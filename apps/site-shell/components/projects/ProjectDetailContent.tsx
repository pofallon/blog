/**
 * Server component for rendering project MDX content
 * Must remain a server component for MDXRemote to work
 */

import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import type { ComponentProps, ReactNode } from 'react';

interface ProjectDetailContentProps {
  content: string;
  colorVar: string;
}

// Custom MDX components factory that injects the project color
function createMDXComponents(colorVar: string) {
  return {
    // Section headers with accent line and brand color
    h2: ({ children }: { children?: ReactNode }) => (
      <div className="mt-12 mb-6 first:mt-0">
        <div className="flex items-center gap-4">
          <div
            className="w-1 h-8 rounded-full shrink-0"
            style={{ backgroundColor: `hsl(var(--${colorVar}))` }}
          />
          <h2
            className="font-brand text-2xl md:text-3xl tracking-wide"
            style={{ color: `hsl(var(--${colorVar}))` }}
          >
            {children}
          </h2>
        </div>
        <div
          className="mt-3 h-px w-full opacity-20"
          style={{ backgroundColor: `hsl(var(--${colorVar}))` }}
        />
      </div>
    ),

    // Paragraphs
    p: ({ children }: { children?: ReactNode }) => (
      <p className="text-g2k-fg-secondary leading-relaxed mb-4">
        {children}
      </p>
    ),

    // Unordered lists as feature cards
    ul: ({ children }: { children?: ReactNode }) => (
      <div className="grid gap-3 my-6">{children}</div>
    ),

    // List items as styled cards
    li: ({ children }: { children?: ReactNode }) => (
      <div
        className="group flex items-start gap-3 rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
        style={{
          backgroundColor: `hsl(var(--g2k-bg-raised))`,
          border: `1.5px solid hsl(var(--g2k-border))`,
          boxShadow: 'var(--g2k-shadow-sm), var(--g2k-shadow-inset)',
        }}
      >
        {/* Accent dot - mt-[0.4rem] aligns with first line of text */}
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-[0.4rem] opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: `hsl(var(--${colorVar}))` }}
        />
        <div className="text-g2k-fg-secondary leading-relaxed">
          {children}
        </div>
      </div>
    ),

    // Bold text with accent color
    strong: ({ children }: { children?: ReactNode }) => (
      <strong
        className="font-semibold"
        style={{ color: `hsl(var(--${colorVar}))` }}
      >
        {children}
      </strong>
    ),

    // Inline code with terminal styling
    code: ({ children, ...props }: ComponentProps<'code'>) => {
      // Check if this is a code block (has className) vs inline code
      const isCodeBlock = 'className' in props && props.className;
      if (isCodeBlock) {
        return <code {...props}>{children}</code>;
      }
      return (
        <code
          className="px-1.5 py-0.5 rounded text-sm font-mono"
          style={{
            backgroundColor: `hsl(var(--${colorVar}) / 0.1)`,
            color: `hsl(var(--${colorVar}))`,
            border: `1px solid hsl(var(--${colorVar}) / 0.2)`,
          }}
        >
          {children}
        </code>
      );
    },

    // Code blocks with enhanced styling
    pre: ({ children }: { children?: ReactNode }) => (
      <pre
        className="rounded-xl p-4 my-6 overflow-x-auto text-sm font-mono"
        style={{
          backgroundColor: 'hsl(var(--g2k-bg-sunken))',
          border: '1.5px solid hsl(var(--g2k-border))',
          boxShadow: 'var(--g2k-shadow-inset-deep)',
        }}
      >
        {children}
      </pre>
    ),

    // Links with hover effect
    a: ({ href, children }: { href?: string; children?: ReactNode }) => (
      <a
        href={href}
        className="font-medium transition-colors hover:underline"
        style={{ color: `hsl(var(--${colorVar}))` }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Table components
    table: ({ children }: { children?: ReactNode }) => (
      <div className="my-6 overflow-x-auto rounded-xl"
        style={{
          border: '1.5px solid hsl(var(--g2k-border))',
          boxShadow: 'var(--g2k-shadow-sm)',
        }}
      >
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: ReactNode }) => (
      <thead
        style={{
          backgroundColor: `hsl(var(--${colorVar}) / 0.1)`,
          borderBottom: '1.5px solid hsl(var(--g2k-border))',
        }}
      >
        {children}
      </thead>
    ),
    tbody: ({ children }: { children?: ReactNode }) => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }: { children?: ReactNode }) => (
      <tr
        className="transition-colors"
        style={{ borderBottom: '1px solid hsl(var(--g2k-border))' }}
      >
        {children}
      </tr>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th
        className="px-4 py-3 text-left font-semibold"
        style={{ color: `hsl(var(--${colorVar}))` }}
      >
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td className="px-4 py-3 text-g2k-fg-secondary">{children}</td>
    ),
  };
}

export default function ProjectDetailContent({
  content,
  colorVar,
}: ProjectDetailContentProps) {
  const mdxComponents = createMDXComponents(colorVar);

  return (
    <div className="relative">
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
