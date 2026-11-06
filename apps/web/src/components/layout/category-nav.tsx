'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@vietvi/ui';
import type { CategoryNavProps } from './category-nav.types';
import { DEFAULT_VIETVI_CATEGORIES } from './category-nav.fixtures';

export function CategoryNav({
  items = DEFAULT_VIETVI_CATEGORIES,
  activeSlug,
  onSelectCategory,
  className,
}: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, items]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const offset = direction === 'left' ? -240 : 240;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Danh mục dịch vụ"
      className={cn(
        'w-full bg-white border-b border-[#dadbdd] h-[40px] text-[14px] select-none transition-colors',
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative flex items-center">
        {/* Nút cuộn trái (Chỉ hiện khi đã cuộn sang phải) */}
        {canScrollLeft && (
          <div className="absolute left-2 sm:left-4 z-10 flex items-center h-full pr-5 pl-0.5 bg-gradient-to-r from-white via-white/95 to-transparent">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Cuộn danh mục sang trái"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white shadow-xs border border-[#dadbdd] flex items-center justify-center text-[#62646a] hover:text-[#222325] hover:border-[#222325] transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-3.5 sm:size-4" />
            </button>
          </div>
        )}

        {/* Danh sách danh mục cuộn ngang */}
        <div
          ref={scrollRef}
          role="menubar"
          className="flex items-center gap-6 sm:gap-7 lg:gap-8 overflow-x-auto h-full scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
        >
          {items.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                role="menuitem"
                onClick={(e) => {
                  if (onSelectCategory) {
                    e.preventDefault();
                    onSelectCategory(cat);
                  }
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 h-full whitespace-nowrap text-[14px] border-b-2 font-normal transition-colors py-0 cursor-pointer shrink-0',
                  isActive
                    ? 'text-[#222325] font-semibold border-[#1dbf73]'
                    : 'text-[#62646a] border-transparent hover:text-[#222325] hover:border-[#1dbf73]'
                )}
              >
                {cat.isTrending && (
                  <Flame
                    className="size-3.5 text-[#ff6b00] fill-[#ff6b00] shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Nút cuộn phải (Hiện khi nội dung tràn sang phải) */}
        {canScrollRight && (
          <div className="absolute right-2 sm:right-4 z-10 flex items-center h-full pl-5 pr-0.5 bg-gradient-to-l from-white via-white/95 to-transparent">
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Cuộn danh mục sang phải"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white shadow-xs border border-[#dadbdd] flex items-center justify-center text-[#62646a] hover:text-[#222325] hover:border-[#222325] transition-colors cursor-pointer"
            >
              <ChevronRight className="size-3.5 sm:size-4" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

