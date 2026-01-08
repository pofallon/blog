/**
 * Zod Validation Schemas for Project Frontmatter
 * @see /specs/010-projects-section/data-model.md
 */

import { z } from 'zod';

export const projectLinkSchema = z.object({
  label: z.string().min(1, 'Link label is required'),
  url: z.string().url('Invalid URL format'),
  type: z.enum(['primary', 'secondary']).optional().default('secondary'),
});

export const projectHeroSchema = z.object({
  src: z.string().min(1, 'Hero src is required'),
  alt: z.string().min(1, 'Hero alt text is required'),
});

export const projectStatusSchema = z.enum(['ready', 'in-progress', 'coming-soon']);

/**
 * Schema for project frontmatter (parsed from markdown files)
 * Note: slug comes from folder name, details comes from markdown body
 */
export const projectFrontmatterSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  status: projectStatusSchema.optional(),
  summary: z.string().min(1, 'Summary is required'),
  tags: z.array(z.string().min(1)).min(1, 'At least one tag is required'),
  links: z.array(projectLinkSchema).min(1, 'At least one link is required'),
  hero: projectHeroSchema.optional(),
  order: z.number().int().optional(),
});

/**
 * Validate slug format (kebab-case)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * Format validation errors with clear, actionable messages
 */
export function formatValidationErrors(
  issues: { path: PropertyKey[]; message: string }[]
): string {
  return issues
    .map((issue) => {
      const path = issue.path.map(String).join('.');
      if (path.includes('url')) {
        return `  - ${path}: ${issue.message}\n    Hint: URLs must include protocol (e.g., "https://...")`;
      }
      return `  - ${path}: ${issue.message}`;
    })
    .join('\n');
}

export type ProjectLinkSchema = z.infer<typeof projectLinkSchema>;
export type ProjectHeroSchema = z.infer<typeof projectHeroSchema>;
export type ProjectFrontmatterSchema = z.infer<typeof projectFrontmatterSchema>;
