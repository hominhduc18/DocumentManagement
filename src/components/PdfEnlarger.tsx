'use client';

import React, { useState, useRef, useCallback } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import {
  Upload, FileText, Settings2, ChevronDown, ChevronUp,
  Download, Loader2, AlertCircle, CheckCircle2, X,
  Maximize2, ScanLine, Layers, Cpu,
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
  targetScale: number; pageIndex: number;
}

async function processPdfClientSide(
  file: File,
  opts: ProcOptions,
  onProgress: (p: number) => void,
): Promise<{ bytes: Uint8Array; pageCount: number }> {

  onProgress(5);

  // 1. Load pdfjs
  const pdfjs = await loadPdfJs();
  const ab = await file.arrayBuffer();
  const pdfjsDoc = await pdfjs.getDocument({ data: ab }).promise;
  const page = await pdfjsDoc.getPage(opts.pageIndex + 1);
  onProgress(15);

  // 2. Render PDF page → off-screen canvas
  const scale = opts.dpi / 72;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx as unknown as CanvasRenderingContext2D, viewport }).promise;
  onProgress(40);

  // 3. Analyse pixel rows
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const rowMeans = computeRowMeans(imgData);
  onProgress(50);

  // 4. Find gaps → cut points
  const gaps = findWhiteGaps(rowMeans, opts.threshold, opts.minGap);
  const midpoints = gaps.map(([s, e]) => Math.round((s + e) / 2));
  const nPages = opts.pages > 0
    ? opts.pages
    : autoNPages(canvas.width, canvas.height, opts.dpi, opts.margin, opts.targetScale);
  const cutPoints = chooseCutPoints(canvas.height, nPages, midpoints);
  const boundaries = [0, ...cutPoints, canvas.height];
  onProgress(58);

  // 5. Crop each part → PNG ArrayBuffer
  const parts: { data: Uint8Array; w: number; h: number }[] = [];
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
    parts.push({
      data: new Uint8Array(await blob.arrayBuffer()),
      w: canvas.width,
      h: bottom - top,
    });

    onProgress(58 + Math.round(((i + 1) / (boundaries.length - 1)) * 25));
  }

  if (parts.length === 0) throw new Error('Không tạo được trang nào từ file này.');

  // 6. Build multi-page A4 PDF
  const outDoc = await PDFDocument.create();
  const pxToPt = 72 / opts.dpi;
  const usableW = A4_W - 2 * opts.margin;
  const usableH = A4_H - 2 * opts.margin;

  for (const part of parts) {
    const pg = outDoc.addPage([A4_W, A4_H]);
    pg.drawRectangle({ x: 0, y: 0, width: A4_W, height: A4_H, color: rgb(1, 1, 1) });

    const partWPt = part.w * pxToPt;
    const partHPt = part.h * pxToPt;
    const s = Math.min(usableW / partWPt, usableH / partHPt);
    const drawW = partWPt * s;
    const drawH = partHPt * s;
    const x = (A4_W - drawW) / 2;
    const y = (A4_H - drawH) / 2;

    const img = await outDoc.embedPng(part.data);
    pg.drawImage(img, { x, y, width: drawW, height: drawH });
  }

  onProgress(97);
  const bytes = await outDoc.save();
  return { bytes, pageCount: parts.length };
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
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultPages, setResultPages] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [opts, setOpts] = useState<ProcOptions>({
    pages: 0, dpi: 150, margin: 20,
    threshold: 245, minGap: 15,
    targetScale: 0.5, pageIndex: 0,
  });

  const setOpt = <K extends keyof ProcOptions>(k: K, v: ProcOptions[K]) =>
    setOpts((o) => ({ ...o, [k]: v }));

  const fmtSize = (b: number) =>
    b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

  const handleFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Chỉ hỗ trợ file PDF.'); setStatus('error'); return;
    }
    if (f.size > 100 * 1024 * 1024) {
      setErrorMsg('File quá lớn (tối đa 100 MB).'); setStatus('error'); return;
    }
    setFile(f); setStatus('idle'); setResultUrl(null); setErrorMsg('');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleProcess = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(0); setErrorMsg(''); setResultUrl(null);

    try {
      const { bytes, pageCount } = await processPdfClientSide(file, opts, setProgress);
      const blob = new Blob([Buffer.from(bytes)], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
      setResultPages(pageCount);
      setResultSize(blob.size);
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
    setErrorMsg(''); setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isProcessing = status === 'processing';

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

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
                  <p className="text-xs text-gray-500">{fmtSize(file.size)}</p>
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
                <Slider label="Số trang đầu ra" hint="0 = tự động tính dựa theo target scale"
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
              <Slider label="Trang trong PDF gốc" hint="0-based: 0 = trang đầu tiên"
                value={opts.pageIndex} min={0} max={20} onChange={(v) => setOpt('pageIndex', v)} />
            </div>
          )}
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
                {progress < 15 ? 'Đang tải PDF…'
                  : progress < 40 ? 'Đang render trang PDF…'
                  : progress < 60 ? 'Phân tích khoảng trắng…'
                  : progress < 85 ? 'Đang cắt & ghép trang…'
                  : 'Đang tạo file PDF đầu ra…'}
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
              <p className="font-bold text-emerald-800">Hoàn thành! PDF đã sẵn sàng tải xuống.</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <StatBadge icon={Layers} label="Số trang" value={`${resultPages} trang A4`} color="blue" />
                <StatBadge icon={FileText} label="Kích thước" value={fmtSize(resultSize)} color="purple" />
                <StatBadge icon={ScanLine} label="DPI" value={`${opts.dpi} DPI`} color="green" />
              </div>
              <button
                id="btn-download-enlarged"
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] py-3.5 text-base font-bold text-white transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                Tải về PDF ({fmtSize(resultSize)})
              </button>
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

        {/* ── How it works ── */}
        <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0066CC]" />
            Cách hoạt động (toàn bộ chạy trên trình duyệt)
          </h2>
          <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
            <li>Render trang PDF gốc thành ảnh {opts.dpi} DPI bằng <strong>PDF.js</strong> (không cần cài thêm gì)</li>
            <li>Phân tích từng hàng pixel để tìm các khoảng trắng tự nhiên (giữa đoạn văn, bảng…)</li>
            <li>Chọn điểm cắt gần mốc chia đều nhất, tránh cắt ngang chữ hoặc bảng</li>
            <li>Tạo PDF nhiều trang A4, mỗi trang chứa 1 phần phóng to tối đa vừa khổ giấy</li>
            <li>File PDF hoàn chỉnh được tạo và tải thẳng về máy — <strong>không upload lên server</strong></li>
          </ol>
        </div>

      </div>
    </div>
  );
}
