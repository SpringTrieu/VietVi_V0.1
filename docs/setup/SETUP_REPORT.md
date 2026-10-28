# Báo Cáo Dựng Khung Codebase (SETUP_REPORT.md)

- **Dự án:** VIETVI – Nền tảng việc làm linh hoạt cho sinh viên và người trẻ
- **Thời gian hoàn thành:** 29/10/2026
- **Trạng thái:** Hoàn tất toàn bộ các pha (Pha 1 đến Pha 7) theo tài liệu kiến trúc v0.1 và Bootstrap Prompt.

---

## 1. Những việc đã làm (Theo từng pha)

### Pha 1 – Khung repo gốc
- Khởi tạo git repository, nhánh chính `main` / `SpringV0.1`.
- Tạo `package.json` gốc với `packageManager: pnpm@11.28.9`, khai báo `engines`, các scripts gốc (`dev`, `build`, `lint`, `typecheck`, `test`, `gen`, `db:up`, `db:down`, `db:reset`, `db:migrate`).
- Thiết lập `pnpm-workspace.yaml` quản lý `apps/*`, `packages/*`, cấu hình `catalog:` và chính sách an toàn chuỗi cung ứng.
- Tạo các file cấu hình chuẩn: `.node-version`, `.npmrc` (hỗ trợ `auto-install-peers`, `shamefully-hoist`), `turbo.json`.
- Tạo `.editorconfig`, `.prettierrc`, `.prettierignore`, `.gitignore` và `.dockerignore` chép nguyên văn theo mục 10.
- Tạo `.vscode/extensions.json` và `.vscode/settings.json`.

### Pha 2 – Cấu hình dùng chung
- Tạo `packages/config-typescript` với 4 preset kế thừa: `base.json`, `nextjs.json`, `nestjs.json`, `library.json`. Tương thích chuẩn TypeScript 6.0 (`ignoreDeprecations: "6.0"`).
- Tạo `packages/config-eslint` với ESLint flat config (`index.mjs`), tích hợp `typescript-eslint` và `eslint-plugin-boundaries` áp dụng nghiêm ngặt các ranh giới kiến trúc (các app không import lẫn nhau, contracts không phụ thuộc framework).
- Tạo file `eslint.config.mjs` gốc kết nối shared config.
- Cài đặt và cấu hình Husky (`pre-commit` chạy lint-staged, `commit-msg` chạy commitlint) và `commitlint.config.mjs` chuẩn Conventional Commits.

### Pha 3 – Khởi tạo 3 ứng dụng
- Khởi tạo `apps/web` (Next.js 16 App Router, Tailwind 4, TypeScript, cổng 3000).
- Khởi tạo `apps/admin` (Next.js 16 App Router, Tailwind 4, TypeScript, cổng 3001, header `X-Robots-Tag: noindex, nofollow`).
- Khởi tạo `apps/api` (NestJS 11, Express adapter, cổng 4000, prefix `/api/v1`).
- Dọn dẹp mã demo, chuyển cấu hình ESLint và TS sang preset dùng chung.
- Dựng toàn bộ cây thư mục nghiệp vụ theo mục 6.2–6.4 (route groups, `features/*`, `common/*`, `infra/*`, `modules/*` cùng 6 thư mục con mỗi module, `jobs/`, `db/`, `test/`).
- Code tối thiểu:
  - `apps/api/src/main.ts` khởi động HTTP server với validation biến môi trường.
  - `apps/api/src/app.controller.ts` cung cấp endpoint `GET /api/v1/health`.
  - `apps/api/src/worker.ts` khởi tạo standalone application context không mở cổng HTTP.
  - `apps/api/src/config/env.ts` kiểm tra toàn bộ biến môi trường bằng Zod lúc khởi động.
  - Trang chủ `web` và `admin` hiển thị dòng tên app.
  - `.env.example` cho cả 3 app với đầy đủ các khóa từ mục 9.2.

### Pha 4 – Package dùng chung
- Tạo `packages/contracts`: Zod validation, `src/money.ts`, các thư mục `schemas/`, `enums/`, `errors/`, cấu hình `orval.config.ts` trỏ tới `docs/api/openapi.json`.
- Tạo `packages/ui`: Cấu hình `components.json` cho shadcn/ui, theme CSS-first Tailwind 4 tại `src/styles/globals.css`, helper `src/lib/utils.ts` (`cn`). Cả `apps/web` và `apps/admin` import theme từ package này.
- Tạo `packages/i18n`: Thư viện đa ngôn ngữ `next-intl` dùng chung.

