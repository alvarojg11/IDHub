import SiteFooter from "@/components/SiteFooter";

export default function MechIDPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">MechID</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        An interactive susceptibility interpretation tool.
      </p>

      <div className="group mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <p className="text-sm text-[var(--muted)]">
          Open the app here:
        </p>
        <a
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:opacity-90"
          href="https://mechid.streamlit.app/"
          target="_blank"
          rel="noreferrer"
        >
          Launch MechID
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>

      <SiteFooter />
    </main>
  );
}
