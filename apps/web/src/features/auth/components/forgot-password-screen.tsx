'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { Logo } from '@vietvi/ui';
import { AuthBanner } from './auth-banner';
import type {
  ForgotPasswordData,
  ForgotPasswordUIState,
} from '../types.placeholder';

export type ForgotPasswordScreenProps = {
  state?: ForgotPasswordUIState;
  initialData?: Partial<ForgotPasswordData>;
  errorMessage?: string;
  onSubmit?: (data: ForgotPasswordData) => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  backLinkText?: string;
};

export function ForgotPasswordScreen({
  state = 'idle',
  initialData,
  errorMessage,
  onSubmit,
  title = 'Đặt lại mật khẩu',
  subtitle = 'Nhập email của bạn để nhận liên kết đặt lại mật khẩu.',
  buttonText = 'Gửi liên kết đặt lại',
  backLinkText = '← Quay lại đăng nhập',
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [isSuccess, setIsSuccess] = useState(state === 'success');

  const isSubmitting = state === 'submitting';
  const displayError = errorMessage;

  useEffect(() => {
    if (initialData?.email !== undefined) setEmail(initialData.email);
  }, [initialData]);

  useEffect(() => {
    setIsSuccess(state === 'success');
  }, [state]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Không tự đặt luật validation - BE đảm nhận theo yêu cầu người dùng & AGENTS.md
    onSubmit?.({
      email: email.trim(),
    });
    // TODO(integration): Nối API POST /auth/password/forgot (gửi link đặt lại mật khẩu)
    setIsSuccess(true);
  };

  return (
    <div className="w-full max-w-[1100px] bg-white rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden grid grid-cols-1 min-[900px]:grid-cols-[55%_45%]">
      {/* CỘT TRÁI: Dùng chung AuthBanner (chuẩn DDESIGN.md) */}
      <AuthBanner />

      {/* CỘT PHẢI: Form Đặt lại mật khẩu (Prototype Reset password) */}
      <div className="p-6 sm:p-8 min-[900px]:p-10 xl:p-12 [@media(max-height:800px)_and_(min-width:900px)]:py-6 [@media(max-height:800px)_and_(min-width:900px)]:px-8 flex flex-col justify-center">
        {/* Khung nội bộ giới hạn chiều rộng max-w-[380px] để form luôn cân đối đồng bộ Login */}
        <div className="w-full max-w-[380px] mx-auto flex flex-col">
          {/* Logo & Tiêu đề */}
          <div className="flex flex-col items-center text-center mb-6 [@media(max-height:800px)_and_(min-width:900px)]:mb-3">
            <Link href="/" aria-label="Trang chủ VietVi" className="mb-3 inline-block">
              <Logo className="h-[28px] w-auto text-[#222325]" />
            </Link>

            <h1 className="text-[21px] font-bold text-[#404145] mb-1.5 leading-tight [@media(max-height:800px)_and_(min-width:900px)]:text-lg">
              {isSuccess ? 'Kiểm tra email của bạn' : title}
            </h1>

            {!isSuccess && (
              <p className="text-[14px] text-[#74767e] text-center leading-normal">
                {subtitle}
              </p>
            )}
          </div>

          {/* Thông báo lỗi (Server Error alert) */}
          {displayError && (
            <div
              id="reset-error-msg"
              role="alert"
              aria-live="polite"
              className="mb-4 p-3 text-[14px] font-medium text-[#f74040] bg-[rgba(247,64,64,0.1)] border border-[#f74040]/30 rounded-[8px] text-center"
            >
              {displayError}
            </div>
          )}

          {/* ============================================================== */}
          {/* TRẠNG THÁI GỬI THÀNH CÔNG (Success State) */}
          {/* ============================================================== */}
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 bg-[#1dbf73]/15 text-[#1dbf73] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[14px] text-[#404145] mb-6 leading-relaxed">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{' '}
                <span className="font-semibold text-[#222325]">{email || 'email của bạn'}</span>.
                Vui lòng kiểm tra hộp thư đến (và thư mục rác nếu cần).
              </p>

              <Link
                href="/login"
                className="w-full h-[44px] flex items-center justify-center bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold text-[15px] rounded-[8px] transition-colors shadow-xs"
              >
                Đăng nhập ngay
              </Link>

              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-[14px] text-[#74767e] hover:text-[#1dbf73] font-medium mt-4 transition-colors cursor-pointer"
              >
                Gửi lại liên kết khác
              </button>
            </div>
          ) : (
            /* ============================================================== */
            /* FORM NHẬP EMAIL GỬI LIÊN KẾT ĐẶT LẠI MẬT KHẨU */
            /* ============================================================== */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Ô nhập Email (DDESIGN.md: inputs 12px radius, viền #c5c6c9, px-4) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reset-email" className="text-[14px] font-medium text-[#404145]">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-invalid={Boolean(displayError)}
                  aria-describedby={displayError ? 'reset-error-msg' : undefined}
                  className="h-[44px] px-4 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
                />
              </div>

              {/* Nút bấm Gửi liên kết (DDESIGN.md: buttons 8px radius, màu #1dbf73) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[44px] bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold text-[15px] rounded-[8px] transition-colors shadow-xs cursor-pointer disabled:opacity-60 flex items-center justify-center mt-2"
              >
                {isSubmitting ? 'Đang gửi...' : buttonText}
              </button>

              {/* Link Quay lại đăng nhập (DDESIGN.md: Ghost link màu #1dbf73) */}
              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-[#1dbf73] font-semibold text-[14px] hover:underline transition-colors inline-block"
                >
                  {backLinkText}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
