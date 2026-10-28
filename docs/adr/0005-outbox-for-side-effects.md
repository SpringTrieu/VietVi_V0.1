# ADR 0005: Xử lý tác vụ bất đồng bộ và Tác dụng phụ qua Transactional Outbox và BullMQ

- **Mã quyết định:** D9
- **Trạng thái:** Đã duyệt
- **Người duyệt:** @tech-lead
- **Ngày:** 2026-10-29

---

## 1. Ngữ cảnh
Khi người dùng thực hiện thao tác đổi trạng thái (chấp nhận offer, hoàn thành đơn, thanh toán), hệ thống cần kích hoạt nhiều tác dụng phụ (side-effects): gửi email OTP, đẩy socket realtime, gửi thông báo in-app, cập nhật thống kê, gọi webhook. Nếu thực hiện các tác vụ này trực tiếp trong giao dịch database:
- Giao dịch bị kéo dài, dễ deadlock và nghẽn tài nguyên.
- Nếu dịch vụ ngoài (mail, cổng thanh toán) gặp sự cố khiến giao dịch DB rollback, nghiệp vụ bị hỏng.
- Nếu nghiệp vụ DB rollback sau khi đã gửi email/thông báo, sẽ tạo ra thông báo "ma" sai lệch.

## 2. Quyết định
Áp dụng mẫu hình **Transactional Outbox**:
1. Trong một giao dịch DB duy nhất: kiểm quyền → kiểm máy trạng thái → ghi dữ liệu → ghi audit log → ghi sự kiện vào bảng `outbox_events` → COMMIT. Tuyệt đối không gọi dịch vụ ngoài trong giao dịch.
2. Tiến trình `worker` độc lập định kỳ đọc các sự kiện chưa phát từ `outbox_events`, đẩy vào hàng đợi **BullMQ** (trên Redis/Valkey) để xử lý bất đồng bộ (gửi mail, đẩy socket, thông báo).
3. Sau khi xử lý thành công, đánh dấu `published_at` cho sự kiện.

## 3. Hệ quả
- **Tích cực:** Đảm bảo tính nhất quán (Atomicity), không bao giờ có thông báo ma khi rollback, tự động retry khi dịch vụ ngoài gián đoạn.
- **Tiêu cực:** Có độ trễ nhỏ (eventual consistency) trong việc gửi thông báo; cần duy trì tiến trình worker và Redis.

## 4. Xem lại khi
Lưu lượng sự kiện tăng vượt quá khả năng xử lý của PostgreSQL outbox table (cần chuyển sang Kafka/RabbitMQ).
