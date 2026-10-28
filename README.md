# VIETVI – Nền Tảng Việc Làm Linh Hoạt (Monorepo)

Monorepo chứa toàn bộ mã nguồn của dự án VIETVI (apps `web`, `admin`, `api` và các package dùng chung), được xây dựng theo kiến trúc **Modular Monolith** với pnpm workspaces và Turborepo.

---

## ⚡ Khởi động Local trong 5 phút

### 1. Yêu cầu môi trường
- **Node.js**: 24 LTS hoặc 26 LTS (khuyến nghị dùng `fnm` hoặc `nvm`)
- **pnpm**: 11.x (bật bằng lệnh: `corepack enable`)
- **Docker & Docker Compose**: Để chạy PostgreSQL, Redis, MinIO và Mailpit
- **Git**: Cấu hình `git config --global core.autocrlf input` (trên Windows)

### 2. Thiết lập biến môi trường
Tạo các file `.env` từ file mẫu:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
```
*(Trên Windows PowerShell, dùng: `Copy-Item apps/api/.env.example apps/api/.env`, tương tự cho web và admin)*

### 3. Cài đặt thư viện
```bash
pnpm install
```

### 4. Khởi động hạ tầng Docker
```bash
pnpm db:up
```

### 5. Chạy migration database
```bash
pnpm db:migrate
```

### 6. Khởi chạy toàn bộ ứng dụng
```bash
pnpm dev
```

---

## 🌐 Danh sách Cổng và Dịch vụ

| Dịch vụ | Địa chỉ | Ghi chú |
| --- | --- | --- |
| **Web** | `http://localhost:3000` | Ứng dụng người dùng (Guest, Requester, Tasker) |
| **Admin** | `http://localhost:3001` | Trang quản trị vận hành (Staff, Admin, `noindex`) |
| **API** | `http://localhost:4000/api/v1` | NestJS REST API |
| **API Health** | `http://localhost:4000/api/v1/health` | Kiểm tra trạng thái hoạt động |
| **MinIO Console**| `http://localhost:9001` | Giả lập S3 (`minioadmin` / `minioadmin`) |
| **MinIO API** | `http://localhost:9000` | Cổng API S3 |
| **Mailpit** | `http://localhost:8025` | Giao diện xem email OTP / thông báo |
| **PostgreSQL** | `localhost:5432` | DB `vietvi` (`vietvi` / `vietvi_dev_secret`) |
| **Redis** | `localhost:6379` | Cache & hàng đợi BullMQ |

---

## 🛠️ Các lệnh thông dụng (Root Scripts)

```bash
# Quản lý hạ tầng
pnpm db:up       # Khởi động PostgreSQL, Redis, MinIO, Mailpit
pnpm db:down     # Tắt hạ tầng
pnpm db:reset    # Xóa volume dữ liệu cũ và khởi động lại sạch sẽ
pnpm db:migrate  # Chạy migration dbmate

# Kiểm tra chất lượng mã nguồn
pnpm lint        # Kiểm tra ESLint cho toàn monorepo
pnpm typecheck   # Kiểm tra kiểu dữ liệu TypeScript cho toàn bộ repo
pnpm test        # Chạy toàn bộ test
pnpm build       # Build toàn bộ package và ứng dụng

# Sinh client và format
pnpm gen         # Sinh client API từ hợp đồng OpenAPI
pnpm format      # Định dạng lại code với Prettier
```

---

## 📚 Tài liệu kiến trúc
- **Tài liệu kiến trúc chính**: [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)
- **Quy trình đóng góp (Contributing)**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Quyết định kiến trúc (ADR)**: [docs/adr/](docs/adr/)
