import React from 'react';
import Link from 'next/link';
import XmlValidator from '@/components/XmlValidator';

export const metadata = {
  title: 'Kiểm tra XML - Ký Số',
  description: 'Công cụ kiểm tra, sửa lỗi và cập nhật file XML QĐ 130 sau khi ký số',
};

export default function XmlValidatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header + tool switcher */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Công cụ Kiểm tra XML</h1>
            <p className="mt-1.5 text-sm text-gray-500 max-w-2xl">
              Kiểm tra file XML (XML1–XML8) theo QĐ 130, đối chiếu trường bắt buộc,
              kiểu dữ liệu và cập nhật dữ liệu trước khi ký số.
            </p>
          </div>

          {/* Quick link sang BHYT Audit */}
          <Link
            href="/bhyt-audit"
            className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500
              text-white font-semibold text-sm shadow-md shadow-amber-200/60
              transition-all duration-150 active:scale-95 whitespace-nowrap shrink-0"
          >
            {/* wand icon inline SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 4-8 8 1 5 5 1 8-8-6-6Z"/><path d="m4.5 16.5-1 3 3-1"/>
              <line x1="9" y1="15" x2="15" y2="9"/>
            </svg>
            Kiểm tra Unicode BHYT
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Tab bar: công cụ hiện tại vs BHYT Audit */}
        <div className="flex gap-1 mb-5 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
          <span className="px-4 py-2 rounded-lg bg-[#0066CC] text-white text-sm font-semibold cursor-default">
            📋 XML Validator (QĐ 130)
          </span>
          <Link
            href="/bhyt-audit"
            className="px-4 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100
              text-sm font-medium transition-colors"
          >
            🛡️ Kiểm tra BHYT / Unicode
          </Link>
        </div>

        <XmlValidator />
      </div>
    </div>
  );
}
