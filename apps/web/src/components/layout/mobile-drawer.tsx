'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, Bell, Mail, Heart, PlusCircle, Package, User, LogOut, HelpCircle, Briefcase } from 'lucide-react';
import { Button, Logo } from '@vietvi/ui';
import type { HeaderUser } from './header.types';

interface NavItem {
  label: string;
  href: string;
}

interface MobileDrawerProps {
  items: NavItem[];
  user?: HeaderUser | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function MobileDrawer({ items, user, isAuthenticated, onLogout }: MobileDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isAuth = Boolean(user || isAuthenticated);

  // Khóa cuộn trang khi menu đang mở
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Đóng bằng phím ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Nút Hamburger bật Drawer (chỉ hiện trên Mobile & Tablet < 1024px) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden -ml-2 p-2 text-[#404145] hover:text-[#1dbf73] focus:outline-none cursor-pointer"
        aria-label="Mở menu điều hướng"
      >
        <Menu className="size-6" />
      </button>

      {/* Lớp phủ Backdrop mờ phía sau */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Panel Menu trượt ra từ bên trái */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng di động"
      >
        <div className="flex flex-col gap-5">
          {/* Header của Drawer: Logo & Nút Đóng */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Link
              href="/"
              onClick={(e) => {
                handleClose();
                if (typeof window !== 'undefined' && window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.dispatchEvent(new CustomEvent('vietvi:reset-home'));
                }
              }}
              className="-m-1.5 p-1.5 inline-flex items-center text-[#222325] focus:outline-none cursor-pointer"
              aria-label="VietVi Trang chủ"
            >
              <Logo className="h-7 w-auto" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
              aria-label="Đóng menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nếu ĐÃ ĐĂNG NHẬP: Hiển thị Profile Mini và Authenticated Links */}
          {isAuth ? (
            <div className="flex flex-col gap-4">
              {/* Thẻ thông tin cá nhân rút gọn */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#1dbf73] text-white font-bold flex items-center justify-center text-[15px]">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'N'}
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#1dbf73] ring-2 ring-white absolute bottom-0 right-0"
                    aria-label="Đang trực tuyến"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold text-[#222325] truncate">
                    {user?.displayName || 'Thành viên VietVi'}
                  </div>
                  <div className="text-[12px] text-[#74767e] truncate">
                    {user?.email || 'Đã đăng nhập'}
                  </div>
                </div>
              </div>

              {/* Danh sách các chức năng Authenticated */}
              <nav className="flex flex-col gap-1 text-[14px] font-medium text-[#404145]">
                <Link
                  href="/tasks/new"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#1dbf73] font-bold bg-[#1dbf73]/10 hover:bg-[#1dbf73]/15 transition-colors"
                >
                  <PlusCircle className="size-4 shrink-0" />
                  <span>+ Đăng Task</span>
                </Link>

                <Link
                  href="/orders"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Package className="size-4 text-slate-500 shrink-0" />
                  <span>Đơn hàng</span>
                </Link>

                <Link
                  href="/messages"
                  onClick={handleClose}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-slate-500 shrink-0" />
                    <span>Tin nhắn</span>
                  </div>
                  {(user?.unreadMessages ?? 0) > 0 && (
                    <span className="px-1.5 py-0.5 text-[11px] font-bold bg-[#f74040] text-white rounded-full">
                      {user?.unreadMessages}
                    </span>
                  )}
                </Link>

                <Link
                  href="/notifications"
                  onClick={handleClose}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="size-4 text-slate-500 shrink-0" />
                    <span>Thông báo</span>
                  </div>
                  {(user?.unreadNotifications ?? 0) > 0 && (
                    <span className="px-1.5 py-0.5 text-[11px] font-bold bg-[#f74040] text-white rounded-full">
                      {user?.unreadNotifications}
                    </span>
                  )}
                </Link>

                <Link
                  href="/saved-tasks"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Heart className="size-4 text-slate-500 shrink-0" />
                  <span>Yêu thích</span>
                </Link>

                <Link
                  href="/become-tasker"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Briefcase className="size-4 text-slate-500 shrink-0" />
                  <span>Trở thành Tasker</span>
                </Link>

                <Link
                  href="/faq"
                  onClick={handleClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <HelpCircle className="size-4 text-slate-500 shrink-0" />
                  <span>Hỗ trợ & FAQ</span>
                </Link>
              </nav>
            </div>
          ) : (
            /* Nếu LÀ KHÁCH: Hiển thị 4 liên kết điều hướng thông thường */
            <nav className="flex flex-col gap-1 text-[1.05rem] font-bold text-[#3A3B3D]">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className="rounded-lg px-3 py-2.5 hover:bg-[#1dbf73]/10 hover:text-[#1dbf73] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Khối dưới cùng: Đăng xuất hoặc Đăng nhập/Tham gia */}
        <div className="pt-4 border-t border-slate-100 mt-4">
          {isAuth ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                onClick={handleClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <User className="size-4 text-slate-400" />
                <span>Hồ sơ cá nhân</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onLogout?.();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
              >
                <LogOut className="size-4 text-red-500" />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={handleClose}
                className="w-full py-2 text-center text-[1rem] font-bold text-[#3A3B3D] hover:text-[#1dbf73] transition-colors"
              >
                Đăng nhập
              </Link>
              <Button asChild variant="outline" className="w-full border-[#1dbf73] text-[#1dbf73] bg-transparent hover:bg-[#1dbf73] hover:text-white hover:border-[#1dbf73] text-[1rem] font-bold py-2 rounded-md transition-all duration-200 shadow-none">
                <Link href="/register" onClick={handleClose}>
                  Tham gia ngay
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
