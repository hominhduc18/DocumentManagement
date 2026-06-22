"use client";

import React from "react";
import { BhytXmlViewer } from "./BhytXmlViewer";

export function BhytGuide() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Chuẩn và định dạng dữ liệu đầu ra XML phục vụ KCB BHYT
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Quyết định 130/QĐ-BYT (18/01/2023), sửa đổi bổ sung bởi QĐ 4750/QĐ-BYT và QĐ 3176/QĐ-BYT.
        </p>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-gray-200 bg-white p-6 space-y-8">
        
        {/* Mục 1: Mở đầu */}
        <section>
          <h3 className="text-lg font-semibold text-[#0066CC] mb-3">1. Tổng quan chuẩn dữ liệu XML</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Chuẩn dữ liệu đầu ra XML do Bộ Y tế ban hành nhằm thống nhất định dạng dữ liệu điện tử, phục vụ tự động hóa quá trình giám định và thanh toán BHYT. Tiêu chuẩn này áp dụng bắt buộc đối với tất cả cơ sở khám bệnh, chữa bệnh (KCB) và cơ quan Bảo hiểm xã hội trên toàn quốc, thay thế hoàn toàn chuẩn cũ theo Quyết định 4210/QĐ-BYT.
          </p>
        </section>

        {/* Mục 2: Danh sách bảng tương tác */}
        <section>
          <h3 className="text-lg font-semibold text-[#0066CC] mb-3">2. Danh sách các file XML dữ liệu</h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            Hệ thống hiện tại cung cấp sẵn dữ liệu của 368 trường (field) thuộc 13 bảng cấu trúc chính (Bảng check-in và XML1 đến XML12). Bạn hãy nhấn vào từng dòng trong bảng danh sách XML tương tác bên dưới để mở rộng và tra cứu thông tin chi tiết của từng field (bao gồm tên trường, kiểu dữ liệu, kích thước tối đa và mức độ bắt buộc).
          </p>
          <BhytXmlViewer />
        </section>

        {/* Mục 4: Cảnh báo */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
           
          </div>
        </section>

      

        {/* Mục 6: Kết luận */}
        <section className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Nguồn tra cứu cập nhật chính thống:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Cổng thông tin điện tử Bộ Y tế</li>
            <li>Cổng tiếp nhận dữ liệu Hệ thống thông tin giám định BHYT</li>
            <li>Hệ thống Thư viện Pháp luật (thuvienphapluat.vn)</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
