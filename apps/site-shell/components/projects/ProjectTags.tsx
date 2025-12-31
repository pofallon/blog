/**
 * Project tags display component
 * @see /specs/010-projects-section/contracts/routes.md
 */

interface ProjectTagsProps {
  tags: string[];
  maxDisplay?: number;
  colorVar?: string;
}

export default function ProjectTags({
  tags,
  maxDisplay,
  colorVar,
}: ProjectTagsProps) {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const hasMore = maxDisplay && tags.length > maxDisplay;

  // Use custom color or fall back to shell-accent
  const tagStyle = colorVar
    ? {
        backgroundColor: `hsl(var(--${colorVar}) / 0.1)`,
        color: `hsl(var(--${colorVar}))`,
        border: `1px solid hsl(var(--${colorVar}) / 0.2)`,
      }
    : undefined;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => (
        <span
          key={tag}
          className={
            colorVar
              ? 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors hover:opacity-80'
              : 'inline-flex items-center rounded-full bg-shell-accent/10 px-2.5 py-0.5 text-xs font-medium text-shell-accent'
          }
          style={tagStyle}
        >
          {tag}
        </span>
      ))}
      {hasMore && (
        <span className="inline-flex items-center text-xs text-g2k-fg-muted">
          +{tags.length - maxDisplay} more
        </span>
      )}
    </div>
  );
}
