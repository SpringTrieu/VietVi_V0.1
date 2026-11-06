import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'VIETVI - Nền tảng việc làm linh hoạt cho sinh viên Việt Nam',
  description: 'Nền tảng việc làm ngắn hạn, tiện lợi, minh bạch và an toàn dành riêng cho sinh viên và người có nhu cầu thuê việc.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
