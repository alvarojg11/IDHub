import CasePollsAdminPanel from "@/components/CasePollsAdminPanel";
import AdminQuickNav from "@/components/AdminQuickNav";

export const metadata = {
  title: "Case Polls Admin",
};

export default function CasePollsAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Case Polls Admin
        </h1>
        <p className="mt-3 text-[var(--foreground)]/85">
          Review how users answered case questions across IDHub.
        </p>
        <AdminQuickNav current="case-polls" />
      </header>

      <CasePollsAdminPanel />
    </main>
  );
}
