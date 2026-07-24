#!/usr/bin/env python3
"""
enlarge_pdf.py — Tự động phóng to PDF dài thành nhiều trang A4 để in

Cách dùng:
    python enlarge_pdf.py input.pdf output.pdf
    python enlarge_pdf.py input.pdf output.pdf --pages 5 --dpi 300 --margin 15
    python enlarge_pdf.py input.pdf output.pdf --threshold 250 --min-gap 15 --page-size letter

Thư viện cần cài:
    pip install pdf2image Pillow reportlab numpy

Windows (Poppler):
    Tải tại: https://github.com/oschwartz10612/poppler-windows/releases
    Giải nén và thêm thư mục bin/ vào PATH  (hoặc dùng tham số --poppler-path)
"""

import argparse
import sys
import io
from pathlib import Path

try:
    import numpy as np
except ImportError:
    print("[LỖI] Chưa cài numpy. Chạy: pip install numpy")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("[LỖI] Chưa cài Pillow. Chạy: pip install Pillow")
    sys.exit(1)

try:
    from reportlab.lib.pagesizes import A4, LETTER
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import ImageReader
except ImportError:
    print("[LỖI] Chưa cài reportlab. Chạy: pip install reportlab")
    sys.exit(1)

try:
    from pdf2image import convert_from_path
except ImportError:
    print("[LỖI] Chưa cài pdf2image. Chạy: pip install pdf2image")
    sys.exit(1)


# ─────────────────────────────── helpers ──────────────────────────────────

def render_pdf_to_image(pdf_path: str, dpi: int = 300, page: int = 0,
                        poppler_path: str = None) -> Image.Image:
    """Render trang chỉ định của PDF thành PIL Image (RGB)."""
    print(f"[1/4] Rendering PDF → ảnh {dpi} DPI …")
    kwargs = dict(dpi=dpi, first_page=page + 1, last_page=page + 1)
    if poppler_path:
        kwargs["poppler_path"] = poppler_path
    pages = convert_from_path(pdf_path, **kwargs)
    if not pages:
        raise ValueError(f"Không đọc được trang {page} từ file: {pdf_path}")
    img = pages[0].convert("RGB")
    print(f"      Kích thước ảnh gốc: {img.width} × {img.height} px")
    return img


def find_white_gaps(img: Image.Image, threshold: int = 245,
                    min_gap_px: int = 15) -> list[tuple[int, int]]:
    """
    Trả về list (start_row, end_row) của các vùng ngang gần-trắng.
    Một hàng pixel được coi là "trắng" nếu độ sáng trung bình >= threshold.
    """
    arr = np.array(img, dtype=np.float32)     # (H, W, 3)
    row_mean = arr.mean(axis=(1, 2))           # (H,)
    is_white = row_mean >= threshold

    gaps: list[tuple[int, int]] = []
    in_gap = False
    start = 0
    h = len(is_white)
    for y in range(h):
        if is_white[y] and not in_gap:
            in_gap = True
            start = y
        elif not is_white[y] and in_gap:
            in_gap = False
            if (y - start) >= min_gap_px:
                gaps.append((start, y - 1))
    if in_gap and (h - start) >= min_gap_px:
        gaps.append((start, h - 1))
    return gaps


