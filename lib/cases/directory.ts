import { CASES } from "@/lib/cases/registry";
import { getCaseDateEntry } from "@/lib/cases/dates";

export type CaseDirectoryEntry = {
  slug: string;
  title: string;
  description: string;
  organisms: string[];
  syndromes: string[];
  concepts: string[];
  publishedAt?: string;
  modifiedAt?: string;
};

export function getCaseDirectoryEntries(): CaseDirectoryEntry[] {
  return CASES.map((item) => {
    const dates = getCaseDateEntry(item.slug);

    return {
      slug: item.slug,
      title: item.title,
      description: item.description ?? "",
      organisms: item.tags?.organisms ?? [],
      syndromes: item.tags?.syndromes ?? [],
      concepts: item.tags?.concepts ?? [],
      publishedAt: dates?.publishedAt,
      modifiedAt: dates?.modifiedAt,
    };
  });
}

export function getAllCaseSyndromes() {
  return [...new Set(CASES.flatMap((item) => item.tags?.syndromes ?? []))].sort();
}
