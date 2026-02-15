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
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          About IDHub
        </h1>
        <p className="mt-4 max-w-3xl text-[var(--foreground)]/85 leading-relaxed">
          IDHub is an educational space built around clinical reasoning,
          uncertainty, and the kind of problem-solving that happens at the bedside.
        </p>
      </header>

      {/* About Me */}
      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[220px_minmax(0,1fr)]">
          <div className="w-full">
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
              <Image
                src="/images/alvaro.png"
                alt="Alvaro Ayala, MD"
                width={220}
                height={270}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <p className="text-[var(--foreground)]/85 leading-relaxed">
                I’m{" "}
                <span className="font-semibold text-[var(--foreground)]">Alvaro</span>,
                currently a second-year Infectious Diseases Fellow. During fellowship, I encountered
                many situations where there was no clear pathway forward—cases shaped by uncertainty,
                imperfect data, and competing possibilities. Over time, I realized how often
                Infectious Diseases follows this pattern. The specialty is less about memorizing
                answers and more about navigating ambiguity thoughtfully.
              </p>

              <p className="mt-5 text-[var(--foreground)]/85 leading-relaxed">
                As my interest in medical education grew, I wanted a place to explore those nuances
                more openly: how we interpret tests, how we communicate probability, and how we make
                decisions when the evidence is incomplete. That was the beginning of my writing in
                Infectious Diseases and eventually the start of IDHub.
              </p>
            </div>
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
