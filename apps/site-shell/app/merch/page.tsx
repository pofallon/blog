import PlaceholderShowcase from '@/components/PlaceholderShowcase';
import { getPlaceholderBySlug } from '@/lib/placeholders';

export default function MerchPage() {
  const placeholder = getPlaceholderBySlug('merch');

  return (
    <div className="space-y-6">
      <PlaceholderShowcase placeholder={placeholder} />
      <section className="rounded-3xl border border-shell-border bg-white px-6 py-5">
        <p className="text-sm text-shell-muted">
          This route holds the experiment backlog for limited drops and enables stakeholders to test
          merchandising flows before integrating the commerce service.
        </p>
      </section>
    </div>
  );
}
