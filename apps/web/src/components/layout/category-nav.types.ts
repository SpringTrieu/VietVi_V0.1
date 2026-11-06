export type CategoryNavItem = {
  id: string;
  label: string;
  slug: string;
  href: string;
  isTrending?: boolean;
};

export type CategoryNavProps = {
  items?: CategoryNavItem[];
  activeSlug?: string;
  onSelectCategory?: (category: CategoryNavItem) => void;
  className?: string;
};

