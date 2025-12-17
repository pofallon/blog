# Component Contracts: Merch Section

**Feature**: 011-merch-section  
**Date**: 2025-12-17

## ProductCard

**File**: `components/merch/ProductCard.tsx`

**Purpose**: Tile component for product grid on index page.

**Props**:
```typescript
interface ProductCardProps {
  product: Product;
  priority?: boolean; // Eager load image if true (first 4 items)
}
```

**Behavior**:
- Renders hero image with `next/image`
- Links entire card to `/merch/[slug]`
- Shows status badge in corner
- Truncates long names with ellipsis

**Accessibility**:
- Card is a link with descriptive `aria-label`
- Image has alt text from data
- Badge has `role="status"`

---

## ProductGallery

**File**: `components/merch/ProductGallery.tsx`

**Purpose**: Image gallery with hero and thumbnails for detail page.

**Props**:
```typescript
interface ProductGalleryProps {
  heroImage: ProductImage;
  galleryImages: ProductImage[];
  productName: string;
}
```

**Behavior**:
- Hero image displayed large, eager-loaded
- Gallery thumbnails lazy-loaded on scroll
- Click thumbnail to swap with hero
- Keyboard navigation with arrow keys
- CSS scroll-snap for smooth scrolling

**Accessibility**:
- Images have alt text
- Gallery has `role="region"` and `aria-label`
- Focus management on thumbnail click
- Visible focus indicators

---

## StatusBadge

**File**: `components/merch/StatusBadge.tsx`

**Purpose**: Visual badge indicating product availability.

**Props**:
```typescript
interface StatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'md'; // sm for cards, md for detail
  showHelperText?: boolean; // Show tooltip/helper on hover
}
```

**Styles**:
| Status | Background | Text | Border |
|--------|------------|------|--------|
| Available | `bg-green-100` | `text-green-800` | `border-green-200` |
| Coming Soon | `bg-yellow-100` | `text-yellow-800` | `border-yellow-200` |
| Sold Out | `bg-gray-100` | `text-gray-600` | `border-gray-200` |

**Accessibility**:
- `role="status"` for screen readers
- `aria-label` with full status text

---

## StatusCTA

**File**: `components/merch/StatusCTA.tsx`

**Purpose**: Contextual call-to-action based on product status.

**Props**:
```typescript
interface StatusCTAProps {
  status: ProductStatus;
  productSlug: string;
  contactHref?: string; // Default: /contact or mailto link
}
```

**Behavior**:
| Status | Label | Action |
|--------|-------|--------|
| Available | "View Details" | Link to detail page (index only) |
| Coming Soon | "Notify Me" | Link to contact/signup |
| Sold Out | "Join Waitlist" | Link to contact/signup |

On detail page, "Available" shows "Contact to Purchase" linking to contact.

**Accessibility**:
- Button/link with clear action label
- Focus visible state

---

## CommerceInfoBlock

**File**: `components/merch/CommerceInfoBlock.tsx`

**Purpose**: Information block explaining future commerce integration.

**Props**:
```typescript
interface CommerceInfoBlockProps {
  variant: 'index' | 'detail';
  contactHref?: string;
}
```

**Content**:
```
┌─────────────────────────────────────────┐
│ 🛒 How to Purchase                      │
│                                         │
│ We're setting up our online store.      │
│ In the meantime, contact us directly    │
│ to place an order or ask questions.     │
│                                         │
│ [Contact Us]                            │
└─────────────────────────────────────────┘
```

**Accessibility**:
- Heading level appropriate to page context
- Link clearly labeled

---

## MerchEmptyState

**File**: `components/merch/MerchEmptyState.tsx`

**Purpose**: Friendly empty state when no products available.

**Props**:
```typescript
interface MerchEmptyStateProps {
  contactHref?: string;
}
```

**Content**:
```
┌─────────────────────────────────────────┐
│          🎁                             │
│                                         │
│     Coming Soon                         │
│                                         │
│ We're working on something special.     │
│ Check back soon or sign up to be        │
│ notified when products are available.   │
│                                         │
│ [Get Notified]                          │
└─────────────────────────────────────────┘
```

**Accessibility**:
- Centered content with clear heading
- Link to signup/contact

---

## MerchIndexPage

**File**: `app/merch/page.tsx`

**Purpose**: Index page component orchestrating product grid.

**Data Loading**:
```typescript
export default async function MerchIndexPage() {
  const products = await loadProductCatalog();
  // Sort and render
}
```

**Sections**:
1. Hero with heading and intro
2. Product grid (or empty state)
3. Commerce info block

---

## MerchDetailPage

**File**: `app/merch/[slug]/page.tsx`

**Purpose**: Detail page for individual product.

**Data Loading**:
```typescript
export default async function MerchDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await loadProductBySlug(params.slug);
  if (!product) notFound();
  // Render
}
```

**Sections**:
1. Breadcrumb navigation
2. Product gallery + details split layout
3. Status CTA
4. Commerce info block
