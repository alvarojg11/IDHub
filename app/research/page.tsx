import Link from "next/link";
import type { Metadata } from "next";

import ContactForm from "@/components/ContactForm";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Research | IDHub",
  description: "Research ideas and collaboration in medical education and clinical infectious diseases.",
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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Research</h1>
        <p className="mt-3 max-w-3xl text-[var(--foreground)]/85">
          We are believers that medical education requires constant learning through a scientific
          method. We would be thrilled to hear any ideas that you might have so we can contribute
          toward a project in medical education.
        </p>
        <div className="mt-5">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            Back to Main Page
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Current research ideas</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          These are active areas of interest for IDHub. If you have a related idea, project, or
          proposal, please reach out.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {currentIdeas.map((idea) => (
            <article
              key={idea.title}
              className="rounded-xl border border-[var(--border)] bg-white p-4"
            >
              <h3 className="text-sm font-semibold text-[var(--foreground)]">{idea.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{idea.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Need help structuring a project?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          We would be happy to help think through research structure based on your idea, including
          framing the question, defining educational outcomes, and planning a path toward
          presentation or publication.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Share a research idea or project</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Tell us about your idea, educational project, or a study you would like to explore.
        </p>
        <div className="mt-5">
          <ContactForm
            context="research"
            organizationLabel="Research Idea or Project (optional)"
            messageLabel="Research message"
            submitLabel="Send research idea"
            successRedirect="/research/thanks"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
