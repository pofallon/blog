/**
 * Blog Post Navigation Component
 * Back link to /blog index
 * @see /specs/006-blog-post-route/tasks.md T012
 */

import Link from 'next/link';

export function BlogPostNav() {
  return (
    <nav className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
      <Link
        href="/blog"
        aria-label="Back to blog index"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Blog
      </Link>
    </nav>
  );
}
