import Link from "next/link";

const cases = [
  {
    title: "Fever, Urinary Symptoms, and a Heart Murmur",
    slug: "aerococcus",
    description: "Beyond the obvious: Gram-positive clusters.",
  },
  {
    title: "Amazon Adventure",
    slug: "lobomycosis",
    description: "A returning traveler lesion.",
  },
    {
    title: "A Nose Lesion that Wouldn’t Heal",
    slug: "rhinoscleroma",
    description: "A chronic nasal lesion with a broad differential diagnosis.",
  },
  {
    title: "Hundreds of Lesions",
    slug: "tungiasis",
    description: "Neglect, poverty, and a devastating skin disease",
  },
  {
    title: "Bloody Diarrhea without a Clear Cause",
    slug: "spirochetosis",
    description: "An unexpected culprit",
  }
];


export default function CasesPage() {
  return (
    <main className="py-16">
      <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
      <p className="mt-4 text-gray-700">
        Interactive, stepwise clinical reasoning cases in infectious diseases.
      </p>

      <ul className="mt-10 space-y-6">
        {cases.map((c) => (
          <li key={c.slug} className="border-b pb-4">
            <Link
              href={`/cases/${c.slug}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {c.title}
            </Link>
            <p className="mt-2 text-gray-600">{c.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
