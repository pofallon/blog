/**
 * Project card component for index listing
 * @see /specs/010-projects-section/contracts/routes.md
 */

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ProjectCardModel } from '@/lib/projects/types';
import ProjectTags from './ProjectTags';

interface ProjectCardProps {
  project: ProjectCardModel;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={project.href} className="block group">
      <Card className="h-full transition-colors hover:border-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription className="line-clamp-3">
            {project.summary}
          </CardDescription>
          <ProjectTags tags={project.tags} maxDisplay={3} />
        </CardContent>
      </Card>
    </Link>
  );
}
