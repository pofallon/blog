/**
 * Project detail component for full project view
 * Industrial blueprint aesthetic with rich markdown rendering
 * @see /specs/010-projects-section/contracts/routes.md
 */

'use client';

import Image from 'next/image';
import type { ProjectDetailModel, ProjectStatus, ProcessedImage } from '@/lib/projects/types';
import { getProjectColor } from '@/lib/projects/colors';
import ProjectTags from './ProjectTags';
import type { ReactNode } from 'react';
import { SiGithub } from '@icons-pack/react-simple-icons';

const statusConfig: Record<ProjectStatus, { label: string; opacity: number }> = {
  'ready': { label: 'Give it a Try!', opacity: 1 },
  'in-progress': { label: 'In Progress', opacity: 0.85 },
  'coming-soon': { label: 'Coming Soon', opacity: 0.7 },
};

interface ProjectDetailProps {
  project: ProjectDetailModel;
  onPrimaryClick?: () => void;
  children?: ReactNode; // Server-rendered MDX content
}

export default function ProjectDetail({
  project,
  onPrimaryClick,
  children,
}: ProjectDetailProps) {
  const colorVar = getProjectColor(project.slug);

  const status = project.status ? statusConfig[project.status] : null;

  return (
    <article className="space-y-8">
      {/* Header with decorative elements */}
      <header className="relative">
        {/* Decorative background glow */}
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: `hsl(var(--${colorVar}))` }}
        />

        <div className="relative">
          {/* Status Badge - Industrial workshop plate style */}
          {status && (
            <div
              className="inline-block mb-4"
              style={{ opacity: status.opacity }}
            >
              <div
                className="relative px-4 py-2 text-xs font-bold uppercase tracking-wider"
                style={{
                  color: `hsl(var(--${colorVar}))`,
                  background: `linear-gradient(135deg, hsl(var(--g2k-bg-sunken)) 0%, hsl(var(--g2k-bg-base)) 100%)`,
                  border: `1px solid hsl(var(--${colorVar}) / 0.4)`,
                  borderRadius: '8px',
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
                    background: `linear-gradient(180deg, hsl(var(--${colorVar}) / 0.08) 0%, transparent 50%)`,
                  }}
                  aria-hidden="true"
                />
                {/* Corner rivets */}
                <span
                  className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full"
                  style={{
                    background: `hsl(var(--${colorVar}) / 0.5)`,
                    boxShadow: `inset 0 0.5px 0 hsl(0 0% 100% / 0.3)`,
                  }}
                  aria-hidden="true"
                />
                <span
                  className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full"
                  style={{
                    background: `hsl(var(--${colorVar}) / 0.5)`,
                    boxShadow: `inset 0 0.5px 0 hsl(0 0% 100% / 0.3)`,
                  }}
                  aria-hidden="true"
                />
                <span className="relative">{status.label}</span>
              </div>
            </div>
          )}

          <h1
            className="font-brand text-4xl md:text-5xl lg:text-6xl mb-4 tracking-wide"
            style={{ color: `hsl(var(--${colorVar}))` }}
          >
            {project.name}
          </h1>
          <p className="text-lg md:text-xl text-g2k-fg-secondary leading-relaxed">
            {project.summary}
          </p>

          {/* Project links */}
          {(project.primaryLink || project.secondaryLinks.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {project.primaryLink && (
                <a
                  href={project.primaryLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onPrimaryClick}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    color: `hsl(var(--${colorVar}))`,
                    backgroundColor: `hsl(var(--${colorVar}) / 0.08)`,
                    border: `1px solid hsl(var(--${colorVar}) / 0.2)`,
                  }}
                >
                  {project.primaryLink.label.toLowerCase().includes('github') ? (
                    <SiGithub size={16} />
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                  {project.primaryLink.label}
                </a>
              )}
              {project.secondaryLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    color: `hsl(var(--${colorVar}))`,
                    backgroundColor: `hsl(var(--${colorVar}) / 0.08)`,
                    border: `1px solid hsl(var(--${colorVar}) / 0.2)`,
                  }}
                >
                  {link.label.toLowerCase().includes('github') ? (
                    <SiGithub size={16} />
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Image or placeholder */}
      {project.image ? (
        <div className="aspect-video relative rounded-2xl overflow-hidden">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            className="object-cover"
            {...(project.image.blurDataURL && {
              placeholder: 'blur' as const,
              blurDataURL: project.image.blurDataURL,
            })}
          />
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1.5px solid hsl(var(--g2k-border))',
            boxShadow: 'var(--g2k-shadow-md), var(--g2k-shadow-inset)',
          }}
        >
          <div
            className="w-full aspect-video flex items-center justify-center"
            style={{ backgroundColor: 'hsl(var(--g2k-bg-sunken))' }}
          >
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `hsl(var(--${colorVar}) / 0.1)`,
                  border: `1px solid hsl(var(--${colorVar}) / 0.3)`,
                }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: `hsl(var(--${colorVar}))` }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-sm text-g2k-fg-muted">
                Project visualization coming soon
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Server-rendered MDX content passed as children */}
      {children}

      {/* Tags section */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: 'hsl(var(--g2k-bg-raised))',
          border: '1.5px solid hsl(var(--g2k-border))',
          boxShadow: 'var(--g2k-shadow-sm), var(--g2k-shadow-inset)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-1 h-5 rounded-full"
            style={{ backgroundColor: `hsl(var(--${colorVar}))` }}
          />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-g2k-fg-muted">
            Technologies
          </h2>
        </div>
        <ProjectTags tags={project.tags} colorVar={colorVar} />
      </div>

    </article>
  );
}
