import { HeroSection } from '@/components/HeroSection';
import { getAllPostsForIndex } from '@/lib/mdx/loader';
import { LatestPosts } from '@/components/LatestPosts';

export default function Home() {
  const latestPosts = getAllPostsForIndex({ limit: 4 });

  return (
    <div className="space-y-8">
      <HeroSection />
      <LatestPosts posts={latestPosts} />
    </div>
  );
}
