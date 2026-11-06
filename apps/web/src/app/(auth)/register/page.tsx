import { RegisterScreen } from '@/features/auth/components/register-screen';
import { defaultRegisterStep1Fixture } from '@/features/auth/fixtures/auth.fixtures';

export const metadata = {
  title: 'Tạo tài khoản mới | VietVi',
  description: 'Đăng ký tài khoản VietVi để nhận task freelance và sử dụng kỹ năng sinh viên hiệu quả',
};

export default function RegisterPage() {
  // TODO(integration): Thay thế fixture bằng API đăng ký 3 bước
  return <RegisterScreen {...defaultRegisterStep1Fixture} />;
}

