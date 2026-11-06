import type { CategoryNavItem } from './category-nav.types';

export type HeaderUser = {
  id: string;
  displayName: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  unreadNotifications?: number;
  unreadMessages?: number;
  isOnline?: boolean;
};

export type HeaderProps = {
  user?: HeaderUser | null;
  isAuthenticated?: boolean;
  activeCategorySlug?: string;
  categories?: CategoryNavItem[];
  onSelectCategory?: (category: CategoryNavItem) => void;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
};