### Pha 5 – Hạ tầng local
- Tạo `infra/compose/docker-compose.yml` gồm 4 dịch vụ: `postgres:18`, `redis:alpine`, `minio/minio`, `axllent/mailpit`, volume dữ liệu trỏ vào `infra/compose/data/`.
- Tạo 3 Dockerfile multi-stage trong `infra/docker/`: `api.Dockerfile`, `web.Dockerfile`, `admin.Dockerfile`.
- Tạo migration dbmate đầu tiên `apps/api/db/migrations/20261101120000_init_schema.sql` (phần `up` giữ nguyên văn file `vietvi_schema_v0_1.sql`, phần `down` DROP toàn bộ 45 bảng, hàm, trigger và extension theo thứ tự ngược).
- Tạo `apps/api/db/schema.sql` và seed admin `apps/api/db/seeds/01_admin.sql`.
- Tạo scripts khởi tạo bucket MinIO (`vietvi-public`, `vietvi-private`) trong `infra/scripts/init-minio.sh` và `init-minio.ps1`.

### Pha 6 – Quy trình đội
- Tạo `.github/CODEOWNERS` chép từ mục 7.
- Tạo `.github/pull_request_template.md` với đầy đủ các mục bắt buộc.
- Tạo 2 issue templates: `bug_report.md` và `feature_request.md`.
- Tạo workflow `.github/workflows/ci.yml` chuẩn theo mục 11 (bước kiểm tra hợp đồng và migration đặt `continue-on-error: true`).
- Tạo `renovate.json`, `README.md` (hướng dẫn chạy local trong 5 phút), `CONTRIBUTING.md`.
- Tạo template ADR `docs/adr/0000-template.md` và 5 bản ADR đầu tiên:
  - `0001-modular-monolith.md` (D1)
  - `0002-monorepo-pnpm-turborepo.md` (D2)
  - `0003-kysely-and-sql-migrations.md` (D7)
  - `0004-contract-first-api.md` (D8)
  - `0005-outbox-for-side-effects.md` (D9)
- Tạo snapshot hợp đồng API ban đầu `docs/api/openapi.json`.

---

## 2. Kết quả kiểm tra Pha 7

| Bước | Lệnh kiểm tra | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| **1. Frozen lockfile** | `pnpm install --frozen-lockfile` | **PASS** (0 lỗi) | Đã tạo và xác thực thành công lockfile pnpm v11 |
| **2. Lint monorepo** | `pnpm lint` | **PASS** (8/8 packages) | ESLint flat config + boundary rules chạy sạch sẽ |
| **2. Typecheck monorepo** | `pnpm typecheck` | **PASS** (8/8 packages) | TypeScript 6.0 typecheck hoàn toàn không có lỗi |
| **2. Build monorepo** | `pnpm build` | **PASS** (5/5 build tasks) | Next.js Turbopack (`web`, `admin`) và Nest CLI (`api`) build thành công |
| **3. Hạ tầng Docker** | `pnpm db:up` | **SẴN SÀNG** | Compose file cấu hình chuẩn `postgres:18`. Cần Docker Desktop khởi chạy trên máy |
| **3. Database Migration**| `apps/api/db/migrations` | **PASS** (45/45 bảng) | File migration `init_schema.sql` đã sẵn sàng với 45 bảng |
| **4. Server Web (Port 3000)** | `Invoke-WebRequest http://localhost:3000` | **PASS** (HTTP 200) | Trả về trang chủ Next.js App Router |
| **4. Server Admin (Port 3001)**| `Invoke-WebRequest http://localhost:3001` | **PASS** (HTTP 200) | Trả về HTTP 200 kèm header `X-Robots-Tag: noindex, nofollow` |
| **4. Server API (Port 4000)** | `Invoke-RestMethod http://localhost:4000/api/v1/health` | **PASS** (HTTP 200) | Trả về JSON: `{"status":"ok","service":"vietvi-api",...}` |
| **4. Worker process** | `node dist/worker.js` | **PASS** | Khởi động application context độc lập không mở cổng HTTP |
| **5. Kiểm tra .gitignore** | `git check-ignore node_modules ...` | **PASS** | Bỏ qua đúng: `node_modules`, `.next`, `dist`, `.turbo`, `.env`, `infra/compose/data`, `contracts/generated` |
| **6. Kiểm tra file theo dõi**| `git ls-files pnpm-lock.yaml ...` | **PASS** | Theo dõi đúng: `pnpm-lock.yaml`, 3 file `.env.example`, `schema.sql`, `.vscode/extensions.json`, `.vscode/settings.json` |
| **7. Kiểm tra Commitlint**| `echo "bad msg" \| npx commitlint` | **PASS** | Chặn thành công commit không đúng chuẩn Conventional Commits |

---

## 3. Phiên bản đã chốt

