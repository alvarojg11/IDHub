// app/probid/references/methods/page.tsx
import Link from "next/link";

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

export default function ProbIDMethodsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-baseline gap-2">
            <h1 className="text-4xl tracking-tight">
              <span className="font-extrabold text-[var(--foreground)]">ProbID</span>
              <span className="font-semibold text-[var(--foreground)]/80"> Methods</span>
            </h1>
          </div>

          <Link
            href="/probid/references"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)] transition"
          >
            ← Back
          </Link>
        </div>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--foreground)]/85">
          ProbID uses likelihood ratios (LRs) and Bayes’ theorem to update a pretest probability into a post-test probability.
          This page explains what an LR is, how it’s calculated from test performance, and shows a worked example.
        </p>
      </header>

      <section className="grid gap-6">
        <Callout title="1) What is a likelihood ratio?">
          <p>
            A likelihood ratio tells you how much a test result changes the odds of a diagnosis.
            It links the result you observe (positive or negative) to how likely that result would be in people{" "}
            <span className="text-[var(--foreground)]/85">with</span> the disease versus{" "}
            <span className="text-[var(--foreground)]/85">without</span> the disease.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border-[var(--border)] bg-[var(--card)] p-5">
              <div className="text-sm font-semibold text-[var(--foreground)]">LR+ (positive likelihood ratio)</div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                How much more likely a <span className="font-semibold">positive</span> result is in disease vs no disease.
              </p>
              <div className="mt-3">
                <Formula>LR+ = Sensitivity / (1 − Specificity)</Formula>
              </div>
            </div>

            <div className="rounded-2xl border-[var(--border)] bg-[var(--card)] p-5">
              <div className="text-sm font-semibold text-[var(--foreground)]">LR− (negative likelihood ratio)</div>
              <p className="mt-2 text-sm text-[var(--muted)]">
                How much less likely a <span className="font-semibold">negative</span> result is in disease vs no disease.
              </p>
              <div className="mt-3">
                <Formula>LR− = (1 − Sensitivity) / Specificity</Formula>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border-[var(--border)] bg-[var(--card)] p-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">How to interpret LRs (rule of thumb)</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-[var(--muted)] space-y-1">
              <li>LR+ &gt; 10: strong “rule-in” effect</li>
              <li>LR+ 5–10: moderate rule-in</li>
              <li>LR+ 2–5: small-to-moderate rule-in</li>
              <li>LR− 0.1–0.2: moderate-to-strong “rule-out” effect</li>
              <li>LR− &lt; 0.1: strong rule-out</li>
            </ul>
          </div>
        </Callout>

        <Callout title="2) Bayes’ theorem in odds form (what ProbID does)">
          <p>
            ProbID updates <span className="font-semibold text-[var(--foreground)]">odds</span>, not probabilities, because odds update by
            simple multiplication.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border-[var(--border)] bg-[var(--card)] p-5">
              <div className="text-sm font-semibold text-[var(--foreground)]">Convert probability → odds</div>
              <div className="mt-3">
                <Formula>Pretest odds = p / (1 − p)</Formula>
              </div>
            </div>

            <div className="rounded-2xl border-[var(--border)] bg-[var(--card)] p-5">
              <div className="text-sm font-semibold text-[var(--foreground)]">Update odds with LR</div>
              <div className="mt-3">
                <Formula>Post-test odds = Pretest odds × LR</Formula>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border-[var(--border)] bg-[var(--card)] p-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">Convert odds → probability</div>
            <div className="mt-3">
              <Formula>Post-test probability = odds / (1 + odds)</Formula>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border-[var(--border)] bg-[var(--card)] p-5">
            <div className="text-sm font-semibold text-[var(--foreground)]">Combining multiple findings</div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              When multiple independent findings are selected, ProbID multiplies their likelihood ratios to create a{" "}
              <span className="font-semibold text-[var(--foreground)]">combined LR</span>. This is convenient, but assumes conditional
              independence—correlated findings can overestimate certainty.
            </p>
            <div className="mt-3">
              <Formula>Combined LR = LR₁ × LR₂ × LR₃ × …</Formula>
            </div>
          </div>
        </Callout>

        <Callout title="3) Worked example (step-by-step)">
          <p>
            Suppose a test has <span className="font-semibold text-[var(--foreground)]">Sensitivity = 0.80</span> and{" "}
            <span className="font-semibold text-[var(--foreground)]">Specificity = 0.90</span>. And your patient’s{" "}
            <span className="font-semibold text-[var(--foreground)]">pretest probability</span> is{" "}
            <span className="font-semibold text-[var(--foreground)]">20%</span>.
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="text-sm font-semibold text-[var(--foreground)]">Step A — Calculate LR+ and LR−</div>

              <div className="mt-3 space-y-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">LR+</div>
                  <Formula>LR+ = 0.80 / (1 − 0.90) = 0.80 / 0.10 = 8.0</Formula>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">LR−</div>
                  <Formula>LR− = (1 − 0.80) / 0.90 = 0.20 / 0.90 = 0.22</Formula>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="text-sm font-semibold text-[var(--foreground)]">Step B — Update probability for positive test</div>

              <div className="mt-3 space-y-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Pretest odds</div>
                  <Formula>Pretest odds = 0.20 / 0.80 = 0.25</Formula>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Post-test odds</div>
                  <Formula>Post-test odds = 0.25 × 8.0 = 2.0</Formula>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Post-test probability</div>
                  <Formula>Post-test p = 2.0 / (1 + 2.0) = 0.667 (≈ 67%)</Formula>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="text-sm font-semibold text-[var(--foreground)]">What if the test is negative?</div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Same pretest probability (20%), but use LR− instead:
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Pretest odds</div>
                <Formula>0.20 / 0.80 = 0.25</Formula>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Post-test odds</div>
                <Formula>0.25 × 0.22 ≈ 0.055</Formula>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Post-test p</div>
                <Formula>0.055 / (1 + 0.055) ≈ 0.052 (≈ 5%)</Formula>
              </div>
            </div>
          </div>
        </Callout>
      </section>

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)]">
        <p>
            IDHub is an educational project focused on clinical teaching in Infectious Disease.

            Content is for learning purposes only and does not replace clinical judgment, institutional guidelines, or consultation with infectious diseases specialists.

            © 2026 IDHub
        </p>
      </footer>
    </main>
  );
}
