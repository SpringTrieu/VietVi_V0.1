# ADR 0002: Tổ chức Monorepo với pnpm workspaces và Turborepo

- **Mã quyết định:** D2
- **Trạng thái:** Đã duyệt
- **Người duyệt:** @tech-lead
- **Ngày:** 2026-10-29

---

## 1. Ngữ cảnh
Dự án bao gồm 3 ứng dụng (`web`, `admin`, `api`) và các thư viện dùng chung (`contracts`, `ui`, `i18n`, `config-eslint`, `config-typescript`). Cần cơ chế chia sẻ mã nguồn tức thời, đảm bảo kiểu dữ liệu và schema Zod đồng bộ giữa FE và BE trong cùng một PR mà không cần xuất bản package lên registry riêng.

## 2. Quyết định
Chọn mô hình **Monorepo** với:
- **pnpm workspaces**: Quản lý gói phụ thuộc tiết kiệm ổ đĩa, hỗ trợ `catalog:` để đồng nhất phiên bản thư viện toàn repo, và tính năng an toàn chuỗi cung ứng.
- **Turborepo**: Điều phối pipeline build, test, lint với cơ chế cache cục bộ thông minh, chỉ chạy lại các phần bị ảnh hưởng bởi thay đổi.

## 3. Hệ quả
- **Tích cực:** Thay đổi hợp đồng API được FE và BE cập nhật và xác thực ngay trong một commit; tooling dùng chung thống nhất.
- **Tiêu cực:** Repo lớn hơn, cần cấu hình CI và cache cẩn thận.

## 4. Xem lại khi
Quy mô đội ngũ vượt quá 10 người hoặc khi sản phẩm phân tách thành các dòng sản phẩm độc lập.
