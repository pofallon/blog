/**
 * Frontmatter parser using gray-matter
 * @see /specs/003-add-mdx-support/research.md
 */

import matter from 'gray-matter';
import { FrontmatterSchema, formatValidationErrors } from './validator';
import type { FrontmatterMetadata, ValidationResult } from './types';

export type ParseResult = {
  metadata: FrontmatterMetadata;
  content: string;
  validation: ValidationResult;
};

/**
 * Parse frontmatter from raw MDX content
 * @param rawContent Raw MDX file content
 * @param filePath Path to the file (for error messages)
 * @returns Parsed metadata, content, and validation result
 */
export function parseFrontmatter(rawContent: string, filePath: string): ParseResult {
  const { data, content } = matter(rawContent);

  const parseResult = FrontmatterSchema.safeParse(data);

  if (!parseResult.success) {
    const errors = formatValidationErrors(filePath, parseResult.error);
    return {
      metadata: {
        title: '',
        date: '',
        description: '',
      },
      content,
      validation: {
        valid: false,
        filePath,
        errors,
        warnings: [],
      },
    };
  }

  const warnings: string[] = [];

  return {
    metadata: parseResult.data as FrontmatterMetadata,
    content,
    validation: {
      valid: true,
      filePath,
      errors: [],
      warnings,
    },
  };
}
