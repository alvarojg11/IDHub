import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "MechID | Antimicrobial Susceptibility Interpretation Tool",
  description:
    "MechID is an interactive antimicrobial susceptibility interpretation tool for infectious diseases, focused on mechanism-based reasoning.",
};

const valuePoints = [
  {
    title: "Mechanism-first interpretation",
    desc: "Use microbiology patterns and resistance logic rather than relying only on memorized organism-antibiotic pairings.",
  },
  {
    title: "Clinically oriented stewardship",
    desc: "Translate susceptibility data into more practical bedside decisions and avoid reflexive escalation when a narrower explanation makes sense.",
  },
  {
    title: "Built for teaching",
    desc: "Useful for fellows, pharmacists, stewardship teams, and learners who want a more transparent framework for interpretation.",
  },
];

export default function MechIDPage() {
  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">Tool Overview</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            MechID
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            A mechanism-based susceptibility interpretation tool for clinicians, pharmacists, and
            trainees who want antimicrobial decision making to feel more grounded in microbiology.
          </p>

          <a
            className="idhub-button-primary mt-7 inline-flex items-center px-5 py-3 text-sm font-semibold"
            href="https://mechid.streamlit.app/"
            target="_blank"
            rel="noreferrer"
          >
            Launch MechID
          </a>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Best for
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Infectious diseases clinicians, stewardship teams, microbiology learners, hospitalists,
            pharmacists, residents, fellows, and anyone trying to connect lab data with mechanism.
          </p>
        </aside>
      </header>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {valuePoints.map((point) => (
          <article
            key={point.title}
            className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]"
          >
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">{point.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{point.desc}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <div className="idhub-panel rounded-[1.8rem] p-6 sm:p-7">
          <p className="idhub-kicker">How It Works</p>
          <p className="mt-4 text-sm leading-8 text-[var(--muted)] sm:text-base">
            MechID combines organism-specific susceptibility patterns, breakpoint-informed
            interpretation, and resistance mechanism logic. The goal is not only to point toward an
            answer, but to help users understand why a certain susceptibility profile should or
            should not change confidence in an antibiotic choice.
          </p>
        </div>
      </section>

      <SiteFooter />
    </section>
  );
}
