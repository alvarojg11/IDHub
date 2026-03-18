import type { ReactNode } from "react";

import CaseStructuredData from "@/components/CaseStructuredData";
import CaseNavAuto from "@/components/CaseNavAuto";
import SiteFooter from "@/components/SiteFooter";

export default function CasesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CaseStructuredData />
      <main className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
        <article className="mx-auto max-w-4xl">
          <section className="idhub-case-content rounded-[1.9rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,251,249,0.94))] p-5 shadow-[var(--shadow-soft)] sm:p-8">
            {children}
          </section>
        </article>

        <div className="mx-auto max-w-4xl">
          <CaseNavAuto />
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
