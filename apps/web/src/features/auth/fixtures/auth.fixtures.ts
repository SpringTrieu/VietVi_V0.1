import type {
  LoginFormData,
  LoginUIState,
  RegisterFormData,
  RegisterStep,
  RegisterUIState,
  ForgotPasswordData,
  ForgotPasswordUIState,
} from '../types.placeholder';

// ==========================================
// 1. LOGIN FIXTURES
// ==========================================

export type LoginScreenFixture = {
  state?: LoginUIState;
  initialData?: Partial<LoginFormData>;
  errorMessage?: string;
};

// Fixture L1: Mặc định — Form sẵn sàng nhập
export const defaultLoginFixture: LoginScreenFixture = {
  state: 'idle',
  initialData: {
    account: '',
    password: '',
    rememberMe: false,
  },
};

// Fixture L2: Đang gửi yêu cầu đăng nhập (Chống bấm đúp)
export const submittingLoginFixture: LoginScreenFixture = {
  state: 'submitting',
  initialData: {
    account: 'nguyen.van.a@fpt.edu.vn',
    password: '••••••••••',
    rememberMe: true,
  },
};

// Fixture L3: Đăng nhập thất bại (sai tài khoản hoặc mật khẩu)
export const errorLoginFixture: LoginScreenFixture = {
  state: 'error',
  initialData: {
    account: 'student.hust@gmail.com',
  },
  errorMessage: 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.',
};

// ==========================================
// 2. REGISTER 3-STEP FIXTURES
// ==========================================

export type RegisterScreenFixture = {
  initialStep?: RegisterStep;
  state?: RegisterUIState;
  initialData?: Partial<RegisterFormData>;
  errorMessage?: string;
};

// Fixture R1: Mặc định — Bước 1: Hồ sơ cá nhân sẵn sàng nhập
export const defaultRegisterStep1Fixture: RegisterScreenFixture = {
  initialStep: 1,
  state: 'idle',
  initialData: {
    fullName: '',
    phone: '',
    email: '',
  },
};

// Fixture R2: Bước 2: Xác minh OTP (Email đã gửi, đếm ngược 120s)
export const defaultRegisterStep2Fixture: RegisterScreenFixture = {
  initialStep: 2,
  state: 'idle',
  initialData: {
    fullName: 'Trần Minh Triệu',
    phone: '0987654321',
    email: 'trieu.tran@gmail.com',
    otpCode: '',
  },
};

// Fixture R3: Bước 3: Tạo thông tin đăng nhập (Tài khoản & Mật khẩu)
export const defaultRegisterStep3Fixture: RegisterScreenFixture = {
  initialStep: 3,
  state: 'idle',
  initialData: {
    fullName: 'Trần Minh Triệu',
    phone: '0987654321',
    email: 'trieu.tran@gmail.com',
    username: 'trieutran',
    password: '',
    confirmPassword: '',
  },
};

// Fixture R4: Bước 1 đang gửi yêu cầu (Submitting)
export const submittingRegisterFixture: RegisterScreenFixture = {
  initialStep: 1,
  state: 'submitting',
  initialData: {
    fullName: 'Trần Minh Triệu',
    phone: '0987654321',
    email: 'trieu.tran@gmail.com',
  },
};

// Fixture R5: Bước 1 bị trùng Email (409 Conflict)
export const errorEmailExistsRegisterFixture: RegisterScreenFixture = {
  initialStep: 1,
  state: 'error',
  initialData: {
    fullName: 'Nguyễn Văn Nam',
    phone: '0912345678',
    email: 'nam.nguyen@fpt.edu.vn',
  },
  errorMessage: 'Email này đã được đăng ký tài khoản. Vui lòng đăng nhập hoặc sử dụng email khác.',
};

// Fixture R6: Bước 2 nhập sai OTP (400 OTP_INVALID)
export const errorOtpRegisterFixture: RegisterScreenFixture = {
  initialStep: 2,
  state: 'error',
  initialData: {
    fullName: 'Trần Minh Triệu',
    phone: '0987654321',
    email: 'trieu.tran@gmail.com',
    otpCode: '123456',
  },
  errorMessage: 'Mã OTP không chính xác hoặc đã hết hiệu lực. Vui lòng kiểm tra lại (bạn còn 4 lần thử).',
};

// Fixture R7: Bước 3 tên tài khoản đã tồn tại (409 Conflict)
export const errorUsernameExistsRegisterFixture: RegisterScreenFixture = {
  initialStep: 3,
  state: 'error',
  initialData: {
    fullName: 'Trần Minh Triệu',
    phone: '0987654321',
    email: 'trieu.tran@gmail.com',
    username: 'admin',
    password: 'password123',
    confirmPassword: 'password123',
  },
  errorMessage: 'Tên tài khoản này đã có người sử dụng. Vui lòng chọn một tên tài khoản khác.',
};

// ==========================================
// 3. FORGOT PASSWORD FIXTURES (RESET LINK PROTOTYPE)
// ==========================================

export type ForgotPasswordScreenFixture = {
  state?: ForgotPasswordUIState;
  initialData?: Partial<ForgotPasswordData>;
  errorMessage?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  backLinkText?: string;
};

// Fixture F1: Mặc định — Form nhập email sẵn sàng
export const defaultForgotPasswordFixture: ForgotPasswordScreenFixture = {
  state: 'idle',
  initialData: {
    email: '',
  },
};

// Alias tương thích với route page hiện tại
export const defaultForgotPasswordStep1Fixture = defaultForgotPasswordFixture;

// Fixture F2: Đang gửi yêu cầu (Submitting)
export const submittingForgotPasswordFixture: ForgotPasswordScreenFixture = {
  state: 'submitting',
  initialData: {
    email: 'trieu.tran@gmail.com',
  },
};

// Fixture F3: Đã gửi liên kết thành công (Success state)
export const successForgotPasswordFixture: ForgotPasswordScreenFixture = {
  state: 'success',
  initialData: {
    email: 'trieu.tran@gmail.com',
  },
};

// Fixture F4: Lỗi không tìm thấy email (404)
export const errorForgotPasswordFixture: ForgotPasswordScreenFixture = {
  state: 'error',
  initialData: {
    email: 'unknown.user@domain.com',
  },
  errorMessage: 'Không tìm thấy tài khoản nào liên kết với địa chỉ email này.',
};
