import { MOCK_STATS, type PlatformStat } from '@/mocks/landing.mock';
import { AnimatedCounter } from './animated-counter';

export interface StatsBannerProps {
  stats?: PlatformStat[];
}

export function StatsBanner({ stats = MOCK_STATS }: StatsBannerProps) {
  return (
    <section className="border-y border-[#dadbdd] bg-white py-5 md:py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:grid-cols-4 text-center">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center px-2 sm:px-4 ${
                idx < stats.length - 1 ? 'md:border-r md:border-[#dadbdd]' : ''
              }`}
            >
              {/* Số liệu thống kê: Carbon #222325 theo chuẩn DDESIGN.md kết hợp hiệu ứng đếm số mượt mà khi tải trang */}
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#222325] tabular-nums">
                <AnimatedCounter value={stat.value} duration={1400} />
              </div>

              {/* Nhãn chính: Slate #404145 */}
              <div className="mt-1.5 text-[14px] sm:text-[15px] font-semibold text-[#404145]">
                {stat.label}
              </div>

              {/* Mô tả phụ: Smoke #74767e */}
              <p className="mt-0.5 text-[12px] sm:text-[13px] text-[#74767e] leading-snug max-w-[200px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
