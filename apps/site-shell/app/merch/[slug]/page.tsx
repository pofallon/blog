import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { loadProductCatalog, loadProductBySlug } from '@/lib/merch/loader';
import ProductGallery from '@/components/merch/ProductGallery';
import StatusBadge from '@/components/merch/StatusBadge';
import StatusCTA from '@/components/merch/StatusCTA';
import CommerceInfoBlock from '@/components/merch/CommerceInfoBlock';
import MerchProductAnalytics from './MerchProductAnalytics';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await loadProductCatalog();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Merch',
    };
  }

  return {
    title: `${product.name} | Merch | Get2Know`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <MerchProductAnalytics
        productSlug={product.slug}
        productName={product.name}
        productStatus={product.status}
      />

      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/merch" className="text-shell-muted hover:text-shell-text">
              Merch
            </Link>
          </li>
          <li className="text-shell-muted">/</li>
          <li className="font-medium text-shell-text">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery
          heroImage={product.heroImage}
          galleryImages={product.galleryImages}
          productName={product.name}
        />

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-shell-text">{product.name}</h1>
              <StatusBadge status={product.status} size="md" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-shell-accent">{product.priceDisplay}</p>
          </div>

          <div className="prose prose-shell max-w-none">
            <p className="text-shell-muted">{product.longDescription}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <StatusCTA status={product.status} productSlug={product.slug} variant="detail" />
          </div>
        </div>
      </div>

      <CommerceInfoBlock variant="detail" />
    </div>
  );
}
