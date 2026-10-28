# Hướng dẫn đóng góp cho VIETVI (CONTRIBUTING)

Chào mừng bạn đến với dự án VIETVI. Tài liệu này quy định các chuẩn mực làm việc, nhánh, commit, và quy trình kiểm duyệt bắt buộc cho toàn đội.

---

## 1. Quy ước Git và Nhánh (Section 8.1)

- **Chiến lược:** Trunk-based development. Nhánh `main` luôn ở trạng thái sẵn sàng deploy lên môi trường staging.
- **Tuổi thọ nhánh:** Nhánh tính năng chỉ sống tối đa **3 ngày**.
- **Quy tắc đặt tên nhánh:** `<loại>/<mã-việc>-<mô-tả-ngắn>`
  - Ví dụ tính năng: `feat/VV-42-offer-submit`
  - Ví dụ sửa lỗi: `fix/VV-57-otp-expiry`
- **Bảo vệ nhánh `main`:**
  - Cấm push trực tiếp vào `main`.
  - Mọi thay đổi phải thông qua Pull Request (PR).
  - Bắt buộc CI xanh.
  - Phải có ít nhất 1 phê duyệt theo phân công `CODEOWNERS`.
  - Hình thức gộp: **Squash and merge**.

---

## 2. Quy ước Commit (Section 8.2)

Tuân thủ nghiêm ngặt **Conventional Commits**. Scope là app hoặc module:

```text
feat(api/offer): chặn offer trùng bằng unique index
fix(web/order): sửa nút nghiệm thu bấm đúp
chore(deps): nâng next lên 16.x
docs(adr): 0003 chọn Kysely
```

### Các loại commit được phép:
- `feat`: Tính năng mới cho người dùng hoặc API
- `fix`: Sửa lỗi
- `refactor`: Tái cấu trúc mã nguồn không đổi hành vi
- `perf`: Cải thiện hiệu năng
- `test`: Thêm hoặc sửa test
- `docs`: Tài liệu
- `chore`: Tác vụ bảo trì, cấu hình build/tool
- `ci`: Thay đổi cấu hình CI/CD
- `build`: Thay đổi hệ thống build hoặc dependency
- `revert`: Hoàn tác commit trước đó

Commit message được tự động kiểm tra bởi Husky và Commitlint trước khi commit.

---

## 3. Quy ước Pull Request (Section 8.3)

- Dung lượng PR: **≤ ~400 dòng thay đổi** (không tính file sinh tự động như lockfile hay schema.sql). Nếu lớn hơn, hãy tách nhỏ PR.
- Điền đầy đủ thông tin trong [pull_request_template.md](.github/pull_request_template.md).
- Thay đổi `packages/contracts` hoặc `db/migrations` phải nêu rõ có gây phá vỡ tương thích ngược (breaking change) hay không.

---

## 4. Quy ước Đặt tên (Section 8.4)

| Đối tượng | Quy ước | Ví dụ |
| --- | --- | --- |
| Thư mục, file TS | kebab-case | `offer-policy.ts`, `order-workspace/` |
| React component | PascalCase (tên file kebab-case) | `TaskCard` trong `task-card.tsx` |
| Class NestJS | PascalCase + hậu tố vai trò | `OfferService`, `OfferRepository`, `OfferPolicy` |
| Bảng, cột DB | snake_case, bảng số nhiều | `task_status_history.to_status` |
| JSON API | camelCase | `agreedPrice`, `dueAt` |
| Enum trạng thái | UPPER_SNAKE | `REVISION_REQUESTED` |
| Biến môi trường | UPPER_SNAKE, FE có tiền tố `NEXT_PUBLIC_` | `DATABASE_URL`, `NEXT_PUBLIC_API_URL` |
| Sự kiện outbox | snake_case quá khứ | `offer_accepted`, `order_completed` |

---

## 5. Tiêu chuẩn Hoàn thành (Definition of Done - Section 8.7)

Trước khi yêu cầu review PR, tác giả phải xác nhận:
- [ ] Có test cho máy trạng thái / policy / tính tiền nếu chạm vào.
- [ ] Chạy `pnpm lint`, `pnpm typecheck`, `pnpm test` xanh cục bộ.
- [ ] Hợp đồng API cập nhật (`docs/api/openapi.json` đổi trong cùng PR) nếu đổi endpoint.
- [ ] Thao tác đổi trạng thái ghi đầy đủ history + audit log + outbox event.
- [ ] Không có chuỗi giao diện viết cứng ngoài file i18n (`packages/i18n`).
- [ ] Có header/meta `noindex` cho các trang riêng tư và admin; kiểm tra quyền truy cập chống IDOR.
