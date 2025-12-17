/**
 * Projects Index Page
 * @see /specs/010-projects-section/contracts/routes.md
 */

import { getAllProjects, toCardModel } from '@/lib/projects/loader';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectEmptyState from '@/components/projects/ProjectEmptyState';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata(
  {
    title: 'Open Source Projects',
    description: 'Browse open source projects and contributions.',
  },
  '/projects'
);

export default function ProjectsPage() {
  const projects = getAllProjects();
  const projectCards = projects.map((p) => toCardModel(p));

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-shell-foreground">Open Source Projects</h1>
      <section aria-label="Projects" className="space-y-4">
        {projectCards.length === 0 ? (
          <ProjectEmptyState />
        ) : (
          projectCards.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))
        )}
      </section>
    </main>
  );
}
