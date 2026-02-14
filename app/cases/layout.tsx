import type { ReactNode } from "react";
import CaseNavAuto from "@/components/CaseNavAuto";

export default function CasesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CaseNavAuto />
    </>
  );
}
