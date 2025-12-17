/**
 * TypeScript Type Definitions for Projects
 * @see /specs/010-projects-section/data-model.md
 */

/**
 * External resource link associated with a project
 */
export interface ProjectLink {
  label: string;
  url: string;
  type?: 'primary' | 'secondary';
}

/**
 * Optional image metadata for project visuals
 */
export interface ProjectImage {
  src: string;
  alt: string;
}

/**
 * Primary entity representing an open source project
 */
export interface Project {
  slug: string;
  name: string;
  summary: string;
  details: string;
  tags: string[];
  links: ProjectLink[];
  image?: ProjectImage;
}

/**
 * Root data structure for projects.json
 */
export interface ProjectsData {
  projects: Project[];
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
