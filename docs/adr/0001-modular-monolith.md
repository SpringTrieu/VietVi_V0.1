# ADR 0001: Lựa chọn kiến trúc Modular Monolith

- **Mã quyết định:** D1
- **Trạng thái:** Đã duyệt
- **Người duyệt:** @tech-lead
- **Ngày:** 2026-10-29

---

## 1. Ngữ cảnh
Đội ngũ phát triển gồm 3 người (2 Front-end, 1 Back-end) với mục tiêu hoàn thành MVP trong 6 sprint. Hệ thống có nhiều nghiệp vụ phức tạp liên quan mật thiết (Auth, Task, Offer, Order, Payment, Moderation). Nếu làm Microservices ngay từ đầu, chi phí hạ tầng, DevOps, mạng và phân tán giao dịch sẽ làm đội quá tải.

## 2. Quyết định
Chọn kiến trúc **Modular Monolith** gồm:
- **1 Codebase API**: Tổ chức thành các module nghiệp vụ độc lập (`modules/*`) khớp với tài liệu SDD.
- **2 Tiến trình chạy độc lập**:
  - Tiến trình `api`: phục vụ HTTP REST và WebSocket.
  - Tiến trình `worker`: chạy BullMQ processor, xử lý outbox và job định kỳ.
- Không để các module chéo import repository của nhau; giao tiếp nội bộ qua service công khai hoặc outbox events.

## 3. Hệ quả
- **Tích cực:** Tốc độ phát triển nhanh, giao dịch database cục bộ tin cậy, không tốn chi phí quản lý nhiều service. Khi cần tách microservice trong tương lai, module đã được đóng gói sẵn.
- **Tiêu cực:** Cần kỷ luật đội ngũ cao và công cụ kiểm tra tự động (`eslint-plugin-boundaries`) để chống rò rỉ phụ thuộc giữa các module.

## 4. Xem lại khi
Khi một module cụ thể cần scale hoặc deploy độc lập với tần suất cao.
