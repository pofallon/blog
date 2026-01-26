import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import typography from '@tailwindcss/typography';

const config: Config = {
    darkMode: ['class'],
    content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './tests/**/*.{ts,tsx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			// get2know.io Design System Colors
  			'g2k-bg-base': 'hsl(var(--g2k-bg-base))',
  			'g2k-bg-raised': 'hsl(var(--g2k-bg-raised))',
  			'g2k-bg-sunken': 'hsl(var(--g2k-bg-sunken))',
  			'g2k-bg-elevated': 'hsl(var(--g2k-bg-elevated))',
  			'g2k-fg-primary': 'hsl(var(--g2k-fg-primary))',
  			'g2k-fg-secondary': 'hsl(var(--g2k-fg-secondary))',
  			'g2k-fg-muted': 'hsl(var(--g2k-fg-muted))',
  			'g2k-brass': 'hsl(var(--g2k-brass))',
  			'g2k-brass-shine': 'hsl(var(--g2k-brass-shine))',
  			'g2k-copper': 'hsl(var(--g2k-copper))',
  			'g2k-teal': 'hsl(var(--g2k-teal))',
  			'g2k-teal-oxidized': 'hsl(var(--g2k-teal-oxidized))',
  			'g2k-coral': 'hsl(var(--g2k-coral))',
  			'g2k-coral-faded': 'hsl(var(--g2k-coral-faded))',
  			'g2k-border': 'hsl(var(--g2k-border))',
  			'g2k-border-hover': 'hsl(var(--g2k-border-hover))',
  			'g2k-success': 'hsl(var(--g2k-success))',
  			'g2k-warning': 'hsl(var(--g2k-warning))',
  			'g2k-error': 'hsl(var(--g2k-error))',
  			'g2k-info': 'hsl(var(--g2k-info))',
  			// Robot accent colors
  			'g2k-robot-alpha': 'hsl(var(--g2k-robot-alpha))',
  			'g2k-robot-beta': 'hsl(var(--g2k-robot-beta))',
  			'g2k-robot-gamma': 'hsl(var(--g2k-robot-gamma))',
  			'g2k-robot-delta': 'hsl(var(--g2k-robot-delta))',
  			// Legacy shell tokens (for backwards compatibility)
  			'shell-ink': 'hsl(var(--g2k-fg-primary))',
  			'shell-muted': 'hsl(var(--g2k-fg-secondary))',
  			'shell-accent': 'hsl(var(--g2k-brass))',
  			'shell-border': 'hsl(var(--g2k-border))',
  			'shell-bg': 'hsl(var(--g2k-bg-base))',
  			// shadcn/ui compatibility
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'JetBrains Mono',
  				'SFMono-Regular',
  				'monospace'
  			],
  			brand: [
  				'var(--font-brand)',
  				'Irish Grover',
  				'cursive'
  			]
  		},
  		boxShadow: {
  			'shell': '0 10px 40px rgba(15, 23, 42, 0.08)',
  			'g2k-sm': 'var(--g2k-shadow-sm)',
  			'g2k-md': 'var(--g2k-shadow-md)',
  			'g2k-lg': 'var(--g2k-shadow-lg)',
  			'g2k-glow': 'var(--g2k-shadow-glow)',
  			'g2k-teal-glow': 'var(--g2k-shadow-teal-glow)',
  			'g2k-inset': 'var(--g2k-shadow-inset)',
  			'g2k-inset-deep': 'var(--g2k-shadow-inset-deep)',
  			'g2k-lifted': 'var(--g2k-shadow-lifted)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'g2k-sm': 'var(--g2k-radius-sm)',
  			'g2k-md': 'var(--g2k-radius-md)',
  			'g2k-lg': 'var(--g2k-radius-lg)',
  			'g2k-xl': 'var(--g2k-radius-xl)',
  		},
  		spacing: {
  			'g2k-xs': 'var(--g2k-space-xs)',
  			'g2k-sm': 'var(--g2k-space-sm)',
  			'g2k-md': 'var(--g2k-space-md)',
  			'g2k-lg': 'var(--g2k-space-lg)',
  			'g2k-xl': 'var(--g2k-space-xl)',
  			'g2k-2xl': 'var(--g2k-space-2xl)',
  			'g2k-3xl': 'var(--g2k-space-3xl)',
  			'g2k-4xl': 'var(--g2k-space-4xl)',
  		},
  		animation: {
  			'g2k-glow': 'g2k-glow 2s ease-in-out infinite alternate',
  			'g2k-float': 'g2k-float 3s ease-in-out infinite',
  		},
  		keyframes: {
  			'g2k-glow': {
  				'0%': { boxShadow: 'var(--g2k-shadow-sm)' },
  				'100%': { boxShadow: 'var(--g2k-shadow-glow)' },
  			},
  			'g2k-float': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-8px)' },
  			},
  		},
  	}
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;
