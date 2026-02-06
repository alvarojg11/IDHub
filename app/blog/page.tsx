import Link from 'next/link';

const posts = [
  {
    title: 'Interpreting β-D-glucan in ICU patients',
    slug: 'bdg-in-icu',
    description:
      'How to interpret BDG results in critically ill patients without overdiagnosing invasive fungal disease.',
  },
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-4 text-gray-700">
        Concise, clinically focused posts on infectious diseases, diagnostics,
        antimicrobial therapy, and stewardship.
      </p>

      <ul className="mt-10 space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-b pb-4">
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
            <p className="mt-2 text-gray-600">{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
