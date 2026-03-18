import type { Metadata } from "next";

const ASSISTANT_BACKEND_ORIGIN =
  process.env.ASSISTANT_BACKEND_ORIGIN ?? "https://assistantapi-production.up.railway.app";

const ASSISTANT_URL = `${ASSISTANT_BACKEND_ORIGIN}/assistant`;

export const metadata: Metadata = {
  title: "IDHub Assistant",
  description:
    "IDHub Uncertainty Assistant for infectious diseases clinical reasoning and ProbID-guided workflows.",
  alternates: {
    canonical: "https://infectiousdiseasehub.com/assistant",
  },
};

export default function AssistantPage() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="border-y border-[var(--border)] bg-[var(--card2)] shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[var(--foreground)] sm:text-xl">
              IDHub Uncertainty Assistant
            </h1>
            <p className="text-sm text-[var(--foreground)]/75">
              Full-screen clinical reasoning workspace for infectious diseases cases.
            </p>
          </div>
          <a
            href={ASSISTANT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Open in New Tab
          </a>
        </div>
        <iframe
          src={ASSISTANT_URL}
          title="IDHub Uncertainty Assistant"
          className="block h-[calc(100dvh-8.5rem)] w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
