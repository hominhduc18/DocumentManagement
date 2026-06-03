"use client";

import { useMemo, useState } from "react";
import { HighlightText } from "@/components/HighlightText";
import { normalizeSearch } from "@/lib/utils";
import type { GlobalError } from "@/types/documentation";

export function ErrorCodesView({ errors }: { errors: GlobalError[] }) {
  const [localSearch, setLocalSearch] = useState("");
  const q = normalizeSearch(localSearch);

  const filtered = useMemo(() => {
    if (!q) return errors;
    return errors.filter(
      (e) =>
        e.code.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
    );
  }, [errors, q]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Bảng mã lỗi hệ thống</h2>
        <p className="mt-1 text-sm text-gray-600">
          {errors.length} mã lỗi dùng chung (ERR:1 → ERR:60)
        </p>
        <div className="relative mt-4 max-w-md">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
            placeholder="Lọc theo mã hoặc mô tả..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Đang hiển thị {filtered.length} / {errors.length} mã lỗi
        </p>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="px-4 py-3 font-semibold w-36">Mã lỗi</th>
              <th className="px-4 py-3 font-semibold">Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.code}
                className="border-b border-gray-100 transition-colors duration-200 hover:bg-gray-50/80"
              >
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded bg-red-100 px-2.5 py-1 font-mono text-xs font-bold text-red-700">
                    <HighlightText text={e.code} query={q} />
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <HighlightText text={e.message} query={q} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-gray-500">Không tìm thấy mã lỗi phù hợp</p>
        )}
      </div>
    </div>
  );
}
