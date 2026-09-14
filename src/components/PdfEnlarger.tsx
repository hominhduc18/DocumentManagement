'use client';

import React, { useState, useRef, useCallback } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import {
  Upload, FileText, Settings2, ChevronDown, ChevronUp,
  Download, Loader2, AlertCircle, CheckCircle2, X,
  Maximize2, ScanLine, Layers, Cpu, Eye, Printer, EyeOff,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const A4_W = 595.28;  // pt
const A4_H = 841.89;  // pt

// ── PDF-JS loader (lazy, client-only) ────────────────────────────────────────
async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  // Use unpkg CDN worker — no system dep needed
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

// ── Image processing helpers ─────────────────────────────────────────────────
function computeRowMeans(imgData: ImageData): Float32Array {
  const { data, width, height } = imgData;
  const means = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      // RGBA → luminance (weighted average)
      sum += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    }
    means[y] = sum / width;
  }
  return means;
}

function findWhiteGaps(
  rowMeans: Float32Array,
  threshold: number,
  minGapPx: number,
): Array<[number, number]> {
  const gaps: Array<[number, number]> = [];
  let inGap = false;
  let start = 0;
  const h = rowMeans.length;
  for (let y = 0; y < h; y++) {
    if (rowMeans[y] >= threshold && !inGap) { inGap = true; start = y; }
    else if (rowMeans[y] < threshold && inGap) {
      inGap = false;
      if (y - start >= minGapPx) gaps.push([start, y - 1]);
    }
  }
  if (inGap && h - start >= minGapPx) gaps.push([start, h - 1]);
  return gaps;
}

function chooseCutPoints(height: number, nPages: number, midpoints: number[]): number[] {
  const cuts: number[] = [];
  for (let k = 1; k < nPages; k++) {
    const ideal = Math.round((height * k) / nPages);
    if (midpoints.length > 0) {
      cuts.push(midpoints.reduce((a, b) => Math.abs(b - ideal) < Math.abs(a - ideal) ? b : a));
    } else {
      cuts.push(ideal);
    }
  }
  return [...new Set(cuts)].sort((a, b) => a - b);
}

function autoNPages(
  imgW: number, imgH: number, dpi: number,
  marginPt: number, targetScale: number,
): number {
  const pxToPt = 72 / dpi;
  const imgHPt = imgH * pxToPt;
  const imgWPt = imgW * pxToPt;
  const usableW = A4_W - 2 * marginPt;
  const usableH = A4_H - 2 * marginPt;
  const scaleW = usableW / imgWPt;
  const nMin = scaleW >= targetScale
    ? Math.max(1, Math.ceil(targetScale * imgHPt / usableH))
    : Math.max(1, Math.round(imgHPt / usableH));
  return Math.min(nMin, Math.max(1, Math.floor(imgH / 50)));
}

// ── Core processing logic (runs in browser) ───────────────────────────────────
interface ProcOptions {
  pages: number; dpi: number; margin: number;
  threshold: number; minGap: number;
  targetScale: number;
}

/**
 * Process ALL pages of the input PDF.
 * Each source page is rendered → analysed → split into A4 sub-pages.
 * All sub-pages are collected into one output PDF.
 */
