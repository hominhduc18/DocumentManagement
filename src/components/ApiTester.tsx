/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import type { ApiDoc } from "@/types/documentation";

export function ApiTester({ api }: { api: ApiDoc }) {
  const [url, setUrl] = useState(api.endpoint);
  const [method, setMethod] = useState(api.method);
  const [body, setBody] = useState(api.xmlTemplate || "");
  const [headers, setHeaders] = useState("{\n  \"Content-Type\": \"application/json\"\n}");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    data: string;
    headers: Record<string, string>;
    time: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUrl(api.endpoint);
    setMethod(api.method);
    setBody(api.xmlTemplate !== "N/A" ? api.xmlTemplate : "");
    setResponse(null);
    setError(null);
    
    const isUrlEncoded = 
      api.requestParams.some(p => p.description?.includes("application/x-www-form-urlencoded")) ||
      api.description?.includes("application/x-www-form-urlencoded");
    const isXml = api.xmlTemplate?.trim().startsWith("<");
    let contentType = "application/json";
    if (isUrlEncoded) contentType = "application/x-www-form-urlencoded";
    else if (isXml) contentType = "application/xml";
    
    setHeaders(`{\n  "Content-Type": "${contentType}"\n}`);
  }, [api]);

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);

    let parsedHeaders: Record<string, string> = {};
    try {
      parsedHeaders = JSON.parse(headers);
    } catch {
      setError("Headers không đúng định dạng JSON.");
      setIsLoading(false);
      return;
    }

    const startTime = Date.now();
    try {
      // Create actual request URL. If GET, we don't send body
      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: method !== "GET" ? body : undefined,
      });

      const endTime = Date.now();
      const time = endTime - startTime;
      
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        resHeaders[key] = value;
      });

      let resData = await res.text();
      try {
        const parsed = JSON.parse(resData);
        resData = JSON.stringify(parsed, null, 2);
      } catch {
        // Keep raw text if not JSON
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: resData,
        headers: resHeaders,
        time,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Lỗi mạng. Khả năng cao do API chặn CORS từ trình duyệt. Vui lòng xem Console để biết thêm chi tiết.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 font-semibold text-gray-700 outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
          value={method}
          onChange={e => setMethod(e.target.value as typeof method)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input 
          type="text" 
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="rounded-md bg-[#0066CC] px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Headers (JSON)</label>
          <textarea 
            className="h-32 w-full resize-y rounded-md border border-gray-300 p-3 font-mono text-xs outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
            value={headers}
            onChange={e => setHeaders(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Body</label>
          <textarea 
            className="h-32 w-full resize-y rounded-md border border-gray-300 p-3 font-mono text-xs outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
            value={body}
            onChange={e => setBody(e.target.value)}
            disabled={method === "GET"}
            placeholder="Payload JSON hoặc XML..."
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-bold text-red-800">Lỗi</h3>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {response && (
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className={response.status >= 200 && response.status < 300 ? "text-green-600" : "text-red-600"}>
              Status: {response.status} {response.statusText}
            </span>
            <span className="text-gray-500">Time: {response.time} ms</span>
          </div>
          <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50">
            <div className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-500">
              Response Body
            </div>
            <pre className="max-h-96 overflow-y-auto p-4 font-mono text-xs text-gray-800">
              {response.data || "(No content)"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
