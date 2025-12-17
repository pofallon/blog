# Route Contracts: Open Source Projects Section

**Feature**: 010-projects-section  
**Date**: 2025-12-17  
**Version**: 1.0.0

## Overview

This document defines the route contracts for the projects section. Since this is a statically generated Next.js application, there are no REST API endpoints. The contracts describe the page routes, their parameters, and expected behavior.

## Routes

### GET /projects

**Description**: Projects index page listing all open source projects.

**Type**: Static page (generated at build time)

**Response**: HTML page with project cards

**Contract**:
```typescript
// Input: None (static page)
// Output: ProjectIndexPageProps

interface ProjectIndexPageProps {
  projects: ProjectCardModel[];
}

interface ProjectCardModel {
  slug: string;      // URL slug for link
  name: string;      // Display name
  summary: string;   // Short description
  tags: string[];    // First 3 tags only
  href: string;      // Computed: /projects/{slug}
}
```

**Behavior**:
- Returns all projects sorted alphabetically by `name`
- Each project displays `name`, `summary`, up to 3 `tags`
- Each card links to `/projects/{slug}`
- If zero projects exist, shows empty state message

**Success Response**: HTTP 200 with rendered page

### GET /projects/[slug]

**Description**: Project detail page for a specific project.

**Type**: Dynamic route with static generation (`generateStaticParams`)

**Params**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | ✅ | Project slug from URL |

**Response**: HTML page with full project details OR soft 404 component

**Contract**:
```typescript
// Input
interface ProjectDetailParams {
  slug: string;
}

// Output (success): ProjectDetailPageProps
interface ProjectDetailPageProps {
  project: ProjectDetailModel;
}

interface ProjectDetailModel {
  slug: string;
  name: string;
  summary: string;
  details: string;
  tags: string[];
  links: ProjectLink[];
  image?: ProjectImage;
  primaryLink: ProjectLink | null;
  secondaryLinks: ProjectLink[];
  hasImage: boolean;
}

// Output (not found): ProjectNotFoundProps
interface ProjectNotFoundProps {
  attemptedSlug: string;
  message: string;
  ctaHref: string;     // /projects
  ctaLabel: string;    // "Back to Projects"
}
```

**Behavior**:
- Valid slug: Renders full project details
- Invalid slug: Renders soft 404 component (HTTP 200)
- Primary CTA button opens main link in new tab
- Primary CTA click fires analytics event
- Missing image shows placeholder

**Success Response**: HTTP 200 with rendered page (always, per soft 404 requirement)

## Static Generation Contract

### generateStaticParams

```typescript
// lib/projects/loader.ts

/**
 * Returns all valid project slugs for static generation
 * Called at build time by Next.js
 */
export function getAllProjectSlugs(): string[] {
  // Returns: ['project-a', 'project-b', ...]
}

/**
 * Load single project by slug
 * Returns null if not found (triggers soft 404 UI)
 */
export function getProjectBySlug(slug: string): Project | null {
  // Returns: Project object or null
}

/**
 * Load all projects for index page
 * Sorted alphabetically by name
 */
export function getAllProjects(): Project[] {
  // Returns: Array of all projects, sorted by name
}
```

## Component Contracts

### ProjectCard

```typescript
interface ProjectCardProps {
  project: ProjectCardModel;
}
```

### ProjectDetail

```typescript
interface ProjectDetailProps {
  project: ProjectDetailModel;
  onPrimaryClick?: () => void;  // Analytics event handler
}
```

### ProjectTags

```typescript
interface ProjectTagsProps {
  tags: string[];
  maxDisplay?: number;  // Default: undefined (show all)
}
```

### ProjectNotFound

```typescript
interface ProjectNotFoundProps {
  attemptedSlug: string;
}
```

### ProjectEmptyState

```typescript
interface ProjectEmptyStateProps {
  message?: string;
}
```

## Analytics Events

### Outbound Link Click (FR-006)

**Event Name**: `project_link_click`

**Payload**:
```typescript
interface ProjectLinkClickEvent {
  event: 'project_link_click';
  projectSlug: string;
  linkLabel: string;
  linkUrl: string;
  linkType: 'primary' | 'secondary';
}
```

**Trigger**: User clicks primary CTA button on detail page

## Metadata Contract

### Page Metadata (SEO)

```typescript
// For /projects
export const metadata: Metadata = {
  title: 'Open Source Projects | Get2Know',
  description: 'Browse open source projects and contributions.',
  openGraph: {
    title: 'Open Source Projects',
    description: 'Browse open source projects and contributions.',
    url: 'https://get2know.io/projects',
    type: 'website',
  },
};

// For /projects/[slug] - generated per project
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  
  if (!project) {
    return { title: 'Project Not Found' };
  }
  
  return {
    title: `${project.name} | Projects | Get2Know`,
    description: project.summary,
    openGraph: {
      title: project.name,
      description: project.summary,
      url: `https://get2know.io/projects/${slug}`,
      type: 'website',
      images: project.image ? [{ url: project.image.src }] : undefined,
    },
  };
}
```
