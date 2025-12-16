export type NavigationPath = '/' | '/blog' | '/projects' | '/merch';

export type NavigationLink = {
  label: string;
  path: NavigationPath;
  description?: string;
  order: number;
  isPrimary: boolean;
  disabled?: boolean;
};

export type SiteMetadata = {
  title: string;
  description: string;
  ogImage: string;
};

export type FooterLink = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export type FooterContent = {
  text: string;
  links: FooterLink[];
  social?: FooterLink[];
};

export type PlaceholderLayoutSlotId = 'hero' | 'body-grid' | 'callout' | 'footer';

export type PlaceholderLayoutSlot = {
  id: PlaceholderLayoutSlotId;
  description: string;
};

export type PlaceholderCTA = {
  label: string;
  href: string;
};

export type PlaceholderSlug = 'home' | 'blog' | 'projects' | 'merch';

export type PlaceholderPage = {
  slug: PlaceholderSlug;
  title: string;
  description: string;
  layoutSlots: PlaceholderLayoutSlot[];
  cta?: PlaceholderCTA;
  status?: 'placeholder' | 'content-ready';
};

export type SiteShellLayout = {
  id: 'site-shell';
  brandName: string;
  navigationLinks: NavigationLink[];
  metadata: SiteMetadata;
  footer: FooterContent;
};
