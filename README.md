# Tài liệu API Hóa đơn điện tử VNPT v6.0

Ứng dụng web Next.js tra cứu tài liệu API Hóa đơn điện tử VNPT (phiên bản 6.0).

## Chạy ứng dụng

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Tính năng

- Tìm kiếm realtime (tên API, mô tả, endpoint, tham số) kèm highlight
- Lọc theo 7 nhóm dịch vụ (sidebar)
- Lọc Method: ALL / POST / GET
- Chi tiết API: tham số, phản hồi, XML template (syntax highlight)
- Bảng 18 mã lỗi hệ thống (ERR:1 → ERR:60)
- Copy endpoint & XML + toast xác nhận
- Responsive (sidebar drawer trên mobile)

## Dữ liệu

Toàn bộ tài liệu API nằm trong `src/data/vnptDocumentation.ts`.

## Công nghệ

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript
