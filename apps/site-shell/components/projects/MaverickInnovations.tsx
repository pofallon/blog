/**
 * "What Makes Maverick Different" feature card grid for the Maverick project page.
 *
 * Four marketing cards highlighting Maverick's distinctive innovations.
 * Visual format mirrors MaverickFlowDiagram and ClimaxFlowDiagram: same outer
 * wrapper, color-var theming, accent borders, mono typography for headlines.
 */

interface MaverickInnovationsProps {
  colorVar: string;
}

interface InnovationCard {
  number: string;
  title: string;
  versus: string;
  body: string;
}

const CARDS: InnovationCard[] = [
  {
    number: '01',
    title: 'Human On The Side, Not In The Loop',
    versus: "Most 'human in the loop' tools turn you into the bottleneck.",
    body: "When agents exhaust their fix attempts, they create an assumption bead tagged for human review and keep flying. You answer when you're ready — from a phone, a laptop, on the train. And because Maverick uses Jujutsu (not git) for writes, your correction can land fifteen beads later and still flow backward into the original commit and forward through every commit built on top of it. Answer late. The implications fix themselves.",
  },
  {
    number: '02',
    title: 'Maximize Your Subscriptions',
    versus: "Lock-in to one provider is a tax on subscriptions you're already paying.",
    body: "Per-actor provider routing lets you assign Claude Opus to the implementer, Copilot's code model to the fixer, and Gemini to the reviewer — all in the same fly run. Connections are cached per provider and reused across steps. Use the right model for each role; don't pay for a Ferrari to fix a typo.",
  },
  {
    number: '03',
    title: 'A Project That Learns',
    versus: 'Most agent tools start every session amnesiac.',
    body: "The Runway knowledge store records bead outcomes, review findings, and fix attempts as JSONL alongside your code. After landing, consolidation distills episodic records into semantic summaries committed back to the repo. The next fly run reads them automatically — so the same mistake doesn't get made twice. Your project gets smarter the more it runs.",
  },
  {
    number: '04',
    title: 'No Silent Skipping',
    versus: '"I addressed all the issues" is not a verifiable claim — until now.',
    body: 'Every review finding flows through an Issue Registry that tracks it to a final state: fixed, blocked (with technical justification), or deferred (with explanation). A fixer that quietly skipped two findings gets bounced back. Unresolved items become GitHub tech-debt issues automatically. This single rule eliminates the entire class of "the agent claimed it was done but it wasn\'t" failures.',
  },
];

function Card({
  card,
  colorVar,
}: {
  card: InnovationCard;
  colorVar: string;
}) {
  return (
    <div
      className="relative rounded-xl p-5 sm:p-6 flex flex-col gap-3 h-full"
      style={{
        backgroundColor: 'hsl(var(--g2k-bg-raised))',
        border: `1.5px solid hsl(var(--${colorVar}) / 0.35)`,
        boxShadow: 'var(--g2k-shadow-sm)',
      }}
    >
      {/* Accent corner number */}
      <div
        className="absolute top-3 right-4 text-xs font-mono font-bold tracking-widest"
        style={{ color: `hsl(var(--${colorVar}) / 0.4)` }}
      >
        {card.number}
      </div>

      {/* Headline */}
      <h3
        className="text-base sm:text-lg font-bold font-mono leading-tight pr-8"
        style={{ color: `hsl(var(--${colorVar}))` }}
      >
        {card.title}
      </h3>

      {/* Versus tagline */}
      <div
        className="text-xs italic leading-snug border-l-2 pl-3 py-0.5"
        style={{
          color: 'hsl(var(--g2k-fg-muted))',
          borderColor: `hsl(var(--${colorVar}) / 0.4)`,
        }}
      >
        {card.versus}
      </div>

      {/* Body */}
      <p className="text-sm leading-relaxed text-g2k-fg">{card.body}</p>
    </div>
  );
}

export default function MaverickInnovations({
  colorVar,
}: MaverickInnovationsProps) {
  return (
    <div
      className="my-8 rounded-xl p-5 sm:p-7"
      style={{
        backgroundColor: 'hsl(var(--g2k-bg-sunken))',
        border: '1.5px solid hsl(var(--g2k-border))',
        boxShadow: 'var(--g2k-shadow-inset-deep)',
      }}
    >
      {/* Section eyebrow */}
      <div className="text-center mb-6">
        <div
          className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-1"
          style={{ color: `hsl(var(--${colorVar}) / 0.7)` }}
        >
          What Makes Maverick Different
        </div>
        <div className="text-sm text-g2k-fg-muted font-mono">
          four innovations that aren&rsquo;t available anywhere else
        </div>
      </div>

      {/* 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {CARDS.map((card) => (
          <Card key={card.number} card={card} colorVar={colorVar} />
        ))}
      </div>
    </div>
  );
}
