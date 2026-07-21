import Link from "next/link";

export type EditorialCardProps = {
  href: string;
  kicker?: string;
  title: string;
  dek?: string;
  imageSrc?: string;
  imageAlt?: string;
  dateLabel?: string;
  byline?: string;
  variant?: "lead" | "list" | "grid";
};

export default function EditorialCard({
  href,
  kicker,
  title,
  dek,
  imageSrc,
  imageAlt = "",
  dateLabel,
  byline,
  variant = "grid",
}: EditorialCardProps) {
  if (variant === "lead") {
    return (
      <Link
        href={href}
        className="group grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center"
      >
        {imageSrc ? (
          <div className="overflow-hidden border border-[var(--border)]">
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ) : null}
        <div className="min-w-0">
          {kicker ? <p className="idhub-kicker">{kicker}</p> : null}
          <h2 className="mt-2 text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] font-semibold leading-[1.12] text-[var(--foreground)] group-hover:text-[var(--primary)]">
            {title}
          </h2>
          {dek ? (
            <p className="mt-3 line-clamp-3 text-[1.02rem] leading-7 text-[var(--ink-soft)]">
              {dek}
            </p>
          ) : null}
          {(dateLabel || byline) && (
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--muted-soft)]">
              {[dateLabel, byline].filter(Boolean).join("  ·  ")}
            </p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link
        href={href}
        className="group grid grid-cols-[minmax(0,1fr)_112px] gap-4 py-5 first:pt-0 last:pb-0"
      >
        <div className="min-w-0">
          {kicker ? (
            <p className="idhub-kicker text-[0.62rem]">{kicker}</p>
          ) : null}
          <h3 className="mt-1.5 text-[1.18rem] font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)]">
            {title}
          </h3>
          {dek ? (
            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
              {dek}
            </p>
          ) : null}
          {dateLabel ? (
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--muted-soft)]">
              {dateLabel}
            </p>
          ) : null}
        </div>
        {imageSrc ? (
          <div className="overflow-hidden border border-[var(--border)]">
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              className="aspect-square h-full w-full object-cover"
            />
          </div>
        ) : null}
      </Link>
    );
  }

  // grid (default)
  return (
    <Link href={href} className="group flex flex-col">
      {imageSrc ? (
        <div className="overflow-hidden border border-[var(--border)]">
          <img
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="min-w-0 pt-4">
        {kicker ? <p className="idhub-kicker text-[0.62rem]">{kicker}</p> : null}
        <h3 className="mt-1.5 text-[1.22rem] font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--primary)]">
          {title}
        </h3>
        {dek ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
            {dek}
          </p>
        ) : null}
        {dateLabel ? (
          <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[var(--muted-soft)]">
            {dateLabel}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
