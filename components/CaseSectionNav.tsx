"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen]);

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
          <div
            ref={mobileMenuRef}
            className="pointer-events-auto relative w-[min(18rem,calc(100vw-2rem))]"
          >
            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              className="ml-auto flex items-center justify-between gap-3 border border-[var(--border-strong)] bg-white px-3.5 py-2 text-left"
              aria-expanded={isMobileOpen}
              aria-label="Open case section navigation"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 items-center justify-center border border-[var(--border)] bg-[var(--background-soft)] text-[var(--primary)]"
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
              <div className="absolute bottom-full right-0 mb-2 w-full overflow-hidden border border-[var(--border-strong)] bg-white p-3">
                <p className="idhub-kicker px-1 pb-2">
                  {sectionCount} jump points in this case
                </p>
                <div className="grid max-h-[60vh] overflow-y-auto border-t border-[var(--border)]">
                  <Link
                    href="/cases"
                    onClick={() => setIsMobileOpen(false)}
                    className="border-b border-[var(--border)] px-3 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--background-soft)]"
                  >
                    Back to all cases
                  </Link>
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setIsMobileOpen(false)}
                      className={`border-b border-[var(--border)] px-3 py-3 text-sm font-medium ${
                        section.id === activeId
                          ? "bg-[var(--primary-tint)] text-[var(--primary)]"
                          : "bg-white text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {section.label}
                    </a>
                  ))}
                  {nextCase ? (
                    <Link
                      href={`/cases/${nextCase.slug}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="border-b border-[var(--border)] bg-[var(--primary-tint)] px-3 py-3 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--background-soft)]"
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
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-y border-[var(--border-strong)] bg-white py-5">
            <p className="idhub-kicker">
              Case navigation
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">Move through this case</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Jump between major sections without losing your place in the case flow.
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted-soft)]">
              {sectionCount} sections available
            </p>

            <div className="mt-5 border-t border-[var(--border)]">
              <Link
                href="/cases"
                className="block border-b border-[var(--border)] px-3 py-3 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--background-soft)]"
              >
                Back to all cases
              </Link>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block border-b border-[var(--border)] px-3 py-3 text-sm font-medium ${
                    section.id === activeId
                      ? "bg-[var(--primary-tint)] text-[var(--primary)]"
                      : "bg-white text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--foreground)]"
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
                    className="block border border-[var(--primary)] bg-[var(--primary-tint)] px-3 py-3 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
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
