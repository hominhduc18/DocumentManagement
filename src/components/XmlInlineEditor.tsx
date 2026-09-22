'use client';

/**
 * XmlInlineEditor.tsx – v2
 *
 * Layout 2 cột:
 *  - Trái: XML text với lỗi bôi màu rõ ràng (nền sáng)
 *  - Phải: Danh sách lỗi, click để scroll + mở fix panel tại chỗ
 */

import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
  AlertCircle, CheckCircle2, Wrench, X, ChevronRight,
  ArrowRight, Lightbulb, CheckCheck, Copy, ClipboardCheck
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface InlineError {
  field: string;
  message: string;
  type: 'error' | 'warning';
  originalValue?: string;
}

interface Segment {
  text: string;
  error: InlineError | null;
  start: number;
  end: number;
  segId: number;
}

// ─────────────────────────────────────────────
// Unicode fix helpers
// ─────────────────────────────────────────────

const UNICODE_FIX_MAP: [RegExp, string, string][] = [
  [/\u00D0/g, '\u0110', 'Ð → Đ'],
  [/\u00F0/g, '\u0111', 'ð → đ'],
  [/\u2018/g, "'", "' → '"],
  [/\u2019/g, "'", "' → '"],
  [/\u201C/g, '"', '" → "'],
  [/\u201D/g, '"', '" → "'],
  [/\u2013/g, '-', '– → -'],
  [/\u2014/g, '-', '— → -'],
  [/\u00A0/g, ' ', 'NBSP → space'],
  [/\u200B/g, '', 'Zero-width → xóa'],
];

function applyUnicodeFix(value: string) {
  let fixed = value;
  const changes: string[] = [];
  for (const [p, r, d] of UNICODE_FIX_MAP) {
    if (p.test(fixed)) { changes.push(d); fixed = fixed.replace(p, r); }
    p.lastIndex = 0;
  }
  return { fixed, changes };
}

function generateFixSuggestion(error: InlineError, value: string) {
  const msg = error.message.toLowerCase();
  if (msg.includes('unicode') || msg.includes('u+00d0') || msg.includes('u+00f0') ||
      msg.includes('curly') || msg.includes('nbsp') || msg.includes('zero-width') ||
      msg.includes('ð') || msg.includes('Ð')) {
    const { fixed, changes } = applyUnicodeFix(value);
    if (fixed !== value) return { description: 'Thay ký tự Unicode sai bằng ký tự tiếng Việt chuẩn', fixedValue: fixed, changes };
  }
  const lenMatch = error.message.match(/vượt quá (\d+) ký tự/);
  if (lenMatch) {
    const max = parseInt(lenMatch[1]);
    return { description: `Cắt xuống còn ${max} ký tự (hiện ${value.length})`, fixedValue: value.slice(0, max), changes: [] };
  }
  if (msg.includes('bắt buộc') && (!value || !value.trim())) {
    return { description: `Trường "${error.field}" là bắt buộc — cần điền giá trị hợp lệ`, fixedValue: undefined, changes: [] };
  }
  return null;
}

// ─────────────────────────────────────────────
// Segment builder
// ─────────────────────────────────────────────

let _segIdCtr = 0;