async function processPdfClientSide(
  file: File,
  opts: ProcOptions,
  onProgress: (p: number, label: string) => void,
): Promise<{ bytes: Uint8Array; pageCount: number; pageThumbs: string[] }> {

  onProgress(2, 'Đang tải PDF…');

  const pdfjs = await loadPdfJs();
  const ab = await file.arrayBuffer();
  const pdfjsDoc = await pdfjs.getDocument({ data: ab }).promise;
  const totalSrcPages = pdfjsDoc.numPages;

  onProgress(5, `Tìm thấy ${totalSrcPages} trang gốc…`);

  const outDoc = await PDFDocument.create();
  const pxToPt = 72 / opts.dpi;
  const usableW = A4_W - 2 * opts.margin;
  const usableH = A4_H - 2 * opts.margin;

  for (let srcIdx = 0; srcIdx < totalSrcPages; srcIdx++) {
    const baseProgress = 5 + Math.round((srcIdx / totalSrcPages) * 90);
    onProgress(baseProgress, `Xử lý trang ${srcIdx + 1} / ${totalSrcPages}…`);

    const page = await pdfjsDoc.getPage(srcIdx + 1);

    // Render source page to canvas
    const scale = opts.dpi / 72;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx as unknown as CanvasRenderingContext2D, viewport }).promise;

    // Analyse & cut
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const rowMeans = computeRowMeans(imgData);
    const gaps = findWhiteGaps(rowMeans, opts.threshold, opts.minGap);
    const midpoints = gaps.map(([s, e]) => Math.round((s + e) / 2));
    const nPages = opts.pages > 0
      ? opts.pages
      : autoNPages(canvas.width, canvas.height, opts.dpi, opts.margin, opts.targetScale);
    const cutPoints = chooseCutPoints(canvas.height, nPages, midpoints);
    const boundaries = [0, ...cutPoints, canvas.height];

    // Build each A4 sub-page
    for (let i = 0; i < boundaries.length - 1; i++) {
      const top = boundaries[i];
      const bottom = boundaries[i + 1];
      if (bottom <= top) continue;

      const partCanvas = document.createElement('canvas');
      partCanvas.width = canvas.width;
      partCanvas.height = bottom - top;
      const pCtx = partCanvas.getContext('2d')!;
      pCtx.fillStyle = '#ffffff';
      pCtx.fillRect(0, 0, partCanvas.width, partCanvas.height);
      pCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, -top, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((res) =>
        partCanvas.toBlob((b) => res(b!), 'image/png'),
      );
      const imgBytes = new Uint8Array(await blob.arrayBuffer());

      const partWPt = canvas.width * pxToPt;
      const partHPt = (bottom - top) * pxToPt;
      const s = Math.min(usableW / partWPt, usableH / partHPt);
      const drawW = partWPt * s;
      const drawH = partHPt * s;
      const x = (A4_W - drawW) / 2;
      const y = (A4_H - drawH) / 2;

      const pg = outDoc.addPage([A4_W, A4_H]);
      pg.drawRectangle({ x: 0, y: 0, width: A4_W, height: A4_H, color: rgb(1, 1, 1) });
      const img = await outDoc.embedPng(imgBytes);
      pg.drawImage(img, { x, y, width: drawW, height: drawH });
    }
  }

  onProgress(97, 'Đang tạo file PDF đầu ra…');
  const bytes = await outDoc.save();
  // ⚠️ pdfjs.getDocument({ data }) may transfer/consume the underlying ArrayBuffer.
  // Keep a safe copy for the caller BEFORE passing to pdfjs.
  const safeBytes = bytes.slice();

  // Build thumbnails (small previews) for each A4 page
  const pageThumbs: string[] = [];
  const thumbPages = outDoc.getPageCount();
  const thumbDoc = await pdfjs.getDocument({ data: safeBytes }).promise;
  for (let ti = 0; ti < thumbPages; ti++) {
    const tp = await thumbDoc.getPage(ti + 1);
    const tvp = tp.getViewport({ scale: 1 });
    const thumbScale = 320 / tvp.width;
    const tvp2 = tp.getViewport({ scale: thumbScale });
    const tc = document.createElement('canvas');
    tc.width = Math.round(tvp2.width);
    tc.height = Math.round(tvp2.height);
    const tcx = tc.getContext('2d')!;
    tcx.fillStyle = '#fff';
    tcx.fillRect(0, 0, tc.width, tc.height);
    await tp.render({ canvasContext: tcx as unknown as CanvasRenderingContext2D, viewport: tvp2 }).promise;
    pageThumbs.push(tc.toDataURL('image/jpeg', 0.7));
  }

  return { bytes, pageCount: outDoc.getPageCount(), pageThumbs };
}

