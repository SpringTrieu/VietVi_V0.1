import { DashboardScreen } from '@/features/dashboard/components/dashboard-screen';
import { defaultDashboardFixture } from '@/features/dashboard/fixtures/dashboard.fixtures';

export const metadata = {
  title: 'Dashboard | VietVi',
  description: 'Trang quản trị và làm việc của người dùng VietVi',
};

export default function DashboardPage() {
  // TODO(integration): thay fixture bằng dữ liệu thật từ BE
  return <DashboardScreen {...defaultDashboardFixture} />;
}

