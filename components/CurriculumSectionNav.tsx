"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CURRICULUM_MODULES,
  getCurriculumModuleNeighbors,
} from "@/lib/curriculum/modules";

type SectionLink = {
  id: string;
  label: string;
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
  const existingId = element.id;
  if (existingId && !seenIds.has(existingId)) {
    seenIds.add(existingId);
    return existingId;
  }
  const baseId = slugify(fallbackLabel) || "section";
  let nextId = baseId;
  let count = 1;
  while (seenIds.has(nextId) || document.getElementById(nextId)) {
    count += 1;
    nextId = `${baseId}-${count}`;
  }
  element.id = nextId;
  seenIds.add(nextId);
  return nextId;
}

function collectSections(): SectionLink[] {
  const article = document.querySelector<HTMLElement>("[data-module-article]");
  if (!article) return [];
  const seenIds = new Set<string>();
  const items: SectionLink[] = [];
  const nodes = Array.from(article.querySelectorAll<HTMLElement>("h2"));
  for (const node of nodes) {
    const label = node.textContent?.trim();
    if (!label) continue;
    const id = ensureId(node, label, seenIds);
    items.push({ id, label });
  }
  return items;
}

function slugFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("training");
  return parts[idx + 1] ?? null;
}

export default function CurriculumSectionNav() {
  const pathname = usePathname();
  const [sections, setSections] = useState<SectionLink[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const slug = pathname ? slugFromPath(pathname) : null;
  const neighbors = useMemo(
    () => (slug ? getCurriculumModuleNeighbors(slug) : {}),
    [slug],
  );
  const moduleIndex = useMemo(
    () => CURRICULUM_MODULES.findIndex((m) => m.slug === slug),
    [slug],
  );
  const moduleTitle =
    moduleIndex >= 0 ? CURRICULUM_MODULES[moduleIndex].title : null;

  useEffect(() => {
    if (!pathname?.startsWith("/training/") || !slug) return;

    const refresh = () => {
      const next = collectSections();
      setSections(next);
      setActiveId((cur) =>
        cur && next.some((s) => s.id === cur) ? cur : (next[0]?.id ?? ""),
      );
    };

    refresh();
    const article = document.querySelector<HTMLElement>("[data-module-article]");
    if (!article) return;
    const observer = new MutationObserver(refresh);
    observer.observe(article, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, slug]);

  useEffect(() => {
    if (sections.length === 0) return;
    const update = () => {
      let nextActive = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 180) nextActive = s.id;
      }
      setActiveId(nextActive);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!mobileMenuRef.current?.contains(e.target as Node)) {
        setIsMobileOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMobileOpen]);

  if (!pathname?.startsWith("/training/") || !slug || sections.length === 0) {
    return null;
  }

  const activeLabel =
    sections.find((s) => s.id === activeId)?.label ?? moduleTitle ?? "This module";

  return (
    <>
      {/* Mobile floating button */}
      <div className="pointer-events-none fixed bottom-5 right-4 z-30 lg:hidden">
        <div
          ref={mobileMenuRef}
          className="pointer-events-auto relative w-[min(18rem,calc(100vw-2rem))]"
        >
          <button
            type="button"
            onClick={() => setIsMobileOpen((o) => !o)}
            className="ml-auto flex items-center justify-between gap-3 border border-[var(--border)] bg-white px-3.5 py-2 text-left shadow-sm"
            style={{ borderRadius: 3 }}
            aria-expanded={isMobileOpen}
            aria-label="Open module section navigation"
          >
            <span className="max-w-[9rem] truncate text-sm font-medium text-[var(--foreground)]">
              {activeLabel}
            </span>
            <span className="shrink-0 text-xs font-semibold text-[var(--primary)]">
              {isMobileOpen ? "↑" : "↓"}
            </span>
          </button>
          {isMobileOpen ? (
            <div className="absolute bottom-full right-0 mb-2 w-full border border-[var(--border)] bg-white p-3 shadow-lg">
              <p className="px-1 pb-2 text-[11px] font-medium text-[var(--muted)]">
                {sections.length} sections in this module
              </p>
              <div className="grid max-h-[60vh] gap-1 overflow-y-auto pr-1">
                <Link
                  href="/training"
                  onClick={() => setIsMobileOpen(false)}
                  className="border-l-2 border-[var(--primary)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
                >
                  ← All modules
                </Link>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setIsMobileOpen(false)}
                    className={`border-l-2 px-3 py-2 text-sm ${
                      s.id === activeId
                        ? "border-[var(--primary)] bg-[var(--primary-tint)] font-semibold text-[var(--primary-strong)]"
                        : "border-transparent text-[var(--muted)]"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop sticky aside */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-[var(--border)] pl-5">
          <p className="idhub-kicker">In this module</p>
          <div className="mt-3 grid gap-1">
            <Link
              href="/training"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)] hover:text-[var(--primary)]"
            >
              ← All modules
            </Link>
            <div className="my-2 h-px bg-[var(--border)]" />
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`border-l-2 pl-3 -ml-[14px] py-1 text-sm leading-snug ${
                  s.id === activeId
                    ? "border-[var(--primary)] font-semibold text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>

          {(neighbors.prev || neighbors.next) && (
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <p className="idhub-kicker mb-2">Continue</p>
              <div className="grid gap-1">
                {neighbors.prev ? (
                  <Link
                    href={`/training/${neighbors.prev.slug}`}
                    className="border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--primary)]"
                  >
                    <span className="block text-[0.65rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Previous
                    </span>
                    <span className="text-[var(--foreground)]">
                      {neighbors.prev.title}
                    </span>
                  </Link>
                ) : null}
                {neighbors.next ? (
                  <Link
                    href={`/training/${neighbors.next.slug}`}
                    className="border border-[var(--primary)] bg-[var(--primary-tint)] px-3 py-2 text-sm text-[var(--primary-strong)] hover:bg-[var(--primary-soft)]"
                  >
                    <span className="block text-[0.65rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                      Next
                    </span>
                    {neighbors.next.title}
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
