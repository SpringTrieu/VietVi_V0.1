import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VIETVI Web',
  description: 'Nền tảng việc làm linh hoạt VIETVI',
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
