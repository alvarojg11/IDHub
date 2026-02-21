import SubscribeForm from "@/components/SubscribeForm";

export default function SubscribePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">Subscribe</h1>
      <p className="mt-4 text-[var(--foreground)]/85">
        Get an email when a new case or blog update is published on IDHub.
      </p>

      <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Email updates</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          You will receive a confirmation email first. You can unsubscribe any time with one click.
        </p>
        <div className="mt-4">
          <SubscribeForm />
        </div>
      </section>
    </main>
  );
}
