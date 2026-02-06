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
    <main className="py-16">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-4 text-gray-700">
        Posts from Substack (shown here for convenience).
      </p>

      <ul className="mt-10 space-y-6">
        {items.map((item, idx) => (
          <li key={(item.link || "") + idx} className="border-b pb-4">
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {item.title ?? "Untitled"}
            </a>
            <p className="mt-2 text-gray-600">{item.contentSnippet}</p>
            <p className="mt-2 text-sm text-gray-500">
              {item.isoDate ? new Date(item.isoDate).toLocaleDateString() : item.pubDate}
            </p>
          </li>
        ))}
        <div className="mt-6 flex gap-3">
            <a
                href="https://alvaroayala1.substack.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                Subscribe on Substack
            </a>
        </div>

      </ul>
    </main>
  );
}
