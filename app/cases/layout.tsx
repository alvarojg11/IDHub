"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import CaseStructuredData from "@/components/CaseStructuredData";
import CaseNavAuto from "@/components/CaseNavAuto";
import SiteFooter from "@/components/SiteFooter";
import styles from "./case-content.module.css";

export default function CasesLayout({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();

  if (segment === null) {
    return <>{children}</>;
  }

  return (
    <>
      <CaseStructuredData />
      <main className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
        <article className="mx-auto max-w-4xl">
          <section className={`${styles.caseContent} px-1 sm:px-2`}>
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
