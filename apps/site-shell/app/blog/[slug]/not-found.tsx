/**
 * Blog Post Not Found Page
 * 404 UI with navigation back to /blog
 * @see /specs/006-blog-post-route/tasks.md T022, T025
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Post Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
    </div>
  );
}
