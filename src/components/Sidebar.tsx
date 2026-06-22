"use client";

import type { MainView, ServiceGroup } from "@/types/documentation";

export function Sidebar({
  groups,
  apiCounts,
  selectedGroupId,
  mainView,
  hasGuide,
  onSelectGroup,
  onSelectView,
  onCloseMobile,
  onToggleCollapse,
}: {
  groups: ServiceGroup[];
  apiCounts: Record<string, number>;
  selectedGroupId: string | null;
  mainView: MainView;
  hasGuide?: boolean;
  onSelectGroup: (id: string | null) => void;
  onSelectView: (view: MainView) => void;
  onCloseMobile?: () => void;
  onToggleCollapse?: () => void;
}) {
  const handleGroup = (id: string | null) => {
    onSelectView("apis");
    onSelectGroup(id);
    onCloseMobile?.();
  };

  const handleErrors = () => {
    onSelectView("errors");
    onCloseMobile?.();
  };

  return (
    <aside className="flex h-full flex-col border-r border-white/50 bg-white/40 backdrop-blur-md">
      <div className="border-b border-gray-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Nhóm dịch vụ
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <button
          type="button"
          onClick={() => handleGroup(null)}
          className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${
            mainView === "apis" && selectedGroupId === null
              ? "bg-[#0066CC] text-white shadow-sm"
              : "text-gray-700 hover:bg-white hover:shadow-sm"
          }`}
        >
          <span className="font-medium">Tất cả API</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              mainView === "apis" && selectedGroupId === null
                ? "bg-white/20 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {Object.values(apiCounts).reduce((a, b) => a + b, 0)}
          </span>
        </button>
        <ul className="space-y-0.5">
          {groups.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => handleGroup(g.id)}
                title={g.description}
                className={`flex w-full items-start justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                  mainView === "apis" && selectedGroupId === g.id
                    ? "bg-[#0066CC] text-white shadow-sm"
                    : "text-gray-700 hover:bg-white hover:shadow-sm"
                }`}
              >
                <span className="line-clamp-2 leading-snug">{g.name}</span>
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    mainView === "apis" && selectedGroupId === g.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {apiCounts[g.id] ?? 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-200 p-2 flex flex-col gap-2">
        {hasGuide && (
          <button
            type="button"
            onClick={() => {
              onSelectView("guide");
              onCloseMobile?.();
            }}
            className={`flex-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              mainView === "guide"
                ? "bg-[#0066CC] text-white shadow-sm"
                : "text-gray-700 hover:bg-white hover:shadow-sm"
            }`}
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Hướng dẫn XML BHYT
          </button>
        )}
        <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={handleErrors}
          className={`flex-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            mainView === "errors"
              ? "bg-red-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-white hover:shadow-sm"
          }`}
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Bảng mã lỗi
        </button>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center rounded-lg px-3 text-gray-500 hover:bg-white hover:text-gray-700 transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm"
            title="Thu nhỏ sidebar"
            aria-label="Thu nhỏ sidebar"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        </div>
      </div>
    </aside>
  );
}
