'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { House, BookOpen, FolderKanban, ShoppingBag } from 'lucide-react';
import type { NavigationLink, NavigationIconName } from '@/lib/types';

type NavigationProps = {
  links: NavigationLink[];
  ariaLabel: string;
  variant?: 'header' | 'footer';
};

// Map icon names to actual icon components
const ICON_MAP: Record<NavigationIconName, typeof House> = {
  'house': House,
  'book-open': BookOpen,
  'folder-kanban': FolderKanban,
  'shopping-bag': ShoppingBag,
};

function linkClasses(isActive: boolean, variant: 'header' | 'footer') {
  const base =
    'text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-g2k-brass focus-visible:ring-offset-2';
  const palette =
    variant === 'header'
      ? 'text-g2k-fg-secondary hover:text-g2k-fg-primary'
      : 'text-g2k-fg-secondary hover:text-g2k-fg-primary';
  const active =
    variant === 'header'
      ? 'text-g2k-brass font-semibold'
      : 'text-g2k-brass font-semibold border-b-[1.5px] border-g2k-brass pb-0.5';

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
          const Icon = link.iconName ? ICON_MAP[link.iconName] : null;
          return (
            <li key={link.path}>
              <Link
                href={link.path}
                aria-current={isActive ? 'page' : undefined}
                className={`${linkClasses(isActive, variant)} inline-flex items-center gap-1.5`}
                onClick={() => {
                  if (variant === 'header') {
                    setIsMenuOpen(false);
                  }
                }}
              >
                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
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
