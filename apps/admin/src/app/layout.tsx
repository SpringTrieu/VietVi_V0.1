import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VIETVI Admin Console',
  description: 'Trang quản trị vận hành VIETVI',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
