import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MechID | Antimicrobial Susceptibility Interpretation Tool",
  description:
    "MechID is an interactive antimicrobial susceptibility interpretation tool for infectious diseases, focused on mechanism-based reasoning.",
};

export default function MechIDPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          MechID — Antimicrobial Susceptibility Interpretation Tool for Clinicians
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-7 text-[var(--foreground)]/85">
          MechID is an interactive tool that helps translate laboratory antimicrobial
          susceptibility results into clinical decisions. Whether you&apos;re interpreting MICs,
          evaluating resistance patterns, or optimizing antibiotic selection, MechID provides
          evidence-based guidance for frontline clinicians and stewardship teams.
        </p>
      </header>

      <section className="space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            How MechID Works
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/85">
            MechID combines microbiology inputs with mechanism-based reasoning to support
            susceptibility interpretation. Clinicians can review organism-specific patterns,
            MIC-related interpretation concepts, breakpoint-informed guidance, and how clinical
            context may affect antibiotic selection and confidence in a reported result.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Who Should Use MechID
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/85">
            MechID is designed for infectious diseases clinicians, hospitalists, intensivists,
            pharmacists, antimicrobial stewardship teams, microbiology learners, residents,
            fellows, and trainees who want a practical framework for interpreting susceptibility
            data at the bedside.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Why It&apos;s Valuable
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/85">
            MechID supports antimicrobial stewardship by improving consistency in interpretation,
            reducing reflexive antibiotic escalation, and helping teams connect laboratory data to
            mechanism-based clinical decision-making. It is built to support rapid decisions while
            reinforcing clinical reasoning.
          </p>
        </div>
      </section>

      <div className="group mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <a
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:opacity-90"
          href="https://mechid.streamlit.app/"
          target="_blank"
          rel="noreferrer"
        >
          Launch MechID
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>

      <SiteFooter />
    </main>
  );
}
