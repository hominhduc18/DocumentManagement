import type { ApiMethod } from "@/types/documentation";

export function MethodBadge({ method }: { method: ApiMethod }) {
  const isPost = method === "POST";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide transition-colors duration-200 ${
        isPost
          ? "bg-emerald-100 text-emerald-800"
          : "bg-orange-100 text-orange-800"
      }`}
    >
      {method}
    </span>
  );
}
