import type { ReactNode } from "react";

import CaseStructuredData from "@/components/CaseStructuredData";
import CaseNavAuto from "@/components/CaseNavAuto";

export default function CasesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CaseStructuredData />
      {children}
      <CaseNavAuto />
    </>
  );
}
