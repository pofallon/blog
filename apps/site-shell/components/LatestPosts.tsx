import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { BlogIndexEntry } from '@/lib/mdx/types';

interface LatestPostsProps {
    posts: BlogIndexEntry[];
}

export function LatestPosts({ posts }: LatestPostsProps) {
    return (
        <section
            className="rounded-3xl border-[1.5px] border-shell-border bg-g2k-bg-raised/50 px-6 py-8"
            style={{ boxShadow: 'var(--g2k-shadow-sm), var(--g2k-shadow-inset)' }}
            aria-labelledby="latest-posts-heading"
        >
            {/* Section header */}
            <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-4 h-4 text-g2k-brass" aria-hidden="true" />
                <h2 id="latest-posts-heading" className="text-sm font-medium tracking-wide text-g2k-fg-secondary">
                    Latest Posts
                </h2>
            </div>

            {/* Post cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={post.url}
                        className="group block rounded-2xl border-[1.5px] border-shell-border bg-white dark:bg-g2k-bg-raised p-5 transition-[transform,border-color,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:border-g2k-brass/40 shadow-[var(--g2k-shadow-sm),var(--g2k-shadow-inset)] hover:shadow-[var(--g2k-shadow-md),var(--g2k-shadow-inset)]"
                    >
                        <div className="flex flex-col h-full">
                            {/* Hero Image Thumbnail */}
                            {post.heroImage ? (
                                <div className="relative aspect-[21/9] w-full mb-4 overflow-hidden rounded-xl border border-shell-border">
                                    <Image
                                        src={post.heroImage.src}
                                        alt={post.heroImage.alt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        placeholder={post.heroImage.blurDataURL ? 'blur' : 'empty'}
                                        blurDataURL={post.heroImage.blurDataURL}
                                    />
                                </div>
                            ) : (
                                <div className="aspect-[21/9] w-full mb-4 overflow-hidden rounded-xl border border-shell-border bg-gradient-to-br from-g2k-bg-raised to-g2k-bg-raised/30 flex items-center justify-center">
                                    <div className="text-g2k-fg-muted/10">No image</div>
                                </div>
                            )}

                            <div className="flex items-start justify-between gap-3 mb-2">
                                <p className="text-xs font-medium text-g2k-fg-muted/60 uppercase tracking-wider">
                                    {post.formattedDate}
                                </p>
                                {/* Subtle directional hint */}
                                <span
                                    className="text-g2k-fg-muted/40 group-hover:text-g2k-brass/60 transition-colors duration-150"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                            </div>

                            <h3 className="text-base font-semibold text-shell-ink group-hover:text-g2k-brass transition-colors duration-150 mb-2">
                                {post.title}
                            </h3>

                            <p className="text-sm text-shell-muted leading-relaxed line-clamp-2">
                                {post.summary}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer link to all posts */}
            <div className="mt-6 text-center">
                <Link
                    href="/blog"
                    className="text-xs text-g2k-fg-muted/60 hover:text-g2k-brass transition-colors duration-150 inline-flex items-center gap-1"
                >
                    View all posts <span aria-hidden="true">→</span>
                </Link>
            </div>
        </section>
    );
}
