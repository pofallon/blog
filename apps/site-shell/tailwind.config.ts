import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './tests/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'shell-ink': '#0f172a',
        'shell-muted': '#475467',
        'shell-accent': '#f97316',
        'shell-border': '#e2e8f0',
        'shell-bg': '#f8fafc',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        shell: '0 10px 40px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
