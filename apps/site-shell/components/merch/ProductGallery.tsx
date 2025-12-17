'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/lib/merch/types';

interface ProductGalleryProps {
  heroImage: ProductImage;
  galleryImages: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  heroImage,
  galleryImages,
  productName,
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<ProductImage>(heroImage);
  const allImages = useMemo(() => [heroImage, ...galleryImages], [heroImage, galleryImages]);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' && index < allImages.length - 1) {
      nextIndex = index + 1;
    } else if (e.key === 'ArrowLeft' && index > 0) {
      nextIndex = index - 1;
    }
    if (nextIndex !== index) {
      const nextImage = allImages[nextIndex];
      if (nextImage) {
        setActiveImage(nextImage);
        thumbnailRefs.current[nextIndex]?.focus();
      }
    }
  }, [allImages]);

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label={`Product images for ${productName}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scroll-smooth pb-2" style={{ scrollSnapType: 'x mandatory' }}>
          {allImages.map((image, index) => (
            <button
              key={image.url}
              ref={(el) => { thumbnailRefs.current[index] = el; }}
              onClick={() => { setActiveImage(image); }}
              onKeyDown={(e) => { handleKeyDown(e, index); }}
              className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                activeImage.url === image.url
                  ? 'border-shell-accent ring-2 ring-shell-accent/20'
                  : 'border-transparent hover:border-shell-border'
              }`}
              style={{ scrollSnapAlign: 'start' }}
              aria-label={`View image ${String(index + 1)}: ${image.alt}`}
              aria-pressed={activeImage.url === image.url}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                loading="lazy"
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
