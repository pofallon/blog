# Data Model: Merch Section

**Feature**: 011-merch-section  
**Date**: 2025-12-17

## Entities

### Product

Primary entity representing a merchandise item.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Product display name (1-100 chars) |
| `slug` | string | ✅ | URL-safe identifier, unique, lowercase |
| `shortDescription` | string | ✅ | Teaser text for list view (1-200 chars) |
| `longDescription` | string | ✅ | Full description for detail page (1-2000 chars) |
| `priceDisplay` | string | ✅ | Formatted price text (e.g., "$45 USD", "Bundle pricing") |
| `heroImage` | ProductImage | ✅ | Primary image for list and detail hero |
| `galleryImages` | ProductImage[] | ❌ | Additional images (0-4 items, total max 5 with hero) |
| `status` | ProductStatus | ✅ | Availability status enum |
| `sortOrder` | number | ❌ | Display order (default: 0, lower = first) |

### ProductImage

Embedded object for image references.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | ✅ | Image URL (relative to /images/merch/ or absolute) |
| `alt` | string | ✅ | Alt text for accessibility (1-150 chars) |

### ProductStatus (Enum)

Controlled vocabulary for product availability.

| Value | Badge | Helper Text | CTA |
|-------|-------|-------------|-----|
| `Available` | Green "Available" | "Ready to ship" | "View Details" |
| `Coming Soon` | Yellow "Coming Soon" | "Sign up to be notified" | "Notify Me" |
| `Sold Out` | Gray "Sold Out" | "Join the waitlist" | "Join Waitlist" |

### IntegrationNote

Documentation artifact for future commerce connection (not stored in JSON, rendered inline).

| Field | Type | Description |
|-------|------|-------------|
| Provider | string | Target commerce platform (e.g., "Shopify", "Stripe") |
| Linking Method | string | How slug maps to external ID |
| Fulfillment | string | Notes on order processing |

## Relationships

```
Product (1) ─── contains ─── (1) ProductImage (hero)
Product (1) ─── contains ─── (0..4) ProductImage (gallery)
Product (1) ─── has ─── (1) ProductStatus
```

## Validation Rules

### Product

1. `name`: Non-empty string, max 100 characters
2. `slug`: Lowercase alphanumeric with hyphens, unique across all products, 1-50 chars
3. `shortDescription`: Non-empty string, max 200 characters
4. `longDescription`: Non-empty string, max 2000 characters
5. `priceDisplay`: Non-empty string, max 50 characters
6. `heroImage`: Must have valid `url` and `alt`
7. `galleryImages`: Array of 0-4 items, each with valid `url` and `alt`
8. `status`: Must be one of: `Available`, `Coming Soon`, `Sold Out`
9. `sortOrder`: Integer >= 0 (optional, defaults to 0)

### ProductImage

1. `url`: Valid URL or relative path starting with `/`
2. `alt`: Non-empty string, max 150 characters

### Collection-Level

1. Minimum 1 product when file is non-empty
2. All `slug` values must be unique
3. Build fails if validation fails

## State Transitions

Products can transition between statuses:

```
[Any] ──→ Available    (product in stock)
[Any] ──→ Coming Soon  (product announced)
[Any] ──→ Sold Out     (inventory depleted)
```

No state machine enforcement - status is manually set in JSON and validated at build time.

## Zod Schema Definition

```typescript
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

export const ProductCatalogSchema = z.array(ProductSchema).min(0).refine(
  (products) => {
    const slugs = products.map(p => p.slug);
    return new Set(slugs).size === slugs.length;
  },
  { message: 'Product slugs must be unique' }
);

export type Product = z.infer<typeof ProductSchema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;
export type ProductStatus = z.infer<typeof ProductStatusSchema>;
```

## Sample Data Structure

```json
{
  "products": [
    {
      "name": "Get2Know Logo Tee",
      "slug": "logo-tee",
      "shortDescription": "Classic fit cotton tee with embroidered logo.",
      "longDescription": "Premium 100% organic cotton t-shirt featuring the Get2Know logo embroidered on the chest. Available in multiple colors. Pre-shrunk and ready to wear.",
      "priceDisplay": "$35 USD",
      "heroImage": {
        "url": "/images/merch/logo-tee-hero.jpg",
        "alt": "Get2Know logo t-shirt in navy blue"
      },
      "galleryImages": [
        {
          "url": "/images/merch/logo-tee-detail.jpg",
          "alt": "Close-up of embroidered logo"
        }
      ],
      "status": "Available",
      "sortOrder": 1
    }
  ]
}
```
