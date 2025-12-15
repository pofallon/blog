import PlaceholderShowcase from '@/components/PlaceholderShowcase';
import { getPlaceholderBySlug } from '@/lib/placeholders';

export default function BlogPage() {
  const placeholder = getPlaceholderBySlug('blog');

  return (
    <div className="space-y-6">
      <PlaceholderShowcase placeholder={placeholder} />
      <section className="rounded-3xl border border-shell-border bg-white px-6 py-5">
        <p className="text-sm text-shell-muted">
          Upcoming work: wire the RSS importer and MDX renderer while ensuring existing Gatsby
          content remains the source of truth.
        </p>
      </section>
    </div>
  );
}
