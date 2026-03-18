import type { Metadata } from "next";

const ASSISTANT_BACKEND_ORIGIN =
  process.env.ASSISTANT_BACKEND_ORIGIN ?? "https://assistantapi-production.up.railway.app";

const ASSISTANT_URL = `${ASSISTANT_BACKEND_ORIGIN}/assistant`;

export const metadata: Metadata = {
  title: "IDAssistant | IDHub",
  description:
    "IDAssistant for Infectious Diseases clinical reasoning and ProbID-guided workflows.",
  alternates: {
    canonical: "https://infectiousdiseasehub.com/assistant",
  },
};

export default function AssistantPage() {
  return (
    <section className="relative left-1/2 min-h-[100dvh] w-screen -translate-x-1/2 bg-white">
      <iframe
        src={ASSISTANT_URL}
        title="IDAssistant"
        className="block h-[100dvh] w-full border-0 bg-white"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
