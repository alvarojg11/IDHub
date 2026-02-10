import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          IDHub
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-700">
          An educational hub for Infectious Diseases, combining clinical cases,
          concise explanations, and interactive tools for everyday practice.
        </p>
      </header>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/blog"
          className="rounded-lg border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">Blog</h2>
          <p className="mt-2 text-gray-600">
            Reflections on diagnostics, antimicrobial therapy, and clinical
            reasoning in infectious diseases, shaped by training, bedside
            conversations, and the recognition that even strong evidence leaves
            room for nuance.
          </p>
        </Link>

        <Link
          href="/cases"
          className="rounded-lg border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">Cases</h2>
          <p className="mt-2 text-gray-600">
            Clinical cases for ongoing learning in infectious diseases, using
            problem solving to revisit syndromes, pathogens, and treatment
            decisions.
          </p>
        </Link>

        <Link
          href="/mechid"
          className="rounded-lg border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">MechID</h2>
          <p className="mt-2 text-gray-600">
            An interactive susceptibility interpretation tool to support
            antimicrobial selection and stewardship.
          </p>
        </Link>

        {/* NEW: ImmunoID */}
        <Link
          href="/tools/immunoid"
          className="rounded-lg border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">ImmunoID</h2>
          <p className="mt-2 text-gray-600">
            Explore immunosuppressive medications, mechanisms of action, and
            high-yield infection risks—with an educational immunosuppression
            level estimate.
          </p>
        </Link>
      

        <Link
          href="/about"
          className="rounded-lg border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">About</h2>
          <p className="mt-2 text-gray-600">
            Why IDHub exists, how it’s meant to be used, and the philosophy behind
            case-based learning and clinical reasoning in infectious diseases.
          </p>
        </Link>
      </section>

      <footer className="mt-16 border-t pt-6 text-sm text-gray-500">
        Educational content only. Not a substitute for clinical judgment.
      </footer>
    </main>
  );
}
