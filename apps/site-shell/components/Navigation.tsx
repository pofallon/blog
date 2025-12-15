'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { NavigationLink } from '@/lib/types';

type NavigationProps = {
  links: NavigationLink[];
  ariaLabel: string;
  variant?: 'header' | 'footer';
};

function linkClasses(isActive: boolean, variant: 'header' | 'footer') {
  const base =
    'text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shell-accent focus-visible:ring-offset-2';
  const palette =
    variant === 'header'
      ? 'text-shell-muted hover:text-shell-ink'
      : 'text-shell-muted hover:text-shell-accent';
  const active =
    variant === 'header'
      ? 'text-shell-ink'
      : 'text-shell-accent border-b-2 border-shell-accent pb-0.5';

  return `${base} ${isActive ? active : palette}`;
}

export default function Navigation({ links, ariaLabel, variant = 'header' }: NavigationProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const listId = `${variant}-navigation`;
  const headerListClasses = `${isMenuOpen ? 'flex' : 'hidden'} nav-panel flex-col gap-4 md:flex md:flex-row md:items-center md:gap-6`;
  const toggleLabel = isMenuOpen ? 'Close navigation menu' : 'Open navigation menu';

  return (
    <nav aria-label={ariaLabel}>
      {variant === 'header' && (
        <button
          type="button"
          className="nav-trigger"
          aria-label={toggleLabel}
          aria-expanded={isMenuOpen}
          aria-controls={listId}
          onClick={() => {
            setIsMenuOpen((previous) => !previous);
          }}
        >
          <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      )}

      <ul
        id={listId}
        role="list"
        className={
          variant === 'header'
            ? headerListClasses
            : 'flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'
        }
      >
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <li key={link.path}>
              <Link
                href={link.path}
                aria-current={isActive ? 'page' : undefined}
                className={linkClasses(isActive, variant)}
                onClick={() => {
                  if (variant === 'header') {
                    setIsMenuOpen(false);
                  }
                }}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <noscript
        data-testid="noscript-navigation"
        dangerouslySetInnerHTML={{
          __html: `<ul>${links
            .map((link) => `<li><a href="${link.path}">${link.label}</a></li>`)
            .join('')}</ul>`,
        }}
      />
    </nav>
  );
}
