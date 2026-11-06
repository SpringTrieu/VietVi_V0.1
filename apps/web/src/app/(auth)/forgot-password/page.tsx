import { ForgotPasswordScreen } from '@/features/auth/components/forgot-password-screen';
import { defaultForgotPasswordFixture } from '@/features/auth/fixtures/auth.fixtures';

export const metadata = {
  title: 'Đặt lại mật khẩu | VietVi',
  description: 'Khôi phục mật khẩu tài khoản VietVi an toàn và nhanh chóng qua liên kết email',
};

export default function ForgotPasswordPage() {
  // TODO(integration): Thay thế fixture bằng API gửi link đặt lại mật khẩu thật
  return <ForgotPasswordScreen {...defaultForgotPasswordFixture} />;
}
