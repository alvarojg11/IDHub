import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 font-mono text-sm text-[var(--foreground)]/90">
      {children}
    </div>
  );
}

function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{children}</div>
    </div>
  );
}

export default function ImmunoIDMethodsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-baseline gap-2">
            <h1 className="text-4xl tracking-tight">
              <span className="font-extrabold text-[var(--foreground)]">ImmunoID</span>
              <span className="font-semibold text-[var(--foreground)]/80"> Methods</span>
            </h1>
          </div>

          <Link
            href="/tools/immunoid/references"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)] transition"
          >
            ← Back
          </Link>
        </div>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--foreground)]/85">
          ImmunoID provides an educational estimate of immunosuppression intensity
          based on selected agents. The score is a heuristic and does not replace
          clinical risk assessment.
        </p>
      </header>

      <section className="grid gap-6">
        <Callout title="1) Agent-Level Base Score">
          <p>
            Each medication in <code className="px-1">lib/immunoData.ts</code> has
            a curated <code className="px-1">baseScore</code> (higher = stronger
            expected immunosuppressive effect in typical use).
          </p>

          <div className="mt-3">
            <Formula>Base sum = Σ(baseScore for all selected agents)</Formula>
          </div>
        </Callout>

        <Callout title="2) Combination Penalty">
          <p>
            To reflect additive risk when multiple immunosuppressive drugs are
            combined, ImmunoID adds a fixed penalty per extra agent.
          </p>

          <div className="mt-3 space-y-3">
            <Formula>if n &lt; 2: comboPenalty = 0</Formula>
            <Formula>if n &gt;= 2: comboPenalty = (n − 1) × 1.5</Formula>
          </div>
        </Callout>

        <Callout title="3) Final Score">
          <p>
            The displayed score is the base sum plus combination penalty, rounded
            to one decimal place.
          </p>

          <div className="mt-3">
            <Formula>
              totalScore = round((Base sum + comboPenalty) × 10) / 10
            </Formula>
          </div>
        </Callout>

        <Callout title="4) Level Mapping">
          <p>
            The score is converted to one of four qualitative levels:
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Formula>score ≤ 3 → Low</Formula>
            <Formula>3 &lt; score ≤ 6 → Moderate</Formula>
            <Formula>6 &lt; score ≤ 9 → High</Formula>
            <Formula>score &gt; 9 → Very High</Formula>
          </div>
        </Callout>

        <Callout title="5) Infection Risk Tag Aggregation">
          <p>
            Each agent carries curated infection risk tags (for example: PJP, TB
            reactivation, CMV, invasive mold). For each selected tag, ImmunoID:
          </p>

          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Takes the maximum strength across selected agents</li>
            <li>Deduplicates reasons (mechanistic notes)</li>
            <li>Lists all linked medications that contributed to that tag</li>
            <li>Sorts tags by strength (highest first)</li>
          </ul>

          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-sm font-semibold text-[var(--foreground)]">Strength labels in UI</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li><span className="font-semibold text-[var(--foreground)]">3</span> → High-yield</li>
              <li><span className="font-semibold text-[var(--foreground)]">2</span> → Common</li>
              <li><span className="font-semibold text-[var(--foreground)]">1</span> → Possible</li>
            </ul>
          </div>
        </Callout>

        <Callout title="6) Important Limits">
          <ul className="list-disc space-y-1 pl-5">
            <li>The score is not a validated prediction model for any single infection outcome.</li>
            <li>It does not yet account for dose, duration, timing from last dose, labs, or prophylaxis in a formal equation.</li>
            <li>Risk estimates should always be interpreted with host factors, epidemiology, and local protocols.</li>
          </ul>
        </Callout>
      </section>

      <SiteFooter />
    </main>
  );
}
