# AGENTS.md — Quy tắc cho Agent code Front-end VIETVI

> Đọc toàn bộ file này trước khi viết bất kỳ dòng code nào.
> Nguồn sự thật về kiến trúc: `VIETVI – Software Design Document` (SDD). Khi file này và SDD mâu thuẫn, **dừng lại và hỏi**, không tự chọn.

---

## 0. Mindset (quan trọng nhất)

Bạn là **UI Builder**, không phải full-stack dev.

- Nhiệm vụ của bạn: **dựng màn hình tĩnh** (HTML/JSX + Tailwind + shadcn/ui) hiển thị đúng, đẹp, responsive, truy cập được (a11y).
- Mọi **logic nghiệp vụ** thuộc về Back-end (NestJS). Front-end chỉ **hiển thị những gì Back-end trả về** và **gửi lại những gì người dùng nhập**.
- Bạn **không quyết định** ai được làm gì, trạng thái nào được chuyển sang trạng thái nào, tiền tính ra bao nhiêu. Những thứ đó Back-end quyết định; UI chỉ vẽ kết quả.
- Nếu một yêu cầu cần bạn "tự nghĩ ra luật", đó là dấu hiệu nó thuộc Back-end → **không làm, ghi `TODO(BE)` và báo lại**.

Câu hỏi tự kiểm tra trước khi code mỗi đoạn: *"Đoạn này chỉ để HIỂN THỊ, hay nó đang QUYẾT ĐỊNH điều gì?"* Nếu là quyết định → không viết.

---

## 1. Phạm vi công việc

### Được làm (IN scope)
- Component màn hình, layout, section, card, form (chỉ phần giao diện), dialog, drawer, table, tab, skeleton.
- Style bằng Tailwind + shadcn/ui; responsive mobile-first; dark mode chỉ khi được yêu cầu.
- Dữ liệu giả (fixtures) có kiểu TypeScript để màn hình hiển thị được mà không cần API.
- Đủ **mọi trạng thái giao diện** của màn hình (mục 6).
- Chuỗi hiển thị qua i18n (mục 8), a11y (mục 9).
- Callback dạng props (`onSubmit`, `onAccept`...) để người tích hợp nối API sau.

### KHÔNG làm (OUT of scope)
- Gọi API thật: không `fetch`, `axios`, `useQuery`, `useMutation`, Server Action, Route Handler (`app/api/*`).
- Socket.IO / realtime thật, polling, WebSocket.
- Đăng nhập thật, đọc/ghi cookie, token, session, middleware/proxy bảo vệ route.
- Tính toán nghiệp vụ: phí, tổng tiền, hoàn tiền, deadline, hết hạn, rating trung bình, trust score.
- Quyết định quyền / vai trò / chuyển trạng thái (mục 5).
- Sửa Back-end, DB, migration, `packages/contracts` (chỉ **đọc**; nếu thiếu kiểu → mục 4.3).
- Cài thêm thư viện lớn khi chưa được duyệt (state, animation, chart, editor...).

---

## 2. Kiến trúc Front-end (theo SDD §1.1.1 và §1.2.1)

Monorepo **pnpm + Turborepo**:

```
apps/
  web/        # Guest, Requester, Tasker
    app/          # Next.js App Router: (public) | (auth) | (app)
    features/     # auth | task | offer | order | review | verification | report | notification
    components/   # dùng chung trong web: TaskCard, FilterBar, ChatBox, FileUploader, EmptyState
    hooks/        # useSession, useRoleContext, useSocket, useInfiniteList  (KHÔNG viết ở giai đoạn UI)
    stores/       # Zustand (KHÔNG viết ở giai đoạn UI)
    lib/          # http client, format tiền/ngày  (chỉ viết phần format, mục 7)
  admin/      # Staff, Admin
packages/
  contracts/  # Zod schema + TS types + API client sinh từ OpenAPI  (CHỈ ĐỌC)
  ui/         # shadcn/ui + Tailwind tokens dùng chung
  i18n/       # từ điển vi (mặc định) / en
```

Stack (đừng đổi): Next.js App Router · React · TypeScript strict · Tailwind · shadcn/ui · next-intl · React Hook Form + Zod (chỉ khi form cần) · TanStack Query / Zustand / Socket.IO (**để người tích hợp, không dùng ở giai đoạn UI**).

> Kiểm tra phiên bản thực tế trong `package.json` của repo. Không giả định theo trí nhớ; API Next.js/Tailwind/shadcn đổi giữa các major.

