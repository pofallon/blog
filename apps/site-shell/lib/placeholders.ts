import type { PlaceholderPage, PlaceholderSlug } from './types';

const PLACEHOLDERS: Record<PlaceholderSlug, PlaceholderPage> = {
  home: {
    slug: 'home',
    title: 'Home',
    description:
      'Welcome to the workshop. Explore projects, read the latest posts, and see what ideas are coming to life.',
    layoutSlots: [
      { id: 'hero', description: 'Hero section with site introduction.' },
      { id: 'body-grid', description: 'Featured projects and latest posts.' },
    ],
    cta: { label: 'Explore projects', href: '/projects' },
    status: 'placeholder',
  },
  blog: {
    slug: 'blog',
    title: 'Blog',
    description:
      'Thoughts on software architecture, developer experience, and learning out loud.',
    layoutSlots: [
      { id: 'hero', description: 'Featured or latest post highlight.' },
      { id: 'callout', description: 'Post categories or tags.' },
    ],
    cta: { label: 'Read latest posts', href: '/blog' },
    status: 'placeholder',
  },
  projects: {
    slug: 'projects',
    title: 'Projects',
    description:
      'Ongoing experiments in distributed systems, developer tools, and creative technology.',
    layoutSlots: [
      { id: 'hero', description: 'Featured project showcase.' },
      { id: 'body-grid', description: 'Project cards with descriptions and links.' },
      { id: 'footer', description: 'Links to GitHub and documentation.' },
    ],
    cta: { label: 'View all projects', href: '/projects' },
    status: 'placeholder',
  },
  merch: {
    slug: 'merch',
    title: 'Merch',
    description:
      'Robot-themed gear and workshop swag. Coming soon.',
    layoutSlots: [
      { id: 'hero', description: 'Hero with featured collection.' },
      { id: 'callout', description: 'Newsletter signup for launch updates.' },
    ],
    cta: { label: 'Get notified', href: '/merch' },
    status: 'placeholder',
  },
};

export function getPlaceholderBySlug(slug: PlaceholderSlug): PlaceholderPage {
  return PLACEHOLDERS[slug];
}

export function isPlaceholderSlug(slug: string): slug is PlaceholderSlug {
  return slug in PLACEHOLDERS;
}

export function getAllPlaceholders(): PlaceholderPage[] {
  return Object.values(PLACEHOLDERS);
}
