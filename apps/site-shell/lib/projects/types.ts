/**
 * TypeScript Type Definitions for Projects
 * @see /specs/010-projects-section/data-model.md
 */

/**
 * Processed image ready for optimized display
 */
export interface ProcessedImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
}

/**
 * Project development status
 */
export type ProjectStatus = 'ready' | 'in-progress' | 'coming-soon';

/**
 * External resource link associated with a project
 */
export interface ProjectLink {
  label: string;
  url: string;
  type?: 'primary' | 'secondary';
}

/**
 * Hero image metadata from frontmatter
 */
export interface ProjectHero {
  src: string;
  alt: string;
}

/**
 * Primary entity representing an open source project
 */
export interface Project {
  slug: string;
  name: string;
  status?: ProjectStatus;
  summary: string;
  details: string;
  tags: string[];
  links: ProjectLink[];
  hero?: ProjectHero;
  /** Processed image with dimensions and blur placeholder */
  image?: ProcessedImage;
  /** Display order (lower numbers appear first) */
  order?: number;
}

/**
 * View model for project cards on index page
 */
export interface ProjectCardModel {
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  href: string;
}

/**
 * View model for project detail page
 */
export interface ProjectDetailModel extends Project {
  primaryLink: ProjectLink | null;
  secondaryLinks: ProjectLink[];
  hasImage: boolean;
}
