import type { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { defaultAuthenticatedUser } from '@/components/layout/header.fixtures';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  // TODO(integration): Thay thế fixture defaultAuthenticatedUser bằng session user thật từ cookie/auth guard
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header user={defaultAuthenticatedUser} isAuthenticated />
      <main className="flex-1 pt-[104px]">{children}</main>
      <Footer />
    </div>
  );
}
