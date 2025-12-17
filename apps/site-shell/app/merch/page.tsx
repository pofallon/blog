import { loadProductCatalog } from '@/lib/merch/loader';
import ProductCard from '@/components/merch/ProductCard';
import MerchEmptyState from '@/components/merch/MerchEmptyState';
import CommerceInfoBlock from '@/components/merch/CommerceInfoBlock';
import MerchIndexAnalytics from './MerchIndexAnalytics';

export const metadata = {
  title: 'Merch | Get2Know',
  description: 'Browse our collection of merchandise and limited drops.',
};

export default async function MerchPage() {
  const products = await loadProductCatalog();

  return (
    <div className="space-y-8">
      <MerchIndexAnalytics productCount={products.length} />

      <section className="text-center">
        <h1 className="text-4xl font-bold text-shell-text">Merch</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-shell-muted">
          Limited drops and exclusive merchandise. Browse our collection and find something special.
        </p>
      </section>

      {products.length === 0 ? (
        <MerchEmptyState />
      ) : (
        <section aria-label="Product catalog">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index < 4} />
            ))}
          </div>
        </section>
      )}

      <CommerceInfoBlock variant="index" />
    </div>
  );
}
