"use client";

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Search, FileText, AlertCircle, Info } from 'lucide-react';
import xmlData from '../data/xmlFieldsData.json';

// Type definition for our JSON structure
type FieldData = {
  stt: string;
  name: string;
  type: string;
  required: string;
  description: string;
};

type TableData = {
  id: string;
  name: string;
  purpose: string;
  fields: FieldData[];
};

export function BhytXmlViewer() {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTable = (id: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allIds = xmlData.reduce((acc, table) => ({ ...acc, [table.id]: true }), {});
    setExpandedTables(allIds);
  };

  const collapseAll = () => {
    setExpandedTables({});
  };

  const renderRequiredBadge = (req: string) => {
    if (req.includes('Bắt buộc có điều kiện')) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#fff3e0] text-[#9a5b00] border border-[#ffcc80]">
          <AlertCircle className="w-3 h-3 mr-1" />
          Có điều kiện
        </span>
      );
    }
    if (req.includes('Bắt buộc')) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#fef3f2] text-[#b42318] border border-[#fecdca]">
          Bắt buộc
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
        Tùy chọn
      </span>
    );
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return xmlData as TableData[];
    
    const query = searchQuery.toLowerCase();
    
    return (xmlData as TableData[]).map(table => {
      const filteredFields = table.fields.filter(field => 
        field.name.toLowerCase().includes(query) || 
        field.description.toLowerCase().includes(query)
      );
      
      // If the table name itself matches, show all fields, otherwise only show matching fields
      if (table.name.toLowerCase().includes(query)) {
        return table;
      }
      
      return { ...table, fields: filteredFields };
    }).filter(table => table.fields.length > 0);
  }, [searchQuery]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-sans">
      <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1d4ed8] flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Tra cứu cấu trúc 12 bảng XML BHYT
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            QĐ 130/QĐ-BYT & QĐ 4750/QĐ-BYT • Dữ liệu chuẩn xác từ Phụ lục Bộ Y tế
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm trường (VD: MA_LK)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] outline-none w-full sm:w-64"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <button onClick={expandAll} className="px-3 py-2 text-[#2563eb] bg-[#eff6ff] hover:bg-[#dbeafe] rounded-lg font-medium transition-colors">
              Mở tất cả
            </button>
            <button onClick={collapseAll} className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
              Thu gọn
            </button>
          </div>
        </div>
      </div>

      <div className="p-2 space-y-2">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy trường dữ liệu nào phù hợp với &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredData.map((table) => {
            // Auto expand if searching and found matching fields
            const isExpanded = expandedTables[table.id] ?? (searchQuery.length > 0);
            
            return (
              <div key={table.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleTable(table.id)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#2563eb]">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{table.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                          {table.fields.length} trường
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-md hidden md:inline-block">
                          {table.purpose}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 bg-[#f9fafb] p-4">
                    <div className="md:hidden text-xs text-gray-600 mb-4 bg-blue-50 p-2 rounded-md border border-blue-100 flex gap-2">
                      <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>{table.purpose}</span>
                    </div>
                    
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-700">
                            <th className="px-4 py-3 font-semibold border-b w-12 text-center">STT</th>
                            <th className="px-4 py-3 font-semibold border-b w-48">Tên trường</th>
                            <th className="px-4 py-3 font-semibold border-b w-32">Kiểu/Cỡ</th>
                            <th className="px-4 py-3 font-semibold border-b w-36">Bắt buộc</th>
                            <th className="px-4 py-3 font-semibold border-b">Diễn giải</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {table.fields.map((field, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                              <td className="px-4 py-3 text-center text-gray-500 font-medium align-top">{field.stt}</td>
                              <td className="px-4 py-3 font-mono text-[#0369a1] font-semibold align-top whitespace-nowrap">
                                {field.name}
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-xs font-mono align-top">
                                {field.type}
                              </td>
                              <td className="px-4 py-3 align-top">
                                {renderRequiredBadge(field.required)}
                              </td>
                              <td className="px-4 py-3 text-gray-700 leading-relaxed text-[13px] align-top" dangerouslySetInnerHTML={{ __html: field.description }}>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
