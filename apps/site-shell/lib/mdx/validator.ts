/**
 * Zod schema validation for MDX frontmatter
 * @see /specs/003-add-mdx-support/data-model.md
 */

import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const ImageMetaSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  alt: z.string().min(1, 'Image alt text is required'),
});

export const FrontmatterSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .transform((s) => s.trim()),
  date: z
    .string()
    .regex(dateRegex, 'Date must be in YYYY-MM-DD format')
    .refine((val) => !isNaN(Date.parse(val)), 'Date must be a valid calendar date'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description should not exceed 200 characters'),
  image: ImageMetaSchema.optional(),
});

export type FrontmatterInput = z.input<typeof FrontmatterSchema>;
export type FrontmatterOutput = z.output<typeof FrontmatterSchema>;

/**
 * Format validation errors with actionable messages
 * @param filePath Path to the MDX file
 * @param errors Zod validation errors
 * @returns Array of formatted error messages
 */
export function formatValidationErrors(
  filePath: string,
  errors: z.ZodError
): string[] {
  return errors.issues.map((err) => {
    const field = err.path.join('.');
    if (err.code === 'too_small' && 'minimum' in err && err.minimum === 1) {
      return `[${filePath}] Missing required field: ${field}`;
    }
    if (err.message.includes('YYYY-MM-DD')) {
      return `[${filePath}] Invalid date format: expected YYYY-MM-DD`;
    }
    return `[${filePath}] ${field}: ${err.message}`;
  });
}
