import type { ReactNode } from "react";

import CaseStructuredData from "@/components/CaseStructuredData";
import CaseNavAuto from "@/components/CaseNavAuto";
import SiteFooter from "@/components/SiteFooter";

export default function CasesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CaseStructuredData />
      <main className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
        <article className="idhub-reading-shell overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,249,247,0.95))] shadow-[var(--shadow-medium)]">
          <div className="border-b border-[var(--border)] px-6 py-5 sm:px-8">
            <p className="idhub-kicker">Interactive Case</p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
              Stepwise infectious diseases reasoning with polls, reveals, and teaching commentary.
            </p>
          </div>
          <section className="idhub-case-content px-6 py-8 sm:px-8">
            {children}
          </section>
        </article>

        <CaseNavAuto />
        <SiteFooter />
      </main>
    </>
  );
}