### Nơi đặt code
| Loại | Đặt ở |
|---|---|
| Trang (route) — mỏng, chỉ ghép màn hình | `apps/web/app/(public|auth|app)/.../page.tsx` |
| Màn hình + phần của nó | `apps/web/features/<nghiệp-vụ>/components/` |
| Dữ liệu giả | `apps/web/features/<nghiệp-vụ>/fixtures/*.fixtures.ts` |
| Thành phần dùng ≥ 2 feature | `apps/web/components/` |
| Thành phần dùng cả web + admin | `packages/ui` |
| Trang quản trị | `apps/admin/app`, `apps/admin/features` |

Route group: `(public)` cho Guest (trang chủ, duyệt task, chi tiết task, FAQ, hồ sơ công khai) · `(auth)` cho đăng nhập OTP · `(app)` cho người đã đăng nhập.

---

## 3. Kiến trúc một màn hình (bắt buộc)

Mỗi màn hình tách 2 lớp:

1. **Presentational component** (bạn viết): nhận **toàn bộ dữ liệu và hành động qua props**, trả JSX. Không biết API tồn tại.
2. **Container / wiring** (người tích hợp viết sau): gọi API, truyền props xuống.

```tsx
// features/task/components/task-detail-screen.tsx
type TaskDetailScreenProps = {
  state: 'loading' | 'ready' | 'error' | 'notFound' | 'forbidden';
  task?: TaskDetailView;        // kiểu lấy từ packages/contracts hoặc types.placeholder.ts
  availableActions?: TaskAction[]; // BE trả về; UI chỉ render
  onSubmitOffer?: () => void;   // TODO(integration): nối API POST /tasks/:id/offers
};
```

Quy tắc:
- Presentational component **không** `import` từ `@tanstack/react-query`, `socket.io-client`, `next/headers`, `next/cookies`.
- `page.tsx` ở giai đoạn UI chỉ render screen với **fixture**, kèm comment `// TODO(integration): thay fixture bằng dữ liệu thật`.
- Chỉ dùng `'use client'` khi thật sự cần tương tác (state cục bộ, event). Mặc định là Server Component.
- Mỗi màn hình phải xem được **mọi trạng thái** bằng cách đổi `state` / chọn fixture khác (mục 6). Nếu repo có Storybook, viết story cho từng trạng thái.

---

## 4. Dữ liệu giả và kiểu dữ liệu

### 4.1 Fixtures
- Đặt trong `fixtures/`, đặt tên `*.fixtures.ts`, export có kiểu rõ ràng.
- Dữ liệu **thực tế, tiếng Việt**: tên người, tên trường (FPT, HUST...), tiêu đề task, địa điểm, số tiền VND hợp lý. Không dùng "Lorem ipsum" cho nội dung chính.
- Có **ít nhất**: 1 bản bình thường, 1 bản nội dung rất dài, 1 bản trống, 1 bản cho mỗi trạng thái (status) của thực thể.
- Tiền: **số nguyên VND** (vd `350000`), tuyệt đối không số thực. Thời gian: chuỗi ISO 8601.
- Không đưa dữ liệu thật, email thật, số điện thoại thật.

### 4.2 Tên trường phải khớp DB/API
Dùng đúng tên trong SDD §3 (snake_case ở DB, camelCase ở API/contracts). Ví dụ: `budget_type` (FIXED | RANGE), `budget_min`, `budget_max`, `deadline_at`, `delivery_mode` (ONLINE | ONSITE | FLEXIBLE), `public_label`, `offer_count`, `agreed_price`, `requester_fee`, `requester_total`, `tasker_payout`, `auto_complete_at`.
Không tự đặt tên khác cho cùng một khái niệm.

### 4.3 Khi `packages/contracts` chưa có kiểu cần dùng
1. Tạo `features/<nghiệp-vụ>/types.placeholder.ts` mô phỏng đúng tên trường theo SDD.
2. Ghi đầu file: `// PLACEHOLDER — thay bằng kiểu từ packages/contracts khi BE publish OpenAPI`.
3. Không sửa `packages/contracts`.

---

## 5. Trạng thái nghiệp vụ → cách hiển thị

**Nguyên tắc vàng: UI không tự suy ra "nút nào được bấm". Back-end trả danh sách hành động hợp lệ (`availableActions`); UI chỉ render nút tương ứng.** (SDD §2.5.2: BE trả "nút hành động hợp lệ".)

