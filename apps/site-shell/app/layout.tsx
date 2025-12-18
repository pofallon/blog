import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono, Irish_Grover } from 'next/font/google';
import { ConditionalHeader } from '@/components/ConditionalHeader';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/theme-provider';
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

const irishGrover = Irish_Grover({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-brand',
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
      <body className={`${inter.variable} ${jetBrains.variable} ${irishGrover.variable} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Skip link for accessibility */}
          <a href="#main-content" className="g2k-skip-link">
            Skip to main content
          </a>
          <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
            <ConditionalHeader brandName={siteShellLayout.brandName} links={siteShellLayout.navigationLinks} />
            <main id="main-content" role="main" className="flex-1">
              {children}
            </main>
            <Footer footer={siteShellLayout.footer} links={siteShellLayout.navigationLinks} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
