/**
 * Project card component for index listing
 * @see /specs/010-projects-section/contracts/routes.md
 */

import Link from 'next/link';
import type { ProjectCardModel } from '@/lib/projects/types';
import ProjectTags from './ProjectTags';

interface ProjectCardProps {
  project: ProjectCardModel;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={project.href}
      className="block rounded-2xl border border-shell-border bg-white p-5 transition-colors hover:border-shell-accent focus:outline-none focus:ring-2 focus:ring-shell-accent focus:ring-offset-2"
    >
      <article>
        <h2 className="text-lg font-semibold text-shell-foreground mb-2">
          {project.name}
        </h2>
        <p className="text-sm text-shell-muted line-clamp-3 mb-3">
          {project.summary}
        </p>
        <ProjectTags tags={project.tags} maxDisplay={3} />
      </article>
    </Link>
  );
}
