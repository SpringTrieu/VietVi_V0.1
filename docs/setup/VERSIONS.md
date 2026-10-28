# Bảng Chốt Phiên Bản Thư Viện (VERSIONS.md)

Tài liệu ghi nhận toàn bộ các phiên bản công cụ và thư viện được chốt tại ngày khởi tạo dự án VIETVI (29/10/2026), đối chiếu trực tiếp với `catalog:` trong `pnpm-workspace.yaml`.

---

## 1. Công cụ Cốt lõi & Hạ tầng

| Gói / Công cụ | Phiên bản | Ghi chú & Ngày tra cứu | Lý do chọn |
| --- | --- | --- | --- |
| **Node.js** | `v24.16.0 LTS` | 29/10/2026 | Node 26 vừa vào LTS (28/10/2026); theo tài liệu mục 4.2: nếu hạ tầng/máy chưa có 26 thì tạm dùng 24 LTS và nâng cấp sau |
| **pnpm** | `11.28.9` | 29/10/2026 | Bản pnpm 11 mới nhất, hỗ trợ workspaces, `catalog:` và chính sách an toàn chuỗi cung ứng |
| **TypeScript** | `6.0.3` | 2026 | Chốt TS 6.0 theo tài liệu mục 4.2; TS 7.0 (bản Go) mới phát hành chưa được toàn bộ tooling hỗ trợ đầy đủ |
| **PostgreSQL** | `18` | Image Docker Hub | Chốt theo bảng 4.2; hỗ trợ UUIDv7, unaccent, citext, pg_trgm |
| **Redis** | `alpine` | Image Docker Hub | Dùng cho BullMQ và rate limiting |
| **MinIO** | `latest` | Image Docker Hub | Object storage giả lập S3 local với 2 bucket `public` và `private` |
| **Mailpit** | `latest` | Image Docker Hub | Bắt và kiểm tra email OTP khi chạy dev local |

---

## 2. Front-end Stack

| Gói | Phiên bản | Lý do chọn |
| --- | --- | --- |
| `next` | `16.4.3` | Next.js 16 App Router với Turbopack mặc định |
| `react` | `19.3.1` | Đi kèm Next.js 16 |
| `react-dom` | `19.3.1` | Đi kèm Next.js 16 |
| `tailwindcss` | `4.3.3` | Tailwind CSS v4 cấu hình CSS-first |
| `@tailwindcss/turbopack` | `4.3.3` | Loader tích hợp cho Turbopack |
| `@tanstack/react-query` | `*` (5.x) | Quản lý server state, cache |
| `zustand` | `*` (5.x) | Quản lý client UI state |
| `react-hook-form` | `*` (7.x) | Form handling kết hợp Zod |
| `next-intl` | `*` | Đa ngôn ngữ (mặc định tiếng Việt) |
| `socket.io-client` | `*` | Client realtime chat và notification |
| `clsx` | `2.1.1` | Shadcn helper |
| `tailwind-merge` | `3.7.0` | Shadcn helper |
| `class-variance-authority` | `0.7.1` | Shadcn component variants |
| `@radix-ui/react-slot` | `1.5.0` | Radix primitive |
| `lucide-react` | `1.63.0` | Icon set |

---

## 3. Back-end Stack

| Gói | Phiên bản | Lý do chọn |
| --- | --- | --- |
| `@nestjs/core` | `11.2.8` | NestJS 11 theo bảng 4.2 |
| `@nestjs/common` | `11.2.8` | NestJS 11 theo bảng 4.2 |
| `@nestjs/platform-express` | `11.2.8` | Express 5 adapter mặc định |
| `@nestjs/testing` | `11.2.8` | Khớp phiên bản Nest core |
| `@nestjs/cli` | `11.0.0` | CLI chính thức NestJS 11 |
| `reflect-metadata` | `0.2.2` | Runtime decorators |
| `rxjs` | `7.8.1` | Reactive extensions cho NestJS |
| `zod` | `4.6.7` | Nguồn sự thật duy nhất cho schema validation giữa FE và BE |
| `dbmate` | `2.37.0` | Quản lý migration SQL thuần |
| `kysely` | `0.29.7` | Type-safe SQL query builder |
| `bullmq` | `6.5.1` | Hàng đợi tác vụ và outbox worker |

---

## 4. Công cụ Phát triển & CI/CD

| Gói | Phiên bản | Lý do chọn |
| --- | --- | --- |
| `turbo` | `2.11.10` | Turborepo điều phối build monorepo |
| `prettier` | `3.9.10` | Định dạng mã nguồn |
| `eslint` | `9.39.5` | Flat config ESLint |
| `typescript-eslint` | `8.33.0` | Parser & plugin cho TypeScript |
| `eslint-plugin-boundaries` | `7.4.0` | Kiểm tra ranh giới kiến trúc monorepo |
| `husky` | `9.1.7` | Git hooks |
| `lint-staged` | `17.6.0` | Chạy lint trên staged files |
| `@commitlint/cli` | `21.2.4` | Kiểm tra Conventional Commits |
| `@commitlint/config-conventional`| `21.2.4` | Quy chuẩn commit thông dụng |
| `jest` | `30.x` | Test runner Back-end |
| `supertest` | `7.x` | Kiểm thử tích hợp HTTP API |
| `orval` | `*` | Sinh client TypeScript và MSW mock từ OpenAPI |
