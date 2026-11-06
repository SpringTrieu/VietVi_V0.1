import type { NotificationItem } from '../types.placeholder';

export type NotificationDropdownFixture = {
  unreadCount: number;
  soundEnabled: boolean;
  items: NotificationItem[];
};

// Fixture 1: Trạng thái trống (Khớp 100% với ảnh tham khảo - 0 thông báo)
export const emptyNotificationsFixture: NotificationDropdownFixture = {
  unreadCount: 0,
  soundEnabled: true,
  items: [],
};

// Fixture 2: Trạng thái có thông báo thực tế của sinh viên (SDD §2.9 & §3.39)
export const populatedNotificationsFixture: NotificationDropdownFixture = {
  unreadCount: 3,
  soundEnabled: true,
  items: [
    {
      id: 'notif-001',
      userId: 'usr-101',
      type: 'OFFER_RECEIVED',
      title: 'Chào giá mới cho Task của bạn',
      body: 'Bạn Minh Trang (ĐH Bách Khoa) vừa gửi đề xuất 450.000 ₫ cho bài tập lớn Python.',
      entityType: 'offer',
      entityId: 'ofr-901',
      readAt: null,
      createdAt: '2026-11-06T06:15:00.000Z',
    },
    {
      id: 'notif-002',
      userId: 'usr-101',
      type: 'ORDER_DELIVERED',
      title: 'Tasker đã bàn giao sản phẩm',
      body: 'Đơn hàng #ORD-882 thiết kế slide Canva đã nộp bản giao nghiệm thu.',
      entityType: 'order',
      entityId: 'ord-882',
      readAt: null,
      createdAt: '2026-11-06T04:30:00.000Z',
    },
    {
      id: 'notif-003',
      userId: 'usr-101',
      type: 'VERIFICATION_APPROVED',
      title: 'Hồ sơ sinh viên đã được xác minh',
      body: 'Chúc mừng! Thẻ sinh viên ĐH Kinh Tế Quốc Dân (NEU) của bạn đã được phê duyệt tick xanh.',
      entityType: 'verification',
      entityId: 'ver-301',
      readAt: null,
      createdAt: '2026-11-05T14:20:00.000Z',
    },
    {
      id: 'notif-004',
      userId: 'usr-101',
      type: 'PAYMENT_HELD',
      title: 'Ký quỹ thành công',
      body: 'Khoản tiền 600.000 ₫ cho đơn hàng #ORD-771 đã được giữ an toàn trong Escrow.',
      entityType: 'order',
      entityId: 'ord-771',
      readAt: '2026-11-05T10:00:00.000Z',
      createdAt: '2026-11-05T09:45:00.000Z',
    },
  ],
};
