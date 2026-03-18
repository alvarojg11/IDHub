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
      <div className="flex flex-wrap justify-center gap-4">
        {prev && (
          <Link
            href={`/cases/${prev.slug}`}
            className="idhub-button-secondary inline-flex min-w-[180px] items-center justify-center px-5 py-3 text-sm font-semibold"
          >
            ← Previous
          </Link>
        )}

        {next && (
          <Link
            href={`/cases/${next.slug}`}
            className="idhub-button-secondary inline-flex min-w-[180px] items-center justify-center px-5 py-3 text-sm font-semibold"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
