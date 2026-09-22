import React from 'react';
import Link from 'next/link';
import BhytAuditor from '@/components/BhytAuditor';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Kiểm tra Hồ sơ BHYT – GIAMDINHHS XML4210',
  description:
    'Công cụ kiểm tra hồ sơ giám định BHYT: decode base64 FILEHOSO, phát hiện lỗi Unicode, đối chiếu logic MA_LK, ngày tháng, tổng tiền, mã CCHN theo QĐ 4210/QĐ-BYT',
};

export default function BhytAuditPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <ShieldCheck className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Kiểm tra Hồ sơ Giám định BHYT
                </h1>
              </div>
              <p className="text-slate-500 max-w-3xl ml-14 text-sm leading-relaxed">
                Phân tích file <code className="bg-slate-100 px-1 rounded font-mono text-xs">GIAMDINHHS_*.xml</code> (XML4210):
                decode base64 tất cả FILEHOSO, phát hiện lỗi Unicode ẩn (Ð/ð, NBSP, curly quotes),
                đối chiếu logic MA_LK · ngày tháng · tổng tiền · số học · mã CCHN · TT_THAU.
              </p>
            </div>

            {/* Quick link sang XML Validator */}
            <Link
              href="/xml-validator"
              className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                bg-[#0066CC] hover:bg-blue-700
                text-white font-semibold text-sm shadow-md shadow-blue-200/60
                transition-all duration-150 active:scale-95 whitespace-nowrap shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
              XML Validator (QĐ 130)
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-5 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
            <Link
              href="/xml-validator"
              className="px-4 py-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100
                text-sm font-medium transition-colors"
            >
              📋 XML Validator (QĐ 130)
            </Link>
            <span className="px-4 py-2 rounded-lg bg-[#0066CC] text-white text-sm font-semibold cursor-default">
              🛡️ Kiểm tra BHYT / Unicode
            </span>
          </div>

          {/* Check groups info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { letter: 'A', label: 'Unicode', desc: 'Ð/ð, NBSP, curly quotes, zero-width', color: 'bg-purple-50 border-purple-100 text-purple-700' },
              { letter: 'B', label: 'Logic đối chiếu', desc: 'MA_LK, ngày tháng, tổng tiền, CCHN, TT_THAU', color: 'bg-blue-50 border-blue-100 text-blue-700' },
              { letter: 'C', label: 'Số học', desc: 'SL × đơn giá = thành tiền, không âm, không ký tự lạ', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
            ].map((g) => (
              <div key={g.letter} className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 ${g.color}`}>
                <div className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {g.letter}
                </div>
                <div>
                  <div className="font-semibold text-sm">{g.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main component */}
        <BhytAuditor />
      </div>
    </div>
  );
}
