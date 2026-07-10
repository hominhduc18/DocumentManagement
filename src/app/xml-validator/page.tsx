import React from 'react';
import XmlValidator from '@/components/XmlValidator';

export const metadata = {
  title: 'Kiểm tra XML - Ký Số',
  description: 'Công cụ kiểm tra, sửa lỗi và cập nhật file XML QĐ 130 sau khi ký số',
};

export default function XmlValidatorPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Công cụ Kiểm tra XML</h1>
          <p className="mt-2 text-sm text-gray-600 max-w-3xl">
            Hỗ trợ kiểm tra các file XML (XML1, XML2,...) theo QĐ 130, đối chiếu các trường bắt buộc, 
            kiểu dữ liệu và cho phép cập nhật dữ liệu bị sai trước khi ký số lại.
          </p>
        </div>
        
        <XmlValidator />
      </div>
    </div>
  );
}
