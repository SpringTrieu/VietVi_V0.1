'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_CATEGORIES, type MockCategory } from '@/mocks/landing.mock';

// Các mockup minh họa trực quan chuẩn phong cách Fiverr cho tầng dưới của Card (Forest Stage #003912)
function CategoryIllustration({ slug }: { slug: string }) {
  switch (slug) {
    case 'gia-su-hoc-tap':
      return (
        <svg viewBox="0 0 180 140" fill="none" className="w-full h-full object-contain select-none" aria-hidden="true">
          <circle cx="90" cy="70" r="50" fill="#1dbf73" fillOpacity="0.16" filter="blur(16px)" />
          {/* Mũ cử nhân tốt nghiệp */}
          <path d="M90 20L135 38L90 56L45 38L90 20Z" fill="#222325" />
          <path d="M60 44V64C60 74 120 74 120 64V44" fill="#222325" />
          <path d="M125 40V68" stroke="#f4b400" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="125" cy="71" r="3" fill="#f4b400" />
          {/* Sách mở tri thức */}
          <path d="M30 110C55 105 85 108 90 120C95 108 125 105 150 110V54C125 49 95 52 90 64C85 52 55 49 30 54V110Z" fill="#ffffff" />
          <path d="M90 64V120" stroke="#003912" strokeWidth="2" strokeLinecap="round" />
          {/* Ruy băng đánh dấu trang xanh Fiverr */}
          <path d="M85 64V88L90 83L95 88V64" fill="#1dbf73" />
        </svg>
      );

    case 'lap-trinh-cntt':
      return (
        <svg viewBox="0 0 180 140" fill="none" className="w-full h-full object-contain select-none" aria-hidden="true">
          <circle cx="90" cy="70" r="50" fill="#1dbf73" fillOpacity="0.18" filter="blur(16px)" />
          {/* Laptop mockup */}
          <rect x="35" y="30" width="110" height="70" rx="6" fill="#111827" stroke="#374151" strokeWidth="2" />
          {/* Cụm nút điều khiển cửa sổ macOS */}
          <circle cx="45" cy="38" r="2.5" fill="#ef4444" />
          <circle cx="53" cy="38" r="2.5" fill="#f59e0b" />
          <circle cx="61" cy="38" r="2.5" fill="#10b981" />
          {/* Dòng code màu sắc rực rỡ */}
          <path d="M48 50L58 58L48 66" stroke="#1dbf73" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M68 58H90" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M48 78H98" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 86H82" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
          <path d="M104 74L116 82L104 90" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Bàn phím & Đế laptop kim loại */}
          <path d="M20 100H160C160 100 156 108 148 108H32C24 108 20 100 20 100Z" fill="#e5e7eb" />
          <rect x="75" y="100" width="30" height="3" rx="1.5" fill="#9ca3af" />
        </svg>
      );

    case 'dich-thuat-noi-dung':
      return (
        <svg viewBox="0 0 180 140" fill="none" className="w-full h-full object-contain select-none" aria-hidden="true">
          <circle cx="90" cy="70" r="50" fill="#1dbf73" fillOpacity="0.16" filter="blur(16px)" />
          {/* Trang tài liệu */}
          <rect x="42" y="25" width="76" height="95" rx="6" fill="#ffffff" />
          <rect x="52" y="40" width="35" height="4" rx="2" fill="#222325" />
          <rect x="52" y="52" width="56" height="3" rx="1.5" fill="#9ca3af" />
          <rect x="52" y="62" width="50" height="3" rx="1.5" fill="#9ca3af" />
          <rect x="52" y="72" width="56" height="3" rx="1.5" fill="#9ca3af" />
          <rect x="52" y="82" width="40" height="3" rx="1.5" fill="#9ca3af" />
          {/* Huy hiệu Dịch thuật Quốc tế */}
          <circle cx="118" cy="85" r="26" fill="#003912" stroke="#1dbf73" strokeWidth="2" />
          <text x="108" y="86" fill="#ffffff" fontSize="13" fontWeight="bold">A</text>
          <text x="119" y="93" fill="#1dbf73" fontSize="13" fontWeight="bold">文</text>
          {/* Bút vàng */}
          <path d="M125 30L140 45L80 105L65 108L68 93L125 30Z" fill="#f59e0b" />
          <path d="M125 30L135 20L145 30L140 45Z" fill="#d97706" />
        </svg>
      );

    case 'thiet-ke-do-hoa':
      return (
        <svg viewBox="0 0 180 140" fill="none" className="w-full h-full object-contain select-none" aria-hidden="true">
          <circle cx="90" cy="70" r="50" fill="#1dbf73" fillOpacity="0.16" filter="blur(16px)" />
          {/* Artboard vẽ đồ họa */}
          <rect x="35" y="26" width="95" height="90" rx="8" fill="#ffffff" />
          <circle cx="65" cy="55" r="16" fill="#ff7675" />
          <path d="M45 100L70 70L85 85L110 55L125 100H45Z" fill="#74b9ff" fillOpacity="0.8" />
          {/* Bảng mã màu Palette */}
          <g transform="translate(102, 45)">
            <rect x="0" y="0" width="38" height="65" rx="6" fill="#222325" stroke="#374151" />
            <circle cx="19" cy="14" r="7" fill="#ff7675" />
            <circle cx="19" cy="32" r="7" fill="#55efc4" />
            <circle cx="19" cy="50" r="7" fill="#ffeaa7" />
          </g>
          {/* Trỏ bút Pen-tool */}
          <path d="M75 40L90 55L82 62L78 54L68 56L75 40Z" fill="#1dbf73" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      );

    case 'tro-ly-su-kien':
      return (
        <svg viewBox="0 0 180 140" fill="none" className="w-full h-full object-contain select-none" aria-hidden="true">
          <circle cx="90" cy="70" r="50" fill="#1dbf73" fillOpacity="0.16" filter="blur(16px)" />
          {/* Thẻ đeo sự kiện Event Pass */}
          <path d="M90 10L65 50H115L90 10Z" fill="none" stroke="#1dbf73" strokeWidth="2.5" />
          <rect x="52" y="48" width="76" height="75" rx="8" fill="#ffffff" />
          <rect x="62" y="55" width="56" height="6" rx="3" fill="#222325" />
          <circle cx="90" cy="78" r="12" fill="#e5e7eb" />
          <path d="M75 105C75 97 82 94 90 94C98 94 105 97 105 105V108H75V105Z" fill="#1dbf73" />
          {/* Ngôi sao VIP gold */}
          <circle cx="120" cy="100" r="18" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          <path d="M120 90L122.5 96H129L123.8 99.8L125.8 106L120 102.2L114.2 106L116.2 99.8L111 96H117.5L120 90Z" fill="#ffffff" />
        </svg>
      );

    case 'van-phong-nhap-lieu':
    default:
      return (
        <svg viewBox="0 0 180 140" fill="none" className="w-full h-full object-contain select-none" aria-hidden="true">
          <circle cx="90" cy="70" r="50" fill="#1dbf73" fillOpacity="0.16" filter="blur(16px)" />
          {/* Bảng tính Excel Sheet */}
          <rect x="35" y="25" width="110" height="92" rx="8" fill="#ffffff" />
          <rect x="35" y="25" width="110" height="22" rx="6" fill="#10b981" />
          <rect x="45" y="33" width="20" height="5" rx="2.5" fill="#ffffff" />
          <rect x="75" y="33" width="25" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.8" />
          <rect x="110" y="33" width="25" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.8" />
          {/* Lưới ô dữ liệu & Biểu đồ cột */}
          <line x1="35" y1="65" x2="145" y2="65" stroke="#f3f4f6" strokeWidth="2" />
          <line x1="35" y1="85" x2="145" y2="85" stroke="#f3f4f6" strokeWidth="2" />
          <line x1="70" y1="47" x2="70" y2="117" stroke="#f3f4f6" strokeWidth="2" />
          <line x1="105" y1="47" x2="105" y2="117" stroke="#f3f4f6" strokeWidth="2" />
          <rect x="45" y="73" width="8" height="18" rx="2" fill="#60a5fa" />
          <rect x="56" y="58" width="8" height="33" rx="2" fill="#1dbf73" />
          <rect x="80" y="70" width="18" height="6" rx="3" fill="#cbd5e1" />
          <rect x="115" y="70" width="20" height="6" rx="3" fill="#10b981" />
          <rect x="80" y="95" width="16" height="6" rx="3" fill="#cbd5e1" />
          <rect x="115" y="95" width="22" height="6" rx="3" fill="#60a5fa" />
        </svg>
      );
  }
}

