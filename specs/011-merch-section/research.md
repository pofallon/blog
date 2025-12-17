# Research: Merch Section Scaffold

**Feature**: 011-merch-section  
**Date**: 2025-12-17  
**Status**: Complete

## Research Questions

### RQ-1: Product Schema Design

**Question**: How should the product schema be structured for placeholder data that maps to future commerce providers?

**Decision**: Use a flat JSON structure with Zod runtime validation and JSON Schema for build-time validation.

**Rationale**:
- Zod integrates seamlessly with existing TypeScript codebase
- JSON Schema enables non-developer validation in editors
- Flat structure avoids over-engineering for placeholder data
- Field names chosen to align with common commerce APIs (Shopify, Stripe)

**Alternatives Considered**:
- MDX files per product: Rejected - overkill for structured data, harder for non-devs to edit
- YAML: Rejected - JSON preferred for schema validation tooling
- Database: Rejected - out of scope for scaffold phase

### RQ-2: Image Gallery Implementation

**Question**: What approach for image galleries meets performance requirements while supporting WCAG 2.1 AA?

**Decision**: CSS-based carousel with native lazy loading and ARIA attributes.

**Rationale**:
- Native `loading="lazy"` for gallery images (per NFR-003)
- CSS scroll-snap for smooth navigation without JS dependency
- ARIA labels for screen reader navigation
- Avoids heavy carousel libraries that impact CLS

**Alternatives Considered**:
- Swiper.js: Rejected - adds 30KB+ bundle, overkill for 1-5 images
- next/image with blur placeholder: Adopted for hero images, not gallery
- Lightbox modal: Deferred - not in MVP requirements

### RQ-3: Status Badge & CTA Mapping

**Question**: How should product status map to visual badges and call-to-action behavior?

**Decision**: Status enum with configuration object mapping status to badge style, helper text, and CTA component.

**Rationale**:
- Single source of truth for status behavior
- Type-safe enum prevents invalid states
- Extensible for future statuses (Pre-order, Limited)
- Consistent messaging across list and detail pages

**Status Configuration**:
| Status | Badge Color | CTA Label | CTA Action |
|--------|-------------|-----------|------------|
| Available | Green | "View Details" | Navigate to detail |
| Coming Soon | Yellow | "Notify Me" | Email signup link |
| Sold Out | Gray | "Join Waitlist" | Email signup link |

### RQ-4: Analytics Integration Pattern

**Question**: How should page view and product detail view events be tracked using existing analytics?

**Decision**: Extend existing structured logging pattern from `lib/projects/analytics.ts`.

**Rationale**:
- Consistent with existing codebase patterns
- No new dependencies required (per FR-009)
- Structured events for easy future integration
- Console logging in development for verification

**Events**:
- `merch_index_view`: Fired on `/merch` page load
- `merch_product_view`: Fired on `/merch/[slug]` page load with product slug

### RQ-5: Build-time Validation Strategy

**Question**: How should JSON validation be implemented to fail builds on schema violations?

**Decision**: Dual validation with Zod (runtime) and JSON Schema (build-time via postinstall/prebuild script).

**Rationale**:
- Zod provides TypeScript integration and detailed error messages
- JSON Schema enables editor validation for non-developers
- Build fails fast with clear messaging (per FR-006)
- Follows existing validation patterns in codebase

**Implementation**:
1. `content/merch/products.schema.json` - JSON Schema definition
2. `lib/merch/schema.ts` - Zod schema with matching constraints
3. `scripts/validate-merch.ts` - Build-time validation script
4. Add to `package.json` prebuild: `npm run validate:merch`

### RQ-6: Empty State Handling

**Question**: What UX pattern for empty or all-unavailable product states?

**Decision**: Dedicated empty state component with encouraging messaging and contact CTA.

**Rationale**:
- Per edge case requirement: "friendly empty state encouraging users to check back soon"
- Consistent with site's friendly tone
- Provides actionable next step (contact/signup)

**Copy**:
- Heading: "Coming Soon"
- Body: "We're working on something special. Check back soon or sign up to be notified when products are available."
- CTA: "Get Notified" → email signup link

### RQ-7: Commerce Provider Mapping Documentation

**Question**: How should integration documentation (FR-008) be structured for future engineers?

**Decision**: Include in-app info block plus `quickstart.md` developer guide.

**Rationale**:
- In-app block serves marketing/stakeholder needs (FR-007)
- Developer guide provides technical mapping details (FR-008)
- Separation of concerns: user-facing vs. developer-facing

**Integration Points**:
| Product Field | Shopify Field | Stripe Field |
|---------------|---------------|--------------|
| slug | handle | metadata.slug |
| name | title | name |
| priceDisplay | variants[0].price | unit_amount_decimal |
| status | inventory_policy | metadata.status |
| images | images | images |

## Dependencies Confirmed

- **Zod 4.x**: Already in package.json, no additional install needed
- **next/image**: Available for hero image optimization
- **Tailwind CSS**: Available for styling, use existing color tokens
- **Jest/Playwright**: Available for testing

## Open Questions (None)

All clarifications resolved. Ready for Phase 1 design.
