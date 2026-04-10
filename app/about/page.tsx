import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";

const BASE_URL = "https://infectiousdiseasehub.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about IDHub and its mission to make Infectious Diseases clinical reasoning more accessible through interactive cases, tools, and teaching content.",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/about`,
    siteName: "InfectiousDiseaseHub",
    title: "About",
    description:
      "Learn about IDHub and its mission to make Infectious Diseases clinical reasoning more accessible.",
  },
  twitter: {
    card: "summary",
    title: "About",
    description:
      "Learn about IDHub and its mission to make Infectious Diseases clinical reasoning more accessible.",
  },
};

const quickLinks = [
  {
    href: "/cases",
    title: "Cases",
    desc: "Problem-solving cases for learning ID syndromes, pathogens, and management decisions.",
  },
  {
    href: "/blog",
    title: "Blog",
    desc: "Reflections on diagnostics, antimicrobials, and clinical reasoning in Infectious Diseases.",
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
    bio: "Juan is the IDHub Research Associate. He is currently engaged in clinical research in critical care and vascular neurology through CHOP/University of Pennsylvania and Montefiore/Albert Einstein.",
    details:
      "Through IDHub, his goal is not only to contribute to ongoing learning in medical education, but also to help other early-career colleagues advance their research goals by collaborating with them and sharing his experience as a researcher.",
  },
  {
    name: "Javier Pérez",
    role: "Research Collaborator",
    contribution: "Case Development",
    imageSrc: "/images/JavierPerez.png",
    imageAlt: "Javier Pérez",
    bio: "Javier is a medical intern at Universidad de los Andes with a deep interest in clinical reasoning and medical decision-making. He has extensive experience as a teaching assistant and has been recognized for his ability to mentor peers and translate difficult concepts into language that learners can actually use.",
    details:
      "His research interests center on clinical reasoning, the development of point-of-care ultrasound in underserved settings, and the formal study of disease probability and treatment thresholds, areas where clearer thinking directly changes what happens to patients. Through IDHub, he has found a space to pursue those interests in practice building cases and educational tools that bring clinical reasoning, probability, and diagnostic thinking to life. Outside of medicine, he represents Colombia as a vallenato singer-songwriter and guitarist, a reminder that the skills of storytelling and clarity matter as much at the bedside as anywhere else.",
  },
  {
    name: "Christian Echevarría Dupuy, MD",
    role: "Research Collaborator",
    contribution: "Clinical Cases",
    imageSrc: "/images/christian.png",
    imageAlt: "Christian Echevarría Dupuy, MD",
    bio: "Christian is an Infectious Diseases resident in Lima, Peru, with a focused interest in diagnostically and therapeutically challenging infections, antimicrobial resistance, and the practical demands of clinical decision-making. He brings a perspective shaped by practicing Infectious Diseases in Peru, a setting where the breadth of pathogens, resource constraints, and epidemiological context add layers of complexity that enrich how the field is understood.",
    details:
      "He believes case-based learning is one of the most effective ways to make Infectious Diseases approachable and relevant — not just for specialists, but for trainees and clinicians at every stage. Through IDHub, he contributes cases that reflect the diagnostic and therapeutic complexity he encounters in practice, and is actively interested in developing research within the platform around his clinical interests, with an emphasis on reasoning that holds up across different settings and systems.",
  },
  {
    name: "Jorge Luis Salinas, MD",
    role: "Project Advisor",
    contribution: "Mentorship",
    imageSrc: "/images/jorge-salinas.png",
    imageAlt: "Jorge Luis Salinas, MD",
    bio: "Jorge is an Infectious Diseases physician at Stanford who brings a thoughtful, systems-based perspective to the way clinical care, infection prevention, and medical education intersect.",
    details:
      "As Project Advisor, he helps shape the broader direction of IDHub and offers steady guidance on how the project can grow in a way that stays practical, rigorous, and useful for learners.",
  },
  {
    name: "Hector Fabio Bonilla, MD",
    role: "Case Development Advisor",
    contribution: "Clinical Cases",
    imageSrc: "/images/hector-bonilla.png",
    imageAlt: "Hector Fabio Bonilla, MD",
    bio: "Hector is an Infectious Diseases physician at Stanford with deep experience in patient care, teaching, and clinical reasoning across a wide range of Infectious Diseases presentations.",
    details:
      "As Case Development Advisor, he brings clinical perspective to the development of IDHub cases and helps refine them so they feel grounded, relevant, and educationally meaningful.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <header className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-start">
        <div className="idhub-panel-strong rounded-[1.75rem] px-6 py-8 sm:px-8">
          <p className="idhub-kicker">About IDHub</p>
          <h1 className="mt-3 text-5xl font-semibold text-[var(--foreground)] sm:text-6xl">
            A shared home for Infectious Diseases learning
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            IDHub brings together writing, cases, and educational tools to support practical
            medical education and clearer clinical reasoning in Infectious Diseases.
          </p>
        </div>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Guiding idea
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Infectious Diseases is rarely about perfect certainty. The platform is designed to help
            learners and clinicians reason more deliberately when the evidence is incomplete.
          </p>
        </aside>
      </header>

      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <article className="idhub-panel rounded-[1.75rem] p-6 sm:p-7">
          <p className="idhub-kicker">Purpose</p>
          <p className="mt-4 text-sm leading-8 text-[var(--muted)] sm:text-base">
            The mission of IDHub is to provide educational tools that are accessible to everyone,
            not only to encourage curiosity about the world of Infectious Diseases, but also to help
            evolve how we teach and learn in medical education. Through multiple tools, the goal is
            to expand understanding of complexity and make difficult scenarios more teachable,
            including multidrug-resistant organisms, immunocompromised hosts, and diagnostic
            uncertainty.
          </p>
        </article>

        <article className="idhub-panel rounded-[1.75rem] p-6 sm:p-7">
          <p className="idhub-kicker">Goal</p>
          <p className="mt-4 text-sm leading-8 text-[var(--muted)] sm:text-base">
            The broader aim is to support a more transparent approach to uncertainty. Clinical
            decisions are often grounded in risk-benefit reasoning rather than absolute answers.
            IDHub tries to make that reasoning visible, usable, and shareable through tools,
            projects, and collaborative medical education work.
          </p>
        </article>
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="idhub-kicker">People</p>
          <h2 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">
            People behind the platform
          </h2>
        </div>

        <div className="grid gap-6">
          <article className="idhub-panel-strong rounded-[1.75rem] p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[240px_minmax(0,1fr)]">
              <div className="relative min-h-[300px] overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white">
                <Image
                  src="/images/alvaro.png"
                  alt="Alvaro Ayala, MD"
                  fill
                  priority
                  sizes="(min-width: 640px) 240px, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-3xl font-semibold text-[var(--foreground)]">
                    Alvaro Ayala, MD
                  </h3>
                  <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Founder
                  </span>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--muted)] sm:text-base">
                  <p>
                    Alvaro is an Infectious Diseases Fellow at Stanford University. During training,
                    he repeatedly encountered cases where there was no clean pathway forward: only
                    uncertainty, imperfect data, and competing possibilities.
                  </p>
                  <p>
                    Over time, that became a central insight. Infectious Diseases is less about
                    memorizing answers and more about navigating ambiguity thoughtfully. As his
                    interest in medical education grew, he wanted a place to explore those nuances
                    more openly, from test interpretation to probability framing to real-world
                    decision making.
                  </p>
                  <p>
                    That became the foundation of IDHub: a place where writing, tools, and teaching
                    cases live together rather than in separate silos.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {collaborators.map((c) => (
            <article key={c.name} className="idhub-panel rounded-[1.75rem] p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
                <div className="relative min-h-[280px] overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white">
                  <Image
                    src={c.imageSrc}
                    alt={c.imageAlt}
                    fill
                    sizes="(min-width: 640px) 220px, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-semibold text-[var(--foreground)]">{c.name}</h3>
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {c.role}
                    </span>
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      {c.contribution}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">{c.bio}</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
                    {c.details}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <article className="idhub-panel rounded-[1.75rem] p-6 sm:p-7">
          <p className="idhub-kicker">Why The Tools Exist</p>
          <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted)] sm:text-base">
            <p>
              During fellowship, common antibiotic decisions were sometimes guided more by patterns
              than by mechanisms. That inspired <span className="font-semibold text-[var(--foreground)]">MechID</span>, a way to
              connect susceptibility results with plausible resistance mechanisms in a form built
              for learning and stewardship.
            </p>
            <p>
              Host factors also became increasingly central. The rapid expansion of chemotherapeutic,
              biologic, and immunomodulatory agents made it difficult to keep mechanisms and
              infection risks organized. That led to <span className="font-semibold text-[var(--foreground)]">ImmunoID</span>, an
              educational tool mapping immune modulation and offering a heuristic
              immunosuppression estimate.
            </p>
            <p>
              Translating clinical gestalt into pretest and post-test probability is also hard, yet
              it often determines the next step. <span className="font-semibold text-[var(--foreground)]">ProbID</span> was built to
              make that process more visible, showing how findings, labs, and imaging can shift
              probability as an educational exercise in diagnostic reasoning.
            </p>
            <p>
              The goal is an evolving set of cases and tools that helps learners and clinicians feel
              more comfortable reasoning through uncertainty while staying connected to what makes
              Infectious Diseases so compelling.
            </p>
          </div>
        </article>

        <aside className="idhub-panel rounded-[1.75rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Research idea in mind?
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            IDHub is also meant to be collaborative. If you have an educational idea, case concept,
            or research project, there is room to build it together.
          </p>
          <Link
            href="/contact"
            className="idhub-button-secondary mt-5 inline-flex px-4 py-2.5 text-sm font-semibold"
          >
            Contact IDHub
          </Link>
        </aside>
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="idhub-kicker">Explore</p>
          <h2 className="mt-2 text-4xl font-semibold text-[var(--foreground)]">
            Explore the platform
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-[1.75rem] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-1 hover:border-[var(--border-strong)]"
            >
              <h3 className="text-3xl font-semibold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                {t.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{t.desc}</p>
              <span className="mt-8 inline-flex text-sm font-semibold text-[var(--primary)]">
                Open section
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </section>
  );
}