def gap_midpoints(gaps: list[tuple[int, int]]) -> list[int]:
    """Tâm điểm của mỗi vùng trắng."""
    return [(s + e) // 2 for s, e in gaps]


def choose_cut_points(height: int, n_pages: int,
                      midpoints: list[int]) -> list[int]:
    """
    Chọn (n_pages-1) điểm cắt.
    Với mỗi mốc lý tưởng height*k/n, tìm midpoint gần nhất (nếu có).
    Loại trùng lặp, giữ thứ tự tăng dần.
    """
    cuts: list[int] = []
    for k in range(1, n_pages):
        ideal = int(height * k / n_pages)
        if midpoints:
            closest = min(midpoints, key=lambda m: abs(m - ideal))
            cuts.append(closest)
        else:
            cuts.append(ideal)

    # Loại trùng, sắp xếp
    seen: set[int] = set()
    unique: list[int] = []
    for c in sorted(cuts):
        if c not in seen:
            seen.add(c)
            unique.append(c)
    return unique


def split_image(img: Image.Image,
                cut_points: list[int]) -> list[Image.Image]:
    """Cắt ảnh thành các phần theo danh sách điểm cắt."""
    boundaries = [0] + cut_points + [img.height]
    parts: list[Image.Image] = []
    for i in range(len(boundaries) - 1):
        top = boundaries[i]
        bottom = boundaries[i + 1]
        if bottom > top:
            parts.append(img.crop((0, top, img.width, bottom)))
    return parts


def auto_n_pages(img_w_px: int, img_h_px: int, dpi: int,
                 page_size_pt: tuple, margin_pt: float,
                 target_scale: float = 0.5) -> int:
    """
    Tự tính số trang sao cho mỗi phần đạt hệ số scale >= target_scale.
    Công thức:
        scale = min(usable_w / part_w_pt, usable_h / part_h_pt)
        với part_h_pt = (img_h_px / n) / dpi * 72
    → n >= target_scale * img_h_pt / usable_h  (khi chiều cao là nút thắt)
    """
    px_to_pt = 72.0 / dpi
    img_w_pt = img_w_px * px_to_pt
    img_h_pt = img_h_px * px_to_pt

    usable_w = page_size_pt[0] - 2 * margin_pt
    usable_h = page_size_pt[1] - 2 * margin_pt

    # Scale giới hạn bởi chiều rộng (cố định với mọi n)
    scale_w = usable_w / img_w_pt

    if scale_w >= target_scale:
        # Chiều rộng không phải nút thắt → tính n từ chiều cao
        n_min = max(1, int(target_scale * img_h_pt / usable_h))
    else:
        # Chiều rộng đã < target → 1 trang cũng không đạt, nhưng vẫn chia hợp lý
        n_min = max(1, round(img_h_pt / usable_h))

    n_max = max(1, img_h_px // 50)   # tránh trang quá nhỏ (< 50px)
    return min(n_min, n_max)


def build_output_pdf(parts: list[Image.Image], output_path: str,
                     page_size_pt: tuple, margin_pt: float, dpi: int):
    """Tạo file PDF nhiều trang từ danh sách ảnh cắt."""
    print(f"[4/4] Xuất PDF ({len(parts)} trang) → {output_path} …")
    usable_w = page_size_pt[0] - 2 * margin_pt
    usable_h = page_size_pt[1] - 2 * margin_pt
    px_to_pt = 72.0 / dpi

    c = canvas.Canvas(output_path, pagesize=page_size_pt)

    for idx, part in enumerate(parts, 1):
        part_w_px, part_h_px = part.size
        part_w_pt = part_w_px * px_to_pt
        part_h_pt = part_h_px * px_to_pt

        # Scale để vừa trang, tối đa hoá
        scale = min(usable_w / part_w_pt, usable_h / part_h_pt)
        draw_w = part_w_pt * scale
        draw_h = part_h_pt * scale

        # Canh giữa trang
        x = (page_size_pt[0] - draw_w) / 2
        y = (page_size_pt[1] - draw_h) / 2

        # Ghi ảnh vào buffer (không tạo file tạm)
        buf = io.BytesIO()
        part.save(buf, format="PNG", optimize=False)
        buf.seek(0)

        c.drawImage(ImageReader(buf), x, y,
                    width=draw_w, height=draw_h,
                    preserveAspectRatio=True, mask="auto")

        print(f"      Trang {idx:>2}/{len(parts)}: "
              f"{part_w_px}×{part_h_px}px  →  scale {scale*100:.1f}%  "
              f"({draw_w:.0f}×{draw_h:.0f} pt)")
        c.showPage()

    c.save()
    size_kb = Path(output_path).stat().st_size // 1024
    print(f"\n✅  Hoàn thành! File: {output_path}  ({size_kb} KB, {len(parts)} trang)")


# ─────────────────────────────── CLI ──────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Phóng to PDF dài thành nhiều trang A4 để in.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ví dụ:
  python enlarge_pdf.py scan.pdf output.pdf
  python enlarge_pdf.py scan.pdf out.pdf --pages 6 --dpi 200
  python enlarge_pdf.py scan.pdf out.pdf --page-size letter --margin 20
  python enlarge_pdf.py scan.pdf out.pdf --threshold 240 --min-gap 20 --target-scale 0.7
""",
    )
    p.add_argument("input",  help="File PDF đầu vào (trang đơn, dài)")
    p.add_argument("output", help="File PDF đầu ra (nhiều trang A4)")

    g = p.add_argument_group("Tùy chọn chia trang")
    g.add_argument("--pages", "-n", type=int, default=0, metavar="N",
                   help="Số trang đầu ra (mặc định: tự động)")
    g.add_argument("--pdf-page", type=int, default=0, metavar="IDX",
                   help="Trang trong PDF gốc cần xử lý, 0-based (mặc định: 0)")
    g.add_argument("--target-scale", type=float, default=0.5, metavar="S",
                   help="Hệ số phóng to tối thiểu khi tự tính số trang (mặc định: 0.5)")

    g2 = p.add_argument_group("Tùy chọn render")
    g2.add_argument("--dpi", type=int, default=300,
                    help="Độ phân giải render DPI (mặc định: 300)")
    g2.add_argument("--poppler-path", default=None, metavar="PATH",
                    help="Đường dẫn tới thư mục bin/ của Poppler (Windows)")

    g3 = p.add_argument_group("Tùy chọn trang xuất")
    g3.add_argument("--page-size", choices=["a4", "letter"], default="a4",
                    help="Khổ giấy (mặc định: a4)")
    g3.add_argument("--margin", type=float, default=15, metavar="PT",
                    help="Lề trang (đơn vị pt, mặc định: 15)")

    g4 = p.add_argument_group("Tùy chọn phát hiện khoảng trắng")
    g4.add_argument("--threshold", type=int, default=245, metavar="0-255",
                    help="Ngưỡng độ sáng để xác định dòng trắng (mặc định: 245)")
    g4.add_argument("--min-gap", type=int, default=15, metavar="PX",
                    help="Chiều cao tối thiểu (px) của vùng trắng (mặc định: 15)")

    return p.parse_args()


def main():
    args = parse_args()

    if not Path(args.input).exists():
        print(f"[LỖI] Không tìm thấy file: {args.input}")
        sys.exit(1)

    page_size_pt: tuple = A4 if args.page_size == "a4" else LETTER

    # 1. Render
    img = render_pdf_to_image(
        args.input, dpi=args.dpi, page=args.pdf_page,
        poppler_path=args.poppler_path
    )

    # 2. Tìm khoảng trắng
    print("[2/4] Phân tích khoảng trắng ngang …")
    gaps = find_white_gaps(img, threshold=args.threshold,
                           min_gap_px=args.min_gap)
    midpoints = gap_midpoints(gaps)
    print(f"      Tìm thấy {len(gaps)} vùng trắng  →  "
          f"{len(midpoints)} điểm cắt tiềm năng")

    # 3. Xác định số trang & điểm cắt
    print("[3/4] Tính điểm cắt …")
    n_pages = args.pages
    if n_pages <= 0:
        n_pages = auto_n_pages(
            img.width, img.height, args.dpi,
            page_size_pt, args.margin, args.target_scale
        )
        print(f"      Số trang (tự động): {n_pages}")
    else:
        print(f"      Số trang (chỉ định): {n_pages}")

    cut_points = choose_cut_points(img.height, n_pages, midpoints)
    print(f"      Điểm cắt (row): {cut_points}")

    parts = split_image(img, cut_points)
    print(f"      Số phần sau khi cắt: {len(parts)}")

    # 4. Xuất PDF
    build_output_pdf(parts, args.output, page_size_pt, args.margin, args.dpi)


if __name__ == "__main__":
    main()
