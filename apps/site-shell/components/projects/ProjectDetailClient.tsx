'use client';

/**
 * Client-side wrapper for project detail with analytics
 * @see /specs/010-projects-section/contracts/routes.md
 */

import type { ProjectDetailModel } from '@/lib/projects/types';
import ProjectDetail from './ProjectDetail';
import { trackProjectLinkClick } from '@/lib/projects/analytics';

interface ProjectDetailClientProps {
  project: ProjectDetailModel;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const handlePrimaryClick = () => {
    if (project.primaryLink) {
      trackProjectLinkClick(
        project.slug,
        project.primaryLink.label,
        project.primaryLink.url,
        'primary'
      );
    }
  };

  return <ProjectDetail project={project} onPrimaryClick={handlePrimaryClick} />;
}
