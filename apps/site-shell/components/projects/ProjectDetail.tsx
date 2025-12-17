/**
 * Project detail component for full project view
 * @see /specs/010-projects-section/contracts/routes.md
 */

import Image from 'next/image';
import type { ProjectDetailModel } from '@/lib/projects/types';
import ProjectTags from './ProjectTags';

interface ProjectDetailProps {
  project: ProjectDetailModel;
  onPrimaryClick?: () => void;
}

export default function ProjectDetail({
  project,
  onPrimaryClick,
}: ProjectDetailProps) {
  return (
    <article className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-shell-foreground mb-2">
          {project.name}
        </h1>
        <p className="text-lg text-shell-muted">{project.summary}</p>
      </header>

      {/* Image or placeholder */}
      <div className="rounded-2xl border border-shell-border overflow-hidden bg-shell-accent/5">
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={800}
            height={400}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-shell-muted">
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="prose prose-lg max-w-none">
        <p className="text-shell-foreground whitespace-pre-line">
          {project.details}
        </p>
      </div>

      {/* Tags */}
      <div>
        <h2 className="text-sm font-semibold text-shell-foreground mb-2">
          Tags
        </h2>
        <ProjectTags tags={project.tags} />
      </div>

      {/* Links */}
      <div className="space-y-4">
        {/* Primary CTA */}
        {project.primaryLink && (
          <a
            href={project.primaryLink.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onPrimaryClick}
            className="inline-flex items-center justify-center rounded-lg bg-shell-accent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-shell-accent/90 focus:outline-none focus:ring-2 focus:ring-shell-accent focus:ring-offset-2"
          >
            {project.primaryLink.label}
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}

        {/* Secondary links */}
        {project.secondaryLinks.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {project.secondaryLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-shell-accent hover:underline"
              >
                {link.label}
                <svg
                  className="ml-1 h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
