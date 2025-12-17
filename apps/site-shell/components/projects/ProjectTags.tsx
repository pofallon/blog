/**
 * Project tags display component
 * @see /specs/010-projects-section/contracts/routes.md
 */

interface ProjectTagsProps {
  tags: string[];
  maxDisplay?: number;
}

export default function ProjectTags({ tags, maxDisplay }: ProjectTagsProps) {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const hasMore = maxDisplay && tags.length > maxDisplay;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-shell-accent/10 px-2.5 py-0.5 text-xs font-medium text-shell-accent"
        >
          {tag}
        </span>
      ))}
      {hasMore && (
        <span className="inline-flex items-center text-xs text-shell-muted">
          +{tags.length - maxDisplay} more
        </span>
      )}
    </div>
  );
}
