/**
 * Empty state component for when no projects exist
 * @see /specs/010-projects-section/research.md
 */

interface ProjectEmptyStateProps {
  message?: string;
}

export default function ProjectEmptyState({
  message = 'No projects yet. Check back soon!',
}: ProjectEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-shell-border bg-white px-6 py-12 text-center">
      <p className="text-shell-muted">{message}</p>
    </div>
  );
}
