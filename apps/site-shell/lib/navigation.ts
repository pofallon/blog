import type { NavigationLink, NavigationPath } from './types';

const REQUIRED_PATHS: NavigationPath[] = ['/', '/blog', '/projects', '/merch'];

const NAVIGATION_LINKS: NavigationLink[] = [
  {
    label: 'Home',
    path: '/',
    description: 'Back to where it all begins.',
    order: 0,
    isPrimary: true,
    iconName: 'house',
  },
  {
    label: 'Blog',
    path: '/blog',
    description: 'Field notes, half-formed ideas, and the occasional epiphany.',
    order: 1,
    isPrimary: true,
    iconName: 'book-open',
  },
  {
    label: 'Projects',
    path: '/projects',
    description: 'Things being built, things being tinkered with, things that work.',
    order: 2,
    isPrimary: true,
    iconName: 'folder-kanban',
  },
  {
    label: 'Merch',
    path: '/merch',
    description: 'Tangible artifacts for fellow curious minds.',
    order: 3,
    isPrimary: false,
    iconName: 'shopping-bag',
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
