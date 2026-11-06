// PLACEHOLDER — thay bằng kiểu từ packages/contracts khi BE publish OpenAPI (SDD §3.39 & §2.9)

export type NotificationType =
  | 'OFFER_RECEIVED'
  | 'OFFER_ACCEPTED'
  | 'ORDER_DELIVERED'
  | 'ORDER_REVISION_REQUESTED'
  | 'ORDER_COMPLETED'
  | 'PAYMENT_HELD'
  | 'VERIFICATION_APPROVED'
  | 'SYSTEM';

export type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  entityType?: 'task' | 'offer' | 'order' | 'verification' | 'system';
  entityId?: string;
  readAt?: string | null; // ISO string nếu đã đọc, null nếu chưa đọc
  createdAt: string; // ISO string
};

export type NotificationUIState = 'idle' | 'loading' | 'empty' | 'error';
