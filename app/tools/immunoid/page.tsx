import type { Metadata } from "next";

import ImmunoTool from "@/components/ImmunoTool";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "ImmunoID | IDHub",
  description:
    "ImmunoID helps learners review immunosuppressive agents, mechanisms of action, and high-yield infection risks in one place.",
};

export default function ImmunoIDPage() {
  return (
    <section className="mx-auto max-w-7xl px-2 py-10 sm:px-4">
      <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="idhub-kicker">Tool Overview</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            ImmunoID organizes immunosuppressive drugs around mechanisms and infection risk so the
            host side of Infectious Diseases care becomes easier to reason through.
          </p>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Best for
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Learners and clinicians who want a fast overview of immune-modifying therapies and the
            opportunistic patterns they should keep in mind.
          </p>
        </div>
      </div>

      <ImmunoTool />

      <SiteFooter />
    </section>
  );
}
