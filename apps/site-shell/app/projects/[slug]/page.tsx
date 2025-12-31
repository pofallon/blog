/**
 * Project Detail Page
 * @see /specs/010-projects-section/contracts/routes.md
 */

import type { Metadata } from 'next';
import {
  getAllProjectSlugs,
  getProjectBySlug,
  toDetailModel,
} from '@/lib/projects/loader';
import ProjectDetailClient from '@/components/projects/ProjectDetailClient';
import ProjectDetailContent from '@/components/projects/ProjectDetailContent';
import { getProjectColor } from '@/lib/projects/colors';
import ProjectNotFound from '@/components/projects/ProjectNotFound';
import { buildPageMetadata } from '@/lib/seo';

interface PageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const override: Parameters<typeof buildPageMetadata>[0] = {
    title: project.name,
    description: project.summary,
  };

  if (project.image) {
    override.shareImage = { url: project.image.src, alt: project.image.alt };
  }

  return buildPageMetadata(override, `/projects/${slug}`);
}

export default async function ProjectPage({ params }: PageParams) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <main className="space-y-6">
        <ProjectNotFound attemptedSlug={slug} />
      </main>
    );
  }

  const detailModel = toDetailModel(project);
  const colorVar = getProjectColor(slug);

  return (
    <main className="space-y-6">
      <ProjectDetailClient project={detailModel}>
        {/* MDX content rendered server-side */}
        <ProjectDetailContent content={project.details} colorVar={colorVar} />
      </ProjectDetailClient>
    </main>
  );
}
