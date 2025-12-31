'use client';

import Link from 'next/link';
import { Code2, Zap, Settings, Radio } from 'lucide-react';

type ProjectStatus = 'ready' | 'in-progress' | 'coming-soon';

const statusConfig: Record<ProjectStatus, { label: string; opacity: number }> = {
  'ready': { label: 'Give it a Try!', opacity: 1 },
  'in-progress': { label: 'In Progress', opacity: 0.85 },
  'coming-soon': { label: 'Coming Soon', opacity: 0.7 },
};

const projects = [
  {
    id: 'remo',
    name: 'Remo',
    slug: 'remo',
    description: 'Automated cloud dev server provisioning with DevContainers and persistent sessions.',
    color: 'g2k-teal',
    glowColor: 'rgba(var(--g2k-teal), 0.3)',
    icon: Code2,
    tags: ['Ansible', 'Hetzner', 'DevContainers'],
    status: 'ready' as ProjectStatus,
  },
  {
    id: 'maverick',
    name: 'Maverick',
    slug: 'maverick',
    description: 'AI-powered development workflow orchestration using autonomous Claude agents.',
    color: 'g2k-brass',
    glowColor: 'rgba(var(--g2k-brass), 0.3)',
    icon: Settings,
    tags: ['Python', 'Claude AI', 'CLI'],
    status: 'in-progress' as ProjectStatus,
  },
  {
    id: 'deacon',
    name: 'Deacon',
    slug: 'deacon',
    description: 'Fast, lightweight Rust implementation of the DevContainer CLI.',
    color: 'g2k-robot-delta',
    glowColor: 'rgba(var(--g2k-robot-delta), 0.3)',
    icon: Zap,
    tags: ['Rust', 'DevContainers', 'CLI'],
    status: 'in-progress' as ProjectStatus,
  },
  {
    id: 'newcleus',
    name: 'Newcleus',
    slug: 'newcleus',
    description: "It's a wiki wiki wiki wiki...",
    color: 'g2k-coral',
    glowColor: 'rgba(var(--g2k-coral), 0.3)',
    icon: Radio,
    tags: ['Node.js', 'TypeScript'],
    status: 'coming-soon' as ProjectStatus,
  },
];

export function FeaturedProjects() {
  return (
    <section
      id="gang-of-four"
      className="rounded-3xl border-[1.5px] border-shell-border bg-g2k-bg-raised/50 px-6 py-8 md:px-8 md:py-10"
      style={{ boxShadow: 'var(--g2k-shadow-md), var(--g2k-shadow-inset)' }}
      aria-labelledby="featured-projects-heading"
    >
      {/* Section header */}
      <div className="mb-8 text-center">
        <h2
          id="featured-projects-heading"
          className="font-brand text-3xl md:text-4xl mb-3"
          style={{ color: 'hsl(var(--g2k-fg-primary))' }}
        >
          The Gang of Four
        </h2>
        <p className="text-g2k-fg-secondary max-w-2xl mx-auto">
          Four open source projects, each with their own personality. Click to explore the workshops where ideas come to life.
        </p>
      </div>

      {/* Project grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {projects.map((project, index) => {
          const Icon = project.icon;
          const status = statusConfig[project.status];
          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group relative block rounded-2xl border-[1.5px] border-shell-border bg-g2k-bg-raised p-6 transition-all duration-300 hover:-translate-y-1 animate-fadeInUp overflow-hidden"
              style={{
                boxShadow: 'var(--g2k-shadow-sm), var(--g2k-shadow-inset)',
                animationDelay: `${0.1 + index * 0.1}s`,
              }}
            >
              {/* Status Badge - Industrial workshop plate style */}
              <div
                className="absolute -top-1 -right-1 z-20 pointer-events-none"
                style={{ opacity: status.opacity }}
              >
                <div
                  className="relative px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rotate-3 origin-top-right"
                  style={{
                    color: `hsl(var(--${project.color}))`,
                    background: `linear-gradient(135deg, hsl(var(--g2k-bg-sunken)) 0%, hsl(var(--g2k-bg-base)) 100%)`,
                    border: `1px solid hsl(var(--${project.color}) / 0.4)`,
                    borderRadius: '0 12px 0 8px',
                    boxShadow: `
                      inset 0 1px 0 hsl(0 0% 100% / 0.05),
                      inset 0 -1px 2px hsl(var(--g2k-shadow-color) / 0.2),
                      0 2px 4px hsl(var(--g2k-shadow-color) / 0.3)
                    `,
                  }}
                >
                  {/* Embossed inner highlight */}
                  <span
                    className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{
                      background: `linear-gradient(180deg, hsl(var(--${project.color}) / 0.08) 0%, transparent 50%)`,
                    }}
                    aria-hidden="true"
                  />
                  {/* Subtle corner rivet */}
                  <span
                    className="absolute top-1 left-1 w-1 h-1 rounded-full"
                    style={{
                      background: `hsl(var(--${project.color}) / 0.5)`,
                      boxShadow: `inset 0 0.5px 0 hsl(0 0% 100% / 0.3)`,
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative">{status.label}</span>
                </div>
              </div>

              {/* Hover glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{
                  boxShadow: `0 0 40px ${project.glowColor}`,
                }}
              />

              {/* Glass morphism background on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--${project.color}) / 0.05) 0%, transparent 100%)`,
                  backdropFilter: 'blur(10px)',
                }}
              />

              <div className="relative z-10">
                {/* Icon and project name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `hsl(var(--${project.color}) / 0.1)`,
                        border: `1px solid hsl(var(--${project.color}) / 0.3)`,
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: `hsl(var(--${project.color}))` }}
                      />
                    </div>
                    <div>
                      <h3
                        className="font-brand text-2xl leading-none group-hover:scale-105 transition-transform duration-300 inline-block"
                        style={{ color: `hsl(var(--${project.color}))` }}
                      >
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <span
                    className="text-g2k-fg-muted/40 group-hover:text-g2k-fg-primary group-hover:translate-x-1 transition-all duration-300 mt-6"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-g2k-fg-secondary leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs font-medium transition-colors duration-300"
                      style={{
                        background: `hsl(var(--${project.color}) / 0.1)`,
                        color: `hsl(var(--${project.color}))`,
                        border: `1px solid hsl(var(--${project.color}) / 0.2)`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-g2k-fg-muted hover:text-g2k-brass transition-colors duration-300"
        >
          <span>View detailed project documentation</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
