'use client';

import React, { useState } from 'react';
import { validateEnvelopeXml, buildXml, updateXmlFieldByPath, EnvelopeValidationResult, rebuildEnvelopeXml } from '@/lib/xmlValidation';
import { Upload, Download, CheckCircle, AlertCircle, Edit2, Save, X, FileJson } from 'lucide-react';
import xmlFieldsData from '@/data/xmlFieldsData.json';

export default function XmlValidator() {
  const [xmlInput, setXmlInput] = useState('');
  const [envelopeResult, setEnvelopeResult] = useState<EnvelopeValidationResult | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setXmlInput(text);
        handleValidate(text);
      };
      reader.readAsText(file);
    }
  };

  const handleValidate = (text: string = xmlInput, resetTab: boolean = true) => {
    if (!text.trim()) return;
    const result = validateEnvelopeXml(text);
    setEnvelopeResult(result);
    if (resetTab) {
      setSelectedTab(0);
    }
  };

  const currentFile = envelopeResult?.files[selectedTab];
  const validationResult = currentFile?.result;

  const startEdit = (fullPath: string, currentValue: any) => {
    setEditingField(fullPath);
    setEditValue(String(currentValue || ''));
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (validationResult?.parsedData && editingField && envelopeResult && currentFile) {
      const newData = updateXmlFieldByPath(validationResult.parsedData, editingField, editValue);
      const newInnerXml = buildXml(newData);
      
      let newXmlInput = xmlInput;

      if (envelopeResult.isEnvelope && envelopeResult.parsedEnvelope) {
        // Rebuild envelope
        const updatedFiles = envelopeResult.files.map((f, idx) => {
          if (idx === selectedTab) return { loaiHoSo: f.loaiHoSo, updatedRawXml: newInnerXml };
          return { loaiHoSo: f.loaiHoSo, updatedRawXml: f.result.rawXml };
        });
        newXmlInput = rebuildEnvelopeXml(envelopeResult.parsedEnvelope, updatedFiles);
      } else {
        newXmlInput = newInnerXml;
      }

      setXmlInput(newXmlInput);
      handleValidate(newXmlInput, false);
      setEditingField(null);
    }
  };

  const downloadXml = () => {
    const blob = new Blob([xmlInput], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `updated_xml_${new Date().getTime()}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDisplayFields = () => {
    if (!validationResult?.parsedData) return [];
    const fields: { key: string; value: any; error: string | null; fullPath: string }[] = [];
    
    const extractFields = (node: any, path: string = '') => {
      if (typeof node === 'object' && node !== null && !Array.isArray(node)) {
        for (const key of Object.keys(node)) {
          if (key.startsWith('@_')) continue;
          if (typeof node[key] !== 'object') {
            const error = validationResult.errors.find(e => e.field === key)?.message || null;
            const fullPath = path ? `${path}.${key}` : key;
            fields.push({ key, value: node[key], error, fullPath });
          } else {
            extractFields(node[key], path ? `${path}.${key}` : key);
          }
        }
      } else if (Array.isArray(node)) {
        node.forEach((item, idx) => extractFields(item, `${path}[${idx}]`));
      }
    };
    
    const rootKeys = Object.keys(validationResult.parsedData).filter(k => !k.startsWith('?'));
    if (rootKeys.length > 0) {
      extractFields(validationResult.parsedData[rootKeys[0]]);
    }
    
    validationResult.errors.forEach(err => {
      if (!fields.find(f => f.key === err.field)) {
        fields.push({ key: err.field, value: '', error: err.message, fullPath: err.field });
      }
    });

    return fields;
  };

  const displayFields = getDisplayFields();
  const ruleDef = validationResult?.xmlType ? xmlFieldsData.find(d => d.name === validationResult.xmlType || d.id === validationResult.xmlType) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      {/* Left Column */}
      <div className={`w-full transition-all duration-300 ${envelopeResult ? 'lg:w-[40%] xl:w-[35%] lg:sticky lg:top-24' : 'max-w-3xl mx-auto'}`}>
      <div className="bg-white rounded-lg shadow p-6 border-t-4 border-[#0066CC]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Kiểm tra và Cập nhật XML (GIAMDINHHS)</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#0066CC]/30 border-dashed rounded-lg cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-[#0066CC]" />
                <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-[#0066CC]">Tải file XML lên</span> hoặc kéo thả vào đây (Hỗ trợ file đơn hoặc GIAMDINHHS)</p>
              </div>
              <input type="file" className="hidden" accept=".xml" onChange={handleFileUpload} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hoặc dán nội dung XML vào đây:</label>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] font-mono text-xs text-gray-700 bg-gray-50"
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
              placeholder="<GIAMDINHHS>...</GIAMDINHHS> hoặc <CHITIEU_TTHOP_KCB>...</CHITIEU_TTHOP_KCB>"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleValidate()}
              className="px-4 py-2 bg-[#0066CC] text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Kiểm tra XML
            </button>
            {envelopeResult && (
              <button
                onClick={downloadXml}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Tải xuống XML
              </button>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Right Column */}
      {envelopeResult && (
        <div className="w-full lg:w-[60%] xl:w-[65%]">
          <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center space-x-2">
              {envelopeResult.isValid ? (
                <CheckCircle className="text-emerald-500 w-6 h-6" />
              ) : (
                <AlertCircle className="text-rose-500 w-6 h-6" />
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                Kết quả kiểm tra: {envelopeResult.isValid ? 'Hợp lệ' : 'Có lỗi'}
              </h3>
            </div>
            
            {envelopeResult.isEnvelope && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold flex items-center">
                <FileJson className="w-4 h-4 mr-1" />
                Hồ sơ tổng hợp (GIAMDINHHS)
              </span>
            )}
          </div>

          {envelopeResult.files.length > 1 && (
            <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/50">
              {envelopeResult.files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTab(idx)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    selectedTab === idx
                      ? 'border-[#0066CC] text-[#0066CC] bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center">
                    {file.loaiHoSo}
                    {!file.result.isValid && <AlertCircle className="w-3 h-3 ml-1 text-rose-500" />}
                  </span>
                </button>
              ))}
            </div>
          )}

          {currentFile && validationResult && (
            <div>
              <div className="p-4 bg-blue-50/30 border-b border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Chi tiết bảng: {currentFile.loaiHoSo}</span>
                {validationResult.xmlType && (
                  <span className="text-xs text-gray-500">Khuôn dạng: {validationResult.xmlType}</span>
                )}
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <table className="min-w-full divide-y divide-gray-200 relative">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trường dữ liệu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị hiện tại</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {displayFields.map((field, idx) => {
                    const rule = ruleDef?.fields.find(r => r.name === field.key);
                    const isEditing = editingField === field.fullPath;
                    
                    return (
                      <tr key={idx} className={field.error ? 'bg-rose-50/50' : 'hover:bg-gray-50/50'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{field.key}</div>
                          {rule && (
                            <div className="text-xs text-gray-500 mt-1">
                              {rule.type} • <span className={rule.required.includes('🔴') ? 'text-rose-600' : 'text-amber-600'}>{rule.required}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-md break-words">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="border border-[#0066CC] rounded p-1.5 w-full text-sm focus:ring-2 focus:ring-[#0066CC]/20 outline-none"
                              autoFocus
                            />
                          ) : (
                            <div className="text-sm text-gray-900 font-mono break-words whitespace-pre-wrap" title={String(field.value)}>
                              {field.value === '' || field.value === undefined ? (
                                <span className="text-gray-400 italic">(Trống)</span>
                              ) : (
                                String(field.value)
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {field.error ? (
                            <div className="flex items-center text-rose-600 text-sm font-medium">
                              <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                              {field.error}
                            </div>
                          ) : (
                            <div className="flex items-center text-emerald-600 text-sm font-medium">
                              <CheckCircle className="w-4 h-4 mr-1.5 shrink-0" />
                              Hợp lệ
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {isEditing ? (
                            <div className="flex space-x-2">
                              <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded transition-colors" title="Lưu">
                                <Save className="w-4 h-4" />
                              </button>
                              <button onClick={cancelEdit} className="text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-1.5 rounded transition-colors" title="Hủy">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => startEdit(field.fullPath, field.value)}
                              className="text-[#0066CC] hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded flex items-center transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-1" />
                              Sửa
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {displayFields.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                        Không có dữ liệu hợp lệ trong file này
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}
