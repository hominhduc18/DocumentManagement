"use client";

import { useCallback, useMemo, useState } from "react";
import { vnptDocumentation } from "@/data/vnptDocumentation";
import { bhytDocumentation } from "@/data/BHYT";
import { ApiCard } from "@/components/ApiCard";
import { ApiDetailPanel } from "@/components/ApiDetailPanel";
import { ErrorCodesView } from "@/components/ErrorCodesView";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Toast } from "@/components/Toast";
import { apiMatchesSearch, copyText, normalizeSearch } from "@/lib/utils";
import type {
  ApiDoc,
  MainView,
  MethodFilter,
  ViewMode,
} from "@/types/documentation";

export function DocumentationApp() {
  const [docSource, setDocSource] = useState<"vnpt" | "bhyt">("vnpt");
  const doc = docSource === "vnpt" ? vnptDocumentation : bhytDocumentation;

  const handleDocSourceChange = (newSource: "vnpt" | "bhyt") => {
    setDocSource(newSource);
    setSelectedGroupId(null);
    setSelectedApiId(null);
    setSearchQuery("");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mainView, setMainView] = useState<MainView>("apis");
  const [selectedApiId, setSelectedApiId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const q = normalizeSearch(searchQuery);

  const apiCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const api of doc.apis) {
      counts[api.serviceGroupId] = (counts[api.serviceGroupId] ?? 0) + 1;
    }
    return counts;
  }, [doc.apis]);

  const filteredApis = useMemo(() => {
    return doc.apis.filter((api) => {
      if (selectedGroupId && api.serviceGroupId !== selectedGroupId) return false;
      if (methodFilter !== "ALL" && api.method !== methodFilter) return false;
      if (!apiMatchesSearch(api, q)) return false;
      return true;
    });
  }, [doc.apis, selectedGroupId, methodFilter, q]);

  const selectedApi = useMemo(
    () => doc.apis.find((a) => a.id === selectedApiId) ?? null,
    [doc.apis, selectedApiId]
  );

  const selectedIndex = selectedApi
    ? filteredApis.findIndex((a) => a.id === selectedApi.id)
    : -1;

  const showToast = useCallback(() => {
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2000);
  }, []);

  const handleCopy = useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      if (ok) showToast();
    },
    [showToast]
  );

  const selectApi = (api: ApiDoc) => {
    setSelectedApiId(api.id);
    setMainView("apis");
  };

  const goPrev = () => {
    if (selectedIndex > 0) {
      setSelectedApiId(filteredApis[selectedIndex - 1].id);
    }
  };

  const goNext = () => {
    if (selectedIndex >= 0 && selectedIndex < filteredApis.length - 1) {
      setSelectedApiId(filteredApis[selectedIndex + 1].id);
    }
  };

  const methodButtons: MethodFilter[] = ["ALL", "POST", "GET"];

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] bg-gray-50">
      <Header
        doc={doc}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        docSource={docSource}
        onDocSourceChange={handleDocSourceChange}
      />

      <div className="relative flex min-h-0 overflow-hidden">
        {mobileSidebarOpen && (
          <div
            className="absolute inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden
          />
        )}
        <div
          className={`absolute inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-xl transition-transform duration-200 lg:relative lg:z-auto lg:w-72 lg:max-w-none lg:translate-x-0 lg:shadow-none ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Sidebar
            groups={doc.serviceGroups}
            apiCounts={apiCounts}
            selectedGroupId={selectedGroupId}
            mainView={mainView}
            onSelectGroup={setSelectedGroupId}
            onSelectView={setMainView}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        </div>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {mainView === "errors" ? (
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <ErrorCodesView errors={doc.globalErrors} />
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden">
              <div
                className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-200 ${
                  selectedApi ? "lg:max-w-[55%]" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:px-6">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileSidebarOpen(true)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-all duration-200 hover:bg-gray-50 lg:hidden"
                      aria-label="Mở menu"
                    >
                      <MenuIcon />
                    </button>
                    <p className="text-sm text-gray-600">
                      Đang hiển thị{" "}
                      <span className="font-semibold text-[#0066CC]">
                        {filteredApis.length}
                      </span>{" "}
                      / {doc.apis.length} API
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-lg border border-gray-200 p-0.5">
                      {methodButtons.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMethodFilter(m)}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                            methodFilter === m
                              ? "bg-[#0066CC] text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <div className="flex rounded-lg border border-gray-200 p-0.5">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`rounded-md p-1.5 transition-all duration-200 ${
                          viewMode === "grid"
                            ? "bg-gray-200 text-gray-900"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                        aria-label="Dạng lưới"
                      >
                        <GridIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`rounded-md p-1.5 transition-all duration-200 ${
                          viewMode === "list"
                            ? "bg-gray-200 text-gray-900"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                        aria-label="Dạng danh sách"
                      >
                        <ListIcon />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                  {filteredApis.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <p className="text-lg font-medium text-gray-700">
                        Không tìm thấy API phù hợp
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Thử đổi bộ lọc hoặc từ khóa tìm kiếm
                      </p>
                    </div>
                  ) : (
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
                          : "flex flex-col gap-2"
                      }
                    >
                      {filteredApis.map((api) => (
                        <ApiCard
                          key={api.id}
                          api={api}
                          searchQuery={q}
                          viewMode={viewMode}
                          isSelected={selectedApiId === api.id}
                          onClick={() => selectApi(api)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedApi && (
                <div className="hidden w-[45%] shrink-0 border-l border-gray-200 lg:flex lg:flex-col">
                  <ApiDetailPanel
                    api={selectedApi}
                    searchQuery={q}
                    hasPrev={selectedIndex > 0}
                    hasNext={
                      selectedIndex >= 0 &&
                      selectedIndex < filteredApis.length - 1
                    }
                    onPrev={goPrev}
                    onNext={goNext}
                    onClose={() => setSelectedApiId(null)}
                    onCopy={handleCopy}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile detail panel */}
      {selectedApi && mainView === "apis" && (
        <div className="lg:hidden">
          <ApiDetailPanel
            api={selectedApi}
            searchQuery={q}
            hasPrev={selectedIndex > 0}
            hasNext={
              selectedIndex >= 0 && selectedIndex < filteredApis.length - 1
            }
            onPrev={goPrev}
            onNext={goNext}
            onClose={() => setSelectedApiId(null)}
            onCopy={handleCopy}
          />
        </div>
      )}

      <Toast message="Đã sao chép!" visible={toastVisible} />
    </div>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
