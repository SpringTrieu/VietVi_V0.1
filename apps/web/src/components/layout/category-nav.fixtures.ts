import type { CategoryNavItem } from './category-nav.types';

export const DEFAULT_VIETVI_CATEGORIES: CategoryNavItem[] = [
  {
    id: 'cat-trending',
    label: 'Xu hướng',
    slug: 'trending',
    href: '/tasks?filter=trending',
    isTrending: true,
  },
  {
    id: 'cat-it',
    label: 'CNTT & Lập trình',
    slug: 'it-lap-trinh',
    href: '/tasks?category=it-lap-trinh',
  },
  {
    id: 'cat-design',
    label: 'Thiết kế & Đồ họa',
    slug: 'thiet-ke-do-hoa',
    href: '/tasks?category=thiet-ke-do-hoa',
  },
  {
    id: 'cat-academic',
    label: 'Học thuật & Gia sư',
    slug: 'hoc-thuat-gia-su',
    href: '/tasks?category=hoc-thuat-gia-su',
  },
  {
    id: 'cat-translation',
    label: 'Dịch thuật & Soạn thảo',
    slug: 'dich-thuat-soan-thao',
    href: '/tasks?category=dich-thuat-soan-thao',
  },
  {
    id: 'cat-video',
    label: 'Video & Hoạt họa',
    slug: 'video-hoat-hoa',
    href: '/tasks?category=video-hoat-hoa',
  },
  {
    id: 'cat-marketing',
    label: 'Marketing & Tiếp thị',
    slug: 'marketing-tiep-thi',
    href: '/tasks?category=marketing-tiep-thi',
  },
  {
    id: 'cat-audio',
    label: 'Âm thanh & Lồng tiếng',
    slug: 'am-thanh-long-tieng',
    href: '/tasks?category=am-thanh-long-tieng',
  },
  {
    id: 'cat-ai',
    label: 'Dịch vụ AI',
    slug: 'dich-vu-ai',
    href: '/tasks?category=dich-vu-ai',
  },
  {
    id: 'cat-event',
    label: 'Hỗ trợ Sự kiện & F&B',
    slug: 'su-kien-fnb',
    href: '/tasks?category=su-kien-fnb',
  },
];

