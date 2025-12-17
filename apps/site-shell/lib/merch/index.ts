export { loadProductCatalog, loadProductBySlug } from './loader';
export { trackMerchIndexView, trackMerchProductView } from './analytics';
export {
  ProductStatusSchema,
  ProductImageSchema,
  ProductSchema,
  ProductCatalogSchema,
} from './schema';
export type { Product, ProductImage, ProductStatus, ProductCatalog } from './types';
