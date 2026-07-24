import type { Metadata } from 'next';
import PdfEnlarger from '@/components/PdfEnlarger';

export const metadata: Metadata = {
  title: 'Phóng to PDF để in — VNPT Tools',
  description:
    'Tự động chia PDF trang đơn dài thành nhiều trang A4 phóng to tối đa để in — giữ nguyên chữ ký, con dấu, nội dung gốc.',
};

export default function PdfEnlargerPage() {
  return <PdfEnlarger />;
}
