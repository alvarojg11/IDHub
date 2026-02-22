import CommentsAdminPanel from "@/components/CommentsAdminPanel";
import AdminQuickNav from "@/components/AdminQuickNav";

export const metadata = {
  title: "Comments Admin | IDHub",
};

export default function CommentsAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Comments Admin
        </h1>
        <p className="mt-3 text-[var(--foreground)]/85">
          Review pending comments and approve or hide them.
        </p>
        <AdminQuickNav current="comments" />
      </header>

      <CommentsAdminPanel />
    </main>
  );
}
