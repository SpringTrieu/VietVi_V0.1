'use client';

import Image from 'next/image';
import { useState, useEffect, type FormEvent } from 'react';
import { cn } from '@vietvi/ui';

export type PopularTagItem = {
  label: string;
  query: string;
};

export type HeroSectionProps = {
  title?: string;
  searchPlaceholder?: string;
  popularTags?: (string | PopularTagItem)[];
  onSearch?: (query: string) => void;
  onSelectTag?: (tag: string) => void;
  className?: string;
};

const DEFAULT_POPULAR_TAGS: PopularTagItem[] = [
  { label: 'Thiết kế đồ họa', query: 'Thiết kế đồ họa' },
  { label: 'Lập trình Web & IT', query: 'Lập trình' },
  { label: 'Làm Slide & Đồ án', query: 'Đồ án' },
  { label: 'Dịch thuật & Content', query: 'Dịch thuật' },
  { label: 'Gia sư & Học thuật', query: 'Gia sư' },
];

export function HeroSection({
  title = 'Thuê sinh viên tài năng, theo cách của bạn',
  searchPlaceholder = 'Bạn đang tìm kiếm dịch vụ, kỹ năng gì?',
  popularTags = DEFAULT_POPULAR_TAGS,
  onSearch,
  onSelectTag,
  className,
}: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery.trim());
    // TODO(integration): Chuyển hướng tới trang danh sách task với từ khóa tìm kiếm: /tasks?q=${query}
  };

  const handleTagClick = (tagQuery: string) => {
    setSearchQuery(tagQuery);
    onSelectTag?.(tagQuery);
    // TODO(integration): Lọc danh sách task theo tag: /tasks?tag=${tag}
  };

  // Reset ô tìm kiếm Hero khi click Logo
  useEffect(() => {
    const handleResetHome = () => {
      setSearchQuery('');
    };
    window.addEventListener('vietvi:reset-home', handleResetHome);
    return () => {
      window.removeEventListener('vietvi:reset-home', handleResetHome);
    };
  }, []);

  // Chuẩn hóa danh sách tag hỗ trợ cả string[] và PopularTagItem[]
  const normalizedTags: PopularTagItem[] = popularTags.map((item) =>
    typeof item === 'string' ? { label: item, query: item } : item
  );

  return (
    <section
      aria-label="Hero — Tìm kiếm task"
      className={cn(
        'relative flex w-full items-center overflow-hidden bg-black min-h-[520px] md:min-h-[580px] lg:min-h-[620px]',
        className
      )}
    >
      {/* ẢNH NỀN: Khung bọc mở rộng chiều cao (-top-[8.5%] -bottom-[8.5%]) để khi scale 0.855 (zoom-out 17%) thì chiều cao phủ kín 100%, TRIỆT TIÊU HOÀN TOÀN 2 vệt đen trên và dưới */}
      <div className="absolute -top-[8.5%] -bottom-[8.5%] left-0 right-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          quality={90}
          className="object-cover object-[center_6%] md:object-[center_8%] md:translate-x-[17%] md:scale-[0.855] md:origin-right transition-transform duration-300 md:[mask-image:linear-gradient(to_right,transparent_0%,black_18%)]"
          sizes="100vw"
        />
      </div>

      {/* LỚP GRADIENT CŨ: Phủ gradient từ trên xuống dưới (from-black/40 via-black/55 to-black/75) giữ nguyên không khí ảnh tự nhiên */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/75"
        aria-hidden="true"
      />

      {/* CONTAINER NỘI DUNG: Canh trái chuẩn Fiverr DDESIGN.md */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 lg:py-20">
        <div className="w-full max-w-xl text-left">
          {/* Tiêu đề H1: Phong cách Macan Display thanh thoát, cỡ lớn, tracking gọn gàng */}
          <h1 className="mb-6 md:mb-8 font-medium tracking-tight text-white text-[32px] sm:text-[42px] md:text-[48px] lg:text-[54px] leading-[1.15]">
            {title}
          </h1>

          {/* Thanh tìm kiếm trung tâm (Chuẩn Fiverr: bo góc 8px, nút vuông Carbon docked phải) */}
          <form
            id="hero-search-form"
            onSubmit={handleSearchSubmit}
            role="search"
            className="mb-5 sm:mb-6 flex w-full max-w-[540px] h-[52px] sm:h-[56px] bg-white rounded-[8px] border border-[#dadbdd] shadow-md overflow-hidden hover:border-[#c5c6c9] focus-within:border-[#1dbf73] transition-colors"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="flex-1 min-w-0 bg-white px-4 sm:px-5 text-[15px] sm:text-base text-[#222325] placeholder:text-[#74767e] outline-none"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="w-[52px] sm:w-[56px] h-[52px] sm:h-[56px] flex items-center justify-center shrink-0 bg-[#222325] text-white hover:bg-black transition-colors cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
                className="shrink-0"
              >
                <path d="M11.7422 10.3281H10.9972L10.7334 10.0737C11.6669 8.98822 12.2222 7.57444 12.2222 6.04639C12.2222 2.70705 9.48911 0 6.11111 0C2.73311 0 0 2.70705 0 6.04639C0 9.38572 2.73311 12.0928 6.11111 12.0928C7.65342 12.0928 9.08053 11.5428 10.1762 10.6183L10.433 10.8797V11.6178L15.1337 16.2751L16 15.4172L11.7422 10.3281ZM6.11111 10.3281C3.72251 10.3281 1.77778 8.40215 1.77778 6.04639C1.77778 3.69062 3.72251 1.76465 6.11111 1.76465C8.49971 1.76465 10.4444 3.69062 10.4444 6.04639C10.4444 8.40215 8.49971 10.3281 6.11111 10.3281Z" />
              </svg>
            </button>
          </form>

          {/* Điểm neo để Header theo dõi khi cuộn qua */}
          <div id="hero-search-anchor" className="h-0 w-full" aria-hidden="true" />

          {/* Dải Thẻ Tag Pills nhanh (Chuẩn Fiverr: viền mờ kính, mũi tên điều hướng →, không có trust bar dưới theo yêu cầu) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {normalizedTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleTagClick(tag.query)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 backdrop-blur-xs px-3.5 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-[14px] font-normal text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-[#222325] cursor-pointer shadow-2xs"
              >
                <span>{tag.label}</span>
                <span
                  aria-hidden="true"
                  className="text-white/60 group-hover:text-[#222325] group-hover:translate-x-0.5 transition-all text-xs"
                >
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
