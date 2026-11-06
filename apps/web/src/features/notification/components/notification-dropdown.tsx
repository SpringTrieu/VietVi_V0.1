'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Volume2,
  VolumeX,
  Settings,
  CheckCheck,
  Briefcase,
  FileText,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@vietvi/ui';
import type { NotificationItem } from '../types.placeholder';
import { emptyNotificationsFixture } from '../fixtures/notification.fixtures';

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items?: NotificationItem[];
  unreadCount?: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
}

/**
 * Minh họa chú chó ngủ trên hộp (Line-art illustration chuẩn theo ảnh tham khảo)
 */
function SleepingDogIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Thùng carton / Hộp đựng */}
      <rect
        x="36"
        y="65"
        width="88"
        height="55"
        rx="2"
        stroke="#222325"
        strokeWidth="2.5"
        fill="#FFFFFF"
      />
      <rect
        x="68"
        y="72"
        width="24"
        height="6"
        rx="1.5"
        stroke="#222325"
        strokeWidth="2"
        fill="none"
      />

      {/* Thân chú chó nằm ngủ phía trên hộp */}
      <path
        d="M 32 65 C 28 46, 50 36, 75 37 C 92 38, 105 45, 115 54 C 122 60, 126 65, 126 65 L 32 65 Z"
        fill="#FFFFFF"
        stroke="#222325"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Đốm đen lớn trên lưng */}
      <path
        d="M 38 65 C 36 50, 48 41, 60 41 C 66 41, 70 48, 64 65 Z"
        fill="#222325"
      />

      {/* Đầu chú chó */}
      <path
        d="M 102 46 C 108 42, 118 43, 124 50 C 128 54, 128 62, 120 64 C 114 65, 106 63, 100 58 Z"
        fill="#FFFFFF"
        stroke="#222325"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Tai chó (màu đen rủ xuống) */}
      <path
        d="M 106 46 C 112 43, 120 45, 122 55 C 120 62, 114 60, 108 52 Z"
        fill="#222325"
      />

      {/* Mũi & Mắt nhắm ngủ */}
      <circle cx="123" cy="56" r="2" fill="#222325" />
      <path
        d="M 112 53 Q 115 55 118 53"
        stroke="#222325"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Chân trước & Đuôi */}
      <path
        d="M 98 65 C 98 69, 106 69, 106 65"
        stroke="#222325"
        strokeWidth="2"
        strokeLinecap="round"
        fill="#FFFFFF"
      />
      <path
        d="M 33 63 C 29 61, 26 63, 27 65"
        stroke="#222325"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NotificationDropdown({
  isOpen,
  onClose,
  items = emptyNotificationsFixture.items,
  unreadCount = emptyNotificationsFixture.unreadCount,
  soundEnabled = emptyNotificationsFixture.soundEnabled,
  onToggleSound,
  onMarkRead,
  onMarkAllRead,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSoundOn, setIsSoundOn] = useState(soundEnabled);
  const displayCount = items.length === 0 ? 0 : (unreadCount ?? items.filter((i) => !i.readAt).length);

  // Xử lý bật/tắt âm thanh cục bộ
  const handleToggleSound = () => {
    setIsSoundOn((prev) => !prev);
    onToggleSound?.();
    // TODO(integration): Nối API PUT /notifications/preferences (SDD §2.9.5)
  };

  // Đóng khi click ra ngoài hoặc nhấn phím ESC (chuẩn a11y)
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      role="dialog"
      aria-label="Khung thông báo"
      className="absolute right-0 top-full mt-2 w-[320px] bg-white rounded-[12px] border border-[#dadbdd] shadow-[0_8px_24px_rgba(0,0,0,0.1)] z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Tam giác chỉ hướng (Mũi tên chỉ về icon chuông) */}
      <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-[#dadbdd] rotate-45" />

      {/* 1. Header Khung thông báo: Bell icon + Notifications (0) */}
      <div className="relative px-3.5 py-2.5 border-b border-[#dadbdd] bg-white flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-[#222325]" />
          <h3 className="text-[13px] font-bold text-[#222325]">
            Notifications ({displayCount})
          </h3>
        </div>

        {displayCount > 0 && (
          <button
            type="button"
            onClick={() => {
              onMarkAllRead?.();
              // TODO(integration): Nối API POST /notifications/read-all (SDD §2.9.4)
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1dbf73] hover:underline cursor-pointer"
          >
            <CheckCheck className="w-3 h-3" />
            <span>Đọc tất cả</span>
          </button>
        )}
      </div>

      {/* 2. Thân Khung thông báo: Empty State hoặc Danh sách */}
      <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
        {items.length === 0 ? (
          /* TRẠNG THÁI TRỐNG (EMPTY STATE - KHỚP 100% ẢNH THAM KHẢO) */
          <div className="py-7 px-4 flex flex-col items-center justify-center text-center">
            {/* Minh họa chú chó ngủ trên hộp tinh gọn */}
            <div className="w-24 h-20 mb-3 flex items-center justify-center">
              <SleepingDogIllustration className="w-full h-full" />
            </div>

            <h4 className="text-[14px] font-bold text-[#222325] mb-1 leading-snug">
              No Notifications...yet
            </h4>
            <p className="text-[12px] text-[#74767e] leading-relaxed max-w-[210px]">
              The more you do out there, the more you&apos;ll see in here.
            </p>
          </div>
        ) : (
          /* TRẠNG THÁI CÓ THÔNG BÁO (LIST STATE) */
          <div className="divide-y divide-slate-100">
            {items.map((item) => {
              const isUnread = !item.readAt;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onMarkRead?.(item.id);
                    // TODO(integration): Nối API PATCH /notifications/:id/read (SDD §2.9.4)
                  }}
                  className={cn(
                    'p-3 flex items-start gap-2.5 transition-colors cursor-pointer',
                    isUnread
                      ? 'bg-slate-50/70 hover:bg-slate-100/70'
                      : 'bg-white hover:bg-slate-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      item.type === 'OFFER_RECEIVED'
                        ? 'bg-blue-50 text-blue-600'
                        : item.type === 'ORDER_DELIVERED'
                          ? 'bg-amber-50 text-amber-600'
                          : item.type === 'VERIFICATION_APPROVED'
                            ? 'bg-[#1dbf73]/10 text-[#1dbf73]'
                            : 'bg-slate-100 text-[#404145]'
                    )}
                  >
                    {item.type === 'OFFER_RECEIVED' && <Briefcase className="w-3.5 h-3.5" />}
                    {item.type === 'ORDER_DELIVERED' && <FileText className="w-3.5 h-3.5" />}
                    {item.type === 'VERIFICATION_APPROVED' && (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    {item.type !== 'OFFER_RECEIVED' &&
                      item.type !== 'ORDER_DELIVERED' &&
                      item.type !== 'VERIFICATION_APPROVED' && (
                        <Bell className="w-3.5 h-3.5" />
                      )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={cn(
                          'text-xs truncate',
                          isUnread
                            ? 'font-bold text-[#222325]'
                            : 'font-medium text-[#404145]'
                        )}
                      >
                        {item.title}
                      </p>
                      {isUnread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1dbf73] shrink-0" />
                      )}
                    </div>
                    {item.body && (
                      <p className="text-[11px] text-[#74767e] line-clamp-2 mt-0.5 leading-snug">
                        {item.body}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Footer Bar: Sound toggle (Volume) + Settings gear (Cài đặt) + Link xem tất cả */}
      <div className="px-3 py-2 border-t border-[#dadbdd] bg-[#f8f9fa] flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Nút bật/tắt chuông */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={isSoundOn ? 'Tắt âm báo' : 'Bật âm báo'}
            title={isSoundOn ? 'Đang bật âm thanh thông báo' : 'Đang tắt âm thanh thông báo'}
            className="p-1 rounded-[4px] text-[#74767e] hover:text-[#222325] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            {isSoundOn ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Nút cài đặt thông báo */}
          <Link
            href="/settings/notifications"
            onClick={onClose}
            aria-label="Cài đặt thông báo"
            title="Cài đặt thông báo (SDD §2.9.5)"
            className="p-1 rounded-[4px] text-[#74767e] hover:text-[#222325] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Link
          href="/notifications"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#222325] hover:text-[#1dbf73] transition-colors"
        >
          <span>Xem tất cả</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
