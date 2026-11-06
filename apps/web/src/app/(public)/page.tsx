import type { Metadata } from 'next';
import { HeroSection } from './_components/hero-section';
import { StatsBanner } from './_components/stats-banner';
import { CategoryGrid } from './_components/category-grid';
import { FeaturedTasksSection } from './_components/featured-tasks-section';
import { HowItWorksSection } from './_components/how-it-works-section';
import { FaqSection } from './_components/faq-section';
import { CTASection } from './_components/cta-section';

export const metadata: Metadata = {
  title: 'VIETVI - Nền tảng việc làm linh hoạt cho sinh viên Việt Nam',
  description:
    'Kết nối việc làm ngắn hạn, tiện lợi, minh bạch và an toàn dành riêng cho sinh viên và người có nhu cầu thuê việc.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBanner />
      <CategoryGrid />
      <FeaturedTasksSection />
      <HowItWorksSection />
      <FaqSection />
      <CTASection />
    </>
  );
}

