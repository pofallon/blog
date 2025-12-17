import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { ProductCatalogSchema } from '../lib/merch/schema';

const PRODUCTS_PATH = path.join(__dirname, '../../../content/merch/products.json');

interface ValidationResult {
  success: boolean;
  errors: string[];
}

function validateMerch(): ValidationResult {
  const errors: string[] = [];

  // Check if file exists
  if (!fs.existsSync(PRODUCTS_PATH)) {
    errors.push(`Products file not found at: ${PRODUCTS_PATH}`);
    return { success: false, errors };
  }

  // Parse JSON
  let data: unknown;
  try {
    const content = fs.readFileSync(PRODUCTS_PATH, 'utf-8');
    data = JSON.parse(content);
  } catch (error) {
    errors.push(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, errors };
  }

  // Validate structure
  if (typeof data !== 'object' || data === null || !('products' in data)) {
    errors.push('Invalid structure: Expected object with "products" array');
    return { success: false, errors };
  }

  const productsData = (data as { products: unknown }).products;

  // Validate schema
  try {
    ProductCatalogSchema.parse(productsData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      for (const issue of error.issues) {
        const pathStr = issue.path.length > 0 ? `products[${issue.path.join('.')}]` : 'products';
        errors.push(`${pathStr}: ${issue.message}`);
      }
    } else {
      errors.push(`Schema validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check for duplicate slugs
  if (Array.isArray(productsData)) {
    const slugs = new Map<string, number>();
    productsData.forEach((product: unknown, index: number) => {
      if (typeof product === 'object' && product !== null && 'slug' in product) {
        const slug = (product as { slug: string }).slug;
        const existingIndex = slugs.get(slug);
        if (existingIndex !== undefined) {
          errors.push(`Duplicate slug "${slug}" found at index ${String(existingIndex)} and ${String(index)}`);
        } else {
          slugs.set(slug, index);
        }
      }
    });
  }

  return { success: errors.length === 0, errors };
}

// Run validation
const result = validateMerch();

if (result.success) {
  console.log('✓ Merch products validation passed');
  process.exit(0);
} else {
  console.error('✗ Merch products validation failed:\n');
  for (const error of result.errors) {
    console.error(`  - ${error}`);
  }
  console.error('');
  process.exit(1);
}
