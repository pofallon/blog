/**
 * Project Data Loader
 * @see /specs/010-projects-section/contracts/routes.md
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { projectsDataSchema, validateUniqueSlugs } from './schema';
import type {
  Project,
  ProjectCardModel,
  ProjectDetailModel,
} from './types';

const PROJECTS_FILE = join(process.cwd(), '../../content/projects.json');

let cachedProjects: Project[] | null = null;

/**
 * Format Zod validation errors with clear, actionable messages
 */
function formatValidationErrors(
  issues: { path: PropertyKey[]; message: string }[]
): string {
  return issues
    .map((issue) => {
      const path = issue.path.map(String).join('.');
      if (path.includes('slug')) {
        return `  - ${path}: ${issue.message}\n    Hint: Slugs must be lowercase kebab-case (e.g., "my-project")`;
      }
      if (path.includes('url')) {
        return `  - ${path}: ${issue.message}\n    Hint: URLs must include protocol (e.g., "https://...")`;
      }
      return `  - ${path}: ${issue.message}`;
    })
    .join('\n');
}

/**
 * Load and validate projects from JSON file
 * @throws Error if validation fails or file cannot be read
 */
function loadProjects(): Project[] {
  if (cachedProjects !== null) {
    return cachedProjects;
  }

  let fileContent: string;
  try {
    fileContent = readFileSync(PROJECTS_FILE, 'utf-8');
  } catch {
    throw new Error(
      `Failed to read projects file: ${PROJECTS_FILE}\n` +
        `Ensure the file exists and is readable.`
    );
  }

  let rawData: unknown;
  try {
    rawData = JSON.parse(fileContent);
  } catch {
    throw new Error(
      `Failed to parse projects.json: Invalid JSON syntax.\n` +
        `Check for missing commas, brackets, or quotes.`
    );
  }

  // Validate schema
  const result = projectsDataSchema.safeParse(rawData);
  if (!result.success) {
    const errors = formatValidationErrors(result.error.issues);
    throw new Error(
      `Project data validation failed:\n${errors}\n\n` +
        `See quickstart.md for the required schema format.`
    );
  }

  // Check for duplicate slugs
  const duplicates = validateUniqueSlugs(result.data.projects);
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate project slugs found: ${duplicates.join(', ')}\n` +
        `Each project must have a unique slug.`
    );
  }

  // Map to Project type (handling optional properties)
  cachedProjects = result.data.projects.map((p) => {
    const project: Project = {
      slug: p.slug,
      name: p.name,
      summary: p.summary,
      details: p.details,
      tags: p.tags,
      links: p.links.map((l) => ({
        label: l.label,
        url: l.url,
        type: l.type,
      })),
    };
    if (p.status) {
      project.status = p.status as Project['status'];
    }
    if (p.image) {
      project.image = p.image;
    }
    return project;
  });
  return cachedProjects;
}

/**
 * Get all projects sorted alphabetically by name
 * @returns Array of all projects
 */
export function getAllProjects(): Project[] {
  const projects = loadProjects();
  return [...projects].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single project by slug
 * @param slug - Project slug to find
 * @returns Project or null if not found
 */
export function getProjectBySlug(slug: string): Project | null {
  const projects = loadProjects();
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * Get all project slugs for static generation
 * @returns Array of all project slugs
 */
export function getAllProjectSlugs(): string[] {
  const projects = loadProjects();
  return projects.map((p) => p.slug);
}

/**
 * Transform a Project to a ProjectCardModel for index page
 * @param project - Project to transform
 * @param maxTags - Maximum number of tags to include (default: 3)
 * @returns ProjectCardModel for card display
 */
export function toCardModel(project: Project, maxTags = 3): ProjectCardModel {
  return {
    slug: project.slug,
    name: project.name,
    summary: project.summary,
    tags: project.tags.slice(0, maxTags),
    href: `/projects/${project.slug}`,
  };
}

/**
 * Transform a Project to a ProjectDetailModel for detail page
 * @param project - Project to transform
 * @returns ProjectDetailModel with computed fields
 */
export function toDetailModel(project: Project): ProjectDetailModel {
  const primaryLink = project.links.find((l) => l.type === 'primary') || null;
  const secondaryLinks = project.links.filter((l) => l.type !== 'primary');

  return {
    ...project,
    primaryLink,
    secondaryLinks,
    hasImage: !!project.image,
  };
}
