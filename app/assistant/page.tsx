import type { Metadata } from "next";

const ASSISTANT_BACKEND_ORIGIN =
  process.env.ASSISTANT_BACKEND_ORIGIN ?? "https://assistantapi-production.up.railway.app";

const ASSISTANT_URL = `${ASSISTANT_BACKEND_ORIGIN}/assistant`;

export const metadata: Metadata = {
  title: "IDAssistant — AI Clinical Reasoning for Infectious Diseases",
  description:
    "IDAssistant for Infectious Diseases clinical reasoning and ProbID-guided workflows.",
  alternates: {
    canonical: "https://infectiousdiseasehub.com/assistant",
  },
  openGraph: {
    type: "website",
    url: "https://infectiousdiseasehub.com/assistant",
    siteName: "InfectiousDiseaseHub",
    title: "IDAssistant | IDHub — AI Clinical Reasoning for Infectious Diseases",
    description:
      "AI-powered Infectious Diseases clinical reasoning and ProbID-guided diagnostic workflows.",
  },
  twitter: {
    card: "summary",
    title: "IDAssistant | IDHub — AI Clinical Reasoning for Infectious Diseases",
    description:
      "AI-powered Infectious Diseases clinical reasoning and ProbID-guided diagnostic workflows.",
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
