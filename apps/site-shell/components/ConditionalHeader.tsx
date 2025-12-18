'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import type { NavigationLink } from '@/lib/types';

type ConditionalHeaderProps = {
  brandName: string;
  links: NavigationLink[];
  tagline?: string;
};

/**
 * Conditionally renders the Header component based on the current route.
 * 
 * On non-homepage routes: Header is always visible.
 * On homepage: Header is hidden initially to let the hero own the viewport,
 * then fades in with a subtle slide-down animation once the hero scrolls out of view.
 */
export function ConditionalHeader({ brandName, links, tagline }: ConditionalHeaderProps) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  
  // Track whether the hero sentinel is visible in the viewport
  // Start as true (hero visible) on homepage, false otherwise
  const [heroVisible, setHeroVisible] = useState(isHomepage);
  
  // Track reveal count to identify first reveal (0 = never revealed, 1 = first reveal, 2+ = subsequent)
  const [revealCount, setRevealCount] = useState(0);
  
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry) {
      const isVisible = entry.isIntersecting;
      setHeroVisible(isVisible);
      
      // Increment reveal count when hero goes out of view (header about to show)
      if (!isVisible) {
        setRevealCount(prev => prev + 1);
      }
    }
  }, []);

  useEffect(() => {
    // Only set up observer on homepage
    if (!isHomepage) {
      return;
    }

    const heroSentinel = document.getElementById('hero-sentinel');
    
    if (!heroSentinel) {
      // Sentinel not found yet - will be handled by next render cycle
      // or scroll will eventually reveal header anyway
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0,
    });

    observer.observe(heroSentinel);

    return () => {
      observer.disconnect();
    };
  }, [isHomepage, handleIntersection]);

  // Determine if header should be shown
  // Non-homepage: always show
  // Homepage: show when hero is NOT visible (scrolled out)
  const showHeader = !isHomepage || !heroVisible;

  // On homepage with hero still visible, render nothing
  if (!showHeader) {
    return null;
  }
  
  // First reveal is when revealCount === 1
  const isFirstReveal = isHomepage && revealCount === 1;

  // Render header with animation classes on homepage (when revealing after scroll)
  // Subtle, confident reveal: minimal vertical movement, calm easing
  // On homepage: use fixed positioning to avoid layout shift
  const animationClasses = isHomepage
    ? 'animate-in fade-in slide-in-from-top-1 duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]'
    : '';

  // Fixed positioning for homepage to prevent layout shift when header appears
  // The header overlays content rather than pushing it down
  const positionClasses = isHomepage
    ? 'fixed top-0 left-0 right-0 z-50 px-4 pt-10 sm:px-6 lg:px-8'
    : '';

  const innerClasses = isHomepage
    ? 'mx-auto max-w-5xl'
    : '';

  return (
    <div className={`${animationClasses} ${positionClasses}`.trim()}>
      <div className={innerClasses}>
        <Header
          brandName={brandName}
          links={links}
          {...(tagline !== undefined && { tagline })}
          isFirstReveal={isFirstReveal}
        />
      </div>
    </div>
  );
}