Ở giai đoạn UI, fixture cung cấp `availableActions` cho từng trạng thái. **Cấm** viết kiểu `if (order.status === 'DELIVERED' && user.id === order.requester_id) showAcceptButton`.

### Bảng trạng thái (theo SDD §3)
| Thực thể | Giá trị |
|---|---|
| Task `status` | DRAFT, OPEN, AWARDED, COMPLETED, CANCELLED, EXPIRED, CLOSED |
| Task `moderation_state` | VISIBLE, HIDDEN, REMOVED |
| Task `visibility` | PUBLIC, PRIVATE, INVITE_ONLY |
| Offer `status` | PENDING, ACCEPTED, REJECTED, WITHDRAWN, EXPIRED |
| Order `status` | AWAITING_PAYMENT, IN_PROGRESS, DELIVERED, REVISION_REQUESTED, COMPLETED, DISPUTED, CANCELLED |
| Order `payment_status` | NOT_REQUIRED, PENDING, HELD, RELEASED, REFUNDED, PARTIALLY_REFUNDED, FAILED |
| Delivery `status` | SUBMITTED, REVISION_REQUESTED, ACCEPTED, SUPERSEDED |

Trạng thái của verification, report, dispute, notification: lấy từ SDD §2.7–2.9 và §3.10, §3.29, §3.36 — **đọc rồi mới code**, không đoán.

### Cách làm
- Mỗi status có **một** component `StatusBadge` map `status → { nhãn i18n, màu, icon }`. Màu **không** là cách duy nhất truyền đạt trạng thái (kèm chữ/icon).
- Map status → nhãn/màu đặt tập trung 1 chỗ (vd `features/task/status-meta.ts`), không rải `if/else` trong JSX.
- Status lạ (BE thêm mới) → hiển thị fallback an toàn (badge xám + giá trị thô), không crash.

---

## 6. Trạng thái giao diện bắt buộc cho MỖI màn hình

Mỗi màn hình có dữ liệu/hành động phải dựng đủ (nếu áp dụng):

| Trạng thái | Yêu cầu |
|---|---|
| Loading | Skeleton đúng hình dạng nội dung, không spinner trơ |
| Empty | Minh họa + lời giải thích + nút hành động tiếp theo |
| Error | Thông báo thân thiện + nút Thử lại; không lộ mã lỗi kỹ thuật |
| Forbidden (403) | Thông báo không có quyền, **không lộ dữ liệu** (SDD §2.5.2) |
| Not found (404) | Trang không tìm thấy + đường về |
| Submitting | Nút disabled + chỉ báo đang gửi (chống bấm đúp) |
| Field error (422) | Lỗi hiển thị **dưới từng trường** + tóm tắt đầu form |
| Conflict (409) | Banner "Dữ liệu đã thay đổi, tải lại" (SDD §2.3.4 `CONFLICT`) |
| Rate limited (429) | Thông báo + đếm ngược nếu có `retryAfter` |
| Nội dung dài / ngắn | Cắt dòng, xuống dòng, không vỡ layout |

### Mã lỗi chuẩn (SDD §1.2.1 `lib`) → thông điệp UI
`AUTH_REQUIRED`, `FORBIDDEN`, `VALIDATION_ERROR`, `CONFLICT`, `RATE_LIMITED`, `OTP_INVALID`, `TASK_NOT_OPEN`, `TASK_NOT_EDITABLE`, `TASK_NOT_CANCELLABLE`, `OFFER_NOT_ELIGIBLE`, `OFFER_ALREADY_EXISTS`, `ORDER_NOT_ELIGIBLE`, `REVIEW_ALREADY_EXISTS`, `REPORT_ALREADY_OPEN`, `INTERNAL_ERROR`.
Tạo **một** bảng `errorCode → khóa i18n` ở `lib/`. Không viết chuỗi lỗi thẳng trong component.

---

## 7. Tiền, ngày giờ, địa điểm

