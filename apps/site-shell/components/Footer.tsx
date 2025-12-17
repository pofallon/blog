import Navigation from '@/components/Navigation';
import type { FooterContent, NavigationLink } from '@/lib/types';
import Link from 'next/link';
import type { Route } from 'next';
import type { ReactNode } from 'react';

type FooterProps = {
  footer: FooterContent;
  links: NavigationLink[];
};

const isInternalLink = (href: string) => href.startsWith('/');
const asRoute = (href: string) => href as Route;

const ExternalAnchor = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="shell-link" target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default function Footer({ footer, links }: FooterProps) {
  return (
    <footer
      role="contentinfo"
      className="mt-16 rounded-3xl border border-shell-border bg-white/70 px-6 py-8 text-sm text-shell-muted"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-base font-semibold text-shell-ink">{footer.text}</p>
          <p className="mt-1 max-w-xl text-sm text-shell-muted">
            Navigation remains stable as content migrates. Editors can confirm shell parity before
            writing new copy.
          </p>
        </div>
        <div className="space-y-2 text-shell-muted">
          <p className="text-xs uppercase tracking-wide text-shell-muted/80">Primary Routes</p>
          <Navigation ariaLabel="Footer navigation" links={links} variant="footer" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {footer.links.map((link) => {
          if (isInternalLink(link.href)) {
            return (
              <Link key={link.label} href={asRoute(link.href)} className="shell-link">
                {link.label}
              </Link>
            );
          }
          return (
            <ExternalAnchor key={link.label} href={link.href}>
              {link.label}
            </ExternalAnchor>
          );
        })}
      </div>

      {footer.social && footer.social.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {footer.social.map((socialLink) => (
            <ExternalAnchor key={socialLink.label} href={socialLink.href}>
              {socialLink.label}
            </ExternalAnchor>
          ))}
        </div>
      )}
    </footer>
  );
}
