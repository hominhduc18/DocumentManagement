"use client";

import { highlightParts } from "@/lib/utils";

export function HighlightText({
  text,
  query,
  className = "",
}: {
  text: string;
  query: string;
  className?: string;
}) {
  const parts = highlightParts(text, query);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark
            key={i}
            className="rounded bg-amber-200/90 px-0.5 text-inherit dark:bg-amber-500/40"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </span>
  );
}
