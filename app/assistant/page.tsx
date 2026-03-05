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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          IDHub Uncertainty Assistant
        </h1>
        <p className="mt-3 max-w-3xl text-[var(--foreground)]/85">
          Describe your case in plain language to get guided infectious diseases clinical reasoning.
        </p>
        <div className="mt-4">
          <a
            href={ASSISTANT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Open Full Assistant
          </a>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
        <iframe
          src={ASSISTANT_URL}
          title="IDHub Uncertainty Assistant"
          className="h-[80vh] w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </section>
    </main>
  );
}
