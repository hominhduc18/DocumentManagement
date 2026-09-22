/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * bhytAudit.ts
 * Engine kiểm tra hồ sơ giám định BHYT – GIAMDINHHS XML4210
 *
 * Nhóm kiểm tra:
 *  (a) Unicode dễ nhầm: Ð/ð thay Đ/đ, curly quotes, NBSP ẩn
 *  (b) Logic đối chiếu: MA_LK, chuỗi ngày, tổng tiền, mã CCHN, TT_THAU
 *  (c) Số học: số lượng × đơn giá = thành tiền, không âm, không ký tự lạ
 */

import { XMLParser } from 'fast-xml-parser';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type IssueSeverity = 'Chắc chắn sai' | 'Nghi vấn cần đối chiếu danh mục BHXH';

export interface BhytAuditIssue {
  stt: number;
  loaiFile: string;           // XML1, XML3, XML4 …
  truong: string;             // tên trường
  giaTriGoc: string;          // giá trị raw
  vanDe: string;              // mô tả vấn đề
  mucDo: IssueSeverity;
  xpath?: string;             // context đường dẫn trong XML
}

export interface BhytAuditResult {
  issues: BhytAuditIssue[];
  filesSummary: { loai: string; decodedOk: boolean; rowCount: number }[];
  parsedFiles: Record<string, any>;
}

// ─────────────────────────────────────────────
// Unicode fix map
// ─────────────────────────────────────────────

/** Bảng thay thế: ký tự sai → ký tự đúng */
const UNICODE_FIX_MAP: [RegExp, string][] = [
  [/\u00D0/g, '\u0110'],   // Ð → Đ
  [/\u00F0/g, '\u0111'],   // ð → đ
  [/\u2018/g, "'"],        // ' → '
  [/\u2019/g, "'"],        // ' → '
  [/\u201C/g, '"'],        // " → "
  [/\u201D/g, '"'],        // " → "
  [/\u2013/g, '-'],        // – → -
  [/\u2014/g, '-'],        // — → -
  [/\u00A0/g, ' '],        // NBSP → space thường
  [/\u200B/g, ''],         // zero-width → xóa
];

/**
 * Sửa tất cả ký tự Unicode dễ nhầm trong một chuỗi.
 * Trả về chuỗi đã được "làm sạch".
 */
export function fixUnicode(text: string): string {
  let result = text;
  for (const [pattern, replacement] of UNICODE_FIX_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Sửa Unicode trong toàn bộ file GIAMDINHHS:
 * - Decode base64 từng FILEHOSO
 * - fixUnicode() nội dung XML bên trong
 * - Re-encode base64
 * - Trả về XML envelope đã được vá, sẵn sàng download
 */
export function fixGiamDinhHsUnicode(envelopeXml: string): string {
  // Regex tìm từng block NOIDUNGFILE (base64)
  // Hỗ trợ cả <NOIDUNGFILE>…</NOIDUNGFILE> và <NOI_DUNG>…</NOI_DUNG>
  return envelopeXml.replace(
    /<(NOIDUNGFILE|NOI_DUNG)>([\s\S]*?)<\/\1>/g,
    (_match, tag, b64Content) => {
      const cleaned = b64Content.trim().replace(/\s+/g, '');
      if (!cleaned) return _match;
      try {
        // Decode
        const bytes = Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0));
        const bomStart = (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) ? 3 : 0;
        const decoded = new TextDecoder('utf-8').decode(bytes.slice(bomStart));
        // Fix unicode
        const fixed = fixUnicode(decoded);
        // Re-encode UTF-8 → base64
        const encoder = new TextEncoder();
        const fixedBytes = encoder.encode(fixed);
        let binary = '';
        fixedBytes.forEach((b) => { binary += String.fromCharCode(b); });
        const newB64 = btoa(binary);
        return `<${tag}>${newB64}</${tag}>`;
      } catch {
        // Nếu decode lỗi, giữ nguyên
        return _match;
      }
    }
  );
}

// ─────────────────────────────────────────────
// XML Parser
// ─────────────────────────────────────────────

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false,
  isArray: (name) => {
    // Luôn parse các tag lặp lại như mảng
    const repeating = [
      'CHI_TIET_DVKT', 'CHI_TIET_THUOC', 'CHI_TIET_VATTU',
      'FILEHOSO', 'CHITIET', 'DICH_VU', 'THUOC', 'VAT_TU',
    ];
    return repeating.includes(name);
  },
});

