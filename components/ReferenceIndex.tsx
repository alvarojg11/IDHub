import CaseDirectory from "@/components/CaseDirectory";

import type { CaseDirectoryEntry } from "@/lib/cases/directory";

type Props = {
  cases: CaseDirectoryEntry[];
  syndromes: string[];
};

export default function ReferenceIndex({ cases, syndromes }: Props) {
  return <CaseDirectory cases={cases} syndromes={syndromes} defaultSort="alphabetical" />;
}
