import Link from "next/link";

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 font-mono text-sm text-[var(--foreground)]/90">
      {children}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{children}</div>
    </section>
  );
}

export default function DoseIDMethodsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl tracking-tight">
            <span className="font-extrabold text-[var(--foreground)]">DoseID</span>
            <span className="font-semibold text-[var(--foreground)]/80"> Methods</span>
          </h1>

          <Link
            href="/tools/doseid/references"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)] transition"
          >
            ← Back
          </Link>
        </div>

        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--foreground)]/85">
          DoseID converts patient inputs into normalized metrics, applies indication-specific logic, and returns reference-dose suggestions with transparent intermediate values.
        </p>
      </header>

      <section className="grid gap-6">
        <Card title="1) Unit Normalization and Body-Size Metrics">
          <p>
            Weight and height entries are normalized before calculations. The app computes total body weight (TBW), ideal body weight (IBW), adjusted body weight (AdjBW), lean body weight (LBW), and BMI.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Formula>IBW (male) = 50 + 2.3 × (inches over 60)</Formula>
            <Formula>IBW (female) = 45 + 2.3 × (inches over 60)</Formula>
            <Formula>AdjBW = IBW + 0.4 × (TBW − IBW)</Formula>
            <Formula>BMI = weight(kg) / height(m)^2</Formula>
          </div>
        </Card>

        <Card title="2) Renal Function Estimation">
          <p>
            DoseID estimates creatinine clearance with Cockcroft-Gault and displays the weight used by the equation.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Formula>CrCl = ((140 − age) × weight) / (72 × SCr)</Formula>
            <Formula>Female correction: CrCl × 0.85</Formula>
          </div>
          <p className="mt-4">
            In the creatinine pathway, renal bins based on CrCl are used for interval and dose adjustments. In iHD or CRRT pathways, dialysis templates override CrCl branching.
          </p>
        </Card>

        <Card title="3) Dose Rule Engine">
          <p>
            Each medication contains structured rules: indication options, weight-basis selection, renal pathway branching, and clinical notes. Regimens are generated from these rules at runtime.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Indication-specific branches (for example, CNS vs non-CNS pathways)</li>
            <li>Renal pathway modes: standard, intermittent HD, CRRT</li>
            <li>Weight-basis handling: TBW, IBW, AdjBW, or LBW depending on agent</li>
            <li>Dose rounding for selected weight-based regimens</li>
          </ul>
        </Card>

        <Card title="4) Scope and Safety">
          <p>
            DoseID is an educational reference tool and not an autonomous prescribing system. Local formulary restrictions, infusion standards, dialysis schedules, therapeutic drug monitoring, and specialist review remain required for final orders.
          </p>
        </Card>
      </section>
    </main>
  );
}
