# PROMPT: Dựng khung codebase VIETVI từ tài liệu kiến trúc

## 1. Vai trò và mục tiêu

Bạn là kỹ sư nền tảng (platform engineer) dựng khung repo cho dự án VIETVI. Thư mục hiện tại là gốc dự án, gần như trống.

Mục tiêu duy nhất của phiên này là dựng **khung** codebase đúng theo tài liệu kiến trúc:
- cây thư mục,
- file cấu hình,
- framework và thư viện được cài đặt và chốt phiên bản,
- các file ignore,
- hạ tầng chạy local,
- quy trình làm việc của đội.

**Không viết logic nghiệp vụ.**

## 2. Nguồn sự thật

| File | Vai trò |
| --- | --- |
| `docs/architecture/ARCHITECTURE.md` | **Nguồn sự thật duy nhất** về cấu trúc, công nghệ, quy ước. Đọc **toàn bộ** trước khi làm bất cứ việc gì |
| `docs/sdd/vietvi_schema_v0_1.sql` | Schema DB đã kiểm tra; dùng nguyên văn cho migration đầu tiên |
| Các file khác trong `docs/` (nếu có) | Tham khảo, không được ghi đè |

Quy tắc khi gặp chỗ chưa rõ:
1. Tài liệu nói rõ → làm đúng như tài liệu, kể cả tên file, tên thư mục, cổng, tên biến môi trường.
2. Tài liệu không nói, nhưng cần để công cụ chạy được → dùng giá trị mặc định của chính công cụ đó. Ghi lại trong `docs/setup/SETUP_REPORT.md` mục "Giả định".
3. Tài liệu không nói, và là quyết định thiết kế → **không tự quyết**. Ghi vào mục "Câu hỏi mở" của report.
4. Tài liệu mâu thuẫn với thực tế (ví dụ hai thư viện không tương thích) → chọn phương án gần tài liệu nhất. Ghi lý do vào report mục "Sai khác so với tài liệu".

Không suy diễn "chắc là", không "làm tương tự", không thêm thư viện hay thư mục mà tài liệu không có.

## 3. Phạm vi

### ĐƯỢC làm
- Tạo toàn bộ cây thư mục ở mục 6 của tài liệu. Thư mục trống thì đặt file `.gitkeep`.
- Tạo file cấu hình gốc, cấu hình dùng chung và cấu hình từng app (mục 4, 6, 8, 9, 10, 11, 12, 13).
- Khởi tạo app bằng công cụ chính thức:
  - `apps/web` và `apps/admin` bằng create-next-app,
  - `apps/api` bằng Nest CLI.
- Sau khi khởi tạo, xóa nội dung demo và sắp lại theo đúng cây thư mục của tài liệu.
- Code khởi động tối thiểu, chỉ gồm:
  - `apps/api/src/main.ts` và `app.module.ts`,
  - endpoint `GET /api/v1/health`,
  - `apps/api/src/worker.ts` khởi động application context mà không mở HTTP,
  - kiểm tra biến môi trường bằng Zod khi khởi động,
  - trang chủ của `web` và `admin` hiển thị một dòng tên app.
- Migration đầu tiên chuyển từ `docs/sdd/vietvi_schema_v0_1.sql` sang định dạng dbmate:
  - phần `up` giữ nguyên văn file gốc,
  - phần `down` chỉ là DROP các đối tượng theo thứ tự ngược.
- File seed rỗng có cấu trúc. Seed một tài khoản admin local nếu tài liệu yêu cầu.
- Các file quy trình: CODEOWNERS, PR template, issue templates, workflow CI, `renovate.json`, `README.md`, `CONTRIBUTING.md`, ADR template và 5 ADR đầu tiên. Nội dung các file này **chỉ** lấy từ tài liệu.

### KHÔNG được làm
- Không viết controller, service, repository, schema Zod nghiệp vụ, hay trang giao diện nghiệp vụ.
- Không sinh client API, vì chưa có `openapi.json` thật. Chỉ tạo `orval.config.ts` và script `pnpm gen`.
- Không cài phần mềm hệ thống (Node.js, Docker, Git) và không dùng `sudo`. Thiếu thì dừng lại và báo người dùng.
- Không cài package global. Ngoại lệ duy nhất: `corepack enable`.
- Không tạo file `.env` có giá trị thật. Chỉ tạo `.env.example`. File `.env` để chạy local được phép tạo nhưng phải nằm trong `.gitignore`.
- Không `git push`, không tạo remote, không thao tác trên GitHub.
- Không sửa hay xóa file trong `docs/` do người dùng đặt sẵn.
- Không tắt kiểm tra an toàn chuỗi cung ứng mặc định của pnpm (`minimumReleaseAge`).

## 4. Chính sách phiên bản

Phiên bản của nhóm công cụ chính đã chốt trong mục 4.2 của tài liệu:

| Công cụ | Phiên bản |
| --- | --- |
| Node.js | 26 LTS |
| pnpm | 11.x |
| TypeScript | 6.0 |
| Next.js | 16.x |
| Tailwind CSS | 4.x |
| NestJS | 11.x |
| PostgreSQL | 18 |

