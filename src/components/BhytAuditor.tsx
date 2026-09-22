'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  auditGiamDinhHs,
  fixGiamDinhHsUnicode,
  readXmlContent,
  BhytAuditIssue,
  BhytAuditResult,
  IssueSeverity,
} from '@/lib/bhytAudit';
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Copy,
  ChevronDown,
  ChevronUp,
  FileSearch,
  Info,
  Zap,
  Wand2,
  CheckCheck,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Severity badge
// ─────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  const isCertain = severity === 'Chắc chắn sai';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap
        ${isCertain
          ? 'bg-red-100 text-red-700 border border-red-200'
          : 'bg-amber-100 text-amber-700 border border-amber-200'
        }`}
    >
      {isCertain ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {isCertain ? 'Chắc chắn sai' : 'Nghi vấn'}
    </span>
  );
}

// ─────────────────────────────────────────────
// Stats bar
// ─────────────────────────────────────────────

function StatsBar({ result }: { result: BhytAuditResult }) {
  const certain = result.issues.filter((i) => i.mucDo === 'Chắc chắn sai').length;
  const suspect = result.issues.filter((i) => i.mucDo !== 'Chắc chắn sai').length;
  const totalFiles = result.filesSummary.length;
  const okFiles = result.filesSummary.filter((f) => f.decodedOk).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {[
        { label: 'Tổng vấn đề', value: result.issues.length, color: result.issues.length === 0 ? 'text-emerald-600' : 'text-slate-800', bg: result.issues.length === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200' },
        { label: 'Chắc chắn sai 🔴', value: certain, color: certain === 0 ? 'text-emerald-600' : 'text-red-600', bg: certain === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200' },
        { label: 'Nghi vấn 🟡', value: suspect, color: suspect === 0 ? 'text-emerald-600' : 'text-amber-600', bg: suspect === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200' },
        { label: 'Files decode OK', value: `${okFiles}/${totalFiles}`, color: okFiles === totalFiles ? 'text-emerald-600' : 'text-red-600', bg: okFiles === totalFiles ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200' },
      ].map((s) => (
        <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
          <div className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
          <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// File summary pills
// ─────────────────────────────────────────────

function FileSummaryPills({ result }: { result: BhytAuditResult }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {result.filesSummary.map((f) => (
        <span
          key={f.loai}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
            ${f.decodedOk
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
            }`}
        >
          {f.decodedOk ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {f.loai}
          {f.decodedOk && <span className="opacity-60">· {f.rowCount} dòng</span>}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Issue detail row expandable
// ─────────────────────────────────────────────

function IssueRow({ issue, idx }: { issue: BhytAuditIssue; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const isCertain = issue.mucDo === 'Chắc chắn sai';

  return (
    <>
      <tr
        className={`border-b last:border-0 cursor-pointer hover:bg-slate-50/70 transition-colors
          ${isCertain ? 'bg-red-50/30' : 'bg-amber-50/20'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-3 py-3 text-center text-xs text-slate-400 font-mono w-10">{idx + 1}</td>
        <td className="px-3 py-3 whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold font-mono">
            {issue.loaiFile}
          </span>
        </td>
        <td className="px-3 py-3 text-sm font-mono text-slate-700 whitespace-nowrap max-w-[160px] truncate" title={issue.truong}>
          {issue.truong}
        </td>
        <td className="px-3 py-3 text-xs text-slate-600 font-mono max-w-[200px] truncate" title={issue.giaTriGoc}>
          {issue.giaTriGoc || <span className="italic text-slate-400">(trống)</span>}
        </td>
        <td className="px-3 py-3 text-sm text-slate-700 max-w-xs">
          <span className="line-clamp-2">{issue.vanDe}</span>
        </td>
        <td className="px-3 py-3 whitespace-nowrap">
          <SeverityBadge severity={issue.mucDo} />
        </td>
        <td className="px-3 py-3 text-center">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className={`border-b ${isCertain ? 'bg-red-50/50' : 'bg-amber-50/40'}`}>
          <td colSpan={7} className="px-4 py-3">
            <div className="grid gap-2 text-sm">
              <div className="flex gap-2">
                <span className="font-semibold text-slate-600 w-28 shrink-0">Trường:</span>
                <code className="font-mono text-indigo-700 break-all">{issue.truong}</code>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-600 w-28 shrink-0">Giá trị gốc:</span>
                <code className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border break-all">{issue.giaTriGoc || '(trống)'}</code>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-600 w-28 shrink-0">Vấn đề:</span>
                <span className="text-slate-700">{issue.vanDe}</span>
              </div>
              {issue.xpath && (
                <div className="flex gap-2">
                  <span className="font-semibold text-slate-600 w-28 shrink-0">Vị trí XML:</span>
                  <code className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded break-all">{issue.xpath}</code>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

type FilterSeverity = 'all' | 'Chắc chắn sai' | 'Nghi vấn';

export default function BhytAuditor() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BhytAuditResult | null>(null);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  // Lưu nội dung XML gốc để fix và download
  const [rawXml, setRawXml] = useState('');
  // Trạng thái sau khi đã fix
  const [fixDone, setFixDone] = useState(false);

  // Filters
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');
  const [filterFile, setFilterFile] = useState<string>('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processXml = useCallback((text: string, name: string) => {
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    setRawXml(text);
    setFixDone(false);
    setFileName(name);
    setTimeout(() => {
      try {
        const cleaned = readXmlContent(text);
        const auditResult = auditGiamDinhHs(cleaned);
        setResult(auditResult);
      } catch (e) {
        setErrorMsg('Lỗi khi xử lý file: ' + (e instanceof Error ? e.message : String(e)));
      } finally {
        setLoading(false);
      }
    }, 50);
  }, []);

  /** Sửa toàn bộ Unicode trong file và tải xuống ngay */
  const fixAndDownload = () => {
    try {
      const fixed = fixGiamDinhHsUnicode(rawXml);
      const baseName = fileName.replace(/\.xml$/i, '');
      const blob = new Blob([fixed], { type: 'text/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_fixed_unicode.xml`;
      a.click();
      URL.revokeObjectURL(url);
      setFixDone(true);
      // Tự động re-audit file đã fix để cập nhật bảng kết quả
      processXml(fixed, `${baseName}_fixed_unicode.xml`);
    } catch (e) {
      setErrorMsg('Lỗi khi sửa Unicode: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processXml(text, file.name);
    };
    // Đọc UTF-8 (có thể có BOM)
    reader.readAsText(file, 'utf-8');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Filtered issues
  const allIssues = result?.issues ?? [];
  const uniqueFiles = ['all', ...Array.from(new Set(allIssues.map((i) => i.loaiFile)))];

  const filtered = allIssues
    .filter((i) => filterSeverity === 'all' || i.mucDo === filterSeverity || (filterSeverity === 'Nghi vấn' && i.mucDo !== 'Chắc chắn sai'))
    .filter((i) => filterFile === 'all' || i.loaiFile === filterFile)
    .filter((i) => {
      if (!filterSearch) return true;
      const s = filterSearch.toLowerCase();
      return (
        i.truong.toLowerCase().includes(s) ||
        i.giaTriGoc.toLowerCase().includes(s) ||
        i.vanDe.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => sortDesc ? b.stt - a.stt : a.stt - b.stt);

  // Export CSV
  const exportCsv = () => {
    const headers = ['STT', 'Loại file', 'Trường', 'Giá trị gốc', 'Vấn đề phát hiện', 'Mức độ'];
    const rows = filtered.map((i) => [
      i.stt,
      i.loaiFile,
      i.truong,
      i.giaTriGoc,
      i.vanDe,
      i.mucDo,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhyt_audit_${fileName || 'result'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const copyClipboard = () => {
    const text = filtered
      .map((i) => `[${i.stt}] ${i.loaiFile} | ${i.truong} | ${i.giaTriGoc} | ${i.vanDe} | ${i.mucDo}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200
          ${dragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : 'border-slate-300 bg-white/60 hover:border-blue-400 hover:bg-blue-50/40'
          }`}
      >
        <input ref={fileInputRef} type="file" accept=".xml" className="hidden" onChange={handleFileChange} />
        <Upload className={`w-10 h-10 mb-3 transition-colors ${dragging ? 'text-blue-500' : 'text-slate-400'}`} />
        <p className="text-sm font-medium text-slate-600">
          <span className="text-blue-600 font-semibold">Tải file GIAMDINHHS XML</span> hoặc kéo thả vào đây
        </p>
        <p className="text-xs text-slate-400 mt-1">Hỗ trợ UTF-8, UTF-8-BOM, XML khai UTF-16</p>
        {fileName && !loading && (
          <div className="absolute bottom-3 right-4 text-xs text-slate-400 font-mono">{fileName}</div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-600 text-sm">Đang phân tích hồ sơ BHYT…</span>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="text-red-700 text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Stats */}
          <StatsBar result={result} />

          {/* File pills */}
          <FileSummaryPills result={result} />

          {/* ── Unicode Fix Banner ── */}
          {(() => {
            const unicodeIssues = result.issues.filter((i) =>
              i.vanDe.includes('U+00D0') || i.vanDe.includes('U+00F0') ||
              i.vanDe.includes('curly') || i.vanDe.includes('NBSP') ||
              i.vanDe.includes('U+200B') || i.vanDe.includes('typographic')
            );
            if (unicodeIssues.length === 0) return null;
            return (
              <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border px-5 py-4 ${
                fixDone
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {fixDone
                    ? <CheckCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                    : <Wand2 className="w-6 h-6 text-amber-500 shrink-0" />
                  }
                  <div>
                    <div className={`font-semibold text-sm ${ fixDone ? 'text-emerald-700' : 'text-amber-800' }`}>
                      {fixDone
                        ? 'Đã sửa xong — file mới đã được tải xuống'
                        : `Phát hiện ${unicodeIssues.length} vấn đề Unicode có thể tự động sửa`
                      }
                    </div>
                    <div className={`text-xs mt-0.5 ${ fixDone ? 'text-emerald-600' : 'text-amber-700' }`}>
                      {fixDone
                        ? 'Bảng kết quả bên dưới đã được cập nhật lại theo file đã sửa'
                        : 'Ð→Đ · ð→đ · NBSP→space · curly quotes→thẳng · em-dash→- · zero-width→xóa'
                      }
                    </div>
                  </div>
                </div>
                {!fixDone && (
                  <button
                    onClick={fixAndDownload}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold text-sm shadow-md shadow-amber-200 transition-all shrink-0"
                  >
                    <Wand2 className="w-4 h-4" />
                    Chuyển &amp; Tải xuống
                  </button>
                )}
              </div>
            );
          })()}

          {/* No issue banner */}
          {result.issues.length === 0 && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <div className="font-semibold text-emerald-700">Không phát hiện lỗi</div>
                <div className="text-sm text-emerald-600 mt-0.5">
                  Tất cả {result.filesSummary.length} file đã được kiểm tra — không có vấn đề nào được phát hiện.
                </div>
              </div>
            </div>
          )}

          {result.issues.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Filter className="w-4 h-4" />
                  <span className="text-xs font-medium">Lọc:</span>
                </div>

                {/* Severity filter */}
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value as FilterSeverity)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">Tất cả mức độ</option>
                  <option value="Chắc chắn sai">🔴 Chắc chắn sai</option>
                  <option value="Nghi vấn">🟡 Nghi vấn</option>
                </select>

                {/* File filter */}
                <select
                  value={filterFile}
                  onChange={(e) => setFilterFile(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {uniqueFiles.map((f) => (
                    <option key={f} value={f}>{f === 'all' ? 'Tất cả file' : f}</option>
                  ))}
                </select>

                {/* Text search */}
                <input
                  type="text"
                  placeholder="Tìm kiếm…"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none flex-1 min-w-[120px]"
                />

                <button
                  onClick={() => setSortDesc(!sortDesc)}
                  className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-2 py-1.5 bg-white"
                >
                  {sortDesc ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  STT
                </button>

                <div className="ml-auto flex gap-2">
                  <button
                    onClick={copyClipboard}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                  <button
                    onClick={exportCsv}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Xuất CSV
                  </button>
                </div>
              </div>

              {/* Count */}
              <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-100 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Hiển thị {filtered.length} / {result.issues.length} vấn đề
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-3 py-2.5 w-10 text-center">#</th>
                      <th className="px-3 py-2.5">Loại file</th>
                      <th className="px-3 py-2.5">Trường</th>
                      <th className="px-3 py-2.5">Giá trị gốc</th>
                      <th className="px-3 py-2.5">Vấn đề phát hiện</th>
                      <th className="px-3 py-2.5">Mức độ</th>
                      <th className="px-3 py-2.5 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((issue, idx) => (
                      <IssueRow key={issue.stt} issue={issue} idx={idx} />
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">
                          <FileSearch className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          Không có kết quả phù hợp với bộ lọc
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Unicode legend */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 flex gap-2">
            <Zap className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
            <div>
              <span className="font-semibold">Ký tự Unicode cần lưu ý:</span>
              {' '}Ð (U+00D0) ≠ Đ (U+0110) · ð (U+00F0) ≠ đ (U+0111) · NBSP (U+00A0) ·
              Curly quotes <span className="font-mono">&#x2018; &#x2019; &#x201C; &#x201D;</span> ·
              En/Em dash <span className="font-mono">&#x2013; &#x2014;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
