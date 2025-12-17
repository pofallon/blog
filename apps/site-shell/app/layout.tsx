import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSiteMetadata, getSiteShellLayout } from '@/lib/site-shell';
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

const siteMetadata = getSiteMetadata();
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://get2know.io';
const siteShellLayout = getSiteShellLayout();

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [
      {
        url: siteMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetBrains.variable} bg-shell-bg text-shell-ink`}>
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <Header brandName={siteShellLayout.brandName} links={siteShellLayout.navigationLinks} />
          <main role="main" className="flex-1">
            {children}
          </main>
          <Footer footer={siteShellLayout.footer} links={siteShellLayout.navigationLinks} />
        </div>
      </body>
    </html>
  );
}