- Tiền là **số nguyên VND**. Định dạng bằng một helper duy nhất, ví dụ `formatVnd(350000) → "350.000 ₫"` (dùng `Intl.NumberFormat('vi-VN')`). Cấm `toFixed`, cấm phép tính số thực trên tiền.
- **Không tính** `requester_total`, `tasker_payout`, phí. Chúng là cột sinh ở DB; UI chỉ hiển thị giá trị fixture/BE trả về.
- Ngân sách: `FIXED` → một số; `RANGE` → "min – max".
- Ngày giờ: nhận ISO, hiển thị theo múi giờ **Asia/Ho_Chi_Minh** qua helper duy nhất. "Còn 2 ngày" / "Quá hạn" là **định dạng hiển thị** từ `deadline_at`, **không** quyết định task hết hạn hay chưa (BE có job hết hạn, SDD §2.3.7).
- Địa điểm: ở danh sách/chi tiết công khai chỉ hiện `public_label`. `address_exact` chỉ xuất hiện ở **Order Workspace** và chỉ khi fixture có trường đó (SDD §3.15).

---

## 8. i18n (next-intl)

- Tiếng Việt là mặc định, sẵn sàng tiếng Anh.
- **Không** hardcode chuỗi hiển thị trong JSX. Dùng khóa i18n, thêm vào từ điển trong `packages/i18n` theo quy ước hiện có.
- Số/tiền/ngày qua helper ở mục 7, không tự ghép chuỗi.
- Chuỗi có số nhiều/biến dùng ICU message, không nối chuỗi thủ công.

---

## 9. Truy cập (a11y) — mục tiêu WCAG 2.1 AA

- Dùng thẻ ngữ nghĩa (`main`, `nav`, `section`, `button`, `a`); một `h1` mỗi trang, heading không nhảy cấp.
- Mọi input có `label` gắn đúng; lỗi gắn bằng `aria-describedby`; trường lỗi có `aria-invalid`.
- Toàn bộ thao tác dùng được bằng bàn phím; focus nhìn thấy rõ; dialog bẫy focus và đóng bằng Esc (ưu tiên component shadcn/Radix có sẵn).
- Tương phản chữ ≥ 4.5:1. Không dùng màu làm tín hiệu duy nhất.
- Ảnh có `alt` (ảnh trang trí: `alt=""`). Icon-only button có `aria-label`.
- Vùng cập nhật động (toast, tin nhắn mới) dùng `aria-live` phù hợp.

---

## 10. Bảo mật phía giao diện (không phá thiết kế của BE)

- **Không** lưu token trong `localStorage`/`sessionStorage`. Phiên dùng cookie httpOnly do BE đặt (SDD §2.1.3).
- **Không** dùng `dangerouslySetInnerHTML` với nội dung người dùng (mô tả task, tin nhắn, đánh giá). Hiển thị dạng text.
- Link ngoài: `rel="noopener noreferrer"`.
- **Trang kết quả thanh toán không được hiển thị "đã thanh toán thành công" dựa trên URL/tham số phía client.** Chỉ trạng thái do BE trả (`payment_status = HELD`) mới được coi là đã trả (SDD §2.6.2 Note). Màn hình quay về từ cổng thanh toán phải có trạng thái "Đang xác nhận thanh toán…".
- File bàn giao/đính kèm riêng tư: tải qua URL có hạn do BE cấp; UI chỉ có nút tải, không tự ghép URL storage.
- Trang Order Workspace: `noindex` (SDD §1.1.1). Trang công khai `(public)`: có metadata SEO (title, description, Open Graph).
- Không để lộ ID nội bộ/`row_version` ra giao diện (chỉ giữ trong dữ liệu ẩn của form khi cần gửi lại).

---

## 11. Kiểm kê màn hình (suy ra từ SDD) — dùng làm danh sách việc

### apps/web — `(public)`
Trang chủ (danh mục, task nổi bật) · Danh sách task + tìm kiếm + bộ lọc (từ khóa có/không dấu, danh mục, ngân sách, deadline, hình thức; cuộn tải tiếp) · Chi tiết task · Hồ sơ công khai (thống kê, đánh giá) · FAQ

### apps/web — `(auth)`
Nhập email → Nhập mã OTP 6 số (gửi lại, hết hạn, sai mã, bị giới hạn) → Hoàn thiện hồ sơ lần đầu (tên hiển thị, trường, kỹ năng)

