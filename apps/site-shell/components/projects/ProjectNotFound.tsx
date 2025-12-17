/**
 * Project not found component for soft 404
 * @see /specs/010-projects-section/contracts/routes.md
 */

import Link from 'next/link';

interface ProjectNotFoundProps {
  attemptedSlug: string;
}

export default function ProjectNotFound({ attemptedSlug }: ProjectNotFoundProps) {
  return (
    <div className="rounded-2xl border border-shell-border bg-white px-6 py-12 text-center">
      <h1 className="text-2xl font-bold text-shell-foreground mb-4">
        Project Not Found
      </h1>
      <p className="text-shell-muted mb-6">
        We couldn&apos;t find a project with the slug &quot;{attemptedSlug}&quot;.
      </p>
      <Link
        href="/projects"
        className="inline-flex items-center justify-center rounded-lg bg-shell-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-shell-accent/90 focus:outline-none focus:ring-2 focus:ring-shell-accent focus:ring-offset-2"
      >
        Back to Projects
      </Link>
    </div>
  );
}