Với mỗi thư viện ghi "mới nhất", làm theo các bước sau:
1. Tra phiên bản bằng `pnpm view <tên-gói> version` và `pnpm view <tên-gói> time --json`. Không dùng phiên bản trong trí nhớ.
2. Kiểm tra `peerDependencies` để chắc chắn tương thích với Node 26, TypeScript 6.0, Next.js 16, NestJS 11 và React đi kèm Next.js 16.
3. Ghi major đã chọn vào `catalog:` trong `pnpm-workspace.yaml`. Mọi `package.json` trong repo tham chiếu `catalog:`, không ghi số phiên bản riêng.
4. Ghi bảng phiên bản cuối cùng vào `docs/setup/VERSIONS.md`, gồm các cột: gói, phiên bản, ngày phát hành, lý do chọn nếu khác bản mới nhất.

Nếu một thư viện chưa hỗ trợ một phiên bản đã chốt, không tự hạ phiên bản cả hệ thống. Dừng lại và báo người dùng; các trường hợp hay gặp:
- TypeScript 6.0 chưa được hỗ trợ,
- `nestjs-zod` chưa hỗ trợ Zod major mới nhất.

## 5. Cách làm việc: theo pha, có điểm dừng

### Pha 0 – Đọc và lập kế hoạch (BẮT BUỘC DỪNG)

1. Đọc toàn bộ `docs/architecture/ARCHITECTURE.md`.
2. Kiểm tra môi trường bằng các lệnh:
   - `node -v` (phải là major 26),
   - `corepack --version`,
   - `git --version`,
   - `docker --version` và `docker compose version`.
3. Trình bày cho người dùng:
   - danh sách pha;
   - danh sách file và thư mục sẽ tạo, nhóm theo pha;
   - lệnh khởi tạo sẽ chạy;
   - các điểm tài liệu chưa rõ mà bạn phát hiện;
   - phần mềm còn thiếu trên máy, kèm cách cài. Ví dụ: chưa có Node 26 thì gợi ý `fnm install 26`.
4. **Dừng lại và chờ người dùng trả lời "OK".** Chưa tạo file nào ở pha này.

### Pha 1 – Khung repo gốc
Tham chiếu: tài liệu mục 4.1, 6.1, 10, 13 (bước 1).

Tạo các file:
- `git init`,
- `package.json` gốc (gồm `packageManager`, `engines`, các script gốc),
- `pnpm-workspace.yaml` (workspaces + `catalog:`),
- `.node-version`, `.npmrc`, `turbo.json`,
- `.editorconfig`, `.prettierrc`, `.prettierignore`,
- `.gitignore` và `.dockerignore`: chép **nguyên văn** từ mục 10,
- `.vscode/extensions.json`, `.vscode/settings.json`.

### Pha 2 – Cấu hình dùng chung
Tham chiếu: tài liệu mục 6.1, 6.6, 12, 13 (bước 2).

Tạo:
- `packages/config-typescript` với 4 preset: base, nextjs, nestjs, library.
- `packages/config-eslint` dùng ESLint flat config + typescript-eslint, kèm rule ranh giới bằng `eslint-plugin-boundaries`, đúng các quy tắc phụ thuộc ở mục 6.6:
  - các app không import lẫn nhau,
  - `contracts` không phụ thuộc React, NestJS hay Kysely,
  - trong `apps/api`: chiều phụ thuộc là controllers → services → repositories,
  - một module không được import repository của module khác.
- `eslint.config.mjs` gốc.
- Husky, lint-staged, `commitlint.config.mjs` theo Conventional Commits (mục 8.2).

### Pha 3 – Khởi tạo ba ứng dụng
Tham chiếu: tài liệu mục 6.2, 6.3, 6.4.

1. Chạy `--help` của đúng phiên bản create-next-app và Nest CLI để lấy cờ không tương tác. Không đoán cờ.
2. Khởi tạo `apps/web`, `apps/admin`, `apps/api`.
3. Dọn dẹp sau khởi tạo:
   - xóa `.git`, lockfile và `.gitignore` lồng bên trong từng app;
   - chuyển cấu hình ESLint và TypeScript sang preset dùng chung;
   - xóa trang, ảnh, CSS và test demo.
4. Tạo đủ cây thư mục con theo mục 6.2–6.4 (route groups, `features/*`, `common/*`, `infra/*`, `modules/*` cùng các thư mục con, `jobs/`, `db/`, `test/`).
5. Đặt cổng chạy theo mục 9.1: web 3000, admin 3001, api 4000. Đặt tiền tố API là `/api/v1`.
6. Thêm header noindex cho toàn bộ `apps/admin` (mục 6.3).

### Pha 4 – Package dùng chung
Tham chiếu: tài liệu mục 6.5, 6.6.

Tạo `packages/contracts`, `packages/ui`, `packages/i18n`, mỗi package có `package.json` và `src/index.ts` rỗng.

Riêng `packages/contracts`:
- tạo đủ các thư mục `schemas/`, `enums/`, `errors/` và file `money.ts` rỗng;
- tạo `orval.config.ts` trỏ tới `docs/api/openapi.json`;
- **chưa** chạy sinh client.

