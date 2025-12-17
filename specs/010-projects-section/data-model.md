# Data Model: Open Source Projects Section

**Feature**: 010-projects-section  
**Date**: 2025-12-17  
**Version**: 1.0.0

## Entities

### Project

Primary entity representing an open source project in the catalog.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | ✅ | URL-safe identifier (lowercase, alphanumeric, hyphens) |
| `name` | string | ✅ | Display name of the project |
| `summary` | string | ✅ | Short description (max 160 chars for cards) |
| `details` | string | ✅ | Full description (supports multi-line) |
| `tags` | string[] | ✅ | At least 1 tag required |
| `links` | ProjectLink[] | ✅ | At least 1 link required |
| `image` | ProjectImage | ❌ | Optional hero/preview image |

**Validation Rules**:
- `slug`: Must match pattern `/^[a-z0-9]+(-[a-z0-9]+)*$/` (lowercase kebab-case)
- `slug`: Must be unique across all projects
- `name`: Non-empty string
- `summary`: Non-empty, recommend ≤160 characters
- `details`: Non-empty string
- `tags`: Array with 1+ items
- `links`: Array with 1+ items (primary link required)

### ProjectLink

Child entity describing an external resource associated with a project.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | ✅ | Display text (e.g., "GitHub", "Documentation") |
| `url` | string | ✅ | Full URL including protocol |
| `type` | "primary" \| "secondary" | ❌ | CTA ordering hint (default: "secondary") |

**Validation Rules**:
- `label`: Non-empty string
- `url`: Must be valid URL starting with `https://` or `http://`
- `type`: Enum, defaults to "secondary" if omitted
- At least one link with `type: "primary"` recommended per project

### ProjectImage

Optional image metadata for project visuals.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `src` | string | ✅ | Image source path or URL |
| `alt` | string | ✅ | Accessible alt text |

**Validation Rules**:
- `src`: Non-empty string (relative path or absolute URL)
- `alt`: Non-empty string describing the image

## TypeScript Definitions

```typescript
// lib/projects/types.ts

export interface ProjectLink {
  label: string;
  url: string;
  type?: 'primary' | 'secondary';
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  name: string;
  summary: string;
  details: string;
  tags: string[];
  links: ProjectLink[];
  image?: ProjectImage;
}

export interface ProjectsData {
  projects: Project[];
}

// View models for components
export interface ProjectCardModel {
  slug: string;
  name: string;
  summary: string;
  tags: string[];        // First 3 tags for card display
  href: string;          // Computed: /projects/{slug}
}

export interface ProjectDetailModel extends Project {
  primaryLink: ProjectLink | null;
  secondaryLinks: ProjectLink[];
  hasImage: boolean;
}
```

## Zod Schema

```typescript
// lib/projects/schema.ts
import { z } from 'zod';

export const projectLinkSchema = z.object({
  label: z.string().min(1, 'Link label is required'),
  url: z.string().url('Invalid URL format'),
  type: z.enum(['primary', 'secondary']).optional().default('secondary'),
});

export const projectImageSchema = z.object({
  src: z.string().min(1, 'Image src is required'),
  alt: z.string().min(1, 'Image alt text is required'),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Slug must be lowercase kebab-case (e.g., my-project)'
    ),
  name: z.string().min(1, 'Project name is required'),
  summary: z.string().min(1, 'Summary is required'),
  details: z.string().min(1, 'Details are required'),
  tags: z.array(z.string().min(1)).min(1, 'At least one tag is required'),
  links: z.array(projectLinkSchema).min(1, 'At least one link is required'),
  image: projectImageSchema.optional(),
});

export const projectsDataSchema = z.object({
  projects: z.array(projectSchema),
});

// Custom validation for slug uniqueness
export function validateUniqueSlugs(projects: Project[]): string[] {
  const slugs = projects.map((p) => p.slug);
  const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
  return [...new Set(duplicates)];
}

export type ProjectLink = z.infer<typeof projectLinkSchema>;
export type ProjectImage = z.infer<typeof projectImageSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectsData = z.infer<typeof projectsDataSchema>;
```

## Data Source Location

**File**: `content/projects.json`

**Example Structure**:
```json
{
  "projects": [
    {
      "slug": "example-project",
      "name": "Example Project",
      "summary": "A short description that appears on the index card.",
      "details": "A longer description with more context about the project, its goals, and how to contribute.",
      "tags": ["typescript", "open-source", "developer-tools"],
      "links": [
        {
          "label": "GitHub",
          "url": "https://github.com/user/example-project",
          "type": "primary"
        },
        {
          "label": "Documentation",
          "url": "https://example-project.dev/docs",
          "type": "secondary"
        }
      ],
      "image": {
        "src": "/images/projects/example-project.png",
        "alt": "Example Project logo"
      }
    }
  ]
}
```

## State Transitions

Projects are static content with no runtime state changes. State management is limited to:

1. **Build Time**: JSON loaded → Schema validated → Static pages generated
2. **Runtime (Index)**: All projects displayed alphabetically by name
3. **Runtime (Detail)**: Single project displayed with full content

## Relationships

```
ProjectsData (1)
    └── Project (many)
            ├── ProjectLink (many, 1+ required)
            └── ProjectImage (0..1)
```

## Edge Case Handling

| Scenario | Validation | Runtime Behavior |
|----------|------------|------------------|
| Zero projects | Build succeeds | Show empty state message |
| Duplicate slugs | Build fails with error | N/A |
| Missing required field | Build fails with Zod error | N/A |
| Invalid URL format | Build fails with Zod error | N/A |
| Missing image | Build succeeds | Render placeholder on detail |
| >5 tags | Build succeeds | Wrap/compress in UI |
| URL without protocol | Build fails (URL validation) | N/A |
