# Quickstart: Merch Section

**Feature**: 011-merch-section  
**Date**: 2025-12-17

## Overview

The merch section provides a scaffold for displaying merchandise with placeholder data. It includes:
- `/merch` - Product catalog index page
- `/merch/[slug]` - Individual product detail pages
- JSON-based product data with schema validation
- Status-based badges and CTAs (Available, Coming Soon, Sold Out)

## Adding/Editing Products

### File Location

Edit product data in: `content/merch/products.json`

### Product Structure

```json
{
  "products": [
    {
      "name": "Product Name",
      "slug": "product-name",
      "shortDescription": "Brief teaser for list view.",
      "longDescription": "Full description with details...",
      "priceDisplay": "$45 USD",
      "heroImage": {
        "url": "/images/merch/product-hero.jpg",
        "alt": "Product description for accessibility"
      },
      "galleryImages": [
        {
          "url": "/images/merch/product-detail-1.jpg",
          "alt": "Detail view description"
        }
      ],
      "status": "Available",
      "sortOrder": 1
    }
  ]
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name (max 100 chars) |
| `slug` | Yes | URL path, lowercase with hyphens only |
| `shortDescription` | Yes | Teaser text (max 200 chars) |
| `longDescription` | Yes | Full description (max 2000 chars) |
| `priceDisplay` | Yes | Price text (e.g., "$45 USD") |
| `heroImage` | Yes | Primary product image |
| `galleryImages` | No | Additional images (0-4) |
| `status` | Yes | One of: `Available`, `Coming Soon`, `Sold Out` |
| `sortOrder` | No | Display order (default: 0, lower first) |

### Status Values

| Status | Use When |
|--------|----------|
| `Available` | Product ready for purchase |
| `Coming Soon` | Product announced but not ready |
| `Sold Out` | Inventory depleted |

### Adding Images

1. Place image files in `public/images/merch/`
2. Reference with path: `/images/merch/filename.jpg`
3. Always include descriptive `alt` text

**Recommended sizes**:
- Hero: 800x600px minimum
- Gallery: 600x600px minimum

## Building & Validation

### Build Command

```bash
npm run build
```

Build will **fail** if:
- JSON is malformed
- Required fields are missing
- Status is not a valid enum value
- Slugs are not unique

### Validation Errors

Example error output:
```
Error validating products.json:
  - products[0].slug: String must contain only lowercase letters, numbers, and hyphens
  - products[2].status: Expected 'Available' | 'Coming Soon' | 'Sold Out', received 'In Stock'
```

### Local Development

```bash
npm run dev
```

Visit:
- http://localhost:3000/merch
- http://localhost:3000/merch/[your-product-slug]

## Future Commerce Integration

This scaffold is designed to connect to a commerce provider (Shopify, Stripe, etc.) in a future phase.

### Field Mapping

| Product Field | Shopify | Stripe |
|---------------|---------|--------|
| `slug` | `handle` | `metadata.slug` |
| `name` | `title` | `name` |
| `priceDisplay` | `variants[0].price` | `unit_amount_decimal` |
| `status` | `inventory_policy` | `metadata.status` |
| `images` | `images[]` | `images[]` |

### Integration Points

1. **Replace JSON loader**: Swap `loadProductCatalog()` to fetch from commerce API
2. **Add checkout CTA**: Replace "Contact to Purchase" with cart/checkout flow
3. **Sync status**: Map inventory levels to status enum
4. **Real-time pricing**: Replace `priceDisplay` string with formatted API values

### Not In Scope (This Phase)

- ❌ Shopping cart
- ❌ Checkout flow
- ❌ Payment processing
- ❌ Inventory sync
- ❌ Order management

## Troubleshooting

### Build fails with validation error

1. Check JSON syntax (use a JSON validator)
2. Verify all required fields are present
3. Ensure slugs are unique and lowercase
4. Confirm status values match enum exactly

### Images not loading

1. Verify files exist in `public/images/merch/`
2. Check URL path starts with `/images/merch/`
3. Ensure file extensions match (case-sensitive)

### Page shows empty state

1. Verify `products.json` has at least one product
2. Check build completed successfully
3. Clear `.next` cache and rebuild

## Analytics Events

The following events are logged for tracking:

| Event | Page | Data |
|-------|------|------|
| `merch_index_view` | /merch | Product count |
| `merch_product_view` | /merch/[slug] | Slug, name, status |

Events are logged to console in development and can be connected to analytics service in production.
