import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import type { Product } from '@/lib/merch/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link
      href={`/merch/${product.slug}`}
      aria-label={`View ${product.name} - ${product.priceDisplay} - ${product.status}`}
      className="block group"
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={product.heroImage.url}
            alt={product.heroImage.alt}
            fill
            priority={priority}
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute right-2 top-2">
            <StatusBadge status={product.status} size="sm" />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="truncate text-lg font-semibold text-foreground">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
          <p className="mt-2 font-medium text-foreground">{product.priceDisplay}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
