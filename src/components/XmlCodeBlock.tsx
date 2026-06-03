"use client";

function highlightXml(code: string): string {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(
      /(&lt;\/?)([\w:]+)/g,
      '$1<span class="text-[#569cd6]">$2</span>'
    )
    .replace(/(&gt;)/g, '<span class="text-[#808080]">$1</span>')
    .replace(/(&lt;)/g, '<span class="text-[#808080]">$1</span>');
}

export function XmlCodeBlock({ code }: { code: string }) {
  if (code === "N/A") {
    return (
      <p className="rounded-lg bg-[#1e1e1e] px-4 py-6 text-center font-mono text-sm text-gray-400">
        Không có mẫu XML cho API này
      </p>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-lg bg-[#1e1e1e] p-4 font-mono text-sm leading-relaxed text-[#d4d4d4]">
      <code dangerouslySetInnerHTML={{ __html: highlightXml(code) }} />
    </pre>
  );
}
