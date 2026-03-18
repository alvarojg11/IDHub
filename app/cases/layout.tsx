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
          <section className="idhub-case-content px-1 sm:px-2">
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
