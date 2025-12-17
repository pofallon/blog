import fs from 'fs/promises';
import path from 'path';
import { ProductCatalogSchema } from './schema';
import type { Product, ProductCatalog } from './types';

const PRODUCTS_PATH = path.join(process.cwd(), '../../content/merch/products.json');

interface ProductsFile {
  products: unknown[];
}

export async function loadProductCatalog(): Promise<ProductCatalog> {
  try {
    const fileContent = await fs.readFile(PRODUCTS_PATH, 'utf-8');
    const data = JSON.parse(fileContent) as ProductsFile;

    const products = ProductCatalogSchema.parse(data.products);

    return products.slice().sort((a, b) => {
      const orderDiff = a.sortOrder - b.sortOrder;
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function loadProductBySlug(slug: string): Promise<Product | null> {
  const products = await loadProductCatalog();
  return products.find((p) => p.slug === slug) ?? null;
}
