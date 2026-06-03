"use client";

import type { VnptDocumentation } from "@/types/documentation";

export function Header({
  doc,
  searchQuery,
  onSearchChange,
}: {
  doc: VnptDocumentation;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex flex-col gap-4 px-4 py-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white shadow-sm"
              style={{ backgroundColor: "#0066CC" }}
              aria-hidden
            >
              V
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                {doc.title}
              </h1>
              <p className="text-xs text-gray-500 sm:text-sm">
                Tra cứu & quản lý tài liệu tích hợp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-[#0066CC] px-3 py-1 font-semibold text-white">
              v{doc.version}
            </span>
            <span className="hidden text-gray-500 sm:inline">|</span>
            <span className="text-gray-600">
              Cập nhật <span className="font-medium">{doc.lastUpdated}</span>
            </span>
          </div>
        </div>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Tìm theo tên API, mô tả, endpoint, tham số..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-[#0066CC] focus:bg-white focus:ring-2 focus:ring-[#0066CC]/20"
          />
        </div>
      </div>
    </header>
  );
}