// ─────────────────────────────────────────────
// Encoding helpers
// ─────────────────────────────────────────────

/**
 * Decode base64 thử nhiều cách:
 * 1. UTF-8 (base64 → bytes → UTF-8)
 * 2. Nếu lỗi → base64 raw (latin-1)
 */
export function decodeBase64Safe(b64: string): string {
  const cleaned = b64.trim().replace(/\s+/g, '');
  try {
    // Cách 1: decode UTF-8 đúng chuẩn
    const bytes = Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0));
    // Bỏ BOM UTF-8 (EF BB BF) nếu có
    const start = (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) ? 3 : 0;
    return new TextDecoder('utf-8').decode(bytes.slice(start));
  } catch {
    try {
      return atob(cleaned);
    } catch {
      return '';
    }
  }
}

/**
 * Đọc nội dung file XML wrapper (GIAMDINHHS):
 * - Thử UTF-8 (có thể có BOM)
 * - Nếu header khai utf-16 nhưng body thực là UTF-8 → vẫn dùng UTF-8
 */
export function readXmlContent(raw: string): string {
  // Loại BOM UTF-8 ở đầu chuỗi (nếu đã được đọc bằng readAsText)
  if (raw.charCodeAt(0) === 0xfeff) {
    return raw.slice(1);
  }
  return raw;
}

// ─────────────────────────────────────────────
// (a) Unicode checks
// ─────────────────────────────────────────────

const UNICODE_PATTERNS: {
  pattern: RegExp;
  label: string;
  severity: IssueSeverity;
  detail: (m: string) => string;
}[] = [
  {
    // Latin Eth Ð (U+00D0) dễ nhầm với Đ (U+0110)
    pattern: /\u00D0/g,
    label: 'Ký tự Ð (U+00D0) thay Đ (U+0110)',
    severity: 'Chắc chắn sai',
    detail: (m) => `Phát hiện ký tự Latin Eth "Ð" (U+00D0) tại vị trí chứa "${m}" — cần thay bằng "Đ" (U+0110) tiếng Việt`,
  },
  {
    // Latin eth ð (U+00F0) dễ nhầm với đ (U+0111)
    pattern: /\u00F0/g,
    label: 'Ký tự ð (U+00F0) thay đ (U+0111)',
    severity: 'Chắc chắn sai',
    detail: (m) => `Phát hiện ký tự Latin eth "ð" (U+00F0) tại "${m}" — cần thay bằng "đ" (U+0111) tiếng Việt`,
  },
  {
    // Curly single quotes ' ' (U+2018, U+2019)
    pattern: /[\u2018\u2019]/g,
    label: "Dấu nháy đơn curly (' ')",
    severity: 'Chắc chắn sai',
    detail: (m) => `Dấu nháy đơn kiểu "curly" (U+2018/U+2019) trong giá trị "${m}" — nên dùng dấu nháy thẳng`,
  },
  {
    // Curly double quotes " " (U+201C, U+201D)
    pattern: /[\u201C\u201D]/g,
    label: 'Dấu nháy kép curly (" ")',
    severity: 'Chắc chắn sai',
    detail: (m) => `Dấu nháy kép kiểu "curly" (U+201C/U+201D) trong "${m}" — nên dùng dấu nháy thẳng`,
  },
  {
    // En-dash – (U+2013), Em-dash — (U+2014)
    pattern: /[\u2013\u2014]/g,
    label: 'Gạch ngang curly (– —)',
    severity: 'Chắc chắn sai',
    detail: (m) => `Gạch ngang kiểu typographic (– hoặc —) trong "${m}" — nên dùng dấu gạch nối thường "-"`,
  },
  {
    // Non-Breaking Space (U+00A0)
    pattern: /\u00A0/g,
    label: 'Khoảng trắng không ngắt dòng (NBSP U+00A0)',
    severity: 'Chắc chắn sai',
    detail: (m) => `NBSP ẩn (U+00A0) lẫn trong trường "${m}" — có thể gây lỗi so sánh/tra cứu mã`,
  },
  {
    // Zero-width space (U+200B)
    pattern: /\u200B/g,
    label: 'Ký tự zero-width (U+200B)',
    severity: 'Chắc chắn sai',
    detail: (m) => `Zero-width space ẩn (U+200B) trong "${m}"`,
  },
];

