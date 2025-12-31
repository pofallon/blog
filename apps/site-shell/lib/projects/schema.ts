/**
 * Zod Validation Schemas for Projects
 * @see /specs/010-projects-section/data-model.md
 */

import { z } from 'zod';

export const projectLinkSchema = z.object({
  label: z.string().min(1, 'Link label is required'),
  url: z.url('Invalid URL format'),
  type: z.enum(['primary', 'secondary']).optional().default('secondary'),
});

export const projectImageSchema = z.object({
  src: z.string().min(1, 'Image src is required'),
  alt: z.string().min(1, 'Image alt text is required'),
});

export const projectStatusSchema = z.enum(['ready', 'in-progress', 'coming-soon']);

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Slug must be lowercase kebab-case (e.g., my-project)'
    ),
  name: z.string().min(1, 'Project name is required'),
  status: projectStatusSchema.optional(),
  summary: z.string().min(1, 'Summary is required'),
  details: z.string().min(1, 'Details are required'),
  tags: z.array(z.string().min(1)).min(1, 'At least one tag is required'),
  links: z.array(projectLinkSchema).min(1, 'At least one link is required'),
  image: projectImageSchema.optional(),
});

export const projectsDataSchema = z.object({
  projects: z.array(projectSchema),
});

/**
 * Validate that all project slugs are unique
 * @param projects - Array of projects to validate
 * @returns Array of duplicate slug strings (empty if all unique)
 */
export function validateUniqueSlugs(
  projects: z.infer<typeof projectSchema>[]
): string[] {
  const slugs = projects.map((p) => p.slug);
  const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
  return [...new Set(duplicates)];
}

export type ProjectLinkSchema = z.infer<typeof projectLinkSchema>;
export type ProjectImageSchema = z.infer<typeof projectImageSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;
export type ProjectsDataSchema = z.infer<typeof projectsDataSchema>;
