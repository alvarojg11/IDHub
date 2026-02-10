import type { MDXComponents } from "mdx/types";
import Image from "next/image";

import CaseQuestion from "./components/caseQuestion";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    CaseQuestion,
    Image,
  };
}
