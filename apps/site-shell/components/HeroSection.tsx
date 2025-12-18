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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
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
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <Link href="/projects" className="g2k-btn-primary">
                <Cog className="w-4 h-4" />
                Meet the Projects
              </Link>
              <Link href="/blog" className="g2k-btn-outline">
                Read the Field Notes
              </Link>
            </div>
          </div>
          
          {/* Robot gang placeholder */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="g2k-hero-robots">
              {/* Placeholder content until robot illustrations are added */}
              <RobotPlaceholders />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Placeholder for the Gang of Four robots
 * Designed frame that reserves space for future illustration
 */
function RobotPlaceholders() {
  const robots = [
    { id: 'alpha', cssVar: '--g2k-teal', label: 'α', height: 'h-14 md:h-20', width: 'w-8 md:w-11' },
    { id: 'beta', cssVar: '--g2k-brass', label: 'β', height: 'h-[4.5rem] md:h-[6.5rem]', width: 'w-10 md:w-14' },
    { id: 'gamma', cssVar: '--g2k-coral', label: 'γ', height: 'h-16 md:h-[5.5rem]', width: 'w-9 md:w-12' },
    { id: 'delta', cssVar: '--g2k-robot-delta', label: 'δ', height: 'h-12 md:h-[4.5rem]', width: 'w-8 md:w-11' },
  ];

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
      {/* Frame title */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-g2k-border/50 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-g2k-fg-muted/50 font-medium whitespace-nowrap px-1">
          Gang of Four
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-g2k-border/50 to-transparent" />
      </div>
      
      {/* Robot silhouette markers */}
      <div className="flex items-end gap-3 md:gap-5">
        {robots.map((robot) => (
          <div
            key={robot.id}
            className="flex flex-col items-center gap-2 group"
          >
            {/* Robot placeholder shape */}
            <div
              className={`
                ${robot.height} ${robot.width}
                relative
                rounded-t-xl rounded-b-md
                border-2 border-dashed border-g2k-border/30
                bg-gradient-to-b from-g2k-bg-sunken/40 to-transparent
                transition-all duration-300
                hover:border-g2k-border/50
              `}
            >
              {/* Indicator dot at "head" position */}
              <div 
                className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ 
                  background: `radial-gradient(circle, hsl(var(${robot.cssVar}) / 0.6), hsl(var(${robot.cssVar}) / 0.2))` 
                }}
              />
            </div>
            
            {/* Robot label */}
            <span className="text-[11px] font-mono text-g2k-fg-muted/40 group-hover:text-g2k-fg-muted/60 transition-colors">
              {robot.label}
            </span>
          </div>
        ))}
      </div>
      
      {/* Decorative corner brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-[1.5px] border-t-[1.5px] border-g2k-border/25 rounded-tl-sm" aria-hidden="true" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-[1.5px] border-t-[1.5px] border-g2k-border/25 rounded-tr-sm" aria-hidden="true" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-[1.5px] border-b-[1.5px] border-g2k-border/25 rounded-bl-sm" aria-hidden="true" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-[1.5px] border-b-[1.5px] border-g2k-border/25 rounded-br-sm" aria-hidden="true" />
      
      {/* Bottom caption */}
      <p className="absolute bottom-4 text-[10px] text-g2k-fg-muted/35 tracking-wider italic">
        illustration in progress
      </p>
    </div>
  );
}

export default HeroSection;
