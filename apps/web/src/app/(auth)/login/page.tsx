import { LoginScreen } from '@/features/auth/components/login-screen';
import { defaultLoginFixture } from '@/features/auth/fixtures/auth.fixtures';

export const metadata = {
  title: 'Đăng nhập vào tài khoản | VietVi',
  description: 'Đăng nhập vào VietVi để kết nối task và tìm kiếm chuyên gia freelance uy tín',
};

export default function LoginPage() {
  // TODO(integration): Thay thế fixture bằng API đăng nhập thật
  return <LoginScreen {...defaultLoginFixture} />;
}
