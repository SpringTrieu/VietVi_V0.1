# ADR 0003: Truy cập Database bằng Kysely và Migration SQL thuần (dbmate)

- **Mã quyết định:** D7
- **Trạng thái:** Đã duyệt
- **Người duyệt:** @tech-lead
- **Ngày:** 2026-10-29

---

## 1. Ngữ cảnh
Schema cơ sở dữ liệu VIETVI chứa nhiều ràng buộc nghiệp vụ quan trọng ở tầng cơ sở dữ liệu: conditional unique indexes, CHECK constraints, triggers bảo vệ audit log, extension unaccent và pg_trgm. Các ORM truyền thống (Prisma, TypeORM) thường tự động sinh migration làm mất hoặc không hỗ trợ trọn vẹn các tính năng cấp cao của PostgreSQL, gây ra rủi ro trôi schema (schema drift).

## 2. Quyết định
- **Kysely**: Dùng làm query builder có kiểm tra kiểu dữ liệu (type-safe) tại thời điểm biên dịch, truy vấn rõ ràng, không có magic mapping ẩn.
- **dbmate**: Quản lý migration bằng file SQL thuần (`up`/`down`), đánh số migration theo timestamp.
- Xuất file `apps/api/db/schema.sql` sau mỗi migration và commit vào git để phục vụ review PR.

## 3. Hệ quả
- **Tích cực:** Tận dụng 100% sức mạnh và tính năng tối ưu của PostgreSQL 18; bảo toàn trọn vẹn các ràng buộc toàn vẹn dữ liệu đã thiết kế; diff migration trong PR hoàn toàn minh bạch.
- **Tiêu cực:** Nhà phát triển BE cần có kỹ năng viết câu lệnh SQL chuẩn; cần sinh lại kiểu TypeScript từ DB bằng công cụ codegen.

## 4. Xem lại khi
Không có kế hoạch xem lại trong giai đoạn MVP.
