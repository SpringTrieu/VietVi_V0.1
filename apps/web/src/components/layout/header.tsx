'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Mail, Heart, LogOut } from 'lucide-react';
import { Button, Logo, cn } from '@vietvi/ui';
import { MobileDrawer } from './mobile-drawer';
import type { HeaderProps } from './header.types';
import { NotificationDropdown } from '@/features/notification/components/notification-dropdown';
import { CategoryNav } from './category-nav';

const GUEST_NAV_ITEMS = [
  { label: 'Khám phá', href: '#categories-section' },
  { label: 'Quy trình', href: '#how-it-works' },
  { label: 'Bảo hiểm', href: '#trust-pillars' },
  { label: 'Hỗ trợ & FAQ', href: '#faq-section' },
];

export function Header({
  user,
  isAuthenticated = false,
  activeCategorySlug,
  categories,
  onSelectCategory,
  onSearch,
  onLogout,
}: HeaderProps) {
  const isAuth = Boolean(user || isAuthenticated);

  const [showSearch, setShowSearch] = useState(isAuth);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Đóng dropdown menu khi bấm ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsUserMenuOpen(false);
    };
    if (isUserMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  // Với khách: Theo dõi vị trí cuộn qua Hero để hiện ô tìm kiếm
  useEffect(() => {
    if (isAuth) {
      setShowSearch(true);
      return;
    }

    const heroSearchAnchor = document.getElementById('hero-search-anchor');
    if (!heroSearchAnchor) {
      setShowSearch(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const isPastHero = !entry.isIntersecting && entry.boundingClientRect.top <= 64;
        setShowSearch(isPastHero);
      },
      {
        rootMargin: '-64px 0px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(heroSearchAnchor);

    return () => {
      observer.disconnect();
    };
  }, [isAuth]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery.trim());
    // TODO(integration): Chuyển hướng tới trang danh sách task: /tasks?q=${query}
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const targetPath = isAuth ? '/dashboard' : '/';
    if (typeof window !== 'undefined' && window.location.pathname === targetPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('vietvi:reset-home'));
    }
  };

  // Reset ô tìm kiếm header khi click logo
  useEffect(() => {
    const handleResetHome = () => {
      setSearchQuery('');
    };
    window.addEventListener('vietvi:reset-home', handleResetHome);
    return () => {
      window.removeEventListener('vietvi:reset-home', handleResetHome);
    };
  }, []);

  const displayName = user?.displayName || 'SpringNguyen';
  const displayEmail = user?.email || 'vietvi28062026@gmail.com';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 bg-white transition-shadow duration-200',
        isAuth ? 'h-[104px]' : 'h-16 border-b border-[#dadbdd]'
      )}
    >
      {/* ============================================================== */}
      {/* HÀNG TRÊN: Main Navigation Bar (64px) */}
      {/* ============================================================== */}
      <div className={cn('w-full h-16', isAuth && 'border-b border-[#dadbdd]')}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2 sm:gap-4">
        {/* ============================================================== */}
        {/* KHỐI TRÁI: Mobile Hamburger + Logo */}
        {/* ============================================================== */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <MobileDrawer
            items={GUEST_NAV_ITEMS}
            user={user}
            isAuthenticated={isAuth}
            onLogout={onLogout}
          />

          <Link
            href={isAuth ? '/dashboard' : '/'}
            onClick={handleLogoClick}
            className="-m-1.5 p-1.5 inline-flex items-center shrink-0 rounded-md focus:outline-none cursor-pointer"
            aria-label="VietVi Trang chủ"
          >
            <Logo
              aria-hidden="true"
              className="h-8 w-auto text-[#222325]"
            />
          </Link>
        </div>

        {/* ============================================================== */}
        {/* KHỐI GIỮA: Thanh tìm kiếm (Chuẩn 400px theo DDESIGN.md) */}
        {/* ============================================================== */}
        <div
          className={cn(
            'flex-1 min-w-[280px] sm:min-w-[320px] max-w-[420px] mx-2 lg:mx-4 transition-all duration-300 ease-out',
            showSearch
              ? 'opacity-100 translate-y-0 pointer-events-auto visible'
              : 'opacity-0 -translate-y-2 pointer-events-none invisible'
          )}
        >
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="flex w-full h-[40px] bg-white rounded-[4px] border border-[#dadbdd] hover:border-[#c5c6c9] focus-within:border-[#1dbf73] transition-colors overflow-hidden shadow-xs"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Bạn đang tìm dịch vụ gì hôm nay?"
              aria-label="Tìm kiếm dịch vụ trên VietVi"
              className="flex-1 min-w-0 bg-transparent px-3.5 text-[14px] text-[#222325] placeholder:text-[#74767e] outline-none"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="w-[40px] h-[40px] flex items-center justify-center shrink-0 bg-[#222325] text-white hover:bg-black transition-colors cursor-pointer"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
                className="shrink-0"
              >
                <path d="M11.7422 10.3281H10.9972L10.7334 10.0737C11.6669 8.98822 12.2222 7.57444 12.2222 6.04639C12.2222 2.70705 9.48911 0 6.11111 0C2.73311 0 0 2.70705 0 6.04639C0 9.38572 2.73311 12.0928 6.11111 12.0928C7.65342 12.0928 9.08053 11.5428 10.1762 10.6183L10.433 10.8797V11.6178L15.1337 16.2751L16 15.4172L11.7422 10.3281ZM6.11111 10.3281C3.72251 10.3281 1.77778 8.40215 1.77778 6.04639C1.77778 3.69062 3.72251 1.76465 6.11111 1.76465C8.49971 1.76465 10.4444 3.69062 10.4444 6.04639C10.4444 8.40215 8.49971 10.3281 6.11111 10.3281Z" />
              </svg>
            </button>
          </form>
        </div>

        {/* ============================================================== */}
        {/* KHỐI PHẢI: Menu Đăng nhập hoặc Menu Khách */}
        {/* ============================================================== */}
        {isAuth ? (
          /* TRẠNG THÁI: ĐÃ ĐĂNG NHẬP (Authenticated Header) */
          <div className="flex items-center gap-3 sm:gap-4 xl:gap-5 shrink-0">
            {/* Desktop Menu items (Ẩn trên mobile < 1024px) */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-[14px] xl:text-[15px]">
              {/* Nút + Đăng Task (Nổi bật màu xanh #1dbf73 theo chuẩn DDESIGN.md) */}
              <Link
                href="/tasks/new"
                className="text-[#1dbf73] font-bold hover:underline transition-all whitespace-nowrap"
              >
                + Đăng Task
              </Link>

              {/* Trở thành Tasker */}
              <Link
                href="/become-tasker"
                className="text-[#404145] hover:text-[#1dbf73] font-medium transition-colors whitespace-nowrap"
              >
                Trở thành Tasker
              </Link>

              {/* FAQ */}
              <Link
                href="/faq"
                className="text-[#404145] hover:text-[#1dbf73] font-medium transition-colors whitespace-nowrap"
              >
                FAQ
              </Link>
            </nav>

            {/* Cụm 3 Icon tiện ích: Chuông, Thư, Tim */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Icon Chuông thông báo & Dropdown Popover (Chuẩn ảnh tham khảo & DDESIGN.md) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsNotificationOpen((prev) => !prev);
                    setIsUserMenuOpen(false);
                  }}
                  aria-expanded={isNotificationOpen}
                  aria-haspopup="dialog"
                  aria-label="Thông báo"
                  className={cn(
                    'relative p-2 text-[#62646a] hover:text-[#222325] hover:bg-slate-100 rounded-full transition-colors cursor-pointer',
                    isNotificationOpen && 'bg-slate-100 text-[#222325]'
                  )}
                >
                  <Bell className="size-5 shrink-0" />
                  {(user?.unreadNotifications ?? 0) > 0 && (
                    <span
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f74040]"
                      aria-label="Có thông báo mới"
                    />
                  )}
                </button>

                {/* Khung thả xuống Thông báo */}
                <NotificationDropdown
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  unreadCount={user?.unreadNotifications ?? 0}
                />
              </div>

              {/* Icon Tin nhắn / Hộp thư */}
              <Link
                href="/messages"
                aria-label="Tin nhắn"
                className="relative p-2 text-[#62646a] hover:text-[#222325] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <Mail className="size-5 shrink-0" />
                {(user?.unreadMessages ?? 0) > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f74040]"
                    aria-label="Có tin nhắn mới"
                  />
                )}
              </Link>

              {/* Icon Yêu thích / Saved */}
              <Link
                href="/saved-tasks"
                aria-label="Danh sách yêu thích"
                className="p-2 text-[#62646a] hover:text-[#222325] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <Heart className="size-5 shrink-0" />
              </Link>
            </div>

            {/* Mục Đơn hàng (Ẩn trên mobile < 1024px) */}
            <Link
              href="/orders"
              className="hidden lg:inline-block text-[14px] xl:text-[15px] font-medium text-[#404145] hover:text-[#1dbf73] transition-colors whitespace-nowrap"
            >
              Đơn hàng
            </Link>

            {/* Avatar người dùng với chấm xanh Online & Dropdown menu chuẩn Fiverr */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationOpen(false);
                }}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label="Menu tài khoản cá nhân"
                className="relative flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:ring-offset-1 select-none overflow-visible"
              >
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={displayName}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#1dbf73] text-white font-bold text-[14px] flex items-center justify-center">
                    {avatarLetter}
                  </div>
                )}
                {/* Chấm xanh Online (Fiverr Green #1dbf73 góc dưới phải) */}
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#1dbf73] ring-2 ring-white absolute -bottom-0.5 -right-0.5"
                  aria-label="Đang trực tuyến"
                />
              </button>

              {/* ============================================================== */}
              {/* DROPDOWN MENU CHUẨN FIVERR & DDESIGN.MD (Bo góc 16px, viền #dadbdd) */}
              {/* ============================================================== */}
              {isUserMenuOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 mt-2 w-[260px] bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#dadbdd] p-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                >
                  {/* PHẦN ĐẦU: Tên người dùng & Email */}
                  <div className="px-3.5 pt-2 pb-2.5 border-b border-[#dadbdd]">
                    <div className="font-bold text-[15px] text-[#222325] truncate">
                      {displayName}
                    </div>
                    <div className="text-[13px] text-[#74767e] truncate mt-0.5">
                      {displayEmail}
                    </div>
                  </div>

                  {/* NHÓM 1: Quản lý yêu cầu & Đăng task (Task Briefs) */}
                  <div className="py-1.5 border-b border-[#dadbdd] flex flex-col gap-0.5">
                    {/* Yêu cầu của bạn (Active pill background chuẩn Fiverr) */}
                    <Link
                      href="/briefs"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-3.5 py-2 text-[14px] font-medium text-[#222325] bg-[#f4f5f7] rounded-[8px] transition-colors"
                    >
                      Yêu cầu của bạn
                    </Link>

                    {/* Đăng mô tả task */}
                    <Link
                      href="/tasks/new"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-3.5 py-2 text-[14px] font-normal text-[#404145] hover:text-[#1dbf73] hover:bg-slate-50 rounded-[8px] transition-colors"
                    >
                      Đăng mô tả task
                    </Link>
                  </div>

                  {/* NHÓM 2: Hồ sơ & Nghiệp vụ cốt lõi */}
                  <div className="py-1.5 border-b border-[#dadbdd] flex flex-col gap-0.5">
                    {/* Hồ sơ cá nhân */}
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-3.5 py-2 text-[14px] font-normal text-[#404145] hover:text-[#1dbf73] hover:bg-slate-50 rounded-[8px] transition-colors"
                    >
                      Hồ sơ cá nhân
                    </Link>

                    {/* Cài đặt tài khoản */}
                    <Link
                      href="/settings"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-3.5 py-2 text-[14px] font-normal text-[#404145] hover:text-[#1dbf73] hover:bg-slate-50 rounded-[8px] transition-colors"
                    >
                      Cài đặt tài khoản
                    </Link>

                    {/* Thanh toán & Nạp/rút */}
                    <Link
                      href="/billing"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-3.5 py-2 text-[14px] font-normal text-[#404145] hover:text-[#1dbf73] hover:bg-slate-50 rounded-[8px] transition-colors"
                    >
                      Thanh toán & Nạp/rút
                    </Link>

                    {/* Trung tâm trợ giúp */}
                    <Link
                      href="/support"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-3.5 py-2 text-[14px] font-normal text-[#404145] hover:text-[#1dbf73] hover:bg-slate-50 rounded-[8px] transition-colors"
                    >
                      Trung tâm trợ giúp
                    </Link>

                    {/* Trở thành Tasker */}
                    <Link
                      href="/become-tasker"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-3.5 py-2 text-[14px] font-normal text-[#404145] hover:text-[#1dbf73] hover:bg-slate-50 rounded-[8px] transition-colors"
                    >
                      Trở thành Tasker
                    </Link>
                  </div>

                  {/* PHẦN ĐĂNG XUẤT (Sign out) */}
                  <div className="pt-1.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[14px] font-normal text-[#404145] hover:text-red-600 hover:bg-red-50 rounded-[8px] transition-colors cursor-pointer"
                    >
                      <LogOut className="size-4 text-[#74767e]" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* TRẠNG THÁI: KHÁCH CHƯA ĐĂNG NHẬP (Guest Header chuẩn DDESIGN.md & Ảnh mẫu) */
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Menu dàn ngang Desktop (>= 1024px) */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[14px] xl:text-[15px] font-semibold text-[#404145]">
              {GUEST_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-[#1dbf73] transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}

              {/* Vạch ngăn cách dọc (|) chuẩn ảnh mẫu & DDESIGN.md */}
              <span className="w-[1px] h-4 bg-[#dadbdd] shrink-0 mx-0.5" aria-hidden="true" />

              {/* Link: Đăng nhập */}
              <Link
                href="/login"
                className="text-[#222325] hover:text-[#1dbf73] transition-colors whitespace-nowrap font-semibold"
              >
                Đăng nhập
              </Link>
            </nav>

            {/* Nút CTA "Tham gia ngay" Desktop (Carbon #222325, chữ trắng, bo góc 8px chuẩn Primary Filled Button) */}
            <Button
              asChild
              className="hidden lg:inline-flex bg-[#222325] hover:bg-[#404145] text-white text-[14px] font-semibold h-9 px-4 sm:px-5 rounded-[8px] transition-colors shadow-none cursor-pointer whitespace-nowrap border-0"
            >
              <Link href="/register">Tham gia ngay</Link>
            </Button>

            {/* Nút CTA thu gọn trên Mobile & Tablet (< 1024px) */}
            <Button
              asChild
              size="sm"
              className="lg:hidden bg-[#222325] hover:bg-[#404145] text-white text-xs font-semibold h-8 px-3 rounded-[8px] transition-colors shadow-none whitespace-nowrap border-0"
            >
              <Link href="/register">Tham gia ngay</Link>
            </Button>
          </div>
        )}
      </div>
    </div>

    {/* ============================================================== */}
    {/* HÀNG DƯỚI: Category Sub-Navigation Bar (40px) - Chỉ khi đã đăng nhập */}
    {/* ============================================================== */}
    {isAuth && (
      <CategoryNav
        items={categories}
        activeSlug={activeCategorySlug}
        onSelectCategory={onSelectCategory}
      />
    )}
  </header>
);
}
