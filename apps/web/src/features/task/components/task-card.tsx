import Link from 'next/link';
import { Clock, Bookmark, CheckCircle2, Users, ArrowUpRight } from 'lucide-react';
import type { MockTaskItem } from '@/mocks/landing.mock';
import { formatVND } from '@/lib/format';

export interface TaskCardProps {
  task: MockTaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
  const deliveryLabel =
    task.deliveryModeText || (task.isRemote ? 'Làm Online' : task.locationLabel || 'Tại chỗ');
  const timeAgo = task.timeAgoText || '25 phút trước';
  const authorInitials =
    task.authorInitials || task.authorName.slice(0, 2).toUpperCase();
  const authorSchool = task.authorSchool || 'Đại học Quốc gia';
  const rating = (task.authorRating ?? 5.0).toFixed(1);
  const reviewsCount = task.authorReviewsCount ?? 16;
  const deadlineDisplay = task.deadlineTime || task.deadlineText || '20:00';

  return (
    <article className="flex flex-col justify-between rounded-[16px] border border-[#dadbdd] bg-white p-5 sm:p-6 shadow-xs transition-[border-color,box-shadow,transform] duration-200 hover:border-[#1dbf73] hover:shadow-[0px_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
      <div>
        {/* Hàng 1: Danh mục, Hình thức, Thời gian đăng, Nút lưu Bookmark */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#62646a]">
            <span className="font-semibold text-[#222325]">{task.categoryName}</span>
            <span className="text-[#dadbdd]">·</span>
            <span className="font-medium">{deliveryLabel}</span>
            <span className="text-[#dadbdd]">·</span>
            <span className="inline-flex items-center gap-1 text-[#74767e]">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{timeAgo}</span>
            </span>
          </div>

          <button
            type="button"
            aria-label="Lưu công việc này"
            className="shrink-0 text-[#74767e] transition-colors hover:text-[#222325] cursor-pointer"
          >
            <Bookmark className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Hàng 2: Tiêu đề Task (Carbon #222325, hover chuyển sang Fiverr Green #1dbf73) */}
        <Link href="#" className="mt-3.5 block group">
          <h3 className="line-clamp-2 text-base sm:text-[17px] font-bold leading-snug text-[#222325] group-hover:text-[#1dbf73] transition-colors">
            {task.title}
          </h3>
        </Link>

        {/* Hàng 3: Mô tả tóm tắt */}
        <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[#62646a]">
          {task.description ||
            'Mình cần tìm sinh viên hoàn thành công việc theo đúng yêu cầu chi tiết, cam kết nghiệm thu và thanh toán an toàn.'}
        </p>

        {/* Hàng 4: Khung tiêu chí nghiệm thu (Sub-box bo góc 12px chuẩn DDESIGN.md) */}
        <div className="mt-3.5 rounded-[12px] border border-[#dadbdd] bg-[#f8f9fa] p-3">
          <span className="text-xs font-bold text-[#222325]">Nghiệm thu:</span>
          <p className="mt-0.5 line-clamp-1 text-xs text-[#62646a]">
            {task.acceptanceCriteria ||
              'Mã nguồn GitHub repo hoặc file ZIP chạy được lệnh `npm run test`.'}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {/* Hàng 5: Thông tin người đăng (Avatar Carbon, Tên, Badge Đã xác minh #1dbf73, Trường, Đánh giá sao) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-[#222325] text-xs font-bold text-white shadow-xs">
              {authorInitials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs sm:text-sm font-semibold text-[#222325]">
                  {task.authorName}
                </span>
                {task.isVerifiedStudent !== false && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#1dbf73]/30 bg-[#1dbf73]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1dbf73]">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    <span>Đã xác minh</span>
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-[#74767e] mt-0.5">{authorSchool}</p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-center justify-end gap-1 text-xs sm:text-sm font-bold text-[#222325]">
              <span className="text-amber-500" aria-hidden="true">★</span>
              <span>{rating}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-[#74767e]">({reviewsCount} đánh giá)</p>
          </div>
        </div>

        {/* Hàng 6: Ngân sách giao dịch & Hạn chót + Nút điều hướng bo góc 8px */}
        <div className="mt-4 flex items-end justify-between border-t border-[#dadbdd] pt-3.5">
          <div>
            <span className="text-[11px] font-medium text-[#74767e]">Ngân sách giao dịch</span>
            <div className="mt-0.5 text-lg sm:text-xl font-bold tracking-tight text-[#222325]">
              {formatVND(task.budget)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-[#74767e]">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>Hạn chót</span>
              </div>
              <span className="mt-0.5 block text-xs sm:text-sm font-bold text-[#222325]">
                {deadlineDisplay}
              </span>
            </div>

            <Link
              href="#"
              aria-label={`Xem chi tiết task ${task.title}`}
              className="flex w-9 h-9 shrink-0 items-center justify-center rounded-[8px] bg-[#f8f9fa] border border-[#dadbdd] text-[#222325] transition-all hover:bg-[#222325] hover:text-white hover:border-[#222325] cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Hàng 7: Số đề xuất đã gửi & Liên kết Chi tiết */}
        <div className="mt-3 flex items-center justify-between pt-1 text-xs text-[#74767e]">
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-[#74767e]" aria-hidden="true" />
            <span>{task.offersCount} đề xuất đã gửi</span>
          </div>

          <Link
            href="#"
            className="flex items-center gap-1 font-semibold text-[#222325] transition-colors hover:text-[#1dbf73]"
          >
            <span>Chi tiết</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
