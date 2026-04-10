/**
 * Horizontal command-rail diagram for the Maverick project page.
 *
 * Shows the five commands of the Maverick pipeline as a left-to-right flow,
 * with each command's column containing the AI agents (accent) and
 * deterministic actors (neutral) it leverages, plus the interactions between
 * them. Off-ramp to Human Review hangs off the fly bead loop.
 *
 * Format mirrors ClimaxFlowDiagram: same outer wrapper, mono typography,
 * accent/neutral box variants, and `colorVar` theming.
 */

interface MaverickFlowDiagramProps {
  colorVar: string;
}

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

function Box({
  title,
  subtitle,
  colorVar,
  accent,
  tiny,
}: {
  title: string;
  subtitle?: string;
  colorVar: string;
  accent?: boolean;
  tiny?: boolean;
}) {
  return (
    <div
      className={`relative rounded-md text-center min-w-0 ${tiny ? 'px-2 py-1.5' : 'px-3 py-2'}`}
      style={{
        backgroundColor: accent
          ? `hsl(var(--${colorVar}) / 0.08)`
          : 'hsl(var(--g2k-bg-raised))',
        border: accent
          ? `1.5px solid hsl(var(--${colorVar}) / 0.35)`
          : '1.5px solid hsl(var(--g2k-border))',
        boxShadow: 'var(--g2k-shadow-sm)',
      }}
    >
      <div
        className={`font-semibold font-mono leading-tight ${tiny ? 'text-[11px]' : 'text-xs'}`}
        style={{
          color: accent ? `hsl(var(--${colorVar}))` : 'hsl(var(--g2k-fg))',
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div className="text-[10px] text-g2k-fg-muted mt-0.5 leading-snug">
          {subtitle}
        </div>
      )}
    </div>
  );
}

function HArrow({
  label,
  colorVar,
  width = 32,
}: {
  label?: string;
  colorVar: string;
  width?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 px-0.5 self-center">
      {label && (
        <span
          className="text-[9px] font-mono font-medium uppercase tracking-wider whitespace-nowrap"
          style={{ color: `hsl(var(--${colorVar}) / 0.6)` }}
        >
          {label}
        </span>
      )}
      <svg
        width={width}
        height="10"
        viewBox={`0 0 ${width} 10`}
        className="block"
      >
        <line
          x1="0"
          y1="5"
          x2={width - 4}
          y2="5"
          stroke={`hsl(var(--${colorVar}) / 0.4)`}
          strokeWidth="1.5"
        />
        <polygon
          points={`${width - 6},1 ${width},5 ${width - 6},9`}
          fill={`hsl(var(--${colorVar}) / 0.4)`}
        />
      </svg>
    </div>
  );
}

