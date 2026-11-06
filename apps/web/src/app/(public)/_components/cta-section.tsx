import Link from 'next/link';
import { Button } from '@vietvi/ui';

export interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
}

export function CTASection({
  title = 'Bắt đầu giải quyết công việc hoặc kiếm thêm thu nhập ngay hôm nay',
  subtitle = 'Tham gia cộng đồng hàng nghìn sinh viên tài năng và các cá nhân, doanh nghiệp tại VIETVI.',
  primaryCtaLabel = 'Đăng việc ngay (Miễn phí)',
  primaryCtaHref = '/login',
}: CTASectionProps) {
  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Khung thẻ bo góc tập trung (chuẩn ảnh tham chiếu Fiverr với nền gradient thương hiệu ban đầu) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0e6138] via-[#1DBF73] to-[#0b4d2c] px-6 py-12 sm:px-12 sm:py-16 lg:py-20 text-center text-white shadow-lg">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px] leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-white/90 leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Cụm nút CTA duy nhất ở trung tâm (đã bỏ nút Trở thành Tasker) */}
          <div className="mt-8 flex items-center justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#0e6138] hover:bg-slate-50 font-semibold shadow-md rounded-lg h-12 px-7 text-base transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
