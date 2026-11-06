import * as React from 'react';
import { cn } from '../lib/utils';

export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Tùy chọn tô màu xanh thương hiệu (#1dbf73) cho 2 chữ "VI" đuôi.
   * Mặc định là false (đồng màu 100% qua currentColor).
   */
  accentLastWord?: boolean;
}

export function Logo({
  className,
  accentLastWord = false,
  ...props
}: LogoProps) {
  return (
    <svg
      viewBox="0 270 1277 366"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-7 w-auto shrink-0', className)}
      aria-label="VietVi Logo"
      {...props}
    >
      {/* Khối chữ "VIET" đầu */}
      <g fill="currentColor">
        {/* V đầu */}
        <path d="M152.707 634.838L0 271.799H49.9201L154.962 522.4L169.514 558.965L143.103 553.682L155.062 522.621L260.971 271.799H305.894L152.707 634.838Z" />
        {/* I đầu */}
        <path d="M259.313 483.219L305.894 373.193V619.119H259.313V483.219Z" />
        {/* E */}
        <path d="M454.828 466.49V421.899H615.356V466.49H454.828Z" />
        <path d="M641.49 618.992H409.068V271.8H642.11V316.459H455.648V422.106H455.859L455.977 466.765H455.648V574.332H641.49V618.992Z" />
        {/* T */}
        <path d="M696.879 271.799H927.38V316.459H834.219V618.991H787.639V316.459H696.879V271.799Z" />
      </g>

      {/* Khối chữ "VI" đuôi: mặc định đồng màu currentColor, bật xanh khi accentLastWord = true */}
      <g fill={accentLastWord ? '#1dbf73' : 'currentColor'}>
        {/* V đuôi */}
        <path d="M1123.76 635.387L971.054 272.348H1020.97L1126.02 522.95L1140.57 559.514L1114.16 554.232L1126.12 523.171L1232.03 272.348H1276.95L1123.76 635.387Z" />
        {/* I đuôi */}
        <path d="M1230.42 483.219L1277 373.192V619.119H1230.42V483.219Z" />
      </g>
    </svg>
  );
}
