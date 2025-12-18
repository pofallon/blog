# get2know.io Design System

> A stylish mashup of steampunk craftsmanship and surf punk rebellion

---

## A) North Star Vibe

**get2know.io feels like discovering a robot workshop hidden behind a beach shack at twilight.**

The aesthetic balances precision engineering with creative chaos—brass gauges and riveted panels meet sun-bleached wood and hand-lettered zine stickers. It's the workbench of a maker who surfs at dawn and solders at midnight.

In **dark mode**, visitors arrive at a moonlit pier where workshop windows glow amber through salt-hazed glass. Copper accents catch the light of old Edison bulbs. The robots feel like loyal companions keeping watch through the night.

In **light mode**, the same world basks in golden hour warmth. Sand-weathered surfaces, oxidized teal patina, and sun-faded coral create an inviting, optimistic space. The robots look ready for adventure.

**Key tensions we balance:**
- Expressive ↔ Readable
- Handcrafted ↔ Systematic
- Playful ↔ Professional
- Dense with character ↔ Light on load time

---

## B) Design Token Table

### Core Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--g2k-bg-base` | `#faf6f1` (warm sand) | `#0c1222` (deep navy) | Page background |
| `--g2k-bg-raised` | `#ffffff` | `#141c2e` | Cards, elevated surfaces |
| `--g2k-bg-sunken` | `#f0ebe4` | `#080d18` | Inset areas, code blocks |
| `--g2k-fg-primary` | `#1a1a2e` | `#f5f1eb` | Primary text |
| `--g2k-fg-secondary` | `#4a4a5c` | `#a8a29e` | Secondary text, captions |
| `--g2k-fg-muted` | `#78716c` | `#6b7280` | Disabled, hints |

### Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--g2k-brass` | `#c9a227` | `#d4af37` | Primary accent, CTAs |
| `--g2k-brass-shine` | `#e6c84a` | `#f0d861` | Hover states, highlights |
| `--g2k-copper` | `#b87333` | `#cd7f32` | Secondary warm accent |
| `--g2k-teal` | `#2a7c7c` | `#3d9494` | Links, interactive elements |
| `--g2k-teal-oxidized` | `#5f9ea0` | `#6bb3b5` | Hover, visited states |
| `--g2k-coral` | `#e07a5f` | `#f08b6d` | Alerts, badges, pops of energy |
| `--g2k-coral-faded` | `#f2a89a` | `#f5b8a8` | Soft accents |

### Semantic Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--g2k-success` | `#2d6a4f` | `#52b788` | Success states |
| `--g2k-warning` | `#bc6c25` | `#dda15e` | Warning states |
| `--g2k-error` | `#9b2226` | `#e63946` | Error states |
| `--g2k-info` | `#1d4e89` | `#4a90d9` | Info states |

### Robot Accent Colors (maps to UI)

| Robot | Primary | Secondary | Glow | Project Association |
|-------|---------|-----------|------|---------------------|
| Bot Alpha | `--g2k-robot-alpha: #3d9494` | Brass | Teal | Project 1 |
| Bot Beta | `--g2k-robot-beta: #d4af37` | Copper | Gold | Project 2 |
| Bot Gamma | `--g2k-robot-gamma: #f08b6d` | Teal | Coral | Project 3 |
| Bot Delta | `--g2k-robot-delta: #8b7cf0` | Brass | Purple | Project 4 |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--g2k-space-xs` | `4px` | Tight gaps |
| `--g2k-space-sm` | `8px` | Icon padding, small gaps |
| `--g2k-space-md` | `16px` | Standard padding |
| `--g2k-space-lg` | `24px` | Section padding |
| `--g2k-space-xl` | `32px` | Large gaps |
| `--g2k-space-2xl` | `48px` | Section margins |
| `--g2k-space-3xl` | `64px` | Hero padding |
| `--g2k-space-4xl` | `96px` | Major section breaks |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--g2k-radius-sm` | `4px` | Badges, small elements |
| `--g2k-radius-md` | `8px` | Buttons, inputs |
| `--g2k-radius-lg` | `12px` | Cards |
| `--g2k-radius-xl` | `16px` | Large cards, modals |
| `--g2k-radius-full` | `9999px` | Pills, avatars |

