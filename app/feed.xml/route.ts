import { getBlogPosts } from "@/lib/blog/registry";
import { CASES } from "@/lib/cases/registry";
import { getCaseSeoEntry } from "@/lib/cases/seo";

const BASE_URL = "https://infectiousdiseasehub.com";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getBlogPosts();
  const enabledCases = CASES.filter((c) => c.enable !== false);

  type FeedItem = {
    title: string;
    url: string;
    description: string;
    pubDate: string;
    category: string;
  };

  const items: FeedItem[] = [];

  for (const post of posts) {
    if (!post.publishedAt) continue;
    items.push({
      title: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
      description: post.description,
      pubDate: new Date(post.publishedAt).toUTCString(),
      category: "Blog",
    });
  }

  for (const c of enabledCases) {
    const entry = getCaseSeoEntry(c.slug);
    if (!entry.publishedAt) continue;
    items.push({
      title: entry.title,
      url: entry.url,
      description: entry.description,
      pubDate: new Date(entry.publishedAt).toUTCString(),
      category: "Case",
    });
  }

  items.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>IDHub — Infectious Diseases Education</title>
    <link>${BASE_URL}</link>
    <description>Clinical cases, blog posts, and educational tools for Infectious Diseases.</description>
    <language>en-us</language>
    <lastBuildDate>${items[0]?.pubDate ?? new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid isPermaLink="true">${item.url}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
