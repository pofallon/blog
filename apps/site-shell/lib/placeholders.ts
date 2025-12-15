import type { PlaceholderPage, PlaceholderSlug } from './types';

const PLACEHOLDERS: Record<PlaceholderSlug, PlaceholderPage> = {
  home: {
    slug: 'home',
    title: 'Home migration hub',
    description:
      'Track the end-to-end migration program timeline, current rollout status, and sign-off milestones.',
    layoutSlots: [
      { id: 'hero', description: 'Top-level timeline card with executive summary.' },
      { id: 'body-grid', description: 'Grid summarizing MVP, P2, P3 scopes.' },
    ],
    cta: { label: 'View migration roadmap', href: '/projects' },
    status: 'placeholder',
  },
  blog: {
    slug: 'blog',
    title: 'Editorial feed',
    description:
      'Each entry surfaces migration journal updates while content moves from Gatsby to Next.js.',
    layoutSlots: [
      { id: 'hero', description: 'Pinned update for the latest sprint recap.' },
      { id: 'callout', description: 'Callout promoting MDX migration readiness checklist.' },
    ],
    cta: { label: 'Review publishing checklist', href: '/blog' },
    status: 'placeholder',
  },
  projects: {
    slug: 'projects',
    title: 'Build trackers',
    description:
      'Stakeholders can browse active initiatives, owners, and blocked dependencies for the shell.',
    layoutSlots: [
      { id: 'hero', description: 'Overview of the current epic and OKRs.' },
      { id: 'body-grid', description: 'Cards enumerating sub-tracks with target ship dates.' },
      { id: 'footer', description: 'Links to Jira, Figma, and research docs.' },
    ],
    cta: { label: 'Open delivery board', href: 'https://get2know.io/projects' },
    status: 'placeholder',
  },
  merch: {
    slug: 'merch',
    title: 'Brand experiments',
    description:
      'An early peek at merch partnerships and upcoming drops once ecommerce flows ship.',
    layoutSlots: [
      { id: 'hero', description: 'Hero callout with featured collection tile.' },
      { id: 'callout', description: 'Waitlist form for founding customers.' },
    ],
    cta: { label: 'Join the merch waitlist', href: 'https://get2know.io/merch' },
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
