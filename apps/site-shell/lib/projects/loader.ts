/**
 * Project Data Loader
 * Reads project content from markdown files in content/projects/
 * @see /specs/010-projects-section/contracts/routes.md
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import matter from 'gray-matter';
import {
  projectFrontmatterSchema,
  isValidSlug,
  formatValidationErrors,
} from './schema';
import type {
  Project,
  ProjectCardModel,
  ProjectDetailModel,
  ProjectStatus,
  ProcessedImage,
} from './types';

let cachedProjects: Project[] | null = null;

/**
 * Get the content directory path (handles monorepo structure)
 */
function getProjectsContentDir(): string {
  const possiblePaths = [
    join(process.cwd(), 'content/projects'),
    join(process.cwd(), '../../content/projects'),
  ];

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      return p;
    }
  }

  return join(process.cwd(), 'content/projects');
}

/**
 * Get the images directory path
 */
function getImagesDir(): string {
  const possiblePaths = [
    join(process.cwd(), 'content/images/projects'),
    join(process.cwd(), '../../content/images/projects'),
  ];

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      return p;
    }
  }

  return join(process.cwd(), 'content/images/projects');
}

/**
 * Get image dimensions from file
 */
function getImageDimensions(
  imagePath: string
): { width: number; height: number } {
  try {
    const buffer = readFileSync(imagePath);

    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }

    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === undefined) break;
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += length + 2;
      }
    }

    // WebP
    if (
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    ) {
      if (buffer[12] === 0x56 && buffer[13] === 0x50 && buffer[14] === 0x38 && buffer[15] === 0x20) {
        const width = (buffer[26] ?? 0) | ((buffer[27] ?? 0) << 8);
        const height = (buffer[28] ?? 0) | ((buffer[29] ?? 0) << 8);
        return { width: width & 0x3fff, height: height & 0x3fff };
      }
      if (buffer[12] === 0x56 && buffer[13] === 0x50 && buffer[14] === 0x38 && buffer[15] === 0x4c) {
        const bits = buffer.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }

    return { width: 1200, height: 630 };
  } catch {
    return { width: 1200, height: 630 };
  }
}

/**
 * Generate blur placeholder SVG
 */
function generateBlurPlaceholder(width: number, height: number): string {
  const aspectRatio = width / height;
  const placeholderWidth = 10;
  const placeholderHeight = Math.round(placeholderWidth / aspectRatio);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${placeholderWidth}" height="${placeholderHeight}">
    <rect width="100%" height="100%" fill="#e2e8f0"/>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Process hero image for a project
 */
function processHeroImage(
  slug: string,
  hero: { src: string; alt: string } | undefined
): ProcessedImage | undefined {
  if (!hero) return undefined;

  const imagesDir = getImagesDir();
  const imagePath = join(imagesDir, slug, hero.src);

  if (!existsSync(imagePath)) {
    console.warn(`[projects] Hero image not found: ${imagePath}`);
    return undefined;
  }

  const { width, height } = getImageDimensions(imagePath);
  const blurDataURL = generateBlurPlaceholder(width, height);

  return {
    src: `/content-images/projects/${slug}/${hero.src}`,
    width,
    height,
    alt: hero.alt,
    blurDataURL,
  };
}

/**
 * Load a single project from its markdown file
 */
function loadProject(slug: string, contentDir: string): Project | null {
  const projectDir = join(contentDir, slug);

  // Check if directory exists
  if (!existsSync(projectDir) || !statSync(projectDir).isDirectory()) {
    return null;
  }

  // Find index file (md or mdx)
  const mdPath = join(projectDir, 'index.md');
  const mdxPath = join(projectDir, 'index.mdx');
  const filePath = existsSync(mdPath) ? mdPath : existsSync(mdxPath) ? mdxPath : null;

  if (!filePath) {
    console.warn(`[projects] No index.md or index.mdx found in ${projectDir}`);
    return null;
  }

  // Read and parse file
  const fileContent = readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);

  // Validate frontmatter
  const result = projectFrontmatterSchema.safeParse(frontmatter);
  if (!result.success) {
    const errors = formatValidationErrors(result.error.issues);
    console.error(`[projects] Validation failed for ${slug}:\n${errors}`);
    return null;
  }

  const validated = result.data;

  // Process hero image
  const processedImage = processHeroImage(slug, validated.hero);

  const project: Project = {
    slug,
    name: validated.name,
    summary: validated.summary,
    details: content.trim(),
    tags: validated.tags,
    links: validated.links.map((l) => ({
      label: l.label,
      url: l.url,
      type: l.type,
    })),
  };

  if (validated.status) {
    project.status = validated.status as ProjectStatus;
  }
  if (validated.hero) {
    project.hero = validated.hero;
  }
  if (processedImage) {
    project.image = processedImage;
  }
  if (validated.order !== undefined) {
    project.order = validated.order;
  }

  return project;
}

/**
 * Load and validate all projects from markdown files
 */
function loadProjects(): Project[] {
  if (cachedProjects !== null) {
    return cachedProjects;
  }

  const contentDir = getProjectsContentDir();

  if (!existsSync(contentDir)) {
    console.warn(`[projects] Content directory not found: ${contentDir}`);
    cachedProjects = [];
    return cachedProjects;
  }

  const entries = readdirSync(contentDir, { withFileTypes: true });
  const projects: Project[] = [];
  const slugs = new Set<string>();

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;

    // Validate slug format
    if (!isValidSlug(slug)) {
      console.warn(
        `[projects] Invalid slug format: "${slug}". Must be lowercase kebab-case.`
      );
      continue;
    }

    // Check for duplicates
    if (slugs.has(slug)) {
      console.warn(`[projects] Duplicate slug: "${slug}"`);
      continue;
    }
    slugs.add(slug);

    const project = loadProject(slug, contentDir);
    if (project) {
      projects.push(project);
    }
  }

  cachedProjects = projects;
  return cachedProjects;
}

/**
 * Clear the cache (useful for testing or hot reload)
 */
export function clearProjectsCache(): void {
  cachedProjects = null;
}

/**
 * Get all projects sorted by order (then by name as fallback)
 */
export function getAllProjects(): Project[] {
  const projects = loadProjects();
  return [...projects].sort((a, b) => {
    // Sort by order first (projects without order go to the end)
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    // Fall back to alphabetical by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get a single project by slug
 */
export function getProjectBySlug(slug: string): Project | null {
  const projects = loadProjects();
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * Get all project slugs for static generation
 */
export function getAllProjectSlugs(): string[] {
  const projects = loadProjects();
  return projects.map((p) => p.slug);
}

/**
 * Transform a Project to a ProjectCardModel for index page
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
