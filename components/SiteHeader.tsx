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
}: {
  primaryNav: NavItem[];
  toolsNav: NavItem[];
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
      className={`sticky top-0 z-40 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl transition-transform duration-300 will-change-transform ${
        isHidden ? "-translate-y-full lg:translate-y-0" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-2.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 flex-col">
            <span className="idhub-kicker">Clinical Learning Platform</span>
            <span className="mt-1 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
              IDHub
            </span>
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/assistant"
              onClick={closeMobileMenu}
              className="rounded-full bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(20,92,71,0.28)] hover:bg-[var(--primary-strong)]"
            >
              Assistant
            </Link>
            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-site-nav"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.05)] hover:border-[var(--border-strong)] hover:bg-[var(--background-soft)]"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        <div className="hidden flex-col gap-3 lg:flex lg:items-end">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]" aria-label="Primary navigation">
            {primaryNav.map((item) => {
              const isActive = isActiveLink(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full border px-3 py-1.5 ${
                    isActive
                      ? "border-[var(--border)] bg-white text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.05)]"
                      : "border-transparent hover:border-[var(--border)] hover:bg-white/80 hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <span className="group relative">
              <button
                type="button"
                className="rounded-full border border-transparent px-3 py-1.5 hover:border-[var(--border)] hover:bg-white/80 hover:text-[var(--foreground)]"
              >
                Tools ▾
              </button>
              <span className="pointer-events-none absolute right-0 top-full z-50 mt-1 flex min-w-[180px] flex-col rounded-2xl border border-[var(--border)] bg-white p-2 opacity-0 shadow-[var(--shadow-medium)] transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                {toolsNav.map((item) => {
                  const isActive = isActiveLink(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        isActive
                          ? "bg-[var(--background-soft)] text-[var(--foreground)]"
                          : "text-[var(--muted)] hover:bg-[var(--background-soft)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </span>
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/contact"
              className="rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.06)] hover:border-[var(--border-strong)] hover:bg-white"
            >
              Contact
            </Link>
            <Link
              href="/assistant"
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(20,92,71,0.28)] hover:bg-[var(--primary-strong)]"
            >
              Open IDAssistant
            </Link>
          </div>
        </div>

        <div
          id="mobile-site-nav"
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-4 rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,248,245,0.95))] p-4 shadow-[var(--shadow-soft)]">
            <nav className="grid gap-2" aria-label="Mobile primary navigation">
              {primaryNav.map((item) => {
                const isActive = isActiveLink(pathname, item.href);

                return (
                  <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    isActive
                        ? "border-[var(--border)] bg-white text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.05)]"
                        : "border-transparent bg-white/70 text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="grid gap-2">
              <p className="px-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-soft)]">
                Tools
              </p>
              {toolsNav.map((item) => {
                const isActive = isActiveLink(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "border-[var(--border)] bg-[var(--background-soft)] text-[var(--foreground)]"
                        : "border-transparent bg-white/55 text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_24px_rgba(13,30,24,0.05)] hover:border-[var(--border-strong)]"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
