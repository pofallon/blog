/**
 * Empty state component for when no blog posts exist
 * @see /specs/005-build-blog-index/research.md
 */

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-shell-border bg-white px-6 py-12 text-center">
      <p className="text-shell-muted">No posts yet. Check back soon!</p>
    </div>
  );
}
