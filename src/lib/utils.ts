import type { ApiDoc } from "@/types/documentation";

export function normalizeSearch(q: string): string {
  return q.trim().toLowerCase();
}

export function apiMatchesSearch(api: ApiDoc, query: string): boolean {
  if (!query) return true;
  const haystack = [
    api.name,
    api.description,
    api.endpoint,
    api.method,
    ...api.requestParams.map((p) => `${p.name} ${p.description ?? ""}`),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function highlightParts(
  text: string,
  query: string
): { text: string; highlight: boolean }[] {
  if (!query) return [{ text, highlight: false }];
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const parts: { text: string; highlight: boolean }[] = [];
  let i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(q, i);
    if (idx === -1) {
      parts.push({ text: text.slice(i), highlight: false });
      break;
    }
    if (idx > i) parts.push({ text: text.slice(i, idx), highlight: false });
    parts.push({ text: text.slice(idx, idx + q.length), highlight: true });
    i = idx + q.length;
  }
  return parts.length ? parts : [{ text, highlight: false }];
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const GROUP_COLORS: Record<string, string> = {
  "basic-publish": "#0066CC",
  "basic-portal": "#0088DD",
  "basic-business": "#0055AA",
  "tt78-publish": "#00AA66",
  "tt78-business": "#009955",
  "ctt-service": "#7C3AED",
  "mtt-service": "#EA580C",
};
