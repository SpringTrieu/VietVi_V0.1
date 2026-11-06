---
name: VietVi
description: Marketplace kết nối sinh viên và người đăng task
colors:
  primary: "#003A8C"        # TODO: lấy từ Figma
  secondary: "#6B7280"
  tertiary: "#1D4ED8"       # link, CTA phụ
  neutral: "#F5F5F5"
  surface: "#FFFFFF"
  on-surface: "#111827"
  error: "#DC2626"
typography:
  h1:
    fontFamily: Inter       # TODO: đúng font trong Figma
    fontSize: 2.5rem
    fontWeight: 600
  h2:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: 600
  body-md:
    fontFamily: Inter
    fontSize: 1rem
  caption:
    fontFamily: Inter
    fontSize: 0.75rem
rounded:
  sm: 4px
  md: 8px
  lg: 16px
  full: 9999px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: 12px
  task-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  tag-pill:
    rounded: "{rounded.full}"
---

## Overview
Marketplace dành cho sinh viên Việt Nam. Cảm giác tin cậy, sạch, nhiều khoảng trắng.
Ngôn ngữ giao diện: tiếng Việt.

## Colors
- **Primary:** navy đậm cho tiêu đề, số liệu thống kê, nút chính.
- **Tertiary:** chỉ dùng cho link và "Chi tiết".
- **Neutral:** nền các section xen kẽ.

## Layout
Max-width 1200px, section cách nhau 48px+. Task card chia 3 cột desktop, 1 cột mobile.

## Components
Task card gồm: tag danh mục, tiêu đề, mô tả, khung "Nghiệm thu", avatar người đăng,
rating, ngân sách, hạn chót, nút Chi tiết.

## Do's and Don'ts
- Do dùng đúng 1 nút primary cho mỗi khu vực.
- Don't tự thêm màu ngoài bảng màu.
- Don't trộn góc bo khác nhau trong cùng một section.
- Do giữ độ tương phản WCAG AA.
