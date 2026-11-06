'use client';

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from 'react';
import Link from 'next/link';
import { Logo } from '@vietvi/ui';
import { AuthBanner } from './auth-banner';
import type {
  RegisterStep,
  RegisterFormData,
  RegisterUIState,
} from '../types.placeholder';

export type RegisterScreenProps = {
  initialStep?: RegisterStep;
  state?: RegisterUIState;
  initialData?: Partial<RegisterFormData>;
  errorMessage?: string;
  onStep1Submit?: (data: { fullName: string; phone: string; email: string }) => void;
  onStep2Submit?: (data: { email: string; otpCode: string }) => void;
  onStep3Submit?: (data: { username: string; password?: string; confirmPassword?: string }) => void;
  onResendOtp?: (email: string) => void;
};

// Helper hiển thị: Ẩn bớt ký tự email (vd: abcdef@domain.com -> a****f@domain.com)
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email || 'bạn';
  const [local = '', domain = ''] = email.split('@');
  if (local.length <= 2) return `${local[0] ?? ''}*@${domain}`;
  const first = local[0] ?? '';
  const last = local[local.length - 1] ?? '';
  const stars = '*'.repeat(Math.max(4, local.length - 2));
  return `${first}${stars}${last}@${domain}`;
}

export function RegisterScreen({
  initialStep = 1,
  state = 'idle',
  initialData,
  errorMessage,
  onStep1Submit,
  onStep2Submit,
  onStep3Submit,
  onResendOtp,
}: RegisterScreenProps) {
  // Quản lý bước hiện tại (1: Hồ sơ, 2: Xác minh, 3: Tài khoản)
  const [currentStep, setCurrentStep] = useState<RegisterStep>(initialStep);

  // Form Step 1: Hồ sơ cá nhân
  const [fullName, setFullName] = useState(initialData?.fullName ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');

  // Form Step 2: OTP 6 số & Bộ đếm thời gian
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(58);
  const [canResend, setCanResend] = useState(false);
  const [resendTrigger, setResendTrigger] = useState(0);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Form Step 3: Tài khoản & Mật khẩu
  const [username, setUsername] = useState(initialData?.username ?? '');
  const [password, setPassword] = useState(initialData?.password ?? '');
  const [confirmPassword, setConfirmPassword] = useState(initialData?.confirmPassword ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSuccess, setIsSuccess] = useState(state === 'success');
  const isSubmitting = state === 'submitting';
  const displayError = errorMessage;

  // Đồng bộ Props -> State khi fixture hoặc dữ liệu bên ngoài thay đổi (TD-05)
  useEffect(() => {
    if (initialStep) setCurrentStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    if (initialData?.fullName !== undefined) setFullName(initialData.fullName);
    if (initialData?.phone !== undefined) setPhone(initialData.phone);
    if (initialData?.email !== undefined) setEmail(initialData.email);
    if (initialData?.username !== undefined) setUsername(initialData.username);
    if (initialData?.password !== undefined) setPassword(initialData.password);
    if (initialData?.confirmPassword !== undefined) setConfirmPassword(initialData.confirmPassword);
  }, [initialData]);

  useEffect(() => {
    setIsSuccess(state === 'success');
  }, [state]);

  // Bộ đếm thời gian gửi lại mã OTP (TD-01: Kích hoạt lại khi bấm gửi lại)
  useEffect(() => {
    if (currentStep !== 2) return;
    setCanResend(false);
    setResendCountdown(58);

    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, resendTrigger]);

  // Xử lý gửi Step 1: Hồ sơ (Không tự đặt luật validation - BE đảm nhận)
  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();

    onStep1Submit?.({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
    // TODO(integration): Nối API POST /auth/register/start (gửi OTP tới email)
    setCurrentStep(2);
  };

  // Xử lý OTP: Thay đổi ký tự từng ô
  const handleOtpChange = (index: number, value: string) => {
    const numValue = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = numValue.slice(-1);
    setOtp(newOtp);

    if (numValue && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Xử lý OTP: Phím Backspace & Mũi tên điều hướng
  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Xử lý OTP: Dán chuỗi 6 ký tự
  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (!pastedData) return;

    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);

    const nextFocusIndex = Math.min(digits.length, 5);
    otpInputsRef.current[nextFocusIndex]?.focus();
  };

  // Xử lý gửi Step 2: Xác minh OTP (Không tự đặt luật validation - BE đảm nhận)
  const handleStep2Submit = (e: FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join('');
    onStep2Submit?.({
      email: email.trim(),
      otpCode,
    });
    // TODO(integration): Nối API POST /auth/register/verify-otp
    setCurrentStep(3);
  };

  // Gửi lại mã OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTrigger((prev) => prev + 1);
    onResendOtp?.(email.trim());
    // TODO(integration): Nối API POST /auth/register/resend-otp
  };

  // Xử lý gửi Step 3: Hoàn tất đăng ký (Không tự đặt luật validation - BE đảm nhận)
  const handleStep3Submit = (e: FormEvent) => {
    e.preventDefault();

    onStep3Submit?.({
      username: username.trim(),
      password,
      confirmPassword,
    });
    // TODO(integration): Nối API POST /auth/register/complete
    setIsSuccess(true);
  };

  return (
    <div className="w-full max-w-[1100px] bg-white rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden grid grid-cols-1 min-[900px]:grid-cols-[55%_45%]">
      {/* CỘT TRÁI: Dùng chung AuthBanner (TD-04: Loại bỏ code trùng lặp) */}
      <AuthBanner />

      {/* CỘT PHẢI: Form Đăng ký 3 bước */}
      <div className="p-6 sm:p-8 min-[900px]:p-10 xl:p-12 [@media(max-height:800px)_and_(min-width:900px)]:py-6 [@media(max-height:800px)_and_(min-width:900px)]:px-8 flex flex-col justify-center">
        {/* Khung nội bộ giới hạn chiều rộng max-w-[380px] để form luôn cân đối đồng bộ Login (TD-03) */}
        <div className="w-full max-w-[380px] mx-auto flex flex-col">
          {/* Logo & Tiêu đề */}
          <div className="flex flex-col items-center text-center mb-4 [@media(max-height:800px)_and_(min-width:900px)]:mb-2">
            <Link href="/" aria-label="Trang chủ VietVi" className="mb-2 inline-block">
              <Logo className="h-[28px] w-auto text-[#222325]" />
            </Link>

            <h1 className="text-[21px] font-bold text-[#404145] mb-[2px] leading-tight [@media(max-height:800px)_and_(min-width:900px)]:text-lg">
              {isSuccess
                ? 'Đăng ký thành công!'
                : currentStep === 1
                  ? 'Create a new account'
                  : currentStep === 2
                    ? 'Kiểm tra email của bạn'
                    : 'Tạo thông tin đăng nhập'}
            </h1>
          </div>

          {/* ============================================================== */}
          {/* THANH TIẾN TRÌNH STEPPER (Chuẩn prototype ảnh 1, 2, 3) */}
          {/* ============================================================== */}
          {!isSuccess && (
            <div className="w-full max-w-[340px] mx-auto mb-6">
              <div className="flex items-center justify-between relative">
                {/* Line 1 - 2 */}
                <div
                  className={`absolute top-[14px] left-[15%] right-[50%] h-[2px] -z-0 transition-colors duration-300 ${
                    currentStep >= 2 ? 'bg-[#1dbf73]' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
                {/* Line 2 - 3 */}
                <div
                  className={`absolute top-[14px] left-[50%] right-[15%] h-[2px] -z-0 transition-colors duration-300 ${
                    currentStep >= 3 ? 'bg-[#1dbf73]' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />

                {/* Step 1 Item */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex flex-col items-center relative z-10 group cursor-pointer focus:outline-none"
                  aria-current={currentStep === 1 ? 'step' : undefined}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep >= 1
                        ? 'bg-[#1dbf73] text-white shadow-xs'
                        : 'bg-slate-100 text-[#74767e] border border-slate-300'
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`text-[0.75rem] font-medium mt-1.5 transition-colors ${
                      currentStep >= 1 ? 'text-[#1dbf73] font-semibold' : 'text-[#74767e]'
                    }`}
                  >
                    Hồ sơ
                  </span>
                </button>

                {/* Step 2 Item */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex flex-col items-center relative z-10 group cursor-pointer focus:outline-none"
                  aria-current={currentStep === 2 ? 'step' : undefined}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep >= 2
                        ? 'bg-[#1dbf73] text-white shadow-xs'
                        : 'bg-slate-100 text-[#74767e] border border-slate-200'
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`text-[0.75rem] font-medium mt-1.5 transition-colors ${
                      currentStep >= 2 ? 'text-[#1dbf73] font-semibold' : 'text-[#74767e]'
                    }`}
                  >
                    Xác minh
                  </span>
                </button>

                {/* Step 3 Item */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex flex-col items-center relative z-10 group cursor-pointer focus:outline-none"
                  aria-current={currentStep === 3 ? 'step' : undefined}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep >= 3
                        ? 'bg-[#1dbf73] text-white shadow-xs'
                        : 'bg-slate-100 text-[#74767e] border border-slate-200'
                    }`}
                  >
                    3
                  </div>
                  <span
                    className={`text-[0.75rem] font-medium mt-1.5 transition-colors ${
                      currentStep >= 3 ? 'text-[#1dbf73] font-semibold' : 'text-[#74767e]'
                    }`}
                  >
                    Tài khoản
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Thông báo lỗi BE trả về (TD-02: A11y Alert) */}
          {displayError && (
            <div
              id="register-error-msg"
              role="alert"
              aria-live="polite"
              className="mb-4 p-3 text-[14px] font-medium text-[#f74040] bg-[rgba(247,64,64,0.1)] border border-[#f74040]/30 rounded-[8px] text-center"
            >
              {displayError}
            </div>
          )}

          {/* ============================================================== */}
          {/* TRẠNG THÁI HOÀN TẤT THÀNH CÔNG */}
          {/* ============================================================== */}
          {isSuccess ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 bg-[#1dbf73]/15 text-[#1dbf73] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-[1.25rem] font-bold text-[#404145] mb-2">
                Chào mừng bạn gia nhập VietVi!
              </h3>
              <p className="text-[0.875rem] text-[#74767e] mb-6 max-w-[320px]">
                Tài khoản của bạn đã được khởi tạo thành công. Bạn có thể đăng nhập và bắt đầu trải nghiệm ngay bây giờ.
              </p>
              <Link
                href="/login"
                className="w-full h-[44px] flex items-center justify-center bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold text-[1rem] rounded-[8px] transition-colors shadow-xs"
              >
                Đăng nhập ngay
              </Link>
            </div>
          ) : currentStep === 1 ? (
            /* ============================================================== */
            /* BƯỚC 1: HỒ SƠ CÁ NHÂN (Prototype Ảnh 1) */
            /* ============================================================== */
            <form onSubmit={handleStep1Submit} className="flex flex-col gap-4" noValidate>
              {/* Họ và Tên */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-fullname" className="text-[14px] font-medium text-[#404145]">
                  Họ và Tên
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  autoComplete="name"
                  disabled={isSubmitting}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  aria-invalid={Boolean(displayError)}
                  aria-describedby={displayError ? 'register-error-msg' : undefined}
                  className="h-[44px] px-4 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
                />
              </div>

              {/* Số điện thoại */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-phone" className="text-[14px] font-medium text-[#404145]">
                  Số điện thoại
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  aria-invalid={Boolean(displayError)}
                  aria-describedby={displayError ? 'register-error-msg' : undefined}
                  className="h-[44px] px-4 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-email" className="text-[14px] font-medium text-[#404145]">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  aria-invalid={Boolean(displayError)}
                  aria-describedby={displayError ? 'register-error-msg' : undefined}
                  className="h-[44px] px-4 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
                />
              </div>

              {/* Nút Tiếp tục */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[44px] mt-2 bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold text-[15px] rounded-[8px] transition-colors shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Đang gửi...' : 'Tiếp tục'}
              </button>

              {/* Link Đăng nhập */}
              <div className="text-center text-[14px] text-[#74767e] mt-2">
                <span>Đã có tài khoản? </span>
                <Link href="/login" className="text-[#1dbf73] font-semibold hover:underline">
                  Đăng nhập
                </Link>
              </div>
            </form>
          ) : currentStep === 2 ? (
            /* ============================================================== */
            /* BƯỚC 2: XÁC MINH OTP (Prototype Ảnh 2) */
            /* ============================================================== */
            <form onSubmit={handleStep2Submit} className="flex flex-col items-center" noValidate>
              <p className="text-[14px] text-[#74767e] text-center mb-6 max-w-[320px]">
                Mã OTP đã được gửi đến{' '}
                <span className="font-semibold text-[#404145]">{maskEmail(email)}</span>
              </p>

              {/* Cụm 6 ô PIN OTP */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-4 w-full">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    disabled={isSubmitting}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    aria-label={`Ký tự OTP số ${idx + 1}`}
                    aria-invalid={Boolean(displayError)}
                    aria-describedby={displayError ? 'register-error-msg' : undefined}
                    className="w-10 h-12 sm:w-11 sm:h-12 text-center text-xl font-bold rounded-[8px] border border-[#c5c6c9] text-[#222325] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-all disabled:bg-slate-50"
                  />
                ))}
              </div>

              {/* Thông báo thời hạn OTP */}
              <p className="text-[13px] text-[#74767e] mb-6">
                Mã OTP có hiệu lực trong 2 phút.
              </p>

              {/* Nút Xác minh email */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[44px] bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold text-[15px] rounded-[8px] transition-colors shadow-xs cursor-pointer disabled:opacity-60 mb-4"
              >
                {isSubmitting ? 'Đang xác minh...' : 'Xác minh email'}
              </button>

              {/* Đếm ngược gửi lại mã */}
              <div className="text-center text-[14px] text-[#74767e]">
                <span>Chưa nhận được mã? </span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#1dbf73] font-semibold hover:underline cursor-pointer"
                  >
                    Gửi lại mã
                  </button>
                ) : (
                  <span className="text-[#74767e] font-medium">
                    Gửi lại mã ({resendCountdown}s)
                  </span>
                )}
              </div>
            </form>
          ) : (
            /* ============================================================== */
            /* BƯỚC 3: TẠO THÔNG TIN ĐĂNG NHẬP (Prototype Ảnh 3) */
            /* ============================================================== */
            <form onSubmit={handleStep3Submit} className="flex flex-col gap-4" noValidate>
              {/* Tên tài khoản */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-username" className="text-[14px] font-medium text-[#404145]">
                  Tên tài khoản
                </label>
                <input
                  id="reg-username"
                  type="text"
                  autoComplete="username"
                  disabled={isSubmitting}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  aria-invalid={Boolean(displayError)}
                  aria-describedby={displayError ? 'register-error-msg' : undefined}
                  className="h-[44px] px-4 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
                />
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-password" className="text-[14px] font-medium text-[#404145]">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    aria-invalid={Boolean(displayError)}
                    aria-describedby={displayError ? 'register-error-msg' : undefined}
                    className="w-full h-[44px] pl-4 pr-11 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74767e] hover:text-[#222325] cursor-pointer p-1 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
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

              {/* Xác nhận mật khẩu */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-confirm-password" className="text-[14px] font-medium text-[#404145]">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    aria-invalid={Boolean(displayError)}
                    aria-describedby={displayError ? 'register-error-msg' : undefined}
                    className="w-full h-[44px] pl-4 pr-11 text-[15px] font-normal rounded-[12px] border border-[#c5c6c9] text-[#222325] placeholder:text-[#74767e] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-colors disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74767e] hover:text-[#222325] cursor-pointer p-1 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
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

              {/* Nút Hoàn tất đăng ký */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[44px] mt-2 bg-[#1dbf73] hover:bg-[#19a463] text-white font-semibold text-[15px] rounded-[8px] transition-colors shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'Đang hoàn tất...' : 'Hoàn tất đăng ký'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
