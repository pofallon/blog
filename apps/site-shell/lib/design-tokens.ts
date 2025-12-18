/**
 * get2know.io Design Tokens
 * 
 * Programmatic access to design system values for components
 * that need runtime access to theme values.
 */

export const colors = {
  // Brand colors (CSS variable names)
  brass: 'var(--g2k-brass)',
  brassShine: 'var(--g2k-brass-shine)',
  copper: 'var(--g2k-copper)',
  teal: 'var(--g2k-teal)',
  tealOxidized: 'var(--g2k-teal-oxidized)',
  coral: 'var(--g2k-coral)',
  coralFaded: 'var(--g2k-coral-faded)',
  
  // Background
  bgBase: 'var(--g2k-bg-base)',
  bgRaised: 'var(--g2k-bg-raised)',
  bgSunken: 'var(--g2k-bg-sunken)',
  
  // Foreground
  fgPrimary: 'var(--g2k-fg-primary)',
  fgSecondary: 'var(--g2k-fg-secondary)',
  fgMuted: 'var(--g2k-fg-muted)',
  
  // Semantic
  success: 'var(--g2k-success)',
  warning: 'var(--g2k-warning)',
  error: 'var(--g2k-error)',
  info: 'var(--g2k-info)',
  
  // Robot accents
  robotAlpha: 'var(--g2k-robot-alpha)',
  robotBeta: 'var(--g2k-robot-beta)',
  robotGamma: 'var(--g2k-robot-gamma)',
  robotDelta: 'var(--g2k-robot-delta)',
} as const;

export const spacing = {
  xs: 'var(--g2k-space-xs)',
  sm: 'var(--g2k-space-sm)',
  md: 'var(--g2k-space-md)',
  lg: 'var(--g2k-space-lg)',
  xl: 'var(--g2k-space-xl)',
  '2xl': 'var(--g2k-space-2xl)',
  '3xl': 'var(--g2k-space-3xl)',
  '4xl': 'var(--g2k-space-4xl)',
} as const;

export const radius = {
  sm: 'var(--g2k-radius-sm)',
  md: 'var(--g2k-radius-md)',
  lg: 'var(--g2k-radius-lg)',
  xl: 'var(--g2k-radius-xl)',
  full: 'var(--g2k-radius-full)',
} as const;

export const shadows = {
  sm: 'var(--g2k-shadow-sm)',
  md: 'var(--g2k-shadow-md)',
  lg: 'var(--g2k-shadow-lg)',
  glow: 'var(--g2k-shadow-glow)',
  tealGlow: 'var(--g2k-shadow-teal-glow)',
} as const;

export const fonts = {
  display: "var(--font-brand, 'Irish Grover', cursive)",
  body: "var(--font-sans, 'Inter', system-ui, sans-serif)",
  mono: "var(--font-mono, 'JetBrains Mono', monospace)",
} as const;

/**
 * Robot mascot configuration
 */
export interface RobotConfig {
  id: string;
  name: string;
  primaryColor: string;
  personality: 'curious' | 'grumpy' | 'clever' | 'chaotic-good' | 'loyal';
  projectAssociation?: string;
}

export const robots: Record<string, RobotConfig> = {
  alpha: {
    id: 'alpha',
    name: 'Bot Alpha',
    primaryColor: colors.robotAlpha,
    personality: 'curious',
  },
  beta: {
    id: 'beta',
    name: 'Bot Beta',
    primaryColor: colors.robotBeta,
    personality: 'clever',
  },
  gamma: {
    id: 'gamma',
    name: 'Bot Gamma',
    primaryColor: colors.robotGamma,
    personality: 'chaotic-good',
  },
  delta: {
    id: 'delta',
    name: 'Bot Delta',
    primaryColor: colors.robotDelta,
    personality: 'grumpy',
  },
} as const;

/**
 * Tailwind class presets for common components
 */
export const componentClasses = {
  // Buttons
  buttonPrimary: 'g2k-btn-primary',
  buttonSecondary: 'g2k-btn-secondary',
  buttonOutline: 'g2k-btn-outline',
  buttonGhost: 'g2k-btn-ghost',
  buttonDestructive: 'g2k-btn-destructive',
  
  // Cards
  cardProject: 'g2k-card-project',
  cardBlog: 'g2k-card-blog',
  
  // Badges
  badgeDefault: 'g2k-badge-default',
  badgeBrass: 'g2k-badge-brass',
  badgeTeal: 'g2k-badge-teal',
  badgeCoral: 'g2k-badge-coral',
  tag: 'g2k-tag',
  
  // Typography
  displayHero: 'g2k-display-hero',
  displayTitle: 'g2k-display-title',
  displaySection: 'g2k-display-section',
  bodyLead: 'g2k-body-lead',
  body: 'g2k-body',
  bodySmall: 'g2k-body-small',
  caption: 'g2k-caption',
  
  // Surfaces
  surface: 'g2k-surface',
  surfaceRaised: 'g2k-surface-raised',
  surfaceSunken: 'g2k-surface-sunken',
  
  // Navigation
  navLink: 'g2k-nav-link',
  navLinkActive: 'g2k-nav-link-active',
  
  // Hero
  hero: 'g2k-hero',
  heroBg: 'g2k-hero-bg',
  heroTitle: 'g2k-hero-title',
  heroTagline: 'g2k-hero-tagline',
  heroRobots: 'g2k-hero-robots',
  
  // Robot
  robotPortrait: 'g2k-robot-portrait',
  
  // Dividers
  divider: 'g2k-divider',
  dividerAccent: 'g2k-divider-accent',
  
  // Theme toggle
  themeToggle: 'g2k-theme-toggle',
} as const;

const designTokens = {
  colors,
  spacing,
  radius,
  shadows,
  fonts,
  robots,
  componentClasses,
};

export default designTokens;
