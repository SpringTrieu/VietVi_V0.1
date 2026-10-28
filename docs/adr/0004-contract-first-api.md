# ADR 0004: Thiết kế API theo mô hình Contract-First

- **Mã quyết định:** D8
- **Trạng thái:** Đã duyệt
- **Người duyệt:** @tech-lead
- **Ngày:** 2026-10-29

---

## 1. Ngữ cảnh
Đội chỉ có 1 lập trình viên Back-end và 2 lập trình viên Front-end (rủi ro bus factor = 1). Nếu FE phải chờ BE hoàn thiện logic và triển khai API mới có thể xây dựng giao diện, dự án sẽ bị nghẽn cổ chai và trễ tiến độ. Ngoài ra, việc viết lặp lại logic validation ở cả hai phía dễ dẫn đến sai lệch luật kiểm tra dữ liệu.

## 2. Quyết định
Áp dụng quy trình **Contract-First**:
1. Định nghĩa Zod schema, enum trạng thái, mã lỗi chuẩn trong package độc lập `packages/contracts` (không phụ thuộc React hay NestJS).
2. NestJS dùng lại Zod schema để kiểm tra dữ liệu đầu vào và xuất `docs/api/openapi.json`.
3. Công cụ **Orval** tự động sinh client hook TanStack Query và mock server **MSW** cho Front-end.
4. FE phát triển giao diện ngay với mock data mà không bị chặn bởi tiến độ của BE.

## 3. Hệ quả
- **Tích cực:** FE và BE làm việc song song hiệu quả; duy nhất một nguồn sự thật cho validation schema; mã lỗi nhất quán.
- **Tiêu cực:** Mọi thay đổi endpoint đòi hỏi cập nhật hợp đồng và sinh lại client trước.

## 4. Xem lại khi
Không có kế hoạch xem lại trong giai đoạn MVP.
