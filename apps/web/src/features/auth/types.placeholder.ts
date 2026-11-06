// PLACEHOLDER — thay bằng kiểu từ packages/contracts khi BE publish OpenAPI

// --- ĐĂNG NHẬP (LOGIN) ---
export type LoginFormData = {
  account: string;
  password?: string;
  rememberMe?: boolean;
};

export type LoginUIState = 'idle' | 'submitting' | 'error';

// --- ĐĂNG KÝ 3 BƯỚC (REGISTER) ---
export type RegisterStep = 1 | 2 | 3;

export type RegisterPersonalInfoData = {
  fullName: string;
  phone: string;
  email: string;
};

export type RegisterOtpData = {
  email: string;
  otpCode: string;
};

export type RegisterCredentialsData = {
  username: string;
  password?: string;
  confirmPassword?: string;
};

export type RegisterFormData = RegisterPersonalInfoData & {
  otpCode?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};

export type RegisterUIState = 'idle' | 'submitting' | 'error' | 'success';

// --- QUÊN MẬT KHẨU (FORGOT PASSWORD / RESET LINK) ---
export type ForgotPasswordStep = 1 | 2;

export type ForgotPasswordData = {
  email: string;
  otpCode?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export type ForgotPasswordUIState = 'idle' | 'submitting' | 'error' | 'success';

// --- MÃ LỖI CHUẨN XÁC THỰC (SDD §1.2.1) ---
export type AuthErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'RATE_LIMITED'
  | 'AUTH_REQUIRED'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'EMAIL_EXISTS'
  | 'USERNAME_EXISTS'
  | 'INTERNAL_ERROR';
