import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono, Righteous, Lexend } from 'next/font/google';
import { ConditionalHeader } from '@/components/ConditionalHeader';
import AboutFooter from '@/components/AboutFooter';
import { ThemeProvider } from '@/components/theme-provider';
import { CustomCursor } from '@/components/CustomCursor';
import { getSiteShellLayout } from '@/lib/site-shell';
import { getGlobalSEOConfig, buildCanonicalUrl, resolveShareImageUrl } from '@/lib/seo';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetBrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-brand',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-tagline',
  display: 'swap',
});

const globalConfig = getGlobalSEOConfig();
const siteShellLayout = getSiteShellLayout();

export const metadata: Metadata = {
  title: globalConfig.defaultTitle,
  description: globalConfig.defaultDescription,
  metadataBase: new URL(globalConfig.canonicalHost),
  alternates: {
    canonical: buildCanonicalUrl('/'),
  },
  openGraph: {
    title: globalConfig.defaultTitle,
    description: globalConfig.defaultDescription,
    type: 'website',
    url: buildCanonicalUrl('/'),
    siteName: globalConfig.siteName,
    locale: globalConfig.locale,
    images: [
      {
        url: resolveShareImageUrl(globalConfig.defaultShareImage) || globalConfig.defaultShareImage,
        width: 1200,
        height: 630,
        alt: globalConfig.defaultTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: globalConfig.defaultTitle,
    description: globalConfig.defaultDescription,
    images: [resolveShareImageUrl(globalConfig.defaultShareImage) || globalConfig.defaultShareImage],
    ...(globalConfig.twitterHandle && { site: `@${globalConfig.twitterHandle}` }),
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetBrains.variable} ${righteous.variable} ${lexend.variable} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          {/* Skip link for accessibility */}
          <a href="#main-content" className="g2k-skip-link">
            Skip to main content
          </a>
          <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
            <ConditionalHeader brandName={siteShellLayout.brandName} links={siteShellLayout.navigationLinks} />
            <main id="main-content" role="main" className="flex-1">
              {children}
            </main>
            <AboutFooter footer={siteShellLayout.footer} links={siteShellLayout.navigationLinks} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
