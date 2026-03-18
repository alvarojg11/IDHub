import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Recommended Projects | IDHub",
  description:
    "Discover recommended Infectious Diseases education projects, medical education resources, and ID teaching tools for clinicians, students, and trainees.",
  keywords: [
    "Infectious Diseases education",
    "medical education resources",
    "ID teaching tools",
    "Infectious Diseases teaching",
    "Infectious Diseases podcast",
    "rotating on ID service",
    "ID rotation",
    "clinical reasoning",
    "medical education projects",
  ],
};

const projects = [
  {
    name: "The Host Response",
    href: "https://www.firstcallid.ca/",
    logoSrc: "/recommended-projects/firstcallid-logo.png",
    logoAlt: "FirstCallID logo",
    tagline: "A practical Infectious Diseases podcast",
    desc: "The Host Response is a clinically focused, practical podcast built for learners who want high-yield Infectious Diseases teaching in a clear and approachable format. Hosted by Dr. Paul Bunce, whose soothing voice makes it an especially inviting listen, it is also a thoughtful space for reflecting on what it means to work in Infectious Diseases.",
    whyItFits:
      "We share a similar perspective on medical education: learning should be practical, grounded in clinical reasoning, and honest about the fact that much of Infectious Diseases requires living with uncertainty.",
    podcastQuestion: "Rotating in ID? Start with FirstCallID.",
    podcastDesc:
      "Beyond the podcast, FirstCallID is a practical Infectious Diseases education resource that helps students, residents, and early trainees build a strong starting framework for common ID questions and bedside learning. It is a strong place to start if you want concise review and useful clinical pearls before or during an ID rotation.",
  },
  {
    name: "SIGIT",
    href: "https://sigit.uniandes.edu.co/",
    logoSrc: "/recommended-projects/sigit-logo.png",
    logoAlt: "SIGIT logo",
    tagline: "Public Health and Tropical Medicine Research from Universidad de los Andes, Colombia",
    desc: "SIGIT is an interdisciplinary research group at Universidad de los Andes focused on health systems, childhood, gender, interculturality, and tropical health. Their work connects applied research, education, and community action, with a strong emphasis on equity and improving health outcomes in vulnerable communities across Colombia.",
    whyItFits:
      "Its work is notable for its interdisciplinary academic approach, linking population health research, implementation, and medical education to the study of tropical diseases and health inequities.",
  },
];

export default function RecommendedProjectsPage() {
  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[2rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">Recommended Projects</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            Projects we think are worth following
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            This page highlights Infectious Diseases education projects, medical education
            resources, and practical teaching work that complements IDHub&apos;s focus on clinical
            reasoning, case-based learning, and thoughtful pedagogy.
          </p>

          <div className="mt-7">
            <Link href="/" className="idhub-button-secondary px-5 py-3 text-sm font-semibold">
              Back to Home
            </Link>
          </div>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Why this page exists
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            IDHub should not feel isolated. This is a growing place to point people toward other
            projects doing thoughtful work in Infectious Diseases and medical education.
          </p>
        </aside>
      </header>

      <section className="mt-10">
        <div className="mb-6">
          <p className="idhub-kicker">Directory</p>
          <h2 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">
            Projects we are following
          </h2>
        </div>

        <div className="grid gap-5">
          {projects.map((project) => (
            <article
              key={project.name}
              className="rounded-[1.8rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[var(--background-soft)] p-3">
                    <Image
                      src={project.logoSrc}
                      alt={project.logoAlt}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-3xl font-semibold text-[var(--foreground)]">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                      {project.tagline}
                    </p>
                  </div>
                </div>

                <Link
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="idhub-button-secondary inline-flex px-4 py-2.5 text-sm font-semibold"
                >
                  Visit Project
                </Link>
              </div>

              <p className="mt-5 text-sm leading-8 text-[var(--muted)] sm:text-base">
                {project.desc}
              </p>
              <p className="mt-4 text-sm leading-8 text-[var(--muted)] sm:text-base">
                {project.whyItFits}
              </p>

              {"podcastQuestion" in project ? (
                <div className="mt-5 rounded-[1.35rem] border border-[var(--border)] bg-[var(--background-soft)] p-5">
                  <h4 className="text-xl font-semibold text-[var(--foreground)]">
                    {project.podcastQuestion}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                    {project.podcastDesc}
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="idhub-panel rounded-[1.8rem] p-6 sm:p-7">
          <p className="idhub-kicker">Suggestions</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
            Know a project to add?
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            If there is an Infectious Diseases or medical education project that belongs here, reach
            out through the contact page. The goal is for this to become a useful place to discover
            thoughtful educational work.
          </p>
          <Link
            href="/contact"
            className="idhub-button-primary mt-6 inline-flex px-5 py-3 text-sm font-semibold"
          >
            Contact IDHub
          </Link>
        </div>
      </section>

      <SiteFooter />
    </section>
  );
}
