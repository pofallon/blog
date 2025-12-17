# Routes Contract: Merch Section

**Feature**: 011-merch-section  
**Date**: 2025-12-17

## Endpoints

### GET /merch

**Description**: Merch index page displaying product catalog grid.

**Response**: HTML page (SSG)

**Data Requirements**:
- Load all products from `content/merch/products.json`
- Sort by `sortOrder` ascending, then by `name` alphabetically
- Filter: Show all products regardless of status
- If catalog empty: Render empty state component

**Page Structure**:
```
┌─────────────────────────────────────────────┐
│ Hero Section                                │
│ - Heading: "Merch"                          │
│ - Subheading: Brief intro text              │
├─────────────────────────────────────────────┤
│ Product Grid (2-4 columns responsive)       │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ Card 1  │ │ Card 2  │ │ Card 3  │        │
│ │ Image   │ │ Image   │ │ Image   │        │
│ │ Name    │ │ Name    │ │ Name    │        │
│ │ Price   │ │ Price   │ │ Price   │        │
│ │ Badge   │ │ Badge   │ │ Badge   │        │
│ └─────────┘ └─────────┘ └─────────┘        │
├─────────────────────────────────────────────┤
│ Commerce Info Block                         │
│ "How to buy" info + contact CTA             │
└─────────────────────────────────────────────┘
```

**Analytics Event**:
```typescript
{
  event: 'merch_index_view',
  productCount: number,
  timestamp: string
}
```

---

### GET /merch/[slug]

**Description**: Product detail page with full information and gallery.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | ✅ | Product slug (lowercase, alphanumeric with hyphens) |

**Response**: HTML page (SSG)

**Data Requirements**:
- Load product matching `slug` from catalog
- If not found: Return 404 page
- Validate slug is lowercase (redirect if uppercase variant)

**Page Structure**:
```
┌─────────────────────────────────────────────┐
│ Breadcrumb: Merch > [Product Name]          │
├─────────────────────────────────────────────┤
│ ┌───────────────────┐ ┌───────────────────┐ │
│ │                   │ │ Name              │ │
│ │   Hero Image      │ │ Price             │ │
│ │                   │ │ Status Badge      │ │
│ │                   │ │                   │ │
│ └───────────────────┘ │ Long Description  │ │
│                       │                   │ │
│ Gallery Thumbnails    │ Status CTA        │ │
│ [1] [2] [3] [4]       │ (contextual)      │ │
│                       └───────────────────┘ │
├─────────────────────────────────────────────┤
│ Commerce Info Block                         │
│ "How to buy" info + contact CTA             │
└─────────────────────────────────────────────┘
```

**Analytics Event**:
```typescript
{
  event: 'merch_product_view',
  productSlug: string,
  productName: string,
  productStatus: ProductStatus,
  timestamp: string
}
```

**Error Responses**:
| Status | Condition | Response |
|--------|-----------|----------|
| 404 | Slug not found | Custom 404 page |
| 308 | Uppercase slug | Redirect to lowercase |

---

## Static Generation

Both routes use **Static Site Generation (SSG)** via `generateStaticParams`:

```typescript
// app/merch/[slug]/page.tsx
export async function generateStaticParams() {
  const products = await loadProductCatalog();
  return products.map((product) => ({
    slug: product.slug,
  }));
}
```

**Build Behavior**:
- All product detail pages pre-rendered at build time
- Index page pre-rendered with full catalog
- Invalid JSON fails build with validation error

---

## Navigation Integration

Add "Merch" link to site navigation:

```typescript
// lib/navigation.ts update
{
  label: 'Merch',
  href: '/merch',
  description: 'Limited drops and merchandise'
}
```

Position: After existing navigation items, before footer links.
