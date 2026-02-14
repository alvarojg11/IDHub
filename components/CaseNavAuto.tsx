"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPrevNext } from "@/lib/cases/registry";

function slugFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const casesIdx = parts.indexOf("cases");
  if (casesIdx === -1) return null;
  return parts[casesIdx + 1] ?? null;
}

export default function CaseNavAuto() {
  const pathname = usePathname();
  const slug = slugFromPath(pathname);

  if (!slug) return null;

  const { prev, next } = getPrevNext(slug);
  if (!prev && !next) return null;

  return (
    <div className="mt-28">
      <div className="mx-auto max-w-5xl flex justify-center gap-8">
        {prev && (
          <Link
            href={`/cases/${prev.slug}`}
            className="
              flex-1 max-w-sm
              inline-flex items-center justify-center
              rounded-full
              px-12 py-10
              text-xl font-semibold
              tracking-wide
              transition-all duration-200
              hover:-translate-y-1 hover:shadow-lg
            "
            style={{
              backgroundColor: "var(--card2)",
              border: "1.5px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            ← Previous
          </Link>
        )}

        {next && (
          <Link
            href={`/cases/${next.slug}`}
            className="
              flex-1 max-w-sm
              inline-flex items-center justify-center
              rounded-full
              px-12 py-10
              text-xl font-semibold
              tracking-wide
              transition-all duration-200
              hover:-translate-y-1 hover:shadow-lg
            "
            style={{
              backgroundColor: "var(--card2)",
              border: "1.5px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            Next →
          </Link>
        )}
      </div>

      <footer className="mt-28 border-t border-[var(--border)] pt-8 pb-6 text-xs text-[var(--muted)] text-center">
        Educational content only. Not medical advice. 
        <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} IDHub
        </p>
      </footer>
    </div>
  );
}
