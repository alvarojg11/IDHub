// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const quickLinks = [
  {
    href: "/cases",
    title: "Cases",
    desc: "Problem-solving cases for learning ID syndromes, pathogens, and management decisions.",
  },
  {
    href: "/blog",
    title: "Blog",
    desc: "Reflections on diagnostics, antimicrobials, and clinical reasoning in infectious diseases.",
  },
  {
    href: "/mechid",
    title: "MechID",
    desc: "Susceptibility interpretation with plausible resistance mechanisms.",
  },
  {
    href: "/tools/immunoid",
    title: "ImmunoID",
    desc: "Immune mechanisms and infection risks, with an educational immunosuppression estimate.",
  },
  {
    href: "/probid",
    title: "ProbID",
    desc: "How findings, labs, and imaging shift pretest to post-test probability.",
  },
  {
    href: "/tools/doseid",
    title: "DoseID",
    desc: "A reference app for facilitating antimicrobial dosing for providers.",
  },
];

const collaborators = [
  {
    name: "Juan Daza-Ovalle, MD",
    role: "Research Collaborator",
    contribution: "Research Projects",
    imageSrc: "/images/juan-daza-ovalle.png",
    imageAlt: "Juan Daza-Ovalle, MD",
    bio: "Juan is the IDHub Research Associate. His interests lie at the intersection of infectious diseases and neurology, especially neurovascular and neurocritical complications of infection. He is especially motivated by the early recognition of underrecognized infectious conditions associated with stroke syndromes, such as meningovascular syphilis.",
    details:
      "He is currently engaged in clinical research in critical care and vascular neurology through CHOP/University of Pennsylvania and Montefiore/Albert Einstein.",
    goal:
      "Through IDHub, his goal is not only to contribute to ongoing learning in medical education, but also to help other early-career colleagues advance their research goals by collaborating with them and sharing his experience as a researcher.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          About IDHub
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--foreground)]/85 leading-relaxed">
          IDHub is a shared home for infectious diseases writing and educational
          tools, designed to support practical medical education in one place.
        </p>
      </header>

      {/* Mission and Vision */}
      <section>
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Our Purpose and Goal
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                Purpose
              </h3>
              <p className="mt-2 text-[var(--foreground)]/85 leading-relaxed">
                The mission of IDHub is to provide educational tools that are accessible to
                everyone, not only to encourage curiosity about the fascinating world of
                Infectious Diseases, but also to keep growing the way we teach and learn in
                medical education. Through multiple tools, we aim to expand understanding of
                the complexity of infectious diseases and provide different ways to think
                through challenging scenarios, including multidrug-resistant organisms,
                immunocompromised hosts, and diagnostic uncertainty.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                Goal
              </h3>
              <p className="mt-2 text-[var(--foreground)]/85 leading-relaxed">
                The ultimate goal of IDHub is to support a more deliberate and transparent
                approach to uncertainty. In this era, we should be able to ground decisions in
                informed risk-benefit reasoning. New technologies have put an extraordinary amount
                of information at our fingertips, and we should use that access to better navigate
                diagnostic uncertainty and make better clinical decisions. By collaborating and
                building on ideas from these tools, we hope to grow a community that can make
                better, more personalized decisions. We also aim to have an impact on how clinical
                education and clinical reasoning are taught and conceived.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* People Behind IDHub */}
      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              People Behind IDHub
            </h2>
            <p className="mt-2 max-w-3xl text-[var(--muted)] leading-relaxed">
              Collaborators helping build IDHub through research, case development, and medical education work.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
              <div className="w-full">
                <div className="relative min-h-[270px] overflow-hidden rounded-xl border border-[var(--border)] bg-white sm:h-full">
                  <Image
                    src="/images/alvaro.png"
                    alt="Alvaro Ayala, MD"
                    fill
                    priority
                    sizes="(min-width: 640px) 220px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                    Alvaro Ayala, MD
                  </h3>
                  <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
                    Founder
                  </span>
                </div>

                <p className="mt-4 text-[var(--foreground)]/85 leading-relaxed">
                  Hi I’m Alvaro, currently a second-year Infectious Diseases Fellow at Stanford University.
                </p>

                <p className="mt-4 text-[var(--foreground)]/85 leading-relaxed">
                  During fellowship, I encountered many situations where there was no clear pathway
                  forward: cases shaped by uncertainty, imperfect data, and competing possibilities.
                  Over time, I realized how often Infectious Diseases follows this pattern. The
                  specialty is less about memorizing answers and more about navigating ambiguity
                  thoughtfully.
                </p>

                <p className="mt-4 text-[var(--foreground)]/85 leading-relaxed">
                  As my interest in medical education grew, I wanted a place to explore these nuances
                  more openly: how we interpret tests, how we communicate probability, and how we make
                  decisions when the evidence is insufficient. That was the beginning of my writing in
                  Infectious Diseases and, eventually, the start of IDHub, a place where all of this
                  comes together.
                </p>
              </div>
            </div>
          </article>

          {collaborators.map((c) => (
            <article
              key={c.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
                <div className="w-full">
                  <div className="relative min-h-[270px] overflow-hidden rounded-xl border border-[var(--border)] bg-white sm:h-full">
                    <Image
                      src={c.imageSrc}
                      alt={c.imageAlt}
                      fill
                      sizes="(min-width: 640px) 220px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                      {c.name}
                    </h3>
                    <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
                      {c.role}
                    </span>
                    <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
                      {c.contribution}
                    </span>
                  </div>

                  <p className="mt-4 text-[var(--foreground)]/85 leading-relaxed">
                    {c.bio}
                  </p>

                  <p className="mt-4 text-[var(--foreground)]/85 leading-relaxed">
                    {c.details}
                  </p>

                  {"goal" in c ? (
                    <p className="mt-4 text-[var(--foreground)]/85 leading-relaxed">
                      {c.goal}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">
              Do you have a research idea in mind?{" "}
              <Link
                href="/contact"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Just contact us.
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Why the tools */}
      <section className="mt-14 space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Why the Tools?
        </h2>

        <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="space-y-5 text-[var(--foreground)]/85 leading-relaxed">
            <p>
              During the intensive hours of fellowship and answering very common questions, I noticed antibiotic decisions were sometimes guided by
              patterns rather than mechanisms—without a clear understanding for antimicrobial resistance. That inspired{" "}
              <span className="font-semibold text-[var(--foreground)]">MechID</span>, a way to connect
              susceptibility results with plausible resistance mechanisms, built to support learning
              and stewardship.
            </p>

            <p>
              I also realized how central the host is in Infectious Diseases. With the rapid expansion
              of chemotherapeutic, biologic, and immunomodulatory agents, it became difficult to track
              mechanisms and infection risks. That led to{" "}
              <span className="font-semibold text-[var(--foreground)]">ImmunoID</span>, an educational
              tool mapping immune modulation and offering a heuristic immunosuppression estimate.
            </p>

            <p>
              Finally, I’ve always been fascinated by how poorly humans intuit probabilities.
              Translating “gestalt” into pretest and post-test probability is hard—yet it often
              determines the next step. I built{" "}
              <span className="font-semibold text-[var(--foreground)]">ProbID</span> to make that
              process visible: how findings, labs, and imaging shift probability in common syndromes,
              as an educational exercise in diagnostic reasoning.
            </p>

            <p>
              My hope is that IDHub becomes an evolving set of learning tools and cases that helps
              trainees and clinicians feel more comfortable reasoning through uncertainty—and more
              connected to what makes infectious diseases so compelling.
            </p>
          </div>
        </div>
      </section>

      {/* Explore tiles */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Explore IDHub
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
            >
              <div className="flex h-full flex-col">
                <h4 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                  {t.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{t.desc}</p>
                <div className="mt-auto pt-5">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
                    Open
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
