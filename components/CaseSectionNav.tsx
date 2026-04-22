"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getPrevNext } from "@/lib/cases/registry";

type SectionLink = {
  id: string;
  label: string;
};

type Props = {
  variant?: "mobile" | "desktop" | "both";
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function ensureId(element: HTMLElement, fallbackLabel: string, seenIds: Set<string>) {
  const existingId = element.id || element.getAttribute("data-anchor-id");

  if (existingId && !seenIds.has(existingId)) {
    element.id = existingId;
    seenIds.add(existingId);
    return existingId;
  }

  const baseId = slugify(fallbackLabel) || "section";
  let nextId = baseId;
  let duplicateCount = 1;

  while (seenIds.has(nextId) || document.getElementById(nextId)) {
    duplicateCount += 1;
    nextId = `${baseId}-${duplicateCount}`;
  }

  element.id = nextId;
  element.setAttribute("data-anchor-id", nextId);
  seenIds.add(nextId);
  return nextId;
}

function collectSections() {
  const article = document.querySelector<HTMLElement>("[data-case-article]");
  if (!article) return [];

  const seenIds = new Set<string>();
  const items: SectionLink[] = [];
  let questionsAdded = false;

  const nodes = Array.from(article.querySelectorAll<HTMLElement>("h2, [data-case-question]"));

  for (const node of nodes) {
    if (node.matches("[data-case-question]")) {
      if (questionsAdded) {
        continue;
      }

      const id = ensureId(node, "questions", seenIds);
      items.push({ id, label: "Questions" });
      questionsAdded = true;
      continue;
    }

    const label = node.textContent?.trim();
    if (!label) {
      continue;
    }

    const id = ensureId(node, label, seenIds);
    items.push({ id, label });
  }

  return items;
}

function slugFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const casesIndex = parts.indexOf("cases");
  if (casesIndex === -1) return null;
  return parts[casesIndex + 1] ?? null;
}

export default function CaseSectionNav({ variant = "both" }: Props) {
  const pathname = usePathname();
  const [sections, setSections] = useState<SectionLink[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!pathname?.startsWith("/cases/")) {
      return;
    }

    const refreshSections = () => {
      const nextSections = collectSections();
      setSections(nextSections);
      setActiveId((currentId) => {
        if (currentId && nextSections.some((item) => item.id === currentId)) {
          return currentId;
        }

        return nextSections[0]?.id ?? "";
      });
    };

    refreshSections();

    const article = document.querySelector<HTMLElement>("[data-case-article]");
    if (!article) {
      return;
    }

    const observer = new MutationObserver(() => {
      refreshSections();
    });

    observer.observe(article, { childList: true, subtree: true });
    window.addEventListener("idhub:case-answered", refreshSections);

    return () => {
      observer.disconnect();
      window.removeEventListener("idhub:case-answered", refreshSections);
    };
  }, [pathname]);

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    const updateActiveSection = () => {
      let nextActiveId = sections[0]?.id ?? "";

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= 180) {
          nextActiveId = section.id;
        }
      }

      setActiveId(nextActiveId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  const activeLabel = useMemo(() => {
    return sections.find((item) => item.id === activeId)?.label ?? "This case";
  }, [activeId, sections]);
  const sectionCount = sections.length;
  const slug = pathname ? slugFromPath(pathname) : null;
  const nextCase = slug ? getPrevNext(slug, "newest").next : null;

  if (!pathname?.startsWith("/cases/") || sections.length === 0) {
    return null;
  }

  const showMobile = variant === "mobile" || variant === "both";
  const showDesktop = variant === "desktop" || variant === "both";

  return (
    <>
      {showMobile ? (
        <div className="pointer-events-none fixed bottom-5 right-4 z-30 lg:hidden">
          <div className="pointer-events-auto relative w-[min(18rem,calc(100vw-2rem))]">
            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              className="ml-auto flex items-center justify-between gap-3 rounded-full border border-[var(--border)] bg-white/92 px-3.5 py-2 text-left shadow-[0_8px_22px_rgba(13,30,24,0.08)] backdrop-blur"
              aria-expanded={isMobileOpen}
              aria-label="Open case section navigation"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="3" cy="4" r="1" fill="currentColor" />
                  <circle cx="3" cy="8" r="1" fill="currentColor" />
                  <circle cx="3" cy="12" r="1" fill="currentColor" />
                  <path d="M6 4H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M6 8H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M6 12H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
              <span className="max-w-[9rem] truncate text-sm font-medium text-[var(--foreground)]">
                {activeLabel}
              </span>
              <span className="shrink-0 text-xs font-semibold text-[var(--primary)]">
                {isMobileOpen ? "↑" : "↓"}
              </span>
            </button>

            {isMobileOpen ? (
              <div className="absolute bottom-full right-0 mb-2 w-full overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(241,248,245,0.97))] p-3 shadow-[var(--shadow-soft)] backdrop-blur">
                <p className="px-1 pb-2 text-[11px] font-medium text-[var(--muted)]">
                  {sectionCount} jump points in this case
                </p>
                <div className="grid max-h-[60vh] gap-2 overflow-y-auto pr-1">
                  <Link
                    href="/cases"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-2xl border border-[var(--border)] bg-white/85 px-4 py-3 text-sm font-semibold text-[var(--foreground)]"
                  >
                    Back to all cases
                  </Link>
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setIsMobileOpen(false)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                        section.id === activeId
                          ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                          : "border-[var(--border)] bg-white/85 text-[var(--muted)]"
                      }`}
                    >
                      {section.label}
                    </a>
                  ))}
                  {nextCase ? (
                    <Link
                      href={`/cases/${nextCase.slug}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="rounded-2xl border border-[var(--primary)] bg-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--primary)]"
                    >
                      Next case: {nextCase.title}
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {showDesktop ? (
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,245,0.95))] p-5 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
              Case navigation
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">Move through this case</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Jump between major sections without losing your place in the case flow.
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-soft)]">
              {sectionCount} sections available
            </p>

            <div className="mt-5 grid gap-2">
              <Link
                href="/cases"
                className="rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-white"
              >
                Back to all cases
              </Link>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    section.id === activeId
                      ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "border-[var(--border)] bg-white/80 text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {section.label}
                </a>
              ))}

              {nextCase ? (
                <div className="mt-2 border-t border-[var(--border)] pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
                    After references
                  </p>
                  <Link
                    href={`/cases/${nextCase.slug}`}
                    className="block rounded-2xl border border-[var(--primary)] bg-[var(--primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                  >
                    Next case: {nextCase.title}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
