'use client';

import Link from 'next/link';
import { Cog } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  siteName?: string;
  tagline?: string;
  subheading?: string;
}

export function HeroSection({
  siteName = "Paul O'Fallon",
  tagline = 'Learning out loud',
  subheading = 'Robot mascots. Endless curiosity. A workshop where ideas come to life.',
}: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="g2k-hero overflow-visible pt-8 pb-32 relative">
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

        {/* Floating geometric shapes - more visible */}
        <div
          className="absolute top-[15%] left-[10%] w-16 h-16 rounded-full floating-shape"
          style={{
            border: '2px solid hsl(var(--g2k-brass) / 0.35)',
            boxShadow: '0 0 20px hsl(var(--g2k-brass) / 0.15)'
          }}
        />
        <div
          className="absolute top-[60%] left-[5%] w-12 h-12 floating-shape-slow"
          style={{
            animationDelay: '-5s',
            border: '2px solid hsl(var(--g2k-teal) / 0.3)',
            boxShadow: '0 0 15px hsl(var(--g2k-teal) / 0.1)'
          }}
        />
        <div
          className="absolute top-[25%] right-[15%] w-20 h-20 rotate-45 floating-shape"
          style={{
            animationDelay: '-10s',
            border: '2px solid hsl(var(--g2k-coral) / 0.3)',
            boxShadow: '0 0 18px hsl(var(--g2k-coral) / 0.12)'
          }}
        />
        <div
          className="absolute bottom-[20%] right-[8%] w-14 h-14 rounded-full floating-shape-slow"
          style={{
            animationDelay: '-15s',
            border: '2px solid hsl(var(--g2k-brass) / 0.4)',
            background: 'hsl(var(--g2k-brass) / 0.05)',
            boxShadow: '0 0 25px hsl(var(--g2k-brass) / 0.2)'
          }}
        />
        <div
          className="absolute top-[40%] left-[20%] w-10 h-10 backdrop-blur-sm floating-shape rounded-full"
          style={{
            animationDelay: '-3s',
            background: 'hsl(var(--g2k-teal) / 0.15)',
            border: '1px solid hsl(var(--g2k-teal) / 0.25)',
            boxShadow: '0 0 12px hsl(var(--g2k-teal) / 0.15)'
          }}
        />
      </div>

      <div className="container mx-auto relative px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start relative">

          {/* Text content - Higher Z-index to partially overlap image or be overlapped */}
          <div
            className="w-full lg:w-3/5 text-center lg:text-left z-20 relative lg:pt-12"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
              transition: 'transform 0.05s linear'
            }}
          >
            {/* Eyebrow */}
            <p
              className="text-xs md:text-sm uppercase tracking-[0.3em] text-g2k-fg-muted mb-6 font-medium inline-block px-3 py-1 rounded border animate-fadeInUp transition-all duration-300 hover:scale-105 whitespace-nowrap"
              style={{
                animationDelay: '0.1s',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderColor: 'hsl(var(--g2k-border) / 0.5)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              Agentic Architect & Open Source Creator
            </p>

            <h1
              className="g2k-hero-title leading-[0.9] !text-[clamp(3.5rem,12vw,6.5rem)] mb-4 -ml-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] animate-fadeInUp whitespace-nowrap"
              style={{ animationDelay: '0.3s' }}
            >
              {siteName}
            </h1>

            {/* Primary tagline */}
            <div
              className="relative inline-block mb-8 animate-fadeInUp"
              style={{ animationDelay: '0.5s', transform: 'rotate(-1.5deg)' }}
            >
              <p className="g2k-hero-tagline gradient-text font-brand text-3xl md:text-4xl lg:text-5xl !mt-0 relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] lg:whitespace-nowrap">
                {tagline}
              </p>
            </div>

            {/* Subheading */}
            <p
              className="g2k-hero-subheading text-lg md:text-xl max-w-[280px] leading-relaxed mb-10 text-g2k-fg-secondary/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] animate-fadeInUp"
              style={{ animationDelay: '0.7s' }}
            >
              {subheading}
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start animate-fadeInUp"
              style={{ animationDelay: '0.9s' }}
            >
              <button
                onClick={() => {
                  const gangOfFour = document.getElementById('gang-of-four');
                  gangOfFour?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="g2k-btn-primary g2k-btn-lg group"
              >
                <Cog className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                Meet the Projects
              </button>
              <Link href="/blog" className="g2k-btn-outline g2k-btn-lg bg-g2k-bg-base/60 backdrop-blur-md">
                Read the Field Notes
              </Link>
            </div>
          </div>

          {/* Robot gang image - Vertical composition */}
          <div
            className="w-full lg:w-1/2 mt-12 lg:mt-0 lg:absolute lg:-right-16 lg:top-0 z-10 pointer-events-none select-none"
            style={{
              transform: `translateY(${scrollY * 0.08}px)`,
              transition: 'transform 0.05s linear'
            }}
          >
            <div className="relative w-full aspect-[9/10] lg:aspect-auto lg:h-[700px] flex items-center justify-center lg:justify-end">

              {/* Depth Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-gradient-to-tr from-g2k-teal/30 via-g2k-brass/30 to-g2k-coral/30 blur-[100px] opacity-40 animate-pulse duration-[10s]" />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/robots/gang_of_four.png"
                alt="The Gang of Four: Remo, Maverick, Deacon, and Newcleus robots"
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-transform duration-1000 ease-in-out animate-fadeInScale"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(var(--g2k-brass), 0.2))',
                  animationDelay: '0.5s',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)'
                }}
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity animate-fadeInUp" style={{ animationDelay: '1.2s' }}>
          <span className="text-xs uppercase tracking-wider text-g2k-fg-muted">Scroll</span>
          <div className="scroll-indicator w-6 h-10 rounded-full border-2 border-g2k-brass/40 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-g2k-brass rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
