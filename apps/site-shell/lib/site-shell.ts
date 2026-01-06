import { getNavigationLinks } from './navigation';
import type { FooterContent, NavigationLink, SiteMetadata, SiteShellLayout } from './types';

const BRAND_NAME = 'get2know.io';

const siteMetadata: SiteMetadata = {
  title: `${BRAND_NAME} — Site Shell`,
  description:
    'A persistent navigation shell that keeps the migration team aligned across blog, projects, and merch previews.',
  ogImage: '/assets/site-shell-og.svg',
};

const currentYear = new Date().getFullYear().toString();

const footerContent: FooterContent = {
  text: `© ${currentYear} ${BRAND_NAME}. All rights reserved.`,
  links: [],
  social: [
    { label: 'GitHub', href: 'https://github.com/pofallon' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pofallon/' },
  ],
};

const navigationLinks: NavigationLink[] = getNavigationLinks();

const siteShellLayout: SiteShellLayout = {
  id: 'site-shell',
  brandName: BRAND_NAME,
  navigationLinks,
  metadata: siteMetadata,
  footer: footerContent,
};

export function getSiteShellLayout(): SiteShellLayout {
  return siteShellLayout;
}

export function getSiteMetadata(): SiteMetadata {
  return siteMetadata;
}

export function getFooterContent(): FooterContent {
  return footerContent;
}
