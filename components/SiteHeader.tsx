"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

function isActiveLink(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({
  primaryNav,
  toolsNav,
  browseSyndromes = [],
}: {
  primaryNav: NavItem[];
  toolsNav: NavItem[];
  browseSyndromes?: string[];
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (window.innerWidth >= 1024) {
        setIsHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (isMenuOpen) {
        setIsHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= 24) {
        setIsHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      const delta = currentScrollY - lastScrollY;

      if (delta > 10 && currentScrollY > 96) {
        setIsHidden(true);
      } else if (delta < -10) {
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setIsHidden(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsHidden(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[var(--border)] bg-white transition-transform duration-300 will-change-transform ${
        isHidden ? "-translate-y-full lg:translate-y-0" : "translate-y-0"
      }`}
    >
      {/* Utility bar */}
      <div className="border-b border-[var(--border)] bg-[var(--background-soft)]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-1.5 text-xs text-[var(--muted)] sm:px-6 lg:px-8">
          <span className="hidden tracking-[0.08em] sm:inline">
            Infectious Diseases · Cases · Tools
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/subscribe"
              className="hover:text-[var(--primary)]"
              onClick={closeMobileMenu}
            >
              Subscribe
            </Link>
            <Link
              href="/contact"
              className="hidden hover:text-[var(--primary)] sm:inline"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            <Link
              href="/assistant"
              className="font-semibold text-[var(--primary)] hover:text-[var(--primary-strong)]"
              onClick={closeMobileMenu}
            >
              IDAssistant
            </Link>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex flex-col" onClick={closeMobileMenu}>
            <span
              className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] font-bold leading-none tracking-tight text-[var(--foreground)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              IDHub
            </span>
            <span className="mt-1 text-[0.66rem] uppercase tracking-[0.18em] text-[var(--muted-soft)]">
              Infectious Diseases Hub
            </span>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-site-nav"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="border border-[var(--border-strong)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              style={{ borderRadius: 3 }}
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/assistant"
              onClick={closeMobileMenu}
              className="idhub-button-primary px-4 py-2 text-sm font-semibold"
            >
              Open IDAssistant
            </Link>
          </div>
        </div>
      </div>

      {/* Nav bar (desktop) */}
      <nav
        className="hidden border-b border-[var(--border)] lg:block"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex max-w-[1200px] items-center gap-1 px-4 sm:px-6 lg:px-8">
          {primaryNav.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative -mb-px border-b-2 px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-[var(--primary)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--ink-soft)] hover:text-[var(--primary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Browse mega-menu */}
          <div className="group relative">
            <button
              type="button"
              className="relative -mb-px border-b-2 border-transparent px-3 py-3 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--primary)]"
            >
              Browse ▾
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 border border-[var(--border)] bg-white p-5 opacity-0 shadow-lg transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <p className="idhub-kicker mb-3">Browse cases by syndrome</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {browseSyndromes.slice(0, 14).map((s) => (
                  <Link
                    key={s}
                    href={`/cases?syndrome=${encodeURIComponent(s)}`}
                    className="text-sm text-[var(--ink-soft)] hover:text-[var(--primary)]"
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex gap-4 border-t border-[var(--border)] pt-3 text-sm">
                <Link
                  href="/cases"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  All Cases →
                </Link>
                <Link
                  href="/references"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Organism Index →
                </Link>
              </div>
            </div>
          </div>

          <span className="mx-2 h-4 w-px bg-[var(--border)]" />

          {toolsNav.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`-mb-px border-b-2 px-2.5 py-3 text-[0.82rem] font-medium uppercase tracking-[0.04em] transition ${
                  isActive
                    ? "border-[var(--primary)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--primary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-site-nav"
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isMenuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-b border-[var(--border)] bg-white px-4 py-4">
          <nav className="grid gap-1" aria-label="Mobile primary navigation">
            {primaryNav.map((item) => {
              const isActive = isActiveLink(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`border-l-2 px-3 py-2.5 text-[0.95rem] ${
                    isActive
                      ? "border-[var(--primary)] font-semibold text-[var(--foreground)]"
                      : "border-transparent text-[var(--ink-soft)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">
            Tools
          </p>
          <nav className="grid gap-1">
            {toolsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="border-l-2 border-transparent px-3 py-2 text-sm text-[var(--muted)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/assistant"
            onClick={closeMobileMenu}
            className="idhub-button-primary mt-4 block w-full py-2.5 text-center text-sm font-semibold"
          >
            Open IDAssistant
          </Link>
        </div>
      </div>
    </header>
  );
}
