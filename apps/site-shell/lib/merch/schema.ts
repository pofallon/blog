import { z } from 'zod';

export const ProductStatusSchema = z.enum(['Available', 'Coming Soon', 'Sold Out']);

export const ProductImageSchema = z.object({
  url: z.string().min(1).max(500),
  alt: z.string().min(1).max(150),
});

export const ProductSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().min(1).max(200),
  longDescription: z.string().min(1).max(2000),
  priceDisplay: z.string().min(1).max(50),
  heroImage: ProductImageSchema,
  galleryImages: z.array(ProductImageSchema).max(4).optional().default([]),
  status: ProductStatusSchema,
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const ProductCatalogSchema = z
  .array(ProductSchema)
  .min(0)
  .refine(
    (products) => {
      const slugs = products.map((p) => p.slug);
      return new Set(slugs).size === slugs.length;
    },
    { message: 'Product slugs must be unique' }
  );