### Shadows

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--g2k-shadow-sm` | `0 1px 2px rgba(26,26,46,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift |
| `--g2k-shadow-md` | `0 4px 12px rgba(26,26,46,0.08)` | `0 4px 12px rgba(0,0,0,0.4)` | Cards |
| `--g2k-shadow-lg` | `0 12px 32px rgba(26,26,46,0.12)` | `0 12px 32px rgba(0,0,0,0.5)` | Modals, dropdowns |
| `--g2k-shadow-glow` | `0 0 20px rgba(201,162,39,0.15)` | `0 0 24px rgba(212,175,55,0.25)` | Accent glow |
| `--g2k-shadow-teal-glow` | `0 0 20px rgba(42,124,124,0.15)` | `0 0 24px rgba(61,148,148,0.3)` | Link/button glow |

### Typography

| Token | Value |
|-------|-------|
| `--g2k-font-display` | `'Irish Grover', cursive` |
| `--g2k-font-body` | `'Inter', system-ui, sans-serif` |
| `--g2k-font-mono` | `'JetBrains Mono', monospace` |

| Scale | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--g2k-text-xs` | `12px` | `16px` | 400 | Captions, metadata |
| `--g2k-text-sm` | `14px` | `20px` | 400 | Small body text |
| `--g2k-text-base` | `16px` | `24px` | 400 | Body text |
| `--g2k-text-lg` | `18px` | `28px` | 400 | Lead paragraphs |
| `--g2k-text-xl` | `20px` | `28px` | 500 | Subheadings |
| `--g2k-text-2xl` | `24px` | `32px` | 600 | Section headings |
| `--g2k-text-3xl` | `30px` | `36px` | 600 | Page titles |
| `--g2k-text-4xl` | `36px` | `40px` | 400 | Display (Irish Grover) |
| `--g2k-text-5xl` | `48px` | `52px` | 400 | Hero (Irish Grover) |
| `--g2k-text-6xl` | `60px` | `64px` | 400 | Hero large (Irish Grover) |

---

## C) Component Checklist with Tailwind Classes

### Buttons

```
Primary (Brass CTA):
  bg-g2k-brass text-g2k-bg-base hover:bg-g2k-brass-shine 
  font-semibold px-6 py-3 rounded-md shadow-md 
  hover:shadow-glow transition-all duration-200
  active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-g2k-brass focus-visible:ring-offset-2

Secondary (Teal):
  bg-g2k-teal text-white hover:bg-g2k-teal-oxidized
  font-semibold px-6 py-3 rounded-md shadow-sm
  transition-all duration-200 active:scale-[0.98]
  focus-visible:ring-2 focus-visible:ring-g2k-teal focus-visible:ring-offset-2

Outline:
  border-2 border-g2k-brass text-g2k-brass hover:bg-g2k-brass/10
  font-semibold px-6 py-3 rounded-md
  transition-all duration-200
  focus-visible:ring-2 focus-visible:ring-g2k-brass focus-visible:ring-offset-2

Ghost:
  text-g2k-fg-primary hover:bg-g2k-fg-primary/5
  font-medium px-4 py-2 rounded-md
  transition-colors duration-200
  focus-visible:ring-2 focus-visible:ring-g2k-brass focus-visible:ring-offset-2

Destructive:
  bg-g2k-error text-white hover:bg-g2k-error/90
  font-semibold px-6 py-3 rounded-md
  transition-all duration-200 active:scale-[0.98]
  focus-visible:ring-2 focus-visible:ring-g2k-error focus-visible:ring-offset-2
```

**Button feel:** Slightly chunky (py-3), tactile (active:scale), mechanical hover (shadow-glow)

### Cards

```
Project Card:
  bg-g2k-bg-raised border border-g2k-border rounded-xl p-6
  shadow-md hover:shadow-lg hover:border-g2k-brass/30
  transition-all duration-300 group
  
  [Robot portrait area]: h-48 bg-g2k-bg-sunken rounded-lg mb-4 overflow-hidden
  [Title]: font-brand text-2xl text-g2k-fg-primary group-hover:text-g2k-brass
  [Description]: text-g2k-fg-secondary text-sm mt-2
  [Tags container]: flex flex-wrap gap-2 mt-4

Blog Card:
  bg-g2k-bg-raised border border-g2k-border rounded-lg p-5
  hover:border-g2k-teal/40 transition-all duration-200 group
  
  [Date]: text-xs text-g2k-fg-muted uppercase tracking-wide
  [Title]: font-semibold text-lg text-g2k-fg-primary group-hover:text-g2k-teal mt-1
  [Excerpt]: text-g2k-fg-secondary text-sm mt-2 line-clamp-2
```

### Badges/Tags

```
Default Badge:
  inline-flex items-center px-2.5 py-0.5 rounded-sm
  text-xs font-medium bg-g2k-bg-sunken text-g2k-fg-secondary
  border border-g2k-border

Accent Badge (Brass):
  inline-flex items-center px-2.5 py-0.5 rounded-sm
  text-xs font-medium bg-g2k-brass/10 text-g2k-brass
  border border-g2k-brass/20

Tech Tag:
  inline-flex items-center px-3 py-1 rounded-full
  text-xs font-medium bg-g2k-teal/10 text-g2k-teal
  hover:bg-g2k-teal/20 transition-colors cursor-pointer
```

### Navigation

```
Navbar:
  fixed top-0 w-full z-50
  bg-g2k-bg-base/80 backdrop-blur-md border-b border-g2k-border
  px-4 md:px-8 py-4

Nav Link:
  text-g2k-fg-secondary hover:text-g2k-fg-primary
  font-medium transition-colors relative
  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
  after:bg-g2k-brass after:transition-all hover:after:w-full

Nav Link Active:
  text-g2k-fg-primary font-semibold
  after:w-full after:bg-g2k-brass

Mobile Menu Button:
  p-2 rounded-md hover:bg-g2k-fg-primary/5
  text-g2k-fg-primary transition-colors
  focus-visible:ring-2 focus-visible:ring-g2k-brass

Mobile Menu Panel:
  absolute top-full left-0 right-0 mt-2 mx-4
  bg-g2k-bg-raised border border-g2k-border rounded-xl
  shadow-lg p-4 space-y-2
```

### Footer

```
Footer Container:
  bg-g2k-bg-sunken border-t border-g2k-border
  px-4 md:px-8 py-12 mt-auto

Footer Link:
  text-g2k-fg-secondary hover:text-g2k-brass
  text-sm transition-colors

Footer Heading:
  font-brand text-lg text-g2k-fg-primary mb-4
```

### Theme Toggle

```
Theme Toggle Button:
  relative p-2 rounded-full
  bg-g2k-bg-sunken border border-g2k-border
  hover:border-g2k-brass/50 transition-all
  group overflow-hidden

  [Sun icon]: text-g2k-brass opacity-100 dark:opacity-0 
              transition-opacity absolute
  [Moon icon]: text-g2k-teal opacity-0 dark:opacity-100 
               transition-opacity absolute

  [Hover effect]: after:absolute after:inset-0 after:bg-g2k-brass/5
                  dark:after:bg-g2k-teal/5 after:opacity-0
                  hover:after:opacity-100 after:transition-opacity
```

### Tabs

```
Tab List:
  flex gap-1 p-1 bg-g2k-bg-sunken rounded-lg border border-g2k-border

Tab Trigger:
  px-4 py-2 rounded-md text-sm font-medium
  text-g2k-fg-secondary hover:text-g2k-fg-primary
  transition-all data-[state=active]:bg-g2k-bg-raised
  data-[state=active]:text-g2k-fg-primary
  data-[state=active]:shadow-sm

Tab Content:
  mt-4 focus-visible:outline-none
```

### Accordion

```
Accordion Item:
  border-b border-g2k-border

Accordion Trigger:
  flex w-full justify-between items-center py-4
  text-g2k-fg-primary font-medium hover:text-g2k-brass
  transition-colors group

  [Chevron]: text-g2k-fg-muted group-hover:text-g2k-brass
             transition-transform data-[state=open]:rotate-180

Accordion Content:
  pb-4 text-g2k-fg-secondary
```

---

## D) Robot Mascot Design Rules

### Shared Mechanical Language (All Robots Have)

**Eyes:**
- Circular or oval lens housings with visible rim/bezel
- Inner glow that matches robot's accent color
- Capable of expressing: alert, curious, sleepy, mischievous
- Subtle reflection/highlight suggesting glass

**Joints:**
- Visible ball-and-socket or hinge mechanisms
- Brass or copper rivets at connection points
- Segmented limbs (2-3 segments per arm/leg)
- Slight weathering/patina at joints

**Materials:**
- Primary body: Brushed metal (steel, aluminum, or copper tones)
- Accent panels: Painted enamel with slight chips/wear
- Decorative elements: Brass trim, gauge faces, small dials
- Surface texture: Mix of smooth and textured panels

**Core Body Shape:**
- Defined chest/torso region
- Clear head separation from body
- Proportions: Slightly chunky, not sleek
- Asymmetrical details encouraged

### Customizable Parts (Per Robot)

| Element | Options |
|---------|---------|
| Head Shape | Round dome, boxy/angular, cylindrical, asymmetric |
| Antenna/Accessories | Antenna, hat, goggles, headphones, nothing |
| Arm Style | Claw, pincer, human-like hand, tool attachment |
| Body Silhouette | Stocky, tall/thin, round, trapezoid |
| Accent Color | Maps to `--g2k-robot-[name]` token |
| Props/Accessories | Surfboard, wrench, book, coffee mug, telescope |
| Surface Decals | Numbers, stripes, stickers, warning labels |

### Personality Range (Allowed Archetypes)

| Personality | Expression Cues | Pose Tendency |
|-------------|-----------------|---------------|
| **Curious** | Wide eyes, tilted head, raised appendage | Leaning forward |
| **Grumpy** | Lowered brow plate, crossed arms, slight slouch | Arms folded |
| **Clever** | One eye slightly larger, knowing tilt, subtle smile | Confident stance |
| **Chaotic-Good** | Asymmetric eye glow, playful tilt, mid-action pose | Dynamic, off-balance |
| **Loyal** | Steady gaze, open stance, slight forward lean | Protective positioning |

### Robot-to-UI Color Mapping

Each robot's primary accent color creates a project identity:

```
Robot Alpha (Teal) → --g2k-robot-alpha: #3d9494
  - Project card border accent
  - Tag background
  - Code block accent
  
Robot Beta (Gold) → --g2k-robot-beta: #d4af37
  - Project card border accent  
  - Badge color
  - Highlight color

Robot Gamma (Coral) → --g2k-robot-gamma: #f08b6d
  - Project card border accent
  - Alert/notification accent
  - Energy/action states

Robot Delta (Purple) → --g2k-robot-delta: #8b7cf0
  - Project card border accent
  - Creative/experimental marker
  - Hover glow alternative
```

### Gang of Four Composition Rules

**Group Portrait Guidelines:**

1. **Asymmetrical Balance**: No perfect symmetry—stagger heights and positions
2. **Overlapping Elements**: Robots can partially overlap (builds cohesion)
3. **Unified Light Source**: All shadows/highlights from same direction
4. **Personality Hierarchy**: One robot slightly forward (leader energy), others in dynamic support positions
5. **Eye Contact Variety**: Some look at viewer, some at each other, one looking off-frame
6. **Shared Ground Plane**: All standing on same implied surface
7. **Breathing Room**: Space between robots allows individual silhouettes to read

**Composition Template:**
```
[Alpha - tall, back-left, looking forward]
    [Beta - medium, center-front, slight lean, looking at viewer]  
        [Gamma - short, front-right, energetic pose, looking at Delta]
[Delta - medium-tall, back-right, arms crossed, knowing look]
```

---

## E) Phased Implementation Plan

### Phase 1: Foundation (Week 1)

**1.1 Design Tokens Setup**
- [ ] Update `globals.css` with complete CSS variable system
- [ ] Update `tailwind.config.ts` with custom theme extension
- [ ] Create `lib/design-tokens.ts` for programmatic token access
- [ ] Test light/dark theme switching

**1.2 Typography**
- [ ] Verify Irish Grover font loading (already in layout.tsx)
- [ ] Create typography utility classes
- [ ] Test Irish Grover at various sizes for readability

**1.3 Base Component Styling**
- [ ] Update shadcn Button component with new variants
- [ ] Update shadcn Card component
- [ ] Update shadcn Badge component
- [ ] Create consistent focus states

### Phase 2: Hero & Navigation (Week 2)

**2.1 Hero Section**
- [ ] Create `HeroSection` component with layout framing
- [ ] Add robot placeholder area (40-60% of hero width)
- [ ] Style site name with Irish Grover
- [ ] Add tagline with body font
- [ ] Implement dark mode glow effects
- [ ] Add subtle background texture (CSS pattern, not image)

**2.2 Navigation Upgrade**
- [ ] Update Header with new styling
- [ ] Add theme toggle with custom styling
- [ ] Implement mobile menu with sheet component
- [ ] Add active state indicators

**2.3 Footer**
- [ ] Create new Footer layout
- [ ] Add workshop-themed decorative elements

### Phase 3: Core Pages (Week 3)

**3.1 Home Page**
- [ ] Complete hero integration
- [ ] Featured projects grid (3-4 cards)
- [ ] Recent blog posts section
- [ ] Add section dividers with texture

**3.2 Blog**
- [ ] Update blog list layout
- [ ] Style blog cards
- [ ] Enhance article typography
- [ ] Add reading time, date styling

**3.3 Projects Page**
- [ ] Create filterable grid layout
- [ ] Style project cards with robot portrait areas
- [ ] Add filter tabs/buttons
- [ ] Implement hover interactions

### Phase 4: Polish & Delight (Week 4)

**4.1 Merch Page**
- [ ] Create "Coming Soon" placeholder
- [ ] Add themed illustration area (blueprint style)
- [ ] Style with workshop elements

**4.2 Micro-interactions**
- [ ] Button hover animations
- [ ] Card hover lifts
- [ ] Theme toggle animation
- [ ] Page transitions (optional)

**4.3 Accessibility Audit**
- [ ] Verify all contrast ratios (WCAG AA minimum)
- [ ] Test keyboard navigation
- [ ] Add skip links
- [ ] Screen reader testing

**4.4 Performance**
- [ ] Audit texture/background usage
- [ ] Optimize font loading
- [ ] Lazy load non-critical images
- [ ] Test Core Web Vitals

### Phase 5: Robot Integration (Future)

**5.1 Robot Assets**
- [ ] Commission/create robot illustrations
- [ ] Export at multiple resolutions
- [ ] Create individual robot components
- [ ] Integrate into hero

**5.2 Project Association**
- [ ] Map robots to actual projects
- [ ] Update project cards with robot portraits
- [ ] Create robot detail views (optional)

---

## Appendix: Quick Reference

### HSL Values for CSS Variables

```css
/* Light mode base colors (HSL) */
--g2k-bg-base: 34 33% 96%;        /* #faf6f1 */
--g2k-bg-raised: 0 0% 100%;       /* #ffffff */
--g2k-bg-sunken: 34 20% 92%;      /* #f0ebe4 */
--g2k-fg-primary: 240 27% 14%;    /* #1a1a2e */
--g2k-fg-secondary: 240 12% 32%;  /* #4a4a5c */
--g2k-fg-muted: 30 6% 45%;        /* #78716c */

/* Dark mode base colors (HSL) */
--g2k-bg-base: 222 45% 9%;        /* #0c1222 */
--g2k-bg-raised: 222 35% 13%;     /* #141c2e */
--g2k-bg-sunken: 222 50% 6%;      /* #080d18 */
--g2k-fg-primary: 34 20% 95%;     /* #f5f1eb */
--g2k-fg-secondary: 30 5% 65%;    /* #a8a29e */
--g2k-fg-muted: 220 9% 46%;       /* #6b7280 */

/* Brand colors (same in both modes, slight dark boost) */
--g2k-brass: 46 70% 47%;          /* #c9a227 → #d4af37 */
--g2k-teal: 180 49% 33%;          /* #2a7c7c → #3d9494 */
--g2k-coral: 14 67% 63%;          /* #e07a5f → #f08b6d */
```

### Font Loading Checklist

- [x] Inter (body) - already loaded
- [x] JetBrains Mono (code) - already loaded
- [x] Irish Grover (display) - already loaded

### Component Import Map

| Component | shadcn Base | Custom Overrides |
|-----------|-------------|------------------|
| Button | `ui/button.tsx` | Variants, colors, sizing |
| Card | `ui/card.tsx` | Border, shadow, hover states |
| Badge | `ui/badge.tsx` | Colors, sizes |
| Sheet | `ui/sheet.tsx` | Mobile menu styling |
| Dropdown | `ui/dropdown-menu.tsx` | Panel styling |

---

*This design system is a living document. Update as the project evolves.*
