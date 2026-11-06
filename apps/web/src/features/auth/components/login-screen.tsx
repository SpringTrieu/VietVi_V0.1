'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { Logo } from '@vietvi/ui';
import { AuthBanner } from './auth-banner';
import type { LoginFormData, LoginUIState } from '../types.placeholder';

export type LoginScreenProps = {
  state?: LoginUIState;
  initialData?: Partial<LoginFormData>;
  errorMessage?: string;
  onSubmit?: (data: LoginFormData) => void;
  onGoogleSignIn?: () => void;
};

export function LoginScreen({
  state = 'idle',
  initialData,
  errorMessage,
  onSubmit,
  onGoogleSignIn,
}: LoginScreenProps) {
  const [account, setAccount] = useState(initialData?.account ?? '');
  const [password, setPassword] = useState(initialData?.password ?? '');
  const [rememberMe, setRememberMe] = useState(initialData?.rememberMe ?? false);
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = state === 'submitting';
  const displayError = errorMessage;

  // Đồng bộ Props -> State khi fixture hoặc dữ liệu bên ngoài thay đổi (TD-05)
  useEffect(() => {
    if (initialData?.account !== undefined) setAccount(initialData.account);
    if (initialData?.password !== undefined) setPassword(initialData.password);
    if (initialData?.rememberMe !== undefined) setRememberMe(initialData.rememberMe);
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Không tự đặt luật validation - BE đảm nhận theo yêu cầu người dùng & AGENTS.md
    onSubmit?.({
      account: account.trim(),
      password,
      rememberMe,
    });
    // TODO(integration): Nối API xác thực đăng nhập POST /auth/login
  };

  const handleGoogleClick = () => {
    onGoogleSignIn?.();
    // TODO(integration): Chuyển hướng tới endpoint OAuth Google GET /auth/google
  };

  return (
    <div className="w-full max-w-[1100px] bg-white rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden grid grid-cols-1 min-[900px]:grid-cols-[55%_45%]">
      {/* CỘT TRÁI: Dùng chung AuthBanner (TD-04: Loại bỏ code trùng lặp) */}
      <AuthBanner />

      {/* CỘT PHẢI: Form Đăng nhập (Căn chỉnh lưới, đệm và khoảng cách chuẩn DDESIGN.md) */}
      <div className="p-6 sm:p-8 min-[900px]:p-10 xl:p-12 [@media(max-height:800px)_and_(min-width:900px)]:py-6 [@media(max-height:800px)_and_(min-width:900px)]:px-8 flex flex-col justify-center">
        {/* Khung nội bộ giới hạn chiều rộng max-w-[380px] để form luôn cân đối, thanh thoát */}
        <div className="w-full max-w-[380px] mx-auto flex flex-col">
          {/* Logo & Tiêu đề */}
          <div className="flex flex-col items-center text-center mb-6 [@media(max-height:800px)_and_(min-width:900px)]:mb-3">
            <Link href="/" aria-label="Trang chủ VietVi" className="mb-3 inline-block">
              <Logo className="h-[28px] w-auto text-[#222325]" />
            </Link>
            <h1 className="text-[21px] font-bold text-[#404145] mb-1 leading-tight [@media(max-height:800px)_and_(min-width:900px)]:text-lg">
              Đăng nhập vào tài khoản
            </h1>
          </div>

          {/* Thông báo lỗi (Server Error alert) */}
          {displayError && (
            <div
              id="login-error-msg"
              role="alert"
              aria-live="polite"
              className="mb-4 p-3 text-[14px] font-medium text-[#f74040] bg-[rgba(247,64,64,0.1)] border border-[#f74040]/30 rounded-[8px] text-center"
            >
              {displayError}
            </div>
          )}

          {/* Nút Đăng nhập với Google (Chuẩn buttons radius: 8px, height: 44px) */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isSubmitting}
            className="w-full h-[44px] flex items-center justify-center gap-3 border border-[#c5c6c9] rounded-[8px] bg-white text-[#404145] font-semibold text-[15px] hover:bg-slate-50 hover:border-[#a0a2a6] transition-colors shadow-xs cursor-pointer disabled:opacity-60"
          >
            {/* Official Google 4-color SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Đăng Nhập Với Google</span>
          </button>

          {/* Đường kẻ chia tách HOẶC (Khoảng cách 20px chuẩn lưới 4px) */}
          <div className="relative my-5 [@media(max-height:800px)_and_(min-width:900px)]:my-2.5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#dadbdd]" />
            </div>
            <span className="relative bg-white px-3 text-[13px] font-medium text-[#74767e] uppercase tracking-wider">
              HOẶC
            </span>
          </div>

          {/* Form Đăng nhập truyền thống */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 [@media(max-height:800px)_and_(min-width:900px)]:gap-2.5" noValidate>
            {/* Ô nhập Email hoặc Tên đăng nhập (DDESIGN.md: inputs 12px radius, viền #c5c6c9, px-4) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-account" className="text-[14px] font-medium text-[#404145]">
                Email hoặc Tên đăng nhập
              </label>
              <input
                id="login-account"
                type="text"
                autoComplete="username"
                disabled={isSubmitting}
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Nhập email hoặc tên đăng nhập"
                aria-invalid={Boolean(displayError)}
                aria-describedby={displayError ? 'login-error-msg' : undefined}
                className="h-[44px] px-4 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
              />
            </div>

            {/* Ô nhập Mật khẩu (DDESIGN.md: inputs 12px radius, viền #c5c6c9, px-4) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-[14px] font-medium text-[#404145]">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  aria-invalid={Boolean(displayError)}
                  aria-describedby={displayError ? 'login-error-msg' : undefined}
                  className="w-full h-[44px] pl-4 pr-11 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74767e] hover:text-[#222325] cursor-pointer p-1 transition-colors"
                >
                  {showPassword ? (
                    /* Icon Eye-Off */
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    /* Icon Eye */
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Hàng Tiện ích: Ghi nhớ đăng nhập & Quên mật khẩu */}
            <div className="flex items-center justify-between text-[14px] pt-0.5">
              <label className="flex items-center gap-2 text-[#404145] font-normal cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] border-[#c5c6c9] text-[#1dbf73] focus:ring-[#1dbf73] cursor-pointer"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[#1dbf73] font-semibold hover:underline transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút bấm Đăng Nhập chính (Chuẩn buttons radius: 8px, height: 44px) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[44px] bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold text-[15px] rounded-[8px] transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center mt-2 shadow-xs"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          {/* Footer chuyển sang Đăng ký */}
          <p className="text-center text-[14px] font-normal text-[#74767e] mt-6 [@media(max-height:800px)_and_(min-width:900px)]:mt-3">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-[#1dbf73] font-semibold hover:underline">
              Tham gia ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
