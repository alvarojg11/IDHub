import Link from "next/link";
import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Research | IDHub",
  description: "Research ideas and collaboration in medical education and clinical Infectious Diseases.",
};

const currentIdeas = [
  {
    title: "Case-based learning outcomes",
    desc: "Evaluate how interactive ID cases improve diagnostic reasoning, antimicrobial selection, and retention compared with static teaching materials.",
  },
  {
    title: "ProbID calibration and usability",
    desc: "Assess how clinicians and trainees use probabilistic diagnosis, calibrate risk, and make clinical decisions using harm-benefit ratios.",
  },
  {
    title: "MechID and resistance-mechanism decision support",
    desc: "Study whether MechID can support clinical decision-making and antimicrobial selection by organizing susceptibility interpretation around mechanisms of resistance.",
  },
];

export default function ResearchPage() {
  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">Research</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            Medical education ideas worth building
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            IDHub treats medical education as something to study, iterate, and improve. This space
            is for collaborations around clinical Infectious Diseases teaching, tool evaluation, and
            project design.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/" className="idhub-button-secondary px-5 py-3 text-sm font-semibold">
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="idhub-button-primary px-5 py-3 text-sm font-semibold"
            >
              Start a Collaboration
            </Link>
          </div>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Current posture
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Open to projects that improve clinical reasoning education, evaluate tool usability, or
            translate bedside questions into publishable educational research.
          </p>
        </aside>
      </header>

      <section className="mt-10">
        <div className="mb-6">
          <p className="idhub-kicker">Current Ideas</p>
          <h2 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">
            Active areas of interest
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {currentIdeas.map((idea) => (
            <article
              key={idea.title}
              className="rounded-[1.6rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]"
            >
              <h3 className="text-2xl font-semibold text-[var(--foreground)]">{idea.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{idea.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <article className="idhub-panel rounded-[1.8rem] p-6 sm:p-7">
          <p className="idhub-kicker">Project Support</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            Need help shaping a project?
          </h2>
          <p className="mt-4 text-sm leading-8 text-[var(--muted)] sm:text-base">
            IDHub can help think through research structure based on your idea, including question
            framing, educational outcomes, study design, and a path toward presentation or
            publication.
          </p>
        </article>

        <article className="idhub-panel-strong rounded-[1.8rem] p-6 sm:p-7">
          <p className="idhub-kicker">Share An Idea</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            Tell us what you want to study
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Share an educational question, research proposal, or early concept for collaboration.
          </p>
          <div className="mt-6">
            <ContactForm
              context="research"
              organizationLabel="Research Idea or Project (optional)"
              messageLabel="Research message"
              submitLabel="Send research idea"
              successRedirect="/research/thanks"
            />
          </div>
        </article>
      </section>

      <SiteFooter />
    </section>
  );
}
