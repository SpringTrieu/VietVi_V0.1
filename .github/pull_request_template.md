## 1. Mã yêu cầu liên quan (SRS / Issue)
- SRS: 
- Issue: 

## 2. Mô tả thay đổi
<!-- Tóm tắt ngắn gọn mục đích và nội dung thay đổi. Quy ước PR ≤ ~400 dòng (không tính file sinh tự động). -->

## 3. Ảnh chụp màn hình / Video demo (bắt buộc cho Front-end)
<!-- Đính kèm ảnh hoặc video minh họa thay đổi giao diện -->

## 4. Kiểm tra Database & Hợp đồng API
- [ ] **Database Migration:** Có thay đổi migration không?
  - Breaking change? [ ] Có [ ] Không
- [ ] **API Contract:** Có thay đổi `packages/contracts` hoặc `docs/api/openapi.json` không?
  - Breaking change? [ ] Có [ ] Không

## 5. Hướng dẫn kiểm thử
<!-- Hướng dẫn từng bước để reviewer có thể kiểm tra PR này trên local -->
1. 
2. 
3. 

## 6. Checklist hoàn thành (Definition of Done)
- [ ] Có test cho máy trạng thái / policy / tính tiền nếu chạm vào
- [ ] Lint, typecheck, test xanh trên local (`pnpm lint`, `pnpm typecheck`, `pnpm test`)
- [ ] Hợp đồng API cập nhật (`openapi.json` đổi trong cùng PR) nếu đổi endpoint
- [ ] Thao tác đổi trạng thái có ghi history + audit + outbox
- [ ] Không có chuỗi giao diện viết cứng ngoài file i18n
- [ ] Có `noindex` cho trang riêng tư; kiểm tra quyền truy cập chống IDOR
