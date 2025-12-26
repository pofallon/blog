'use client';

import Link from 'next/link';
import { Cog } from 'lucide-react';

interface HeroSectionProps {
  siteName?: string;
  tagline?: string;
  subheading?: string;
}

/**
 * Hero section for get2know.io homepage
 * Features the "Gang of Four" robot mascots (placeholder for now)
 */
export function HeroSection({
  siteName = 'get2know.io',
  tagline = 'A workshop for the curious.',
  subheading = 'Open source experiments, half-finished robots, and the occasional thing that actually works. Four projects. One story still being written.',
}: HeroSectionProps) {
  return (
    <section className="g2k-hero">
      {/* Sentinel element for Intersection Observer - triggers header reveal when hero scrolls out */}
      <div id="hero-sentinel" className="absolute top-0 left-0 h-1 w-full pointer-events-none" aria-hidden="true" />

      {/* Background with gradient effects */}
      <div className="g2k-hero-bg" aria-hidden="true" />

      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1 lg:mt-12">
            {/* Eyebrow - hints at the nature of the site */}
            <p className="text-sm uppercase tracking-[0.15em] text-g2k-fg-muted mb-3 font-medium">
              Somewhere between idea and artifact
            </p>

            <h1 className="g2k-hero-title">
              {siteName}
            </h1>

            {/* Primary tagline - short, evocative */}
            <p className="g2k-hero-tagline font-brand">
              {tagline}
            </p>

            {/* Subheading - the story hint */}
            <p className="g2k-hero-subheading">
              {subheading}
            </p>
          </div>

          {/* Robot gang image and buttons */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-8 h-full">
            <div className="relative w-full h-full max-h-[800px] flex items-end justify-center">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-g2k-teal/20 via-g2k-brass/20 to-g2k-coral/20 blur-3xl opacity-40 scale-90" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/robots/gang_of_four.png"
                alt="The Gang of Four: Alpha, Beta, Gamma, and Delta robots"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]"
              />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects" className="g2k-btn-primary">
                <Cog className="w-4 h-4" />
                Meet the Projects
              </Link>
              <Link href="/blog" className="g2k-btn-outline">
                Read the Field Notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
