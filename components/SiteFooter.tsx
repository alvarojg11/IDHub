export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)] py-12">
      <div className="max-w-5xl mx-auto space-y-2">
        <p>
          IDHub is an educational project focused on clinical teaching in Infectious Disease.
        </p>
        <p>
          Content is for learning purposes only and does not replace clinical judgment,
          institutional guidelines, or consultation with infectious diseases specialists.
        </p>
        <p className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} IDHub
        </p>
      </div>
    </footer>
  );
}