function checkUnicode(
  value: string,
  fieldName: string,
  loaiFile: string,
  xpath: string,
  issues: BhytAuditIssue[],
  counter: { n: number },
) {
  for (const p of UNICODE_PATTERNS) {
    if (p.pattern.test(value)) {
      // reset lastIndex vì dùng /g
      p.pattern.lastIndex = 0;
      // Cắt giá trị hiển thị
      const display = value.length > 80 ? value.slice(0, 80) + '…' : value;
      issues.push({
        stt: ++counter.n,
        loaiFile,
        truong: fieldName,
        giaTriGoc: display,
        vanDe: p.detail(display),
        mucDo: p.severity,
        xpath,
      });
    }
    p.pattern.lastIndex = 0;
  }
}

/** Duyệt đệ quy toàn bộ node XML để kiểm tra Unicode */
function walkUnicode(
  node: any,
  loaiFile: string,
  pathPrefix: string,
  issues: BhytAuditIssue[],
  counter: { n: number },
) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item, i) => walkUnicode(item, loaiFile, `${pathPrefix}[${i}]`, issues, counter));
    return;
  }
  for (const key of Object.keys(node)) {
    if (key.startsWith('@_')) continue;
    const val = node[key];
    const xpath = `${pathPrefix}/${key}`;
    if (typeof val === 'string') {
      checkUnicode(val, key, loaiFile, xpath, issues, counter);
    } else {
      walkUnicode(val, loaiFile, xpath, issues, counter);
    }
  }
}

// ─────────────────────────────────────────────
// (b) Logic cross-checks
// ─────────────────────────────────────────────

