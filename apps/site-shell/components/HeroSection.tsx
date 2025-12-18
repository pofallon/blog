'use client';

import Link from 'next/link';
import { Cog, Wrench, Lightbulb, Zap } from 'lucide-react';

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
 * Will be replaced with actual illustrations
 */
function RobotPlaceholders() {
  const robots = [
    { 
      id: 'alpha', 
      icon: Lightbulb, 
      color: 'text-g2k-teal',
      bgColor: 'bg-g2k-teal/10',
      label: 'α' 
    },
    { 
      id: 'beta', 
      icon: Cog, 
      color: 'text-g2k-brass',
      bgColor: 'bg-g2k-brass/10',
      label: 'β' 
    },
    { 
      id: 'gamma', 
      icon: Zap, 
      color: 'text-g2k-coral',
      bgColor: 'bg-g2k-coral/10',
      label: 'γ' 
    },
    { 
      id: 'delta', 
      icon: Wrench, 
      color: 'text-g2k-robot-delta',
      bgColor: 'bg-g2k-robot-delta/10',
      label: 'δ' 
    },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <div className="flex items-end gap-4 md:gap-6">
        {robots.map((robot, index) => {
          const Icon = robot.icon;
          // Stagger heights for visual interest
          const heights = ['h-20', 'h-28', 'h-24', 'h-26'];
          
          return (
            <div
              key={robot.id}
              className={[
                'relative flex flex-col items-center justify-end',
                heights[index],
                'w-12 md:w-16',
                robot.bgColor,
                'rounded-lg border border-g2k-border/30',
                'transition-transform duration-300',
                'hover:scale-105 hover:-translate-y-1',
                'group'
              ].join(' ')}
            >
              {/* Robot "eye" glow */}
              <div 
                className={`
                  absolute top-2 w-3 h-3 rounded-full
                  ${robot.bgColor} ${robot.color}
                  opacity-60 group-hover:opacity-100
                  transition-opacity
                `}
              >
                <div className={`w-full h-full rounded-full ${robot.bgColor} animate-pulse`} />
              </div>
              
              {/* Robot body icon */}
              <Icon className={`w-6 h-6 md:w-8 md:h-8 ${robot.color} mb-2`} />
              
              {/* Robot label */}
              <span className={`text-xs font-mono ${robot.color} opacity-70`}>
                {robot.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Subtitle */}
      <span className="absolute bottom-4 text-xs text-g2k-fg-muted/50 font-mono">
        [ robot illustrations coming soon ]
      </span>
    </div>
  );
}

export default HeroSection;
