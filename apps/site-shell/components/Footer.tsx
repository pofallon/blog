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

// Custom SVG icons for social links (using consistent interface)
type IconProps = { className?: string };

function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

// Get icon component for social link based on label
function getSocialIcon(label: string): React.ComponentType<IconProps> {
  const key = label.toLowerCase();
  if (key === 'github') return GithubIcon;
  if (key === 'linkedin') return LinkedinIcon;
  if (key === 'x' || key === 'twitter') return XIcon;
  if (key === 'mail' || key === 'email') return MailIcon;
  return ExternalLinkIcon;
}

const ExternalAnchor = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="font-medium text-foreground transition-colors hover:text-primary" target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default function Footer({ footer, links }: FooterProps) {
  return (
    <footer
      role="contentinfo"
      className="mt-16 rounded-3xl border-[1.5px] border-border bg-card/80 px-6 py-8 text-sm text-muted-foreground backdrop-blur-sm"
      style={{ boxShadow: 'var(--g2k-shadow-md), var(--g2k-shadow-inset)' }}
    >
      {/* Decorative accent line */}
      <div className="g2k-accent-line mb-6 w-16" aria-hidden="true" />
      
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-base font-semibold text-foreground">{footer.text}</p>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Navigation remains stable as content migrates. Editors can confirm shell parity before
            writing new copy.
          </p>
        </div>
        <div className="space-y-2 text-muted-foreground">
          <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Primary Routes</p>
          <Navigation ariaLabel="Footer navigation" links={links} variant="footer" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {footer.links.map((link) => {
          if (isInternalLink(link.href)) {
            return (
              <Link key={link.label} href={asRoute(link.href)} className="font-medium text-foreground transition-colors hover:text-primary">
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
          {footer.social.map((socialLink) => {
            const Icon = getSocialIcon(socialLink.label);
            return (
              <a
                key={socialLink.label}
                href={socialLink.href}
                className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={socialLink.ariaLabel || socialLink.label}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {socialLink.label}
              </a>
            );
          })}
        </div>
      )}

      {/* Small human moment */}
      <p className="mt-8 pt-6 border-t border-border/50 text-xs text-g2k-fg-muted text-center">
        Still building. Still curious.
      </p>
    </footer>
  );
}
