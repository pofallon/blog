import type { NavigationLink, NavigationPath } from './types';

const REQUIRED_PATHS: NavigationPath[] = ['/', '/blog', '/projects', '/merch'];

const NAVIGATION_LINKS: NavigationLink[] = [
  {
    label: 'Home',
    path: '/',
    description: 'Return to the landing experience.',
    order: 0,
    isPrimary: true,
  },
  {
    label: 'Blog',
    path: '/blog',
    description: 'Read migration notes and long-form updates.',
    order: 1,
    isPrimary: true,
  },
  {
    label: 'Projects',
    path: '/projects',
    description: 'Preview the build backlog for the new site shell.',
    order: 2,
    isPrimary: true,
  },
  {
    label: 'Merch',
    path: '/merch',
    description: 'Future commerce experiences for the brand collective.',
    order: 3,
    isPrimary: false,
  },
];

const orderedLinks = NAVIGATION_LINKS.slice().sort((a, b) => a.order - b.order);
const missingPaths = REQUIRED_PATHS.filter(
  (path) => !orderedLinks.some((link) => link.path === path),
);

if (missingPaths.length > 0) {
  throw new Error(
    `Navigation registry missing required paths: ${missingPaths
      .map((path) => `"${path}"`)
      .join(', ')}`,
  );
}

export function getNavigationLinks(): NavigationLink[] {
  return orderedLinks.map((link) => ({ ...link }));
}

export function findNavigationLink(path: NavigationPath): NavigationLink | undefined {
  return orderedLinks.find((link) => link.path === path);
}

export type NavigationLinksResponse = {
  links: NavigationLink[];
};
