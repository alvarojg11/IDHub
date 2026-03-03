import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";

import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Recommended Projects | IDHub",
  description:
    "Discover recommended infectious diseases education projects, medical education resources, and ID teaching tools for clinicians, students, and trainees.",
  keywords: [
    "infectious diseases education",
    "medical education resources",
    "ID teaching tools",
    "infectious diseases teaching",
    "infectious diseases podcast",
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
    tagline: "A practical infectious diseases podcast",
    desc: "The Host Response is a clinically focused, practical podcast built for learners who want high-yield infectious diseases teaching in a clear and approachable format. Hosted by Dr. Paul Bunce, whose soothing voice makes it an especially inviting listen, it is also a thoughtful space for reflecting on what it means to work in infectious diseases.",
    whyItFits:
      "We share a similar perspective on medical education: learning should be practical, grounded in clinical reasoning, and honest about the fact that much of infectious diseases requires living with uncertainty.",
    podcastQuestion:
      "Rotating in ID? Start with FirstCallID.",
    podcastDesc:
      "Beyond the podcast, FirstCallID is a practical infectious diseases education resource that helps students, residents, and early trainees build a strong starting framework for common ID questions and bedside learning. It is a strong place to start if you want concise review and useful clinical pearls before or during an ID rotation.",
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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Recommended Projects
        </h1>
        <p className="mt-3 max-w-3xl text-[var(--foreground)]/85">
          This page highlights infectious diseases education projects, medical education resources,
          and practical ID teaching tools that support clinical reasoning, case-based learning, and
          thoughtful medical education for clinicians, students, and trainees.
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
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Projects we are following</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This page will keep growing as we find more educational work worth sharing across
          infectious diseases and medical education.
        </p>

        <div className="mt-5 grid gap-5">
          {projects.map((project) => (
            <article
              key={project.name}
              className="rounded-xl border border-[var(--border)] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  {"logoSrc" in project ? (
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                      <Image
                        src={project.logoSrc}
                        alt={project.logoAlt}
                        width={96}
                        height={96}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">{project.name}</h3>
                    <p className="mt-1 text-sm font-medium text-[var(--primary)]">{project.tagline}</p>
                  </div>
                </div>
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--card)]"
                >
                  Visit Project
                </Link>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--foreground)]/85">
                {project.desc}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {project.whyItFits}
              </p>

              {"podcastQuestion" in project ? (
                <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
                  <h4 className="text-base font-semibold text-[var(--foreground)]">
                    {project.podcastQuestion}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {project.podcastDesc}
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Know a project to add?</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          If there is an infectious diseases or medical education project that belongs here, feel
          free to reach out through the contact page. We want this to become a useful place to
          discover thoughtful educational work.
        </p>
        <div className="mt-5">
          <Link
            href="/contact"
            className="inline-flex rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