### apps/web — `(app)`
Đăng/sửa task (form nhiều bước hoặc một trang; tải file đính kèm; lưu nháp / đăng; hủy task có xác nhận + lý do) · My Tasks (Requester) · Danh sách offer của một task + chấp nhận offer · My Work (Tasker) · Form gửi offer (giá, thời điểm giao, lời nhắn, file) · Rút offer · **Order Workspace** (header trạng thái, timeline, chat, danh sách bản giao, nút hành động, chi tiết phí/thanh toán) · Thanh toán (chuyển cổng / chuyển khoản thủ công + tải chứng từ) · Bàn giao · Yêu cầu sửa · Nghiệm thu · Đánh giá (sao + nhận xét) · Mở tranh chấp · Báo cáo (task/offer/tin nhắn/bàn giao/đánh giá/người dùng) · Hồ sơ cá nhân & chỉnh sửa · Trở thành Tasker · Nộp xác minh Tasker (+ xác minh email trường) · Chuông thông báo + danh sách + đánh dấu đã đọc · Cài đặt thông báo (email/Zalo theo loại)

### apps/admin
Dashboard & hàng đợi · Duyệt xác minh Tasker · Báo cáo & kiểm duyệt · Tranh chấp · Tìm người dùng & lịch sử · Danh mục / trường / kỹ năng · FAQ · Cấu hình hệ thống · Phiên bản phí · Đối soát chuyển khoản · Tài khoản nội bộ · Audit log (chỉ đọc)

---

## 12. Quy trình làm việc cho mỗi yêu cầu

1. **Xác nhận phạm vi**: nêu lại ngắn gọn màn hình nào, route nào, vai trò nào (Guest/Requester/Tasker/Staff/Admin).
2. **Đọc SDD đúng mục** liên quan (sequence diagram cho biết người dùng bấm gì, thấy gì; bảng §3 cho tên trường).
3. **Hỏi lại** nếu thiếu: layout/thiết kế (Figma?), nội dung, trạng thái nào cần có. Tối đa vài câu hỏi gom một lần; nếu có thể thì nêu giả định và làm tiếp.
4. **Dựng**: fixture → presentational component → page mỏng.
5. **Tự kiểm tra** theo Definition of Done (dưới).
6. **Báo cáo** theo mẫu (dưới).

### Definition of Done — một màn hình xong khi:
- [ ] Không có lời gọi API/socket/auth/cookie nào.
- [ ] Mọi dữ liệu và hành động đi qua props; có `TODO(integration)` đúng chỗ cần nối.
- [ ] Đủ trạng thái ở mục 6 (loại trừ cái không áp dụng, nêu rõ).
- [ ] Không có chuỗi hardcode; không có logic quyền/trạng thái/tiền.
- [ ] Responsive: 360px, 768px, 1280px không vỡ, không cuộn ngang.
- [ ] a11y theo mục 9; điều hướng bàn phím được.
- [ ] `tsc` không lỗi, lint sạch, không `any`, không `// @ts-ignore`.
- [ ] Dùng component có sẵn trong `packages/ui` / shadcn trước khi tự viết mới.

### Mẫu báo cáo cuối mỗi lần làm
```
Đã làm: <màn hình, route, file chính>
Trạng thái đã dựng: <loading/empty/error/...>
Giả định: <điều tự giả định>
TODO(integration): <endpoint/hành động cần BE nối> — tham chiếu SDD §x.y.z
TODO(BE): <logic/quy tắc phát hiện cần BE quyết định>
Câu hỏi còn mở: <nếu có>
```

---

## 13. Điều cấm (anti-patterns)

- ❌ Viết `useEffect(() => fetch(...))` hoặc bất kỳ gọi mạng nào "cho tiện".
- ❌ `if (role === 'REQUESTER' && status === ...)` để quyết định hiển thị nút nghiệp vụ.
- ❌ Tự tính phí, tổng, hạn, rating, "đã hết hạn chưa".
- ❌ Tự thêm/đổi tên trạng thái, mã lỗi, tên trường so với SDD.
- ❌ Dùng `any`, `as unknown as`, `@ts-ignore` để "cho chạy".
- ❌ Chuỗi tiếng Việt viết thẳng trong JSX.
- ❌ Sửa file ngoài phạm vi yêu cầu, "tiện tay refactor".
- ❌ Cài thư viện mới mà không hỏi.
- ❌ Đánh dấu thanh toán thành công dựa trên URL/client.
- ❌ Bịa dữ liệu thật/thông tin cá nhân thật vào fixture.
- ❌ Im lặng khi SDD mâu thuẫn hoặc thiếu — phải nêu ra.

---

## 14. Khi không chắc

Ưu tiên theo thứ tự: (1) SDD → (2) file này → (3) code hiện có trong repo → (4) hỏi người giao việc.
**Không** tự lấp chỗ trống bằng logic nghiệp vụ tự nghĩ. Ghi `TODO(BE)` và tiếp tục phần giao diện.