/** Parse ngày dạng YYYYMMDD hoặc YYYY-MM-DD hoặc DD/MM/YYYY */
function parseDate(raw: string): Date | null {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.trim();
  // YYYYMMDD
  if (/^\d{8}$/.test(s)) {
    const d = new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`);
    return isNaN(d.getTime()) ? null : d;
  }
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s.slice(0, 10));
    return isNaN(d.getTime()) ? null : d;
  }
  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}/.test(s)) {
    const [dd, mm, yyyy] = s.slice(0, 10).split('/');
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function checkDateSequence(
  xml1Row: any,
  loaiFile: string,
  xpath: string,
  issues: BhytAuditIssue[],
  counter: { n: number },
) {
  const fields = [
    { key: 'NGAY_VAO', label: 'NGAY_VAO' },
    { key: 'NGAY_YL', label: 'NGAY_YL' },
    { key: 'NGAY_TH_YL', label: 'NGAY_TH_YL' },
    { key: 'NGAY_KQ', label: 'NGAY_KQ' },
    { key: 'NGAY_RA', label: 'NGAY_RA' },
  ];
  const dates: { label: string; date: Date | null; raw: string }[] = fields.map((f) => ({
    label: f.label,
    date: parseDate(xml1Row[f.key] || ''),
    raw: String(xml1Row[f.key] || ''),
  }));

  for (let i = 0; i < dates.length - 1; i++) {
    const a = dates[i];
    const b = dates[i + 1];
    if (!a.date || !b.date) continue;
    if (a.date > b.date) {
      issues.push({
        stt: ++counter.n,
        loaiFile,
        truong: `${a.label} > ${b.label}`,
        giaTriGoc: `${a.raw} > ${b.raw}`,
        vanDe: `Ngày ${a.label} (${a.raw}) lớn hơn ${b.label} (${b.raw}) — vi phạm trình tự thời gian`,
        mucDo: 'Chắc chắn sai',
        xpath,
      });
    }
  }
}

/** Kiểm tra MA_LK trong detail rows khớp với MA_LK ở XML1 */
function checkMaLk(
  xml1MaLk: string,
  detailRows: any[],
  loaiFile: string,
  issues: BhytAuditIssue[],
  counter: { n: number },
) {
  detailRows.forEach((row, i) => {
    const rowMaLk = String(row.MA_LK || '').trim();
    if (rowMaLk && rowMaLk !== xml1MaLk.trim()) {
      issues.push({
        stt: ++counter.n,
        loaiFile,
        truong: 'MA_LK',
        giaTriGoc: rowMaLk,
        vanDe: `MA_LK "${rowMaLk}" ở dòng ${i + 1} không khớp MA_LK XML1 "${xml1MaLk}"`,
        mucDo: 'Chắc chắn sai',
        xpath: `${loaiFile}/CHI_TIET[${i}]/MA_LK`,
      });
    }
  });
}

/** Kiểm tra tổng tiền XML1 so với tổng dòng XML3 */
function checkTotalAmount(
  xml1: any,
  xml3Rows: any[],
  issues: BhytAuditIssue[],
  counter: { n: number },
) {
  const toNum = (v: any) => parseFloat(String(v || '0').replace(/,/g, '')) || 0;

  const tongBv = toNum(xml1?.T_TONGCHI_BV ?? xml1?.T_TONGCHI);
  const tongBh = toNum(xml1?.T_TONGCHI_BH);

  let sumBv = 0;
  let sumBh = 0;
  xml3Rows.forEach((r) => {
    sumBv += toNum(r.THANH_TIEN_BV ?? r.THANH_TIEN);
    sumBh += toNum(r.THANH_TIEN_BH);
  });

  const TOLERANCE = 1; // 1 đồng sai số làm tròn
  if (Math.abs(tongBv - sumBv) > TOLERANCE && tongBv > 0) {
    issues.push({
      stt: ++counter.n,
      loaiFile: 'XML1↔XML3',
      truong: 'T_TONGCHI_BV / THANH_TIEN_BV',
      giaTriGoc: `XML1: ${tongBv}, Tổng XML3: ${sumBv}`,
      vanDe: `T_TONGCHI_BV (${tongBv.toLocaleString()}) ≠ tổng THANH_TIEN_BV dòng XML3 (${sumBv.toLocaleString()}) — chênh lệch ${Math.abs(tongBv - sumBv).toLocaleString()}`,
      mucDo: 'Chắc chắn sai',
      xpath: 'XML1/T_TONGCHI_BV',
    });
  }
  if (Math.abs(tongBh - sumBh) > TOLERANCE && tongBh > 0) {
    issues.push({
      stt: ++counter.n,
      loaiFile: 'XML1↔XML3',
      truong: 'T_TONGCHI_BH / THANH_TIEN_BH',
      giaTriGoc: `XML1: ${tongBh}, Tổng XML3: ${sumBh}`,
      vanDe: `T_TONGCHI_BH (${tongBh.toLocaleString()}) ≠ tổng THANH_TIEN_BH dòng XML3 (${sumBh.toLocaleString()}) — chênh lệch ${Math.abs(tongBh - sumBh).toLocaleString()}`,
      mucDo: 'Chắc chắn sai',
      xpath: 'XML1/T_TONGCHI_BH',
    });
  }
}

/** Kiểm tra định dạng mã chứng chỉ hành nghề */
const CCHN_PATTERN = /^\d+\/[A-ZĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐƠƯẠ][A-Z0-9ĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐƠƯẠ\s\-]*[-–]CCHN$/i;

function checkCCHN(
  value: string,
  fieldName: string,
  loaiFile: string,
  xpath: string,
  issues: BhytAuditIssue[],
  counter: { n: number },
) {
  const v = String(value || '').trim();
  if (!v) return;
  // Kiểm tra khoảng trắng thừa đầu/cuối
  if (v !== value) {
    issues.push({
      stt: ++counter.n,
      loaiFile,
      truong: fieldName,
      giaTriGoc: JSON.stringify(value),
      vanDe: `Trường ${fieldName} có khoảng trắng thừa đầu/cuối`,
      mucDo: 'Chắc chắn sai',
      xpath,
    });
  }
  // Kiểm tra định dạng số/TỈNH-CCHN
  if (!CCHN_PATTERN.test(v)) {
    issues.push({
      stt: ++counter.n,
      loaiFile,
      truong: fieldName,
      giaTriGoc: v,
      vanDe: `Mã CCHN "${v}" không đúng định dạng "số/TỈNH-CCHN" (vd: 12345/HN-CCHN)`,
      mucDo: 'Nghi vấn cần đối chiếu danh mục BHXH',
      xpath,
    });
  }
}

/** Kiểm tra TT_THAU (số quyết định trúng thầu) */
function checkTtThau(
  value: string,
  loaiFile: string,
  xpath: string,
  issues: BhytAuditIssue[],
  counter: { n: number },
) {
  const v = String(value || '').trim();
  if (!v) return;
  // Không nên chứa ký tự Unicode đặc biệt / dấu câu curly
  if (/[\u2013\u2014\u201C\u201D\u2018\u2019\u00A0]/.test(v)) {
    issues.push({
      stt: ++counter.n,
      loaiFile,
      truong: 'TT_THAU',
      giaTriGoc: v,
      vanDe: `TT_THAU chứa ký tự đặc biệt không hợp lệ (curly quotes, dash, NBSP)`,
      mucDo: 'Chắc chắn sai',
      xpath,
    });
  }
  // Cảnh báo nếu quá ngắn (< 5 ký tự) hoặc quá dài (> 50)
  if (v.length < 4 || v.length > 60) {
    issues.push({
      stt: ++counter.n,
      loaiFile,
      truong: 'TT_THAU',
      giaTriGoc: v,
      vanDe: `TT_THAU có độ dài bất thường (${v.length} ký tự) — kiểm tra lại số quyết định trúng thầu`,
      mucDo: 'Nghi vấn cần đối chiếu danh mục BHXH',
      xpath,
    });
  }
}

// ─────────────────────────────────────────────
// (c) Arithmetic checks
// ─────────────────────────────────────────────

const NUM_CHARS_PATTERN = /[^\d.,\-\s]/;

function checkArithmetic(
  rows: any[],
  loaiFile: string,
  issues: BhytAuditIssue[],
  counter: { n: number },
) {
  const toNum = (v: any): number => {
    const s = String(v ?? '').replace(/,/g, '').trim();
    return parseFloat(s) || 0;
  };

  rows.forEach((row, i) => {
    const xpath = `${loaiFile}/CHI_TIET[${i + 1}]`;

    // 1. Kiểm tra ký tự lạ trong các trường số
    const numFields = ['SO_LUONG', 'DON_GIA', 'THANH_TIEN', 'THANH_TIEN_BV', 'THANH_TIEN_BH', 'SO_LUONG_BHTT', 'TYLE_TT'];
    for (const f of numFields) {
      const rawVal = row[f];
      if (rawVal === undefined || rawVal === null || rawVal === '') continue;
      const strVal = String(rawVal);
      if (NUM_CHARS_PATTERN.test(strVal)) {
        issues.push({
          stt: ++counter.n,
          loaiFile,
          truong: f,
          giaTriGoc: strVal,
          vanDe: `Trường số ${f} chứa ký tự không phải số: "${strVal}"`,
          mucDo: 'Chắc chắn sai',
          xpath: `${xpath}/${f}`,
        });
      }
      // Kiểm tra âm
      if (toNum(rawVal) < 0) {
        issues.push({
          stt: ++counter.n,
          loaiFile,
          truong: f,
          giaTriGoc: strVal,
          vanDe: `Trường ${f} có giá trị âm (${strVal}) — không hợp lệ trong hồ sơ BHYT`,
          mucDo: 'Chắc chắn sai',
          xpath: `${xpath}/${f}`,
        });
      }
    }

    // 2. Số lượng × đơn giá ≈ thành tiền
    const soLuong = toNum(row.SO_LUONG ?? row.SO_LUONG_BHTT);
    const donGia = toNum(row.DON_GIA);
    const thanhTien = toNum(row.THANH_TIEN ?? row.THANH_TIEN_BV);

    if (soLuong > 0 && donGia > 0 && thanhTien > 0) {
      const expected = soLuong * donGia;
      const diff = Math.abs(expected - thanhTien);
      // Cho phép sai số 1 đồng / đơn vị do làm tròn
      if (diff > Math.max(1, soLuong * 0.01)) {
        issues.push({
          stt: ++counter.n,
          loaiFile,
          truong: 'SO_LUONG × DON_GIA ≠ THANH_TIEN',
          giaTriGoc: `${soLuong} × ${donGia} = ${expected} ≠ ${thanhTien}`,
          vanDe: `Dòng ${i + 1}: ${soLuong} × ${donGia} = ${expected.toLocaleString()} nhưng THANH_TIEN = ${thanhTien.toLocaleString()} (chênh ${diff.toLocaleString()})`,
          mucDo: 'Chắc chắn sai',
          xpath,
        });
      }
    }
  });
}

// ─────────────────────────────────────────────
// Helper: lấy root data bất kể tên tag
// ─────────────────────────────────────────────

function getRootData(parsed: any): { tag: string; data: any } | null {
  if (!parsed || typeof parsed !== 'object') return null;
  const keys = Object.keys(parsed).filter((k) => !k.startsWith('?'));
  if (keys.length === 0) return null;
  return { tag: keys[0], data: parsed[keys[0]] };
}

/** Trích xuất mảng rows từ nhiều cấu trúc khác nhau */
function extractDetailRows(rootData: any): any[] {
  if (!rootData) return [];
  // Thử các tên tag phổ biến
  const candidates = [
    rootData.CHI_TIET_DVKT,
    rootData.CHI_TIET_THUOC,
    rootData.CHI_TIET_VATTU,
    rootData.CHITIET,
    rootData.DICH_VU,
    rootData.THUOC,
    rootData.VAT_TU,
  ];
  for (const c of candidates) {
    if (Array.isArray(c) && c.length > 0) return c;
    if (c && typeof c === 'object' && !Array.isArray(c)) return [c];
  }
  return [];
}

// ─────────────────────────────────────────────
// Main audit function
// ─────────────────────────────────────────────

export function auditGiamDinhHs(envelopeXml: string): BhytAuditResult {
  const issues: BhytAuditIssue[] = [];
  const counter = { n: 0 };
  const filesSummary: BhytAuditResult['filesSummary'] = [];
  const parsedFiles: Record<string, any> = {};

  let envelopeParsed: any;
  try {
    const cleaned = readXmlContent(envelopeXml);
    envelopeParsed = xmlParser.parse(cleaned);
  } catch {
    issues.push({
      stt: ++counter.n,
      loaiFile: 'GIAMDINHHS',
      truong: 'XML wrapper',
      giaTriGoc: '',
      vanDe: 'Không thể parse XML wrapper — kiểm tra encoding và cú pháp XML',
      mucDo: 'Chắc chắn sai',
    });
    return { issues, filesSummary, parsedFiles };
  }

  // Lấy danh sách FILEHOSO
  const hoSo = envelopeParsed?.GIAMDINHHS?.THONGTINHOSO?.DANHSACHHOSO?.HOSO;
  if (!hoSo) {
    issues.push({
      stt: ++counter.n,
      loaiFile: 'GIAMDINHHS',
      truong: 'DANHSACHHOSO/HOSO',
      giaTriGoc: '',
      vanDe: 'Không tìm thấy cấu trúc HOSO trong GIAMDINHHS — sai định dạng hoặc sai đường dẫn',
      mucDo: 'Chắc chắn sai',
    });
    return { issues, filesSummary, parsedFiles };
  }

  const fileHoSoList = Array.isArray(hoSo.FILEHOSO)
    ? hoSo.FILEHOSO
    : hoSo.FILEHOSO
    ? [hoSo.FILEHOSO]
    : [];

  // Decode và parse từng FILEHOSO
  for (const fileNode of fileHoSoList) {
    const loai: string = String(fileNode.LOAIHOSO || fileNode.LOAI_HO_SO || 'UNKNOWN').trim().toUpperCase();
    const b64: string = String(fileNode.NOIDUNGFILE || fileNode.NOI_DUNG || '').trim();

    let decodedXml = '';
    let decodedOk = false;
    let innerParsed: any = null;

    if (!b64) {
      filesSummary.push({ loai, decodedOk: false, rowCount: 0 });
      issues.push({
        stt: ++counter.n,
        loaiFile: loai,
        truong: 'NOIDUNGFILE',
        giaTriGoc: '',
        vanDe: 'NOIDUNGFILE rỗng — không có nội dung base64',
        mucDo: 'Chắc chắn sai',
      });
      continue;
    }

    decodedXml = decodeBase64Safe(b64);
    if (!decodedXml) {
      filesSummary.push({ loai, decodedOk: false, rowCount: 0 });
      issues.push({
        stt: ++counter.n,
        loaiFile: loai,
        truong: 'NOIDUNGFILE',
        giaTriGoc: b64.slice(0, 40) + '…',
        vanDe: 'Không thể decode base64 — nội dung có thể bị hỏng hoặc sai encoding',
        mucDo: 'Chắc chắn sai',
      });
      continue;
    }

    try {
      innerParsed = xmlParser.parse(readXmlContent(decodedXml));
      decodedOk = true;
    } catch {
      filesSummary.push({ loai, decodedOk: false, rowCount: 0 });
      issues.push({
        stt: ++counter.n,
        loaiFile: loai,
        truong: 'XML nội dung',
        giaTriGoc: decodedXml.slice(0, 100),
        vanDe: 'Không thể parse XML sau khi decode — cú pháp XML lỗi',
        mucDo: 'Chắc chắn sai',
      });
      continue;
    }

    const root = getRootData(innerParsed);
    if (!root) {
      filesSummary.push({ loai, decodedOk, rowCount: 0 });
      continue;
    }

    parsedFiles[loai] = innerParsed;
    const rootData = root.data;
    const detailRows = extractDetailRows(rootData);
    filesSummary.push({ loai, decodedOk, rowCount: detailRows.length });

    // ── (a) Unicode scan toàn bộ file ──
    walkUnicode(rootData, loai, loai, issues, counter);

    // ── (b) Logic checks ──

    // Ngày tháng (XML1 level)
    if (loai === 'XML1' || loai.includes('1')) {
      checkDateSequence(rootData, loai, `${loai}/root`, issues, counter);

      // Mã CCHN ở XML1
      const cchnFields = ['MA_BAC_SI', 'MA_BS_KE_TOA', 'NGUOI_THUC_HIEN', 'MA_BSDIEUTRI'];
      for (const f of cchnFields) {
        if (rootData[f]) {
          checkCCHN(String(rootData[f]), f, loai, `${loai}/${f}`, issues, counter);
        }
      }
    }

    // Ngày trong từng dòng XML3
    if (loai === 'XML3' || loai.includes('3')) {
      detailRows.forEach((row, i) => {
        checkDateSequence(row, loai, `${loai}/CHI_TIET[${i + 1}]`, issues, counter);
        // CCHN trong dòng chi tiết
        const cchnFields = ['MA_BAC_SI', 'NGUOI_THUC_HIEN'];
        for (const f of cchnFields) {
          if (row[f]) {
            checkCCHN(String(row[f]), f, loai, `${loai}/CHI_TIET[${i + 1}]/${f}`, issues, counter);
          }
        }
        // TT_THAU
        if (row.TT_THAU) {
          checkTtThau(String(row.TT_THAU), loai, `${loai}/CHI_TIET[${i + 1}]/TT_THAU`, issues, counter);
        }
      });
    }

    // ── (c) Arithmetic checks (XML3, XML4, XML5) ──
    if (detailRows.length > 0) {
      checkArithmetic(detailRows, loai, issues, counter);
    }
  }

  // ── Tổng tiền XML1 ↔ XML3 ──
  const xml1Data = parsedFiles['XML1'] ? getRootData(parsedFiles['XML1'])?.data : null;
  const xml3Rows = parsedFiles['XML3']
    ? extractDetailRows(getRootData(parsedFiles['XML3'])?.data ?? {})
    : [];
  const xml1MaLk = xml1Data ? String(xml1Data.MA_LK || '').trim() : '';

  if (xml1Data && xml3Rows.length > 0) {
    checkTotalAmount(xml1Data, xml3Rows, issues, counter);
    if (xml1MaLk) {
      checkMaLk(xml1MaLk, xml3Rows, 'XML3', issues, counter);
    }
  }

  // MA_LK cho XML4, XML5
  for (const loai of ['XML4', 'XML5', 'XML7', 'XML8']) {
    if (parsedFiles[loai] && xml1MaLk) {
      const rows = extractDetailRows(getRootData(parsedFiles[loai])?.data ?? {});
      checkMaLk(xml1MaLk, rows, loai, issues, counter);
    }
  }

  // Đánh số lại STT
  issues.forEach((iss, i) => { iss.stt = i + 1; });

  return { issues, filesSummary, parsedFiles };
}
