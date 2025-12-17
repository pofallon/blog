import PlaceholderShowcase from '@/components/PlaceholderShowcase';
import { getPlaceholderBySlug } from '@/lib/placeholders';

export default function ProjectsPage() {
  const placeholder = getPlaceholderBySlug('projects');

  return (
    <div className="space-y-6">
      <PlaceholderShowcase placeholder={placeholder} />
      <section className="rounded-3xl border border-shell-border bg-white px-6 py-5">
        <p className="text-sm text-shell-muted">
          Use this view to track dependencies, owners, and Amplify deployment readiness for every
          shell milestone.
        </p>
      </section>
    </div>
  );
}
