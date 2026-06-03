"use client";

import { HighlightText } from "@/components/HighlightText";
import { MethodBadge } from "@/components/MethodBadge";
import { GROUP_COLORS } from "@/lib/utils";
import type { ApiDoc } from "@/types/documentation";
import type { ViewMode } from "@/types/documentation";

export function ApiCard({
  api,
  searchQuery,
  viewMode,
  isSelected,
  onClick,
}: {
  api: ApiDoc;
  searchQuery: string;
  viewMode: ViewMode;
  isSelected: boolean;
  onClick: () => void;
}) {
  const borderColor = GROUP_COLORS[api.serviceGroupId] ?? "#0066CC";

  if (viewMode === "list") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-all duration-200 hover:shadow-md ${
          isSelected ? "ring-2 ring-[#0066CC]/40" : ""
        }`}
        style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}
      >
        <MethodBadge method={api.method} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">
            <HighlightText text={api.name} query={searchQuery} />
          </p>
          <p className="truncate font-mono text-xs text-[#0066CC]">
            <HighlightText text={api.endpoint} query={searchQuery} />
          </p>
        </div>
        <p className="hidden max-w-md truncate text-sm text-gray-500 lg:block">
          <HighlightText text={api.description} query={searchQuery} />
        </p>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isSelected ? "ring-2 ring-[#0066CC]/40" : ""
      }`}
      style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-tight">
          <HighlightText text={api.name} query={searchQuery} />
        </h3>
        <MethodBadge method={api.method} />
      </div>
      <p className="mb-2 truncate font-mono text-xs text-[#0066CC]">
        <HighlightText text={api.endpoint} query={searchQuery} />
      </p>
      <p className="line-clamp-2 flex-1 text-sm text-gray-600">
        <HighlightText text={api.description} query={searchQuery} />
      </p>
    </button>
  );
}
