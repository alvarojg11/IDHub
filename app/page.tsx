export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          IDHub
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-700">
          An educational hub for infectious diseases, combining clinical cases,
          concise explanations, and interactive tools for everyday practice.
        </p>
      </header>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/blog"
          className="rounded-lg border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">Blog</h2>
          <p className="mt-2 text-gray-600">
            Short, practical posts on diagnostics, antimicrobial therapy, and
            clinical reasoning in infectious diseases.
          </p>
        </a>

        <a
          href="/cases"
          className="rounded-lg border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">Cases</h2>
          <p className="mt-2 text-gray-600">
            Case-based learning designed to mirror real-world ID decision making,
            from first labs to final management.
          </p>
        </a>

        <a
          href="/mechid"
          className="rounded-lg border p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold text-gray-900">MechID</h2>
          <p className="mt-2 text-gray-600">
            An interactive susceptibility interpretation tool to support
            antimicrobial selection and stewardship.
          </p>
        </a>
      </section>

      <footer className="mt-16 border-t pt-6 text-sm text-gray-500">
        Educational content only. Not a substitute for clinical judgment.
      </footer>
    </main>
  );
}