// ── Print helper ──────────────────────────────────────────────────────────────
function printPdf(url: string, pageRange?: string) {
  const src = pageRange ? `${url}#page=${pageRange}` : url;
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;';
  iframe.src = src;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.open(src, '_blank');
    }
    setTimeout(() => { try { document.body.removeChild(iframe); } catch { /* ignore */ } }, 60_000);
  };
}

// ── Page thumbnail grid + print selector ───────────────────────────────────────────
function PageGrid({
  thumbs,
  selected,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onPrintSelected,
  onPrintAll,
}: {
  thumbs: string[];
  selected: Set<number>;
  onToggle: (i: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onPrintSelected: () => void;
  onPrintAll: () => void;
}) {
  const nSel = selected.size;
  const nAll = thumbs.length;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
        <span className="text-sm font-semibold text-gray-700 mr-auto">
          {nSel === 0 ? 'Chọn trang muốn in' : `Đã chọn ${nSel} / ${nAll} trang`}
        </span>
        <button onClick={onSelectAll}
          className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors">
          Chọn tất cả
        </button>
        <button onClick={onDeselectAll}
          className="text-xs px-2.5 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 transition-colors">
          Bỏ chọn
        </button>
        <button
          onClick={onPrintSelected}
          disabled={nSel === 0}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#0066CC] hover:bg-blue-700 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          In {nSel > 0 ? `${nSel} trang` : 'đã chọn'}
        </button>
        <button
          onClick={onPrintAll}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border-2 border-[#0066CC] text-[#0066CC] font-semibold hover:bg-blue-50 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          In tất cả ({nAll})
        </button>
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[80vh] overflow-y-auto pr-1">
        {thumbs.map((src, i) => {
          const checked = selected.has(i);
          return (
            <button
              key={i}
              onClick={() => onToggle(i)}
              className={`relative flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all duration-150 group
                ${ checked
                  ? 'border-[#0066CC] shadow-md shadow-blue-200'
                  : 'border-gray-200 hover:border-blue-300'}`}
            >
              {/* Checkbox overlay */}
              <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-colors
                ${checked ? 'bg-[#0066CC] border-[#0066CC]' : 'bg-white/80 border-gray-300 group-hover:border-blue-400'}`}>
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              {/* Thumbnail image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Trang ${i + 1}`} className="w-full object-contain bg-gray-50" />
              {/* Page number */}
              <span className={`w-full text-center text-xs py-1 font-semibold transition-colors
                ${checked ? 'bg-[#0066CC] text-white' : 'bg-gray-100 text-gray-500'}`}>
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── UI sub-components ─────────────────────────────────────────────────────────
function Slider({
  label, hint, value, min, max, step = 1, unit = '', onChange,
}: {
  label: string; hint: string; value: number; min: number;
  max: number; step?: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-mono font-semibold text-[#0066CC] tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#0066CC]"
      />
      <p className="text-xs text-gray-400 mt-1">{hint}</p>
    </div>
  );
}

function StatBadge({ icon: Icon, label, value, color = 'blue' }: {
  icon: React.ElementType; label: string; value: string;
  color?: 'blue' | 'green' | 'purple';
}) {
  const cls = {
    blue: 'bg-blue-50 text-[#0066CC] border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  }[color];
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${cls}`}>
      <Icon className="w-4 h-4 shrink-0" />
      <div>
        <p className="text-xs opacity-70">{label}</p>
        <p className="text-sm font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PdfEnlarger() {
  const [file, setFile]           = useState<File | null>(null);
  const [status, setStatus]       = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultPages, setResultPages] = useState(0);
  const [resultSize, setResultSize]   = useState(0);
  const [pageThumbs, setPageThumbs]   = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [showPageGrid, setShowPageGrid]   = useState(false);
  const [isDragging, setIsDragging]   = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [totalSrcPages, setTotalSrcPages] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [opts, setOpts] = useState<ProcOptions>({
    pages: 0, dpi: 150, margin: 20,
    threshold: 245, minGap: 15,
    targetScale: 0.5,
  });
  const [oneToOne, setOneToOne] = useState(false); // 1 trang gốc → đúng 1 trang A4

  const setOpt = <K extends keyof ProcOptions>(k: K, v: ProcOptions[K]) =>
    setOpts((o) => ({ ...o, [k]: v }));

  const fmtSize = (b: number) =>
    b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

  // Peek at total page count when a file is chosen
  const peekPageCount = useCallback(async (f: File) => {
    try {
      const pdfjs = await loadPdfJs();
      const ab = await f.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: ab }).promise;
      setTotalSrcPages(doc.numPages);
    } catch {
      setTotalSrcPages(null);
    }
  }, []);

  const handleFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Chỉ hỗ trợ file PDF.'); setStatus('error'); return;
    }
    if (f.size > 100 * 1024 * 1024) {
      setErrorMsg('File quá lớn (tối đa 100 MB).'); setStatus('error'); return;
    }
    setFile(f); setStatus('idle'); setResultUrl(null); setErrorMsg('');
    setShowPageGrid(false); setPageThumbs([]); setSelectedPages(new Set()); setTotalSrcPages(null);
    peekPageCount(f);
  }, [peekPageCount]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(0); setProgressLabel(''); setErrorMsg('');
    setResultUrl(null); setShowPageGrid(false); setPageThumbs([]); setSelectedPages(new Set());

    try {
      const { bytes, pageCount, pageThumbs: thumbs } = await processPdfClientSide(
        file, { ...opts, pages: oneToOne ? 1 : opts.pages },
        (p, label) => { setProgress(p); setProgressLabel(label); },
      );
      const blob = new Blob([bytes as any], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultPages(pageCount);
      setResultSize(blob.size);
      setPageThumbs(thumbs);
      // Select all pages by default
      setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)));
      setProgress(100);
      setStatus('done');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `enlarged_${file?.name ?? 'output'}.pdf`;
    a.click();
  };

  const reset = () => {
    setFile(null); setStatus('idle'); setResultUrl(null);
    setErrorMsg(''); setProgress(0); setProgressLabel('');
    setShowPageGrid(false); setPageThumbs([]); setSelectedPages(new Set()); setTotalSrcPages(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Print helpers
  const printSelectedPages = useCallback(() => {
    if (!resultUrl || selectedPages.size === 0) return;
    // Build a new PDF containing only selected pages, then print it
    const sorted = [...selectedPages].sort((a, b) => a - b);
    // Create print HTML with selected thumbs as images (one per A4 page)
    const imgs = sorted.map((i) => pageThumbs[i]).filter(Boolean);
    const html = `<!DOCTYPE html><html><head><style>
      @page{size:A4;margin:0}body{margin:0;padding:0}
      img{display:block;width:100%;height:100vh;object-fit:contain;page-break-after:always}
    </style></head><body>${imgs.map((src) => `<img src="${src}">`).join('')}</body></html>`;
    const win = window.open('', '_blank')!;
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
  }, [resultUrl, selectedPages, pageThumbs]);

  const printAllPages = useCallback(() => {
    if (!resultUrl) return;
    printPdf(resultUrl);
  }, [resultUrl]);

  const isProcessing = status === 'processing';

  return (
    <>
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0066CC] shadow-md">
              <Maximize2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Phóng to PDF để in</h1>
              <p className="text-gray-500 mt-1 text-sm leading-relaxed">
                Nhận vào 1 PDF trang đơn rất dài (hồ sơ, biên lai, bệnh án scan…),
                tự động chia thành nhiều trang <strong className="text-gray-700">khổ A4</strong> phóng to tối đa,
                không cắt ngang bảng/chữ, giữ nguyên chữ ký &amp; con dấu.
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">
                  Xử lý 100% trên trình duyệt — không upload, không cần cài thêm phần mềm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Drop zone ── */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10
            cursor-pointer transition-all duration-200 select-none
            ${isDragging ? 'border-[#0066CC] bg-blue-50 scale-[1.01]'
              : file ? 'border-emerald-400 bg-emerald-50/40 hover:bg-emerald-50'
              : 'border-gray-300 bg-white hover:border-[#0066CC]/60 hover:bg-blue-50/30'}
            ${isProcessing ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          <input
            ref={fileInputRef} type="file" accept=".pdf" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {fmtSize(file.size)}
                    {totalSrcPages !== null && (
                      <span className="ml-2 text-[#0066CC] font-semibold">· {totalSrcPages} trang gốc</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Xóa file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-600 font-medium">✓ File đã sẵn sàng · Click để đổi file</p>
            </>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                <Upload className="w-8 h-8 text-[#0066CC]" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">
                  Kéo thả PDF vào đây hoặc{' '}
                  <span className="text-[#0066CC] underline underline-offset-2">chọn file</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF trang đơn dài bất kỳ · Tối đa 100 MB · Xử lý offline</p>
              </div>
            </>
          )}
        </div>

        {/* ── Advanced options ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#0066CC]" />
              Tùy chỉnh nâng cao
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showAdvanced && (
            <div className="px-5 pb-5 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-gray-100">
              <div className="sm:col-span-2">
                <Slider label="Số trang A4 mỗi trang gốc" hint="0 = tự động · 1 = không chia trang"
                  value={opts.pages} min={0} max={20} onChange={(v) => setOpt('pages', v)} />
              </div>
              <Slider label="Độ phân giải (DPI)" hint="Cao hơn → nét hơn nhưng xử lý lâu hơn"
                value={opts.dpi} min={72} max={300} step={1} unit=" DPI" onChange={(v) => setOpt('dpi', v)} />
              <Slider label="Target Scale" hint="Hệ số phóng to tối thiểu mong muốn (0.1–1.0)"
                value={opts.targetScale} min={0.1} max={1.0} step={0.05} unit="×" onChange={(v) => setOpt('targetScale', v)} />
              <Slider label="Lề trang" hint="Khoảng lề (pt — 1pt ≈ 0.35mm)"
                value={opts.margin} min={0} max={60} unit=" pt" onChange={(v) => setOpt('margin', v)} />
              <Slider label="Ngưỡng dòng trắng" hint="Pixel sáng hơn ngưỡng này được coi là trắng"
                value={opts.threshold} min={200} max={255} onChange={(v) => setOpt('threshold', v)} />
              <Slider label="Chiều cao vùng trắng tối thiểu" hint="Vùng trắng ≥ số pixel này mới làm điểm cắt"
                value={opts.minGap} min={5} max={80} unit=" px" onChange={(v) => setOpt('minGap', v)} />
            </div>
          )}
        </div>

        {/* ── Mode toggle ── */}
        <div
          onClick={() => setOneToOne((v) => !v)}
          className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 cursor-pointer select-none transition-all duration-200
            ${oneToOne
              ? 'border-[#0066CC] bg-blue-50'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'}`}
        >
          <div>
            <p className={`font-semibold text-sm ${oneToOne ? 'text-[#0066CC]' : 'text-gray-700'}`}>
              1 trang gốc → 1 trang A4
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {oneToOne
                ? 'Mỗi trang gốc chỉ ra đúng 1 trang A4 (phóng vừa khổ, không chia)'
                : 'Tự động chia trang dài thành nhiều trang A4 để phóng to tối đa'}
            </p>
          </div>
          {/* Toggle switch */}
          <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ml-4
            ${oneToOne ? 'bg-[#0066CC]' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200
              ${oneToOne ? 'left-5' : 'left-0.5'}`} />
          </div>
        </div>

        {/* ── Process button ── */}
        <button
          id="btn-enlarge-pdf"
          onClick={handleProcess}
          disabled={!file || isProcessing}
          className={`
            w-full flex items-center justify-center gap-3 rounded-2xl py-4 text-base font-bold
            transition-all duration-200 shadow-md
            ${!file || isProcessing
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-[#0066CC] hover:bg-blue-700 active:scale-[0.99] text-white hover:shadow-lg'}
          `}
        >
          {isProcessing
            ? <><Loader2 className="w-5 h-5 animate-spin" />Đang xử lý…</>
            : <><ScanLine className="w-5 h-5" />Phóng to &amp; Chia trang</>}
        </button>

        {/* ── Progress ── */}
        {isProcessing && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0066CC]" />
                {progressLabel || 'Đang xử lý…'}
              </span>
              <span className="font-mono text-[#0066CC] font-bold tabular-nums">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0066CC] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">
              Xử lý hoàn toàn trên máy bạn — không có dữ liệu nào được gửi lên server.
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-700 text-sm">Xử lý thất bại</p>
              <p className="text-rose-600 text-sm mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* ── Done ── */}
        {status === 'done' && resultUrl && (
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
            <div className="bg-emerald-50 px-5 py-4 flex items-center gap-3 border-b border-emerald-100">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <p className="font-bold text-emerald-800">Hoàn thành! PDF đã sẵn sàng.</p>
            </div>
            <div className="p-5 space-y-3">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <StatBadge icon={Layers} label="Số trang" value={`${resultPages} trang A4`} color="blue" />
                <StatBadge icon={FileText} label="Kích thước" value={fmtSize(resultSize)} color="purple" />
                <StatBadge icon={ScanLine} label="DPI" value={`${opts.dpi} DPI`} color="green" />
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-download-enlarged"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] py-3 text-sm font-bold text-white transition-all shadow hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Tải về PDF
                </button>
                <button
                  id="btn-toggle-grid"
                  onClick={() => setShowPageGrid((v) => !v)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#0066CC] text-[#0066CC] font-bold py-3 text-sm hover:bg-blue-50 transition-colors"
                >
                  {showPageGrid
                    ? <><EyeOff className="w-4 h-4" />Ẩn danh sách trang</>
                    : <><Eye className="w-4 h-4" />Xem & Chọn trang in</>}
                </button>
              </div>

              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Xử lý file khác
              </button>
            </div>
          </div>
        )}

        {/* ── Page grid (thumbnail selector + print) ── */}
        {showPageGrid && pageThumbs.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Layers className="w-4 h-4 text-[#0066CC]" />
              Chọn trang & In
            </div>
            <PageGrid
              thumbs={pageThumbs}
              selected={selectedPages}
              onToggle={(i) => setSelectedPages((prev) => {
                const next = new Set(prev);
                next.has(i) ? next.delete(i) : next.add(i);
                return next;
              })}
              onSelectAll={() => setSelectedPages(new Set(Array.from({ length: pageThumbs.length }, (_, i) => i)))}
              onDeselectAll={() => setSelectedPages(new Set())}
              onPrintSelected={printSelectedPages}
              onPrintAll={printAllPages}
            />
          </div>
        )}

        {/* ── How it works ── */}
        <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0066CC]" />
            Cách hoạt động (toàn bộ chạy trên trình duyệt)
          </h2>
          <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
            <li>Render <strong>từng trang</strong> PDF gốc thành ảnh {opts.dpi} DPI bằng <strong>PDF.js</strong></li>
            <li>Phân tích từng hàng pixel để tìm các khoảng trắng tự nhiên (giữa đoạn văn, bảng…)</li>
            <li>Chọn điểm cắt gần mốc chia đều nhất, tránh cắt ngang chữ hoặc bảng</li>
            <li>Tạo PDF nhiều trang A4, mỗi trang chứa 1 phần phóng to tối đa vừa khổ giấy</li>
            <li>Xem trước ngay trên trình duyệt hoặc in trực tiếp — <strong>không upload lên server</strong></li>
          </ol>
        </div>

      </div>
    </div>
  </>
  );
}
