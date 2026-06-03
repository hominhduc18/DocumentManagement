"use client";

import type { MainView, ServiceGroup } from "@/types/documentation";

export function Sidebar({
  groups,
  apiCounts,
  selectedGroupId,
  mainView,
  onSelectGroup,
  onSelectView,
  onCloseMobile,
}: {
  groups: ServiceGroup[];
  apiCounts: Record<string, number>;
  selectedGroupId: string | null;
  mainView: MainView;
  onSelectGroup: (id: string | null) => void;
  onSelectView: (view: MainView) => void;
  onCloseMobile?: () => void;
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
    <aside className="flex h-full flex-col border-r border-gray-200 bg-gray-50/80">
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
      <div className="border-t border-gray-200 p-2">
        <button
          type="button"
          onClick={handleErrors}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
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
      </div>
    </aside>
  );
}
