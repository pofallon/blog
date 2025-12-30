'use client';

import Link from 'next/link';
import { Cog } from 'lucide-react';

interface HeroSectionProps {
  siteName?: string;
  tagline?: string;
  subheading?: string;
}

export function HeroSection({
  siteName = 'get2know.io',
  tagline = 'A workshop for the curious.',
  subheading = 'Open source experiments, half-finished robots, and the occasional thing that actually works. Four projects. One story still being written.',
}: HeroSectionProps) {
  return (
    <section className="g2k-hero overflow-visible pt-24 pb-32">
      {/* Sentinel element for Intersection Observer */}
      <div id="hero-sentinel" className="absolute top-0 left-0 h-1 w-full pointer-events-none" aria-hidden="true" />

      {/* Background Layer with retro '70s surf vibes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Sunburst / Stripe effect behind robots */}
        <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square opacity-[0.15] dark:opacity-[0.1]">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg 10deg, var(--g2k-brass) 10deg 20deg, transparent 20deg 30deg, var(--g2k-teal) 30deg 40deg, transparent 40deg 50deg, var(--g2k-coral) 50deg 60deg, transparent 60deg)'
            }}
          />
        </div>
        {/* Large atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-gradient-to-b from-transparent via-g2k-brass/5 to-transparent blur-[120px]" />
      </div>

      <div className="container mx-auto relative px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start relative">

          {/* Text content - Higher Z-index to partially overlap image or be overlapped */}
          <div className="w-full lg:w-3/5 text-center lg:text-left z-20 relative lg:pt-12">
            {/* Eyebrow */}
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-g2k-fg-muted mb-6 font-medium bg-g2k-bg-base/80 backdrop-blur-sm inline-block px-3 py-1 rounded border border-g2k-border/50">
              Somewhere between idea and artifact
            </p>

            <h1 className="g2k-hero-title leading-[0.9] !text-[clamp(3.5rem,12vw,6.5rem)] mb-4 -ml-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {siteName}
            </h1>

            {/* Primary tagline */}
            <div className="relative inline-block mb-8">
              <p className="g2k-hero-tagline font-brand text-3xl md:text-4xl lg:text-5xl !mt-0 relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] lg:whitespace-nowrap">
                {tagline}
              </p>
            </div>

            {/* Subheading */}
            <p className="g2k-hero-subheading text-lg md:text-xl max-w-[280px] leading-relaxed mb-10 text-g2k-fg-secondary/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              {subheading}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/projects" className="g2k-btn-primary g2k-btn-lg group">
                <Cog className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                Meet the Projects
              </Link>
              <Link href="/blog" className="g2k-btn-outline g2k-btn-lg bg-g2k-bg-base/60 backdrop-blur-md">
                Read the Field Notes
              </Link>
            </div>
          </div>

          {/* Robot gang image - Large and Overlapping */}
          <div className="w-full lg:w-2/3 mt-12 lg:mt-0 lg:absolute lg:-right-32 lg:top-0 z-10 pointer-events-none select-none">
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[800px] flex items-center justify-center lg:justify-end">

              {/* Depth Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-g2k-teal/30 via-g2k-brass/30 to-g2k-coral/30 blur-[100px] opacity-40 animate-pulse duration-[10s]" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/robots/gang_of_four.png"
                alt="The Gang of Four: Alpha, Beta, Gamma, and Delta robots"
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-2 scale-110 lg:scale-125 hover:rotate-0 transition-transform duration-1000 ease-in-out"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(var(--g2k-brass), 0.2))'
                }}
              />

              {/* Final Fade-out Overlay - Blending robots into the background */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3 z-20 pointer-events-none bg-gradient-to-t from-g2k-bg-base via-g2k-bg-base/60 to-transparent"
                aria-hidden="true"
              />

              {/* Retro Striped Floating Element */}
              <div className="absolute bottom-1/4 right-0 w-32 h-32 opacity-20 hidden lg:block">
                <div className="w-full h-full flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-2 w-full bg-g2k-brass" style={{ opacity: 1 - (i * 0.2) }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
