/**
 * Blog Image Zod Schemas
 * @see /specs/007-add-image-handling/data-model.md
 * Feature: 007-add-image-handling
 */

import { z } from 'zod';

/**
 * Hero image metadata schema for frontmatter validation
 */
export const HeroImageMetaSchema = z.object({
  src: z.string().min(1, 'Hero image src is required'),
  alt: z.string().default(''),
  caption: z.string().max(200).optional(),
  focalPoint: z.string().optional().default('center'),
});

/**
 * Inline image props schema for MDX component validation
 */
export const InlineImagePropsSchema = z.object({
  src: z.string().min(1, 'Image src is required'),
  alt: z.string().default(''),
  caption: z.string().max(200).optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

/**
 * Extended frontmatter schema with hero image support
 */
export const BlogPostFrontmatterWithHeroSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().optional(),
  hero: HeroImageMetaSchema.optional(),
});

export type HeroImageMetaInput = z.input<typeof HeroImageMetaSchema>;
export type HeroImageMetaOutput = z.output<typeof HeroImageMetaSchema>;
export type InlineImagePropsInput = z.input<typeof InlineImagePropsSchema>;
