import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#f8f9fa] flex flex-col">
      <Header />
      {/* 
        Tuân thủ chuẩn kiến trúc Responsive.md §7.5:
        - Tuyệt đối không dùng items-center + flex-1/min-h-screen gây hiện tượng "ốc đảo" tách rời khi zoom out
        - Dùng items-start và clamp() khoảng đệm đỉnh để giữ khoảng cách với Header luôn ổn định ở mọi mức zoom (25% - 200%)
      */}
      <main className="w-full flex-1 flex justify-center items-start pt-[calc(65px+clamp(20px,4vh,60px))] pb-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
