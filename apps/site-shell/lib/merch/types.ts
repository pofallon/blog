import type { z } from 'zod';
import type {
  ProductSchema,
  ProductImageSchema,
  ProductStatusSchema,
  ProductCatalogSchema,
} from './schema';

export type Product = z.infer<typeof ProductSchema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;
export type ProductStatus = z.infer<typeof ProductStatusSchema>;
export type ProductCatalog = z.infer<typeof ProductCatalogSchema>;