function VArrow({
  colorVar,
  label,
}: {
  colorVar: string;
  label?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-1 my-0.5">
      <svg width="14" height="16" viewBox="0 0 14 16" className="block">
        <line
          x1="7"
          y1="0"
          x2="7"
          y2="12"
          stroke={`hsl(var(--${colorVar}) / 0.4)`}
          strokeWidth="1.5"
        />
        <polygon
          points="3,10 7,16 11,10"
          fill={`hsl(var(--${colorVar}) / 0.4)`}
        />
      </svg>
      {label && (
        <span
          className="text-[9px] font-mono uppercase tracking-wider"
          style={{ color: `hsl(var(--${colorVar}) / 0.55)` }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function LoopBackArrow({ colorVar }: { colorVar: string }) {
  return (
    <div className="flex justify-center my-1">
      <svg
        width="100%"
        height="22"
        viewBox="0 0 200 22"
        preserveAspectRatio="xMidYMid meet"
        className="block max-w-[180px]"
      >
        <path
          d="M 178 4 C 192 4, 192 18, 178 18 L 22 18 C 8 18, 8 4, 22 4"
          fill="none"
          stroke={`hsl(var(--${colorVar}) / 0.3)`}
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <polygon
          points="26,0 18,4 26,8"
          fill={`hsl(var(--${colorVar}) / 0.3)`}
        />
        <text
          x="100"
          y="14"
          textAnchor="middle"
          fill={`hsl(var(--${colorVar}) / 0.5)`}
          fontSize="9"
          fontFamily="monospace"
          fontWeight="500"
        >
          fix &amp; retry
        </text>
      </svg>
    </div>
  );
}

function ParallelGroup({
  children,
  label,
  colorVar,
}: {
  children: React.ReactNode;
  label: string;
  colorVar: string;
}) {
  return (
    <div
      className="rounded-md p-2 pt-3 relative"
      style={{
        border: `1.5px dashed hsl(var(--${colorVar}) / 0.25)`,
        backgroundColor: `hsl(var(--${colorVar}) / 0.03)`,
      }}
    >
      <div
        className="absolute -top-2 left-2 px-1.5 text-[9px] font-mono font-medium uppercase tracking-wider whitespace-nowrap"
        style={{
          color: `hsl(var(--${colorVar}) / 0.55)`,
          backgroundColor: 'hsl(var(--g2k-bg-sunken))',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function CommandColumn({
  command,
  children,
  width,
}: {
  command: string;
  children: React.ReactNode;
  width: string;
}) {
  return (
    <div
      className="flex flex-col shrink-0"
      style={{ width }}
    >
      <div className="text-center mb-3">
        <span
          className="text-[10px] font-mono font-bold uppercase tracking-widest text-g2k-fg-muted"
        >
          maverick
        </span>{' '}
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-g2k-fg">
          {command}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main diagram                                                       */
/* ------------------------------------------------------------------ */

export default function MaverickFlowDiagram({
  colorVar,
}: MaverickFlowDiagramProps) {
  return (
    <div
      className="my-6 rounded-xl p-5 sm:p-6 overflow-x-auto"
      style={{
        backgroundColor: 'hsl(var(--g2k-bg-sunken))',
        border: '1.5px solid hsl(var(--g2k-border))',
        boxShadow: 'var(--g2k-shadow-inset-deep)',
      }}
    >
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-4 text-[10px] font-mono text-g2k-fg-muted">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{
              backgroundColor: `hsl(var(--${colorVar}) / 0.08)`,
              border: `1.5px solid hsl(var(--${colorVar}) / 0.35)`,
            }}
          />
          <span>AI agent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{
              backgroundColor: 'hsl(var(--g2k-bg-raised))',
              border: '1.5px solid hsl(var(--g2k-border))',
            }}
          />
          <span>deterministic actor</span>
        </div>
      </div>

      {/* Horizontal command rail */}
      <div className="flex items-stretch justify-start gap-1 min-w-fit">
        {/* ── runway seed ── */}
        <CommandColumn command="runway seed" width="130px">
          <Box
            title="Seeder"
            subtitle="codebase scan"
            colorVar={colorVar}
            accent
          />
          <div className="flex-1" />
          <Box
            title="runway/"
            subtitle="knowledge store"
            colorVar={colorVar}
            tiny
          />
        </CommandColumn>

        <HArrow colorVar={colorVar} />

        {/* ── plan generate ── */}
        <CommandColumn command="plan generate" width="200px">
          <ParallelGroup label="pre-flight briefing" colorVar={colorVar}>
            <div className="grid grid-cols-2 gap-1.5">
              <Box title="Scopist" colorVar={colorVar} accent tiny />
              <Box title="Codebase" colorVar={colorVar} accent tiny />
              <Box title="Criteria" colorVar={colorVar} accent tiny />
              <Box title="Contrarian" colorVar={colorVar} accent tiny />
            </div>
          </ParallelGroup>
          <VArrow colorVar={colorVar} label="synthesize" />
          <Box
            title="Plan Generator"
            subtitle="→ flight plan"
            colorVar={colorVar}
            accent
          />
        </CommandColumn>

        <HArrow colorVar={colorVar} />

        {/* ── refuel ── */}
        <CommandColumn command="refuel" width="200px">
          <ParallelGroup label="briefing room" colorVar={colorVar}>
            <div className="grid grid-cols-2 gap-1.5">
              <Box title="Navigator" colorVar={colorVar} accent tiny />
              <Box title="Structural" colorVar={colorVar} accent tiny />
              <Box title="Recon" colorVar={colorVar} accent tiny />
              <Box title="Contrarian" colorVar={colorVar} accent tiny />
            </div>
          </ParallelGroup>
          <VArrow colorVar={colorVar} label="synthesize" />
          <Box
            title="Decomposer"
            subtitle="→ beads (bd)"
            colorVar={colorVar}
            accent
          />
        </CommandColumn>

        <HArrow colorVar={colorVar} />

        {/* ── fly ── */}
        <CommandColumn command="fly" width="240px">
          <div className="text-center text-[9px] font-mono uppercase tracking-wider text-g2k-fg-muted -mt-1 mb-0.5">
            for each ready bead
          </div>
          <Box
            title="Implementer"
            subtitle="TDD, full tools"
            colorVar={colorVar}
            accent
          />
          <VArrow colorVar={colorVar} />
          <div className="grid grid-cols-3 gap-1">
            <Box title="Gate" subtitle="lint/test" colorVar={colorVar} tiny />
            <Box title="AC" subtitle="criteria" colorVar={colorVar} tiny />
            <Box title="Spec" subtitle="grep" colorVar={colorVar} tiny />
          </div>
          <VArrow colorVar={colorVar} />
          <ParallelGroup label="parallel review" colorVar={colorVar}>
            <div className="grid grid-cols-2 gap-1.5">
              <Box
                title="Complete"
                subtitle="coverage"
                colorVar={colorVar}
                accent
                tiny
              />
              <Box
                title="Correct"
                subtitle="quality"
                colorVar={colorVar}
                accent
                tiny
              />
            </div>
          </ParallelGroup>
          <VArrow colorVar={colorVar} />
          <Box
            title="Review Fixer"
            subtitle="accountability"
            colorVar={colorVar}
            accent
            tiny
          />
          <LoopBackArrow colorVar={colorVar} />
          <Box
            title="Committer"
            subtitle="jj snapshot"
            colorVar={colorVar}
            tiny
          />
          <div className="text-center text-[9px] font-mono uppercase tracking-wider text-g2k-fg-muted mt-2 mb-0.5">
            once per epic
          </div>
          <Box
            title="Aggregate Reviewer"
            subtitle="cross-bead audit"
            colorVar={colorVar}
            accent
            tiny
          />
        </CommandColumn>

        <HArrow colorVar={colorVar} />

        {/* ── land ── */}
        <CommandColumn command="land" width="140px">
          <Box
            title="Curator"
            subtitle="reorganize history"
            colorVar={colorVar}
            accent
          />
          <VArrow colorVar={colorVar} />
          <Box
            title="jj push + PR"
            colorVar={colorVar}
            tiny
          />
          <div className="flex-1" />
          <Box
            title="Runway"
            subtitle="consolidate"
            colorVar={colorVar}
            tiny
          />
        </CommandColumn>
      </div>

      {/* Human review off-ramp */}
      <div className="mt-5 pt-4 border-t border-dashed border-g2k-border">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-wider text-g2k-fg-muted">
            when fix attempts exhausted in <span className="font-bold">fly</span>
          </span>
          <HArrow colorVar={colorVar} label="escalate" width={40} />
          <div className="w-[180px]">
            <Box
              title="maverick review"
              subtitle="human approves / rejects / defers"
              colorVar={colorVar}
            />
          </div>
          <HArrow colorVar={colorVar} label="correction bead" width={48} />
          <span className="text-[10px] font-mono uppercase tracking-wider text-g2k-fg-muted">
            back to <span className="font-bold">fly</span>
          </span>
        </div>
      </div>
    </div>
  );
}
