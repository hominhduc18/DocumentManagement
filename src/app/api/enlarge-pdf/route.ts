import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import sharp from 'sharp';

export const maxDuration = 120;

// A4 in points (72pt = 1 inch)
const A4_W = 595.28;
const A4_H = 841.89;

// ── PDF → image via sharp (uses libvips/poppler when available) ───────────────

async function pdfToImageBuffer(
  pdfBytes: Buffer,
  dpi: number,
): Promise<{ buffer: Buffer; width: number; height: number }> {
  // sharp can render PDF pages if libvips was compiled with poppler support
  const image = sharp(pdfBytes, { density: dpi });
  const buffer = await image.png().toBuffer();
  const meta = await sharp(buffer).metadata();
  return { buffer, width: meta.width!, height: meta.height! };
}

// ── Row brightness analysis ───────────────────────────────────────────────────

async function computeRowMeans(pngBuffer: Buffer): Promise<{ means: Float32Array; width: number; height: number }> {
  const { data, info } = await sharp(pngBuffer)
    .flatten({ background: '#ffffff' }) // RGBA → RGB with white bg
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const means = new Float32Array(height);

  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    for (let x = 0; x < width; x++) {
      const base = (y * width + x) * channels;
      rowSum += (data[base] + data[base + 1] + data[base + 2]) / 3;
    }
    means[y] = rowSum / width;
  }

  return { means, width, height };
}

// ── White gap detection ───────────────────────────────────────────────────────

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
    const isWhite = rowMeans[y] >= threshold;
    if (isWhite && !inGap) { inGap = true; start = y; }
    else if (!isWhite && inGap) {
      inGap = false;
      if (y - start >= minGapPx) gaps.push([start, y - 1]);
    }
  }
  if (inGap && h - start >= minGapPx) gaps.push([start, h - 1]);
  return gaps;
}

// ── Cut point selection ───────────────────────────────────────────────────────

function chooseCutPoints(height: number, nPages: number, midpoints: number[]): number[] {
  const cuts: number[] = [];
  for (let k = 1; k < nPages; k++) {
    const ideal = Math.round((height * k) / nPages);
    if (midpoints.length > 0) {
      const closest = midpoints.reduce((a, b) =>
        Math.abs(b - ideal) < Math.abs(a - ideal) ? b : a,
      );
      cuts.push(closest);
    } else {
      cuts.push(ideal);
    }
  }
  return [...new Set(cuts)].sort((a, b) => a - b);
}

// ── Auto page count ───────────────────────────────────────────────────────────

function autoNPages(
  imgW: number,
  imgH: number,
  dpi: number,
  marginPt: number,
  targetScale: number,
): number {
  const pxToPt = 72 / dpi;
  const imgWPt = imgW * pxToPt;
  const imgHPt = imgH * pxToPt;
  const usableW = A4_W - 2 * marginPt;
  const usableH = A4_H - 2 * marginPt;
  const scaleW = usableW / imgWPt;

  let nMin: number;
  if (scaleW >= targetScale) {
    nMin = Math.max(1, Math.ceil((targetScale * imgHPt) / usableH));
  } else {
    nMin = Math.max(1, Math.round(imgHPt / usableH));
  }
  const nMax = Math.max(1, Math.floor(imgH / 50));
  return Math.min(nMin, nMax);
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'Không có file PDF' }, { status: 400 });
    }

    const pdfBuf = Buffer.from(await file.arrayBuffer());

    // Parse params
    const dpi = Math.min(300, Math.max(72, Number(formData.get('dpi') ?? 150)));
    const marginPt = Number(formData.get('margin') ?? 20);
    const threshold = Number(formData.get('threshold') ?? 245);
    const minGapPx = Number(formData.get('minGap') ?? 15);
    const targetScale = Number(formData.get('targetScale') ?? 0.5);
    const nPagesParam = Number(formData.get('pages') ?? 0);

    // 1. Render PDF → PNG
    let pngBuffer: Buffer;
    let imgW: number;
    let imgH: number;

    try {
      const rendered = await pdfToImageBuffer(pdfBuf, dpi);
      pngBuffer = rendered.buffer;
      imgW = rendered.width;
      imgH = rendered.height;
    } catch (renderErr) {
      console.error('[enlarge-pdf] render error:', renderErr);
      return NextResponse.json(
        {
          error:
            'Không thể render PDF. Máy chủ cần cài Poppler để xử lý PDF. ' +
            'Trên Windows: tải poppler và thêm vào PATH. Trên Linux: apt install poppler-utils.',
        },
        { status: 422 },
      );
    }

    // 2. Row brightness analysis
    const { means: rowMeans } = await computeRowMeans(pngBuffer);

    // 3. Find gaps & cut points
    const gaps = findWhiteGaps(rowMeans, threshold, minGapPx);
    const midpoints = gaps.map(([s, e]) => Math.round((s + e) / 2));

    const nPages =
      nPagesParam > 0
        ? nPagesParam
        : autoNPages(imgW, imgH, dpi, marginPt, targetScale);

    const cutPoints = chooseCutPoints(imgH, nPages, midpoints);

    // 4. Crop parts
    const boundaries = [0, ...cutPoints, imgH];
    const parts: { buffer: Buffer; w: number; h: number }[] = [];

    for (let i = 0; i < boundaries.length - 1; i++) {
      const top = boundaries[i];
      const bottom = boundaries[i + 1];
      if (bottom <= top) continue;

      const partBuf = await sharp(pngBuffer)
        .extract({ left: 0, top, width: imgW, height: bottom - top })
        .png()
        .toBuffer();

      parts.push({ buffer: partBuf, w: imgW, h: bottom - top });
    }

    if (parts.length === 0) {
      return NextResponse.json(
        { error: 'Không tạo được trang nào từ PDF này.' },
        { status: 422 },
      );
    }

    // 5. Build multi-page A4 PDF
    const outDoc = await PDFDocument.create();
    const pxToPt = 72 / dpi;
    const usableW = A4_W - 2 * marginPt;
    const usableH = A4_H - 2 * marginPt;

    for (const part of parts) {
      const page = outDoc.addPage([A4_W, A4_H]);

      // White background
      page.drawRectangle({
        x: 0, y: 0, width: A4_W, height: A4_H,
        color: rgb(1, 1, 1),
      });

      const partWPt = part.w * pxToPt;
      const partHPt = part.h * pxToPt;
      const scale = Math.min(usableW / partWPt, usableH / partHPt);
      const drawW = partWPt * scale;
      const drawH = partHPt * scale;

      // Center (pdf-lib: y=0 is bottom)
      const x = (A4_W - drawW) / 2;
      const y = (A4_H - drawH) / 2;

      const img = await outDoc.embedPng(part.buffer);
      page.drawImage(img, { x, y, width: drawW, height: drawH });
    }

    const outBytes = Buffer.from(await outDoc.save());

    return new NextResponse(outBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="enlarged_${Date.now()}.pdf"`,
        'X-Pages-Count': String(parts.length),
        'X-Original-Size': String(pdfBuf.byteLength),
      },
    });
  } catch (err: unknown) {
    console.error('[enlarge-pdf] unexpected error:', err);
    const msg = err instanceof Error ? err.message : 'Lỗi không xác định';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