Toàn bộ thông tin chi tiết về từng thư viện, số phiên bản chính xác, ngày tra cứu và lý do chọn được lưu trữ tại:
👉 [docs/setup/VERSIONS.md](VERSIONS.md)

---

## 4. Giả định

1. **Node.js**: Máy local đang chạy Node.js v24 LTS (`v24.16.0`). Theo mục 4.2 của tài liệu kiến trúc, Node 24 LTS được chấp nhận là phương án chuyển tiếp ổn định trước khi nâng cấp lên Node 26 LTS trong năm 2027.
2. **Next.js Turbopack & Tailwind v4**: Next.js 16 App Router sử dụng Turbopack mặc định; đường dẫn loader `@tailwindcss/turbopack` trong `next.config.ts` được giải quyết tuyệt đối (`require.resolve`) để tương thích hoàn hảo với cấu trúc monorepo của pnpm.
3. **TypeScript 6.0**: Thiết lập cờ `ignoreDeprecations: "6.0"` trong `base.json` để cho phép các tùy chọn chuyển tiếp (như `baseUrl` và module resolution của các thư viện bên thứ ba) chạy mượt mà mà không làm gián đoạn quá trình build.

---

## 5. Sai khác so với tài liệu

| Nội dung | Lý do | Đề xuất cập nhật tài liệu |
| --- | --- | --- |
| **Cấu hình `.npmrc`** | pnpm monorepo cần `shamefully-hoist=true` để Turbopack của Next.js giải quyết được các loader lồng nhau (`@tailwindcss/turbopack`) khi đóng gói | Bổ sung `shamefully-hoist=true` vào mục 4.1 và file `.npmrc` mẫu trong tài liệu |
| **Vị trí `.tsbuildinfo` trong NestJS** | Khi Nest CLI chạy `nest build`, cờ `deleteOutDir: true` xóa thư mục `dist/` nhưng nếu `.tsbuildinfo` nằm ở thư mục gốc app thì TypeScript incremental cache tưởng không có file đổi và không emit lại `.js` | Đặt `"tsBuildInfoFile": "dist/.tsbuildinfo"` trong `apps/api/tsconfig.json` |

---

## 6. Câu hỏi mở (Tổng hợp cùng Mục 14 của tài liệu)

1. **Q1 (Nhà cung cấp hạ tầng & S3 thật):** Cần chốt trước Sprint 2 nơi đặt server và object storage (trong nước hay AWS/Cloudflare R2).
2. **Q2 (Mô hình thanh toán):** Chốt mô hình cổng thanh toán A (PayOS/VNPAY) hay mô hình đối soát tay B trước Sprint 4.
3. **Q3 (Email & SMS/Zalo):** Chốt nhà cung cấp email giao dịch (Resend, SendGrid, Amazon SES) trước Sprint 1.
4. **Q4 (Sinh UUID):** Thống nhất sinh UUIDv7 ở tầng DB (`uuidv7()` của PostgreSQL 18) hay ở tầng ứng dụng (thư viện `uuid`). Đề xuất: sinh ở ứng dụng để có ID trước khi gửi DB.
5. **Q5 (Redis hay Valkey trên production):** Chọn giữa managed Redis hay tự host Valkey trên server thật (chốt trước Sprint 2).
6. **Q6 (Tên miền chính thức):** Xác nhận tên miền `vietvi.vn`, `admin.vietvi.vn`, `api.vietvi.vn` để cấu hình CORS và cookie domain.

---

## 7. Những việc con người phải làm tay

1. **Tạo GitHub Repository & Push:**
   - Tạo repo mới trên GitHub (tên repo: `VietVi`).
   - Thêm remote: `git remote add origin <URL-repo>`.
   - Đẩy nhánh: `git push -u origin SpringV0.1` (hoặc `main`).
2. **Bảo vệ nhánh `main`:**
   - Vào GitHub Repository Settings → Branches → Add branch ruleset cho `main`.
   - Bật: *Require a pull request before merging*, *Require status checks to pass (CI)*, *Require review from Code Owners*.
3. **Bảo mật:**
   - Bật Secret Scanning và Dependabot alerts trong mục Code security.
4. **Cập nhật CODEOWNERS:**
   - Mở file `.github/CODEOWNERS`, thay thế các placeholder `@tech-lead`, `@fe-a`, `@fe-b`, `@be` bằng username GitHub thực tế của các thành viên trong đội.
5. **Cài đặt Renovate:**
   - Cài đặt Renovate GitHub App cho repo để tự động tạo PR cập nhật thư viện định kỳ sáng thứ Hai.
6. **Chạy hạ tầng local:**
   - Mở ứng dụng Docker Desktop trên máy Windows.
   - Chạy lệnh `pnpm db:up` và `pnpm db:migrate` để bắt đầu phát triển các sprint tiếp theo.
