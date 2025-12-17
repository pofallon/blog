/**
 * Next.js Middleware for URL normalization
 * Redirects non-canonical URLs to canonical form
 * @see /specs/006-blog-post-route/tasks.md T020, T021
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * URL normalization middleware
 * - Converts uppercase to lowercase
 * - Removes trailing slashes
 * - Returns 301 permanent redirect for non-canonical URLs
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /blog/* routes (T021)
  if (!pathname.startsWith('/blog/')) {
    return NextResponse.next();
  }

  // Normalize: lowercase and no trailing slash
  const normalized = pathname.toLowerCase().replace(/\/$/, '');

  // Check if normalization changed the URL
  if (pathname !== normalized) {
    const url = request.nextUrl.clone();
    url.pathname = normalized;
    // 301 permanent redirect per edge case spec
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

/**
 * Middleware configuration
 * Match only /blog/* routes for URL normalization
 */
export const config = {
  matcher: '/blog/:path*',
};
