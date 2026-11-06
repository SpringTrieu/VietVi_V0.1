'use client';

import Link from 'next/link';
import { Logo } from '@vietvi/ui';
import { Globe } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Danh mục công việc',
    links: [
      { label: 'Gia sư & Học tập', href: '#categories-section' },
      { label: 'Lập trình & CNTT', href: '#categories-section' },
      { label: 'Thiết kế đồ họa', href: '#categories-section' },
      { label: 'Viết lách & Dịch thuật', href: '#categories-section' },
      { label: 'Trợ lý sự kiện', href: '#categories-section' },
      { label: 'Nhập liệu & Admin', href: '#categories-section' },
    ],
  },
  {
    title: 'Dành cho Khách hàng',
    links: [
      { label: 'Hướng dẫn đăng task', href: '#how-it-works' },
      { label: 'Bảo vệ quyền lợi người thuê', href: '#trust-pillars' },
      { label: 'Thanh toán Escrow an toàn', href: '#trust-pillars' },
      { label: 'Quy định cho người đăng', href: '#' },
      { label: 'Câu hỏi thường gặp', href: '#faqs' },
    ],
  },
  {
    title: 'Dành cho Tasker',
    links: [
      { label: 'Trở thành Tasker', href: '/login' },
      { label: 'Cẩm nang nhận việc', href: '#' },
      { label: 'Xác thực thẻ sinh viên', href: '/login' },
      { label: 'Cộng đồng Tasker', href: '#' },
      { label: 'Quy chuẩn hoạt động', href: '#' },
    ],
  },
  {
    title: 'Cộng đồng',
    links: [
      { label: 'Diễn đàn thảo luận', href: '#' },
      { label: 'Sự kiện & Workshop', href: '#' },
      { label: 'Blog sinh viên', href: '#' },
      { label: 'Giới thiệu bạn bè', href: '#' },
      { label: 'Tiêu chuẩn cộng đồng', href: '#' },
    ],
  },
  {
    title: 'Về VietVi',
    links: [
      { label: 'Giới thiệu VietVi', href: '#' },
      { label: 'Cơ hội nghề nghiệp', href: '#' },
      { label: 'Hợp tác phát triển', href: '#' },
      { label: 'Chính sách bảo mật', href: '#' },
      { label: 'Điều khoản dịch vụ', href: '#' },
      { label: 'Trung tâm trợ giúp', href: '/help' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-[#dadbdd] bg-white text-[#74767e]">
      {/* Tầng 1 — Thân Footer: Dàn đều 5 cột liên kết theo chuẩn Fiverr (Không còn logo/text giới thiệu ở trên) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 xl:gap-8">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[15px] font-bold text-[#222325] tracking-tight">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3 text-[14px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#74767e] hover:text-[#222325] hover:underline transition-colors block leading-snug"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tầng 2 — Thanh Chân trang đáy: Logo VietVi đặt cạnh bản quyền bên trái, Icon mạng xã hội & Ngôn ngữ bên phải */}
      <div className="border-t border-[#dadbdd] py-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Bên trái: Logo VietVi + Bản quyền liền kề (chuẩn Fiverr) */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <Link
              href="/"
              onClick={(e) => {
                if (typeof window !== 'undefined' && window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.dispatchEvent(new CustomEvent('vietvi:reset-home'));
                }
              }}
              className="-m-1.5 p-1.5 inline-flex items-center text-[#222325] focus:outline-none cursor-pointer"
              aria-label="VietVi Trang chủ"
            >
              <Logo className="h-6 w-auto" aria-hidden="true" />
            </Link>
            <p className="text-[13px] sm:text-[14px] text-[#74767e]">
              © 2026 VietVi. Bảo lưu mọi quyền.
            </p>
          </div>

          {/* Bên phải: Cụm Icon mạng xã hội + Bộ chọn Ngôn ngữ & Tiền tệ */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#74767e]">
            {/* Các icon mạng xã hội tối giản chuẩn nét */}
            <div className="flex items-center gap-4">
              {/* TikTok */}
              <Link
                href="#"
                aria-label="TikTok"
                className="hover:text-[#222325] transition-colors"
              >
                <svg className="size-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.34 6.34 0 0 0 1.9-4.5V8.75a8.28 8.28 0 0 0 4.84 1.56V6.85a4.84 4.84 0 0 1-.97-.16z" />
                </svg>
              </Link>
              {/* Instagram */}
              <Link
                href="#"
                aria-label="Instagram"
                className="hover:text-[#222325] transition-colors"
              >
                <svg className="size-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              {/* LinkedIn */}
              <Link
                href="#"
                aria-label="LinkedIn"
                className="hover:text-[#222325] transition-colors"
              >
                <svg className="size-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74V10.13H5.06v8.37h2.8z" />
                </svg>
              </Link>
              {/* Facebook */}
              <Link
                href="#"
                aria-label="Facebook"
                className="hover:text-[#222325] transition-colors"
              >
                <svg className="size-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </Link>
              {/* X / Twitter */}
              <Link
                href="#"
                aria-label="X (Twitter)"
                className="hover:text-[#222325] transition-colors"
              >
                <svg className="size-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>

            {/* Bộ chọn Ngôn ngữ & Tiền tệ */}
            <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-[#e4e5e7]">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-semibold text-[#74767e] hover:text-[#222325] transition-colors cursor-pointer"
              >
                <Globe className="size-4 text-[#74767e]" aria-hidden="true" />
                <span>Tiếng Việt</span>
              </button>
              <span className="text-slate-300 select-none">·</span>
              <button
                type="button"
                className="inline-flex items-center text-[13px] sm:text-[14px] font-semibold text-[#74767e] hover:text-[#222325] transition-colors cursor-pointer"
              >
                <span>₫ VND</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