function buildSegments(xmlText: string, errors: InlineError[]): Segment[] {
  interface Hit { valueStart: number; valueEnd: number; error: InlineError; originalValue: string; }
  const hits: Hit[] = [];

  for (const error of errors) {
    const field = error.field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(<${field}\\s*>)([\\s\\S]*?)(<\\/${field}>)`, 'g');
    let m: RegExpExecArray | null;
    while ((m = re.exec(xmlText)) !== null) {
      const vs = m.index + m[1].length;
      const ve = vs + m[2].length;
      if (!hits.some(h => h.valueStart < ve && h.valueEnd > vs)) {
        hits.push({ valueStart: vs, valueEnd: ve, error: { ...error, originalValue: m[2] }, originalValue: m[2] });
      }
    }
  }

  hits.sort((a, b) => a.valueStart - b.valueStart);

  // Deduplicate same field+value
  const seen = new Set<string>();
  const dedup = hits.filter(h => {
    const k = `${h.error.field}::${h.originalValue}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  const segs: Segment[] = [];
  let cursor = 0;
  for (const h of dedup) {
    if (h.valueStart > cursor) segs.push({ text: xmlText.slice(cursor, h.valueStart), error: null, start: cursor, end: h.valueStart, segId: ++_segIdCtr });
    segs.push({ text: xmlText.slice(h.valueStart, h.valueEnd), error: { ...h.error, originalValue: h.originalValue }, start: h.valueStart, end: h.valueEnd, segId: ++_segIdCtr });
    cursor = h.valueEnd;
  }
  if (cursor < xmlText.length) segs.push({ text: xmlText.slice(cursor), error: null, start: cursor, end: xmlText.length, segId: ++_segIdCtr });
  return segs.length ? segs : [{ text: xmlText, error: null, start: 0, end: xmlText.length, segId: ++_segIdCtr }];
}

// ─────────────────────────────────────────────
// Inline Fix Tooltip (hiện ngay dưới highlight)
// ─────────────────────────────────────────────

interface FixTooltipProps {
  error: InlineError;
  originalValue: string;
  onApply: (newValue: string) => void;
  onClose: () => void;
}

function FixTooltip({ error, originalValue, onApply, onClose }: FixTooltipProps) {
  const suggestion = generateFixSuggestion(error, originalValue);
  const isCertain = error.type === 'error';
  const [applied, setApplied] = useState(false);
  const [copiedOrig, setCopiedOrig] = useState(false);
  const [copiedFixed, setCopiedFixed] = useState(false);

  const handleApply = () => {
    if (suggestion?.fixedValue !== undefined) {
      onApply(suggestion.fixedValue);
      setApplied(true);
    }
  };

  const copyText = (text: string, which: 'orig' | 'fixed') => {
    navigator.clipboard.writeText(text);
    if (which === 'orig') { setCopiedOrig(true); setTimeout(() => setCopiedOrig(false), 2000); }
    else { setCopiedFixed(true); setTimeout(() => setCopiedFixed(false), 2000); }
  };

  return (
    <span
      contentEditable={false}
      className="block my-1 rounded-xl border shadow-lg text-sm not-italic select-text"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13 }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <span className={`flex items-center justify-between px-4 py-2.5 rounded-t-xl ${isCertain ? 'bg-red-50 border-b border-red-100' : 'bg-amber-50 border-b border-amber-100'}`}>
        <span className={`flex items-center gap-2 font-semibold ${isCertain ? 'text-red-700' : 'text-amber-700'}`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          {isCertain ? 'Lỗi' : 'Cảnh báo'}: <code className="font-mono text-xs">{error.field}</code>
        </span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-100">
          <X className="w-3.5 h-3.5" />
        </button>
      </span>

      <span className="block px-4 py-3 bg-white rounded-b-xl space-y-3">
        {/* Error message */}
        <span className="block text-gray-700">{error.message}</span>

        {/* Original value */}
        {originalValue && (
          <span className="block">
            <span className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 font-medium">Giá trị gốc:</span>
              <button
                onClick={() => copyText(originalValue, 'orig')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all ${
                  copiedOrig
                    ? 'bg-emerald-100 text-emerald-600 font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                }`}
              >
                {copiedOrig ? <><ClipboardCheck className="w-3 h-3" /> Đã copy!</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </span>
            <code className={`block text-xs px-2 py-1.5 rounded-lg border font-mono break-all ${isCertain ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              {originalValue || '(trống)'}
            </code>
          </span>
        )}

        {/* Fix suggestion */}
        {suggestion ? (
          applied ? (
            <span className="flex items-center gap-2 text-emerald-600 font-semibold py-1">
              <CheckCheck className="w-4 h-4" /> Đã áp dụng sửa!
            </span>
          ) : (
            <span className="block bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <Lightbulb className="w-3.5 h-3.5" />
                Gợi ý sửa
              </span>
              <span className="block text-emerald-700 text-xs">{suggestion.description}</span>
              {suggestion.changes && suggestion.changes.length > 0 && (
                <span className="block space-y-0.5">
                  {suggestion.changes.map((c, i) => (
                    <span key={i} className="flex items-center gap-1 text-xs text-emerald-600">
                      <ChevronRight className="w-3 h-3 shrink-0" /><code className="font-mono">{c}</code>
                    </span>
                  ))}
                </span>
              )}
              {suggestion.fixedValue !== undefined && (
                <span className="block">
                  <span className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Sau khi sửa:</span>
                    <button
                      onClick={() => copyText(suggestion.fixedValue!, 'fixed')}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all ${
                        copiedFixed
                          ? 'bg-emerald-100 text-emerald-700 font-semibold'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-600'
                      }`}
                    >
                      {copiedFixed ? <><ClipboardCheck className="w-3 h-3" /> Đã copy!</> : <><Copy className="w-3 h-3" /> Copy giá trị sửa</>}
                    </button>
                  </span>
                  <code className="block text-xs px-2 py-1.5 bg-white border border-emerald-300 rounded font-mono break-all text-emerald-800">
                    {suggestion.fixedValue || '(trống)'}
                  </code>
                </span>
              )}
              {suggestion.fixedValue !== undefined && (
                <button
                  onClick={handleApply}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Áp dụng sửa
                </button>
              )}
            </span>
          )
        ) : (
          <span className="block bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500">
            Cần sửa thủ công — chưa có gợi ý tự động.
          </span>
        )}
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────
// Error list panel (bên phải)
// ─────────────────────────────────────────────

interface ErrorListProps {
  errorSegs: Segment[];
  activeSegId: number | null;
  onSelect: (seg: Segment) => void;
}

function ErrorList({ errorSegs, activeSegId, onSelect }: ErrorListProps) {
  if (errorSegs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-emerald-600">
        <CheckCircle2 className="w-10 h-10 mb-3 text-emerald-400" />
        <p className="font-semibold">Không có lỗi</p>
        <p className="text-xs text-gray-400 mt-1">File XML hợp lệ</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="px-3 py-2 border-b bg-gray-50 text-xs font-semibold text-gray-600 sticky top-0 z-10">
        {errorSegs.length} vị trí cần kiểm tra
      </div>
      <div className="divide-y divide-gray-100">
        {errorSegs.map((seg, i) => {
          const isCertain = seg.error?.type === 'error';
          const isActive = seg.segId === activeSegId;
          return (
            <button
              key={seg.segId}
              onClick={() => onSelect(seg)}
              className={`w-full text-left px-3 py-3 transition-colors flex items-start gap-2.5 ${
                isActive
                  ? isCertain ? 'bg-red-50 border-l-2 border-red-500' : 'bg-amber-50 border-l-2 border-amber-400'
                  : 'hover:bg-gray-50 border-l-2 border-transparent'
              }`}
            >
              <span className={`mt-0.5 shrink-0 ${isCertain ? 'text-red-500' : 'text-amber-400'}`}>
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5">
                  <code className="text-xs font-mono font-bold text-gray-800">{seg.error?.field}</code>
                  <span className={`text-xs px-1 rounded font-medium ${isCertain ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'}`}>
                    #{i + 1}
                  </span>
                </span>
                <span className="block text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{seg.error?.message}</span>
                {seg.text && (
                  <code className={`block mt-1 text-xs truncate max-w-full px-1.5 py-0.5 rounded font-mono ${
                    isCertain ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {seg.text.length > 40 ? seg.text.slice(0, 40) + '…' : seg.text || '(trống)'}
                  </code>
                )}
              </span>
              {isActive && <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

interface XmlInlineEditorProps {
  xmlText: string;
  errors: InlineError[];
  onXmlChange: (newXml: string) => void;
}

export default function XmlInlineEditor({ xmlText, errors, onXmlChange }: XmlInlineEditorProps) {
  const [activeSegId, setActiveSegId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const errorRefs = useRef<Record<number, HTMLElement | null>>({});

  const segments = useMemo(() => buildSegments(xmlText, errors), [xmlText, errors]);
  const errorSegs = segments.filter(s => s.error !== null);
  const activeSeg = errorSegs.find(s => s.segId === activeSegId) ?? null;

  const scrollTo = useCallback((seg: Segment) => {
    setActiveSegId(seg.segId);
    setTimeout(() => {
      const el = errorRefs.current[seg.segId];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, []);

  const handleApplyFix = useCallback((start: number, end: number, newValue: string) => {
    const newXml = xmlText.slice(0, start) + newValue + xmlText.slice(end);
    onXmlChange(newXml);
    setActiveSegId(null);
  }, [xmlText, onXmlChange]);

  // Navigate
  const currentIdx = activeSeg ? errorSegs.findIndex(s => s.segId === activeSeg.segId) : -1;
  const goNext = () => { const n = errorSegs[(currentIdx + 1) % errorSegs.length]; if (n) scrollTo(n); };
  const goPrev = () => { const p = errorSegs[(currentIdx - 1 + errorSegs.length) % errorSegs.length]; if (p) scrollTo(p); };

  return (
    <div className="flex h-full border-t border-gray-200 bg-white">

      {/* ── LEFT: XML code view ── */}
      <div className="flex-1 min-w-0 flex flex-col border-r border-gray-200">

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs flex-wrap">
          <span className="text-gray-500 font-medium">Click vào chỗ bôi màu để xem gợi ý sửa</span>
          {errorSegs.length > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-gray-400">{currentIdx >= 0 ? `${currentIdx + 1}/` : ''}{errorSegs.length}</span>
              <button onClick={goPrev} className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors" title="Lỗi trước">↑</button>
              <button onClick={goNext} className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors" title="Lỗi tiếp">↓</button>
            </div>
          )}
        </div>

        {/* XML content */}
        <div
          ref={containerRef}
          className="overflow-auto flex-1 bg-[#FAFAFA] p-5"
          style={{ fontFamily: 'Consolas, "Courier New", monospace', fontSize: 12.5, lineHeight: '2' }}
        >
          <pre className="whitespace-pre-wrap break-all text-slate-700 select-text m-0">
            {segments.map((seg) => {
              if (!seg.error) return <span key={seg.segId}>{seg.text}</span>;

              const isActive = seg.segId === activeSegId;
              const isCertain = seg.error.type === 'error';

              return (
                <span key={seg.segId} style={{ display: 'contents' }}>
                  {/* The highlighted error value */}
                  <mark
                    ref={el => { errorRefs.current[seg.segId] = el; }}
                    onClick={() => setActiveSegId(isActive ? null : seg.segId)}
                    title={`${seg.error.field}: ${seg.error.message} — Click để xem gợi ý sửa`}
                    className={`
                      relative cursor-pointer rounded px-0.5 py-px transition-all duration-150 select-text
                      ${isCertain
                        ? isActive
                          ? 'bg-red-200 text-red-900 ring-2 ring-red-400 ring-offset-1'
                          : 'bg-red-100 text-red-800 underline decoration-red-400 decoration-wavy hover:bg-red-200'
                        : isActive
                          ? 'bg-amber-200 text-amber-900 ring-2 ring-amber-400 ring-offset-1'
                          : 'bg-amber-100 text-amber-800 underline decoration-amber-400 decoration-wavy hover:bg-amber-200'
                      }
                    `}
                  >
                    {/* Icon badge */}
                    <span
                      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-white mr-0.5 align-middle text-[8px] font-bold ${isCertain ? 'bg-red-500' : 'bg-amber-400'}`}
                      style={{ lineHeight: 1 }}
                    >
                      {isCertain ? '!' : '?'}
                    </span>
                    {seg.text || <span className="italic opacity-60">(trống)</span>}
                  </mark>

                  {/* Inline fix tooltip — renders right after the mark */}
                  {isActive && seg.error && (
                    <span style={{ display: 'block', marginTop: 4, marginBottom: 4 }}>
                      <FixTooltip
                        error={seg.error}
                        originalValue={seg.error.originalValue ?? seg.text}
                        onApply={(newValue) => handleApplyFix(seg.start, seg.end, newValue)}
                        onClose={() => setActiveSegId(null)}
                      />
                    </span>
                  )}
                </span>
              );
            })}
          </pre>
        </div>
      </div>

      {/* ── RIGHT: Error list ── */}
      <div className="w-72 shrink-0 flex flex-col bg-white">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-gray-700">Danh sách lỗi</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Click vào một lỗi để nhảy đến vị trí</p>
        </div>
        <ErrorList
          errorSegs={errorSegs}
          activeSegId={activeSegId}
          onSelect={scrollTo}
        />
      </div>
    </div>
  );
}
