"use client";

import { useState } from "react";
import { HighlightText } from "@/components/HighlightText";
import { MethodBadge } from "@/components/MethodBadge";
import { XmlCodeBlock } from "@/components/XmlCodeBlock";
import { ApiTester } from "@/components/ApiTester";
import type { ApiDoc } from "@/types/documentation";

type DetailTab = "params" | "response" | "xml" | "test";

export function ApiDetailPanel({
  api,
  searchQuery,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
  onCopy,
}: {
  api: ApiDoc;
  searchQuery: string;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onCopy: (text: string) => void;
}) {
  const [tab, setTab] = useState<DetailTab>("params");

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "params", label: "Tham số đầu vào" },
    { id: "response", label: "Phản hồi" },
    { id: "xml", label: "XML Template" },
    { id: "test", label: "Thử nghiệm" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 lg:hidden"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-white/50 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-transform duration-200 lg:static lg:z-auto lg:max-w-none lg:shadow-none lg:h-full lg:overflow-hidden lg:bg-white/40"
        role="dialog"
        aria-label={`Chi tiết API ${api.name}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {api.sectionNumber && (
                <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                  {api.sectionNumber}
                </span>
              )}
              <h2 className="text-lg font-bold text-gray-900">
                <HighlightText text={api.name} query={searchQuery} />
              </h2>
              <MethodBadge method={api.method} />
            </div>
            <div className="flex items-center gap-2">
              <code className="truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-[#0066CC]">
                {api.endpoint}
              </code>
              <button
                type="button"
                onClick={() => onCopy(api.endpoint)}
                className="shrink-0 rounded p-1.5 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-[#0066CC]"
                title="Sao chép endpoint"
              >
                <CopyIcon />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">{api.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100"
            aria-label="Đóng"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex border-b border-gray-200 px-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "border-[#0066CC] text-[#0066CC]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "params" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <th className="pb-2 pr-3 font-semibold">Tên</th>
                    <th className="pb-2 pr-3 font-semibold">Kiểu</th>
                    <th className="pb-2 pr-3 font-semibold">Bắt buộc</th>
                    <th className="pb-2 font-semibold">Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  {api.requestParams.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-500">
                        Không có tham số
                      </td>
                    </tr>
                  ) : (
                    api.requestParams.map((p) => (
                      <tr
                        key={p.name}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-3 pr-3 font-mono text-xs font-medium text-gray-900">
                          {p.name}
                        </td>
                        <td className="py-3 pr-3 text-gray-600">{p.type}</td>
                        <td className="py-3 pr-3">
                          {p.required === true ? (
                            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                              Bắt buộc
                            </span>
                          ) : (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              Tùy chọn
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-gray-600">
                          {p.description ?? "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === "response" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <th className="pb-2 pr-4 font-semibold">Mã</th>
                    <th className="pb-2 font-semibold">Ý nghĩa</th>
                  </tr>
                </thead>
                <tbody>
                  {api.responseParams.map((r, i) => (
                    <tr
                      key={`${r.code}-${i}`}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 pr-4 font-mono text-xs font-medium text-[#0066CC]">
                        {r.code}
                      </td>
                      <td className="py-3 text-gray-600">{r.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "xml" && (
            <div>
              <div className="mb-3 flex justify-end">
                {api.xmlTemplate !== "N/A" && (
                  <button
                    type="button"
                    onClick={() => onCopy(api.xmlTemplate)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-[#0066CC] hover:text-[#0066CC]"
                  >
                    <CopyIcon />
                    Sao chép XML
                  </button>
                )}
              </div>
              <XmlCodeBlock code={api.xmlTemplate} />
            </div>
          )}

          {tab === "test" && (
            <div className="py-2">
              <ApiTester api={api} />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-5 py-3">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={onPrev}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 enabled:hover:bg-gray-100 disabled:opacity-40"
          >
            ← API trước
          </button>
          <button
            type="button"
            disabled={!hasNext}
            onClick={onNext}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 enabled:hover:bg-gray-100 disabled:opacity-40"
          >
            API tiếp theo →
          </button>
        </div>
      </aside>
    </>
  );
}

function CopyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
