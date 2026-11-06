import type { HeaderUser } from './header.types';

// Fixture mặc định: 0 thông báo (khớp 100% ảnh tham khảo với Empty State)
export const defaultAuthenticatedUser: HeaderUser = {
  id: 'usr-vietvi-01',
  displayName: 'SpringNguyen',
  username: 'springnguyen',
  email: 'vietvi28062026@gmail.com',
  unreadNotifications: 0,
  unreadMessages: 1,
  isOnline: true,
};

// Fixture trạng thái có thông báo chưa đọc (để kiểm tra badge đỏ và danh sách)
export const userWithNotifications: HeaderUser = {
  ...defaultAuthenticatedUser,
  unreadNotifications: 3,
};
