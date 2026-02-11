import Parser from "rss-parser";

type FeedItem = {
  title?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
};

export default async function BlogPage() {
  const parser = new Parser();
  const feedUrl = "https://alvaroayala1.substack.com/feed";

  const feed = await parser.parseURL(feedUrl);
  const items = (feed.items || []) as FeedItem[];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Blog
        </h1>

        <p className="mt-4 max-w-3xl text-[var(--foreground)]/85 text-justify">
          This blog grew out of a simple realization: we all carry ideas, doubts,
          and clinical questions that rarely make it to paper. Here, I try to slow
          down and write through the nuances of infectious diseases—diagnostics,
          antimicrobials, and the everyday clinical decisions shaped by evidence,
          experience, and interpretation rather than certainty.
          <span className="ml-2 text-[var(--muted)]">
            Posts from Substack (ID)as &amp; Op(ID)nions.
          </span>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://alvaroayala1.substack.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)] transition"
          >
            Subscribe on Substack
          </a>
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {items.map((item, idx) => {
          const dateLabel = item.isoDate
            ? new Date(item.isoDate).toLocaleDateString()
            : item.pubDate ?? "";

          return (
            <article
              key={(item.link || "") + idx}
              className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm hover:bg-[var(--cardHover)] transition"
            >
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition">
                  {item.title ?? "Untitled"}
                </h2>

                {item.contentSnippet ? (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]/80">
                    {item.contentSnippet}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-[var(--muted)]">{dateLabel}</p>

                  <span className="text-xs font-semibold text-[var(--primary)]">
                    Read →
                  </span>
                </div>
              </a>
            </article>
          );
        })}
      </section>

      <footer className="mt-12 border-t border-[var(--border)] pt-6">
        <a
          href="https://alvaroayala1.substack.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--cardHover)] transition"
        >
          Subscribe on Substack
        </a>
      </footer>
    </main>
  );
}
