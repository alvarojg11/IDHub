// app/probid/page.tsx
import React from "react";
import Link from "next/link";
import { ProbIDTool } from "@/components/ProbIDTool";
import { PROBID_MODULES } from "@/lib/lrSyndromes";

export default function Page() {
  return (
    <div>
      <ProbIDTool modules={PROBID_MODULES} defaultModuleId="cap" />
    </div>
  );
}