Riêng `packages/ui`: khởi tạo shadcn/ui bằng CLI chính thức và đặt theme Tailwind 4 tại đây. `apps/web` và `apps/admin` import theme từ package này.

### Pha 5 – Hạ tầng local
Tham chiếu: tài liệu mục 6.1, 6.4, 9.1, 9.2, 13 (bước 4).

Tạo:
- `infra/compose/docker-compose.yml` với 4 dịch vụ (postgres 18, redis hoặc valkey, minio, mailpit), đúng cổng ở mục 9.1;
- volume dữ liệu đặt trong `infra/compose/data/` (đã nằm trong ignore);
- 3 Dockerfile multi-stage trong `infra/docker/`;
- migration dbmate đầu tiên trong `apps/api/db/migrations/`, kèm `schema.sql` do dbmate xuất ra;
- `.env.example` cho 3 app với **đúng** danh sách khóa ở mục 9.2;
- các script gốc: `pnpm db:up`, `pnpm db:down`, `pnpm db:reset`, `pnpm db:migrate`, `pnpm gen`, `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`;
- script tạo bucket `public` và `private` trên MinIO trong `infra/scripts/`.

### Pha 6 – Quy trình đội
Tham chiếu: tài liệu mục 1, 7, 8, 11, 13 (bước 5).

Tạo:
- `.github/CODEOWNERS`: chép từ mục 7, giữ nguyên các placeholder `@tech-lead`, `@fe-a`, `@fe-b`, `@be`;
- `pull_request_template.md` với các mục bắt buộc ở 8.3;
- 2 issue template;
- `.github/workflows/ci.yml` theo sơ đồ mục 11. Bước "kiểm tra hợp đồng" và "kiểm tra migration" để chế độ cảnh báo (`continue-on-error: true`), ghi chú TODO bật lại sau Sprint 1;
- `renovate.json`;
- `README.md` hướng dẫn chạy local trong 5 phút;
- `CONTRIBUTING.md` lấy từ mục 8;
- `docs/adr/0000-template.md` và 5 ADR 0001–0005 lấy nội dung từ bảng quyết định D1, D2, D7, D8, D9 ở mục 1.

### Pha 7 – Kiểm tra cuối (BẮT BUỘC)

Chạy lần lượt và ghi kết quả từng bước vào report:
1. `pnpm install --frozen-lockfile` sau khi đã có lockfile.
2. `pnpm lint`, `pnpm typecheck`, `pnpm build` cho toàn monorepo.
3. `pnpm db:up`, rồi `pnpm db:migrate`. Kiểm tra trong PostgreSQL đủ 45 bảng.
4. Chạy `pnpm dev` khoảng 60 giây và xác nhận:
   - `http://localhost:3000` và `http://localhost:3001` trả 200;
   - `http://localhost:4000/api/v1/health` trả ok;
   - Mailpit (cổng 8025) và MinIO console (cổng 9001) mở được.
5. `git status --ignored`: các file sau phải bị ignore: `node_modules`, `.next`, `dist`, `.turbo`, `.env`, `infra/compose/data`, `packages/contracts/generated`.
6. Các file sau phải **được theo dõi** (không bị ignore): `pnpm-lock.yaml`, mọi `.env.example`, `apps/api/db/schema.sql`, `.vscode/extensions.json`, `.vscode/settings.json`.
7. Thử một commit có message sai chuẩn để xác nhận commitlint chặn được, sau đó hủy commit thử.

Bước nào lỗi thì sửa. Sửa không được thì ghi rõ lỗi, nguyên nhân dự đoán và đề xuất vào report, **không che giấu**.

### Commit
Cuối mỗi pha từ 1 đến 6, tạo một commit cục bộ theo Conventional Commits. Ví dụ:
- `chore(repo): khởi tạo monorepo pnpm + turborepo`
- `chore(api): scaffold NestJS và migration đầu tiên`

## 6. Báo cáo cuối: `docs/setup/SETUP_REPORT.md`

Báo cáo gồm các mục sau:
1. **Đã làm**: theo pha, liệt kê file và thư mục chính.
2. **Kết quả kiểm tra Pha 7**: bảng gồm bước, lệnh, kết quả, ghi chú.
3. **Phiên bản đã chốt**: dẫn sang `docs/setup/VERSIONS.md`.
4. **Giả định**: các mặc định của công cụ đã dùng khi tài liệu không nói.
5. **Sai khác so với tài liệu**: mỗi dòng gồm nội dung, lý do, đề xuất cập nhật tài liệu.
6. **Câu hỏi mở**: gộp với mục 14 của tài liệu, không lặp lại.
7. **Việc con người phải làm tay**: tạo repo GitHub và push; bật bảo vệ nhánh `main` và secret scanning; thay placeholder trong CODEOWNERS; cài Renovate GitHub App; khai báo secrets staging/production.

Kết thúc phiên bằng một đoạn tóm tắt ngắn trong chat:
- tổng số file đã tạo,
- trạng thái từng bước kiểm tra,
- số câu hỏi mở,
- đường dẫn tới report.