export function CategoryGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollOffset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section id="categories-section" className="py-12 sm:py-16 bg-[#ffffff] scroll-mt-16">
      {/* Khung chứa rộng rãi chuẩn DDESIGN.md */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề & Nút điều hướng Carousel */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#222325]">
              Danh mục công việc phổ biến
            </h2>
            <p className="mt-2 text-[15px] text-[#62646a]">
              Khám phá các kỹ năng và dịch vụ sinh viên được yêu cầu nhiều nhất
            </p>
          </div>

          {/* Cụm nút điều hướng Carousel ngang */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Cuộn sang trái"
              className="w-9 h-9 rounded-full bg-white border border-[#dadbdd] text-[#222325] hover:bg-slate-50 hover:border-[#c5c6c9] shadow-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Cuộn sang phải"
              className="w-9 h-9 rounded-full bg-white border border-[#dadbdd] text-[#222325] hover:bg-slate-50 hover:border-[#c5c6c9] shadow-xs flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khung Carousel: Thêm pt-3 pb-7 px-1.5 để Card nâng lên khi hover (-translate-y-2) và đổ bóng không bị cắt xén */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4.5 overflow-x-auto pt-3 pb-7 px-1.5 scrollbar-none snap-x snap-mandatory -mx-4 sm:-mx-1.5 sm:px-1.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MOCK_CATEGORIES.map((cat: MockCategory) => (
            <Link
              key={cat.id}
              href={`#tasks`}
              className="group shrink-0 w-[276px] sm:w-[253px] lg:w-[calc(16.666%-15px)] min-w-[213px] h-[322px] rounded-[16px] bg-[#003912] hover:bg-[#004717] pt-[29px] px-[18px] flex flex-col justify-between overflow-hidden shadow-[0px_3px_10px_0px_rgba(0,0,0,0.13)] hover:shadow-[0px_10px_24px_0px_rgba(0,0,0,0.28)] hover:-translate-y-2 transition-all duration-300 ease-out snap-start"
            >
              {/* Tiêu đề góc trên bên trái (+15% kích thước hiển thị cân đối) */}
              <div className="z-10">
                <h3 className="text-[17px] font-semibold text-white leading-snug">
                  {cat.name}
                </h3>
                <p className="mt-1 text-[14px] text-white/75 line-clamp-1">
                  {cat.description}
                </p>
              </div>

              {/* Tầng 60% dưới: Tăng chiều cao lên 178px (+15%) chứa mockup trực quan */}
              <div className="h-[178px] w-full flex items-end justify-center group-hover:scale-105 transition-transform duration-300 ease-out">
                <CategoryIllustration slug={cat.slug} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
