import type { Metadata } from "next";

import { ProbIDTool } from "@/components/ProbIDTool";
import SiteFooter from "@/components/SiteFooter";
import { PROBID_MODULES } from "@/lib/lrSyndromes";

export const metadata: Metadata = {
  title: "ProbID | IDHub",
  description:
    "ProbID is an educational diagnostic reasoning tool that uses pretest probability and likelihood ratios to estimate post-test probability in infectious diseases syndromes.",
};

export default function ProbIDPage() {
  return (
    <section className="mx-auto max-w-7xl px-2 py-10 sm:px-4">
      <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="idhub-kicker">Tool Overview</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            ProbID turns pretest thinking into a visible workflow by combining setting, findings,
            and likelihood ratios into an educational post-test estimate.
          </p>
        </div>

        <div className="idhub-panel rounded-[1.8rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Use it for
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            CAP, VAP, endocarditis, invasive mold, and other syndromes where diagnostic uncertainty
            matters more than rote recall.
          </p>
        </div>
      </div>

      <ProbIDTool modules={PROBID_MODULES} defaultModuleId="cap" />

      <SiteFooter />
    </section>
  );
}
