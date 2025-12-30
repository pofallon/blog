import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import type { FooterContent, NavigationLink } from '@/lib/types';
import type { Route } from 'next';

type AboutFooterProps = {
  footer: FooterContent;
  links: NavigationLink[];
};

const isInternalLink = (href: string) => href.startsWith('/');
const asRoute = (href: string) => href as Route;

// Social link icons mapping
function getSocialIcon(label: string) {
  const key = label.toLowerCase();
  if (key === 'github') return Github;
  if (key === 'linkedin') return Linkedin;
  if (key === 'x' || key === 'twitter') {
    // Custom X/Twitter icon
    return ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    );
  }
  if (key === 'mail' || key === 'email') return Mail;
  return ExternalLink;
}

export default function AboutFooter({ footer, links }: AboutFooterProps) {
  return (
    <footer
      role="contentinfo"
      className="mt-16 rounded-3xl border-[1.5px] border-border bg-g2k-bg-raised/50 px-6 py-10 md:px-10 md:py-12"
      style={{ boxShadow: 'var(--g2k-shadow-md), var(--g2k-shadow-inset)' }}
    >
      {/* Decorative accent line */}
      <div className="g2k-accent-line mb-8 w-24 mx-auto" aria-hidden="true" />

      {/* Main content grid */}
      <div className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-12 lg:gap-16">
        {/* Left column: Avatar and name */}
        <div className="flex flex-col items-center md:items-start">
          {/* Avatar placeholder - replace with actual image */}
          <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-g2k-brass/20 to-g2k-teal/20 border-2 border-g2k-border mb-4 flex items-center justify-center overflow-hidden">
            <div className="text-6xl text-g2k-fg-muted/30 font-brand">P</div>
            {/* Replace with actual image:
            <Image
              src="/images/avatar.jpg"
              alt="Paul's avatar"
              width={160}
              height={160}
              className="object-cover"
            />
            */}
          </div>

          <h2 className="font-brand text-2xl text-g2k-fg-primary mb-1">Paul O'Fallon</h2>
          <p className="text-sm text-g2k-brass mb-4">Agentic Architect • Open Source Maker</p>

          {/* Social links */}
          {footer.social && footer.social.length > 0 && (
            <div className="flex gap-3">
              {footer.social.map((socialLink) => {
                const Icon = getSocialIcon(socialLink.label);
                return (
                  <a
                    key={socialLink.label}
                    href={socialLink.href}
                    className="w-10 h-10 rounded-lg bg-g2k-bg-sunken border border-g2k-border flex items-center justify-center text-g2k-fg-secondary hover:text-g2k-brass hover:border-g2k-brass/40 transition-all duration-300 hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLink.ariaLabel || socialLink.label}
                    style={{ boxShadow: 'var(--g2k-shadow-sm)' }}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Bio and links */}
        <div className="text-center md:text-left">
          {/* Bio */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-g2k-fg-primary mb-4">About the Workshop</h3>

            <div className="space-y-4 text-g2k-fg-secondary leading-relaxed">
              <p>
                I build things at the intersection of infrastructure and application development.
                The robots you see above aren't just decoration—they represent four ongoing projects,
                each exploring different aspects of distributed systems, automation, and developer experience.
              </p>

              <p>
                This workshop is where experiments happen. Some turn into production tools.
                Others teach valuable lessons about what <em>not</em> to do. All of them push
                the boundaries of what's possible when you combine curiosity with code.
              </p>

              <p className="text-sm italic text-g2k-fg-muted">
                "The best way to predict the future is to build it—even if it breaks a few times along the way."
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-wide text-g2k-fg-muted mb-3">Explore</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={asRoute(link.path)}
                  className="text-g2k-fg-secondary hover:text-g2k-brass transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Additional footer links */}
          {footer.links && footer.links.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm text-g2k-fg-muted">
              {footer.links.map((link) => {
                if (isInternalLink(link.href)) {
                  return (
                    <Link
                      key={link.label}
                      href={asRoute(link.href)}
                      className="hover:text-g2k-brass transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="hover:text-g2k-brass transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="mt-10 pt-6 border-t border-border/50 text-center">
        <p className="text-sm text-g2k-fg-muted">
          Still building. Still curious. Still shipping.
        </p>
      </div>
    </footer>
  );
}
