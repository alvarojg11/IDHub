# IDHub Case Writing Guide

Reference file for writing daily clinical cases on IDHub.

---

## Overview

Each case requires changes to **3 files** plus a **public image directory**:

1. `app/cases/{slug}/page.mdx` — Full case content (vignette, questions, rationale, teaching points, references)
2. `lib/cases/registry.ts` — `CaseMeta` entry in the `CASES` array
3. `lib/cases/dates.ts` — Date entry in `CASE_DATES`
4. `public/cases/{slug}/` — Clinical images (MRI, photos, etc.)

After the case is built, Instagram cards are exported via `npm run export:social -- case {slug}`.

---

## 1. MDX File Structure

File: `app/cases/{slug}/page.mdx`

Every case follows this exact structure:

```mdx
import { buildCaseMetadata } from "@/lib/cases/seo";

export const metadata = buildCaseMetadata("slug-name");

<h1 className="text-5xl font-extrabold tracking-tight text-gray-900 my-8">
  Case Title
</h1>

<h2 className="text-2xl font-bold text-gray-900 mb-6">
  Clinical Vignette
</h2>

<div className="mx-auto max-w-5xl">
  <p className="text-lg leading-6 text-gray-800 mb-6 text-justify">
    [Clinical story paragraph 1 — patient demographics, past medical history, medications]
  </p>
  <p className="text-lg leading-6 text-gray-800 mb-6 text-justify">
    [Clinical story paragraph 2 — presenting illness, symptoms, timeline]
  </p>
  <p className="text-lg leading-6 text-gray-800 mb-6 text-justify">
    [Clinical story paragraph 3 — physical exam findings, vital signs, key labs]
  </p>
  <p className="text-lg leading-6 text-gray-800 mb-6 text-justify">
    [Bridge to imaging — e.g., "MRI of the brain is performed."]
  </p>
</div>

<!-- FIGURE (single image) -->
<figure className="my-12">
  <div className="mx-auto max-w-xl">
    <div className="flex h-[380px] items-center justify-center rounded-lg border border-gray-300 bg-white p-2">
      <Image
        src="/cases/{slug}/image.png"
        alt="Detailed alt text describing the imaging finding"
        width={800}
        height={600}
        className="rounded-lg mx-auto h-full w-full object-contain"
      />
    </div>
    <figcaption className="mt-3 text-center text-sm text-gray-600">
      Caption describing the key finding.
    </figcaption>
  </div>
</figure>

<!-- QUESTION 1 -->
<CaseQuestion
  pollId="case-{slug}-q1"
  title="Question 1"
  prompt="Question text here?"
  options={[
    {
      id: "A",
      label: "Option A text",
      feedback:
        "Detailed feedback explaining why this is correct or incorrect.",
    },
    {
      id: "B",
      label: "Correct option text",
      correct: true,
      feedback:
        "Detailed feedback explaining why this is the correct answer.",
    },
    {
      id: "C",
      label: "Option C text",
      feedback: "Detailed feedback.",
    },
    {
      id: "D",
      label: "Option D text",
      feedback: "Detailed feedback.",
    },
    {
      id: "E",
      label: "Option E text",
      feedback: "Detailed feedback.",
    },
  ]}
/>

<!-- SEPARATOR -->
<div className="my-6" />
<hr className="border-gray-200" />
<div className="my-6" />

<!-- QUESTION 2 -->
<CaseQuestion
  pollId="case-{slug}-q2"
  title="Question 2"
  prompt="Question text?"
  options={[
    { id: "A", label: "...", feedback: "..." },
    { id: "B", label: "...", correct: true, feedback: "..." },
    { id: "C", label: "...", feedback: "..." },
    { id: "D", label: "...", feedback: "..." },
    { id: "E", label: "...", feedback: "..." },
  ]}
/>

<!-- SEPARATOR -->
<div className="my-6" />
<hr className="border-gray-200" />
<div className="my-6" />

<!-- QUESTION 3 (if applicable) -->
<CaseQuestion
  pollId="case-{slug}-q3"
  title="Question 3"
  prompt="Question text?"
  options={[
    { id: "A", label: "...", feedback: "..." },
    { id: "B", label: "...", correct: true, feedback: "..." },
    { id: "C", label: "...", feedback: "..." },
    { id: "D", label: "...", feedback: "..." },
    { id: "E", label: "...", feedback: "..." },
  ]}
/>

<!-- SEPARATOR -->
<div className="my-6" />
<hr className="border-gray-200" />
<div className="my-6" />

<!-- RATIONALE (gated behind last question) -->
<CaseReveal pollId="case-{slug}-q3">
<h2 className="text-2xl font-bold text-gray-900 mb-6">
  Rationale
</h2>

<div className="mx-auto max-w-5xl">
  <p className="text-lg leading-6 text-gray-800 mb-6 text-justify">
    [Rationale paragraph 1 — pathophysiology and organism background]
  </p>
  <p className="text-lg leading-6 text-gray-800 mb-6 text-justify">
    [Rationale paragraph 2 — clinical presentation and key features]
  </p>
  <p className="text-lg leading-6 text-gray-800 mb-6 text-justify">
    [Rationale paragraph 3 — diagnostic approach]
  </p>
  <p className="text-lg leading-6 text-gray-800 mb-6 text-justify">
    [Rationale paragraph 4 — treatment and management]
  </p>
</div>

<div className="my-12" />
<hr className="border-gray-200" />
<div className="my-12" />
</CaseReveal>

<!-- TEACHING POINTS (gated behind same last question) -->
<CaseReveal pollId="case-{slug}-q3">
<h2 className="text-2xl font-bold text-gray-900 mb-6">
  Teaching Points
</h2>

<div className="mx-auto max-w-5xl">
  <ul className="list-disc pl-6 text-lg leading-7 text-gray-800 space-y-2">
    <li>Teaching point 1</li>
    <li>Teaching point 2</li>
    <li>Teaching point 3</li>
    <li>Teaching point 4</li>
    <li>Teaching point 5</li>
  </ul>
</div>

<div className="my-12" />
<hr className="border-gray-200" />
<div className="my-12" />
</CaseReveal>

<!-- REFERENCES (always visible) -->
<h2 className="text-2xl font-bold text-gray-900 mb-6">
  References
</h2>

<div className="mx-auto max-w-5xl space-y-10">
  <div>
    <p className="text-lg leading-6 text-gray-800 text-justify">
      Author1, Author2. Title. <em>Journal</em>. Year;Volume(Issue):Pages.
    </p>
    <p className="mt-3">
      <a
        href="https://doi.org/10.XXXX/..."
        target="_blank"
        rel="noreferrer"
        className="text-sm font-semibold text-blue-600 hover:underline"
      >
        DOI: 10.XXXX/...
      </a>
    </p>
  </div>

  <!-- Repeat for each reference -->
</div>

<!-- TRAILING SPACER -->
<div className="my-12" />
<hr className="border-gray-200" />
<div className="my-12" />
```

---

## 2. Registry Entry

File: `lib/cases/registry.ts`

Add to the `CASES` array **before** the closing `].filter((c) => c.enable !== false);`:

```typescript
  {
    title: "Case Title Here",
    slug: "slug-name",
    description: "One-line card blurb.",
    enable: true,
    ogImage: "/cases/slug-name/image.png",
    teaser: "2-3 sentence clinical hook with demographic, key findings, and a closing question for Instagram.",
    tags: {
      organisms: ["Organism full name"],
      syndromes: ["Category 1", "Category 2"],
      concepts: ["Concept 1", "Concept 2", "Key finding", "Treatment name"]
    },
  },
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | URL segment, matches directory name under `app/cases/` |
| `title` | Yes | h1 title, displayed on case page |
| `description` | No | Short card blurb for directory listing |
| `subtitle` | No | Optional subtitle |
| `enable` | No | Set to `false` to hide (draft mode) |
| `ogImage` | No | Path to image in `public/` for OG and Instagram cards |
| `teaser` | No | 2-3 sentence hook for Instagram teaser card |
| `tags.organisms` | No | Array of organism names |
| `tags.syndromes` | No | Array of syndrome categories |
| `tags.concepts` | No | Array of key concepts/keywords |

### Common Syndromes (from existing cases)

- Neuroinfection
- Skin & Soft Tissue
- Pulmonary Infection
- Sepsis & Bacteremia
- Endocarditis
- Meningitis
- Transplant & Immunocompromised
- Travel Medicine
- Parasitology
- Mycology
- Mycobacterial
- Vector-Borne
- Zoonotic
- GI & Diarrheal
- Ophthalmology
- Dermatology
- HIV/AIDS
- Tropical & Neglected Disease
- Opportunistic Infection
- Cardiovascular
- ENT
- Fever of Unknown Origin
- Hematology
- Urinary Tract Infection

---

## 3. Date Entry

File: `lib/cases/dates.ts`

Add before the closing `};` of `CASE_DATES`:

```typescript
  "slug-name": {
    publishedAt: "2026-MM-DDT08:00:00-07:00",
    modifiedAt: "2026-MM-DDT08:00:00-07:00",
  },
```

Use Pacific time offset (`-07:00`). Today's date for new cases.

---

## 4. Question Writing Guidelines

### Format

- **5 options** (A through E)
- **Exactly one correct** answer (`correct: true`)
- **Detailed feedback** for every option (2-5 sentences)
- Feedback should explain *why* the answer is correct or *why* it's wrong and what the key distinction is

### Typical Question Pattern (3-question case)

| Question | Topic | Focus |
|----------|-------|-------|
| Q1 | Diagnosis | Differential diagnosis — which condition best explains the clinical picture? |
| Q2 | Diagnostic Testing | Best next test or confirmatory approach, including pitfalls |
| Q3 | Treatment | Management decision — mainstay therapy, common errors |

### Question Quality Checklist

- [ ] Each distractor is a plausible real-world answer (not obviously wrong)
- [ ] Feedback for wrong answers explains *why* specifically — the learning moment
- [ ] Feedback for the correct answer is the longest and most educational
- [ ] No two options are so similar they could both be correct
- [ ] The question tests clinical reasoning, not just recall

---

## 5. Image Conventions

### Directory

```
public/cases/{slug}/
```

### Naming

- Use descriptive lowercase names: `mri.png`, `ct-chest.jpg`, `gram-stain.png`
- For MRI: `mri.png` is the standard name
- Supported formats: PNG, JPG, WEBP

### Figure Markup

Single image:
```mdx
<figure className="my-12">
  <div className="mx-auto max-w-xl">
    <div className="flex h-[380px] items-center justify-center rounded-lg border border-gray-300 bg-white p-2">
      <Image src="/cases/{slug}/mri.png" alt="..." width={800} height={600}
        className="rounded-lg mx-auto h-full w-full object-contain" />
    </div>
    <figcaption className="mt-3 text-center text-sm text-gray-600">
      MRI brain, FLAIR sequence: [key finding description].
    </figcaption>
  </div>
</figure>
```

The `ogImage` in the registry must match the `src` path: `/cases/{slug}/mri.png`

---

## 6. Instagram Card Export

### Prerequisites

- Dev server running: `npm run dev` (localhost:3000)
- Case must have `ogImage` and `teaser` in registry
- Images must exist in `public/cases/{slug}/`

### Export Command

```bash
npm run export:social -- case {slug}
```

### Cards Generated (6 total)

| File | Size | Content |
|------|------|---------|
| `hook.png` | 1080x1080 | MRI image + case title + syndrome kicker |
| `teaser.png` | 1080x1080 | "NEW CASE" header + first paragraph + first question |
| `story.png` | 1080x1920 | Full vignette + "WHAT'S THE DIAGNOSIS?" box |
| `teaching.png` | 1080x1080 | Up to 4 teaching point bullets |
| `cta.png` | 1080x1080 | "Work through the full interactive case" + URL |
| `og.png` | 1200x630 | OG link preview for Twitter/Facebook |

### Output

Cards save to Google Drive at `Media/Instagram/{slug}/` (mirrored in `Media/OG/{slug}/`).

---

## 7. Style Conventions

### Paragraphs
- Use `text-justify` alignment
- Use `text-lg leading-6 text-gray-800 mb-6` classes
- Wrap in `<div className="mx-auto max-w-5xl">`

### Headings
- h1: `text-5xl font-extrabold tracking-tight text-gray-900 my-8`
- h2: `text-2xl font-bold text-gray-900 mb-6`

### Separators
Between questions and sections:
```mdx
<div className="my-6" />
<hr className="border-gray-200" />
<div className="my-6" />
```

### References
- Format: `Author et al. Title. *Journal*. Year;Volume(Issue):Pages.`
- Include DOI link: `https://doi.org/...`
- Use `text-blue-600 hover:underline` for links
- Wrap in `<div className="mx-auto max-w-5xl space-y-10">`

### CaseReveal
- The `pollId` must match the preceding question's `pollId`
- Typically gated behind the **last** question (Q2 or Q3)
- Both Rationale and Teaching Points use the same `pollId`

---

## 8. Publishing Checklist

Before marking a case complete:

1. [ ] MDX file created at `app/cases/{slug}/page.mdx`
2. [ ] Registry entry added to `lib/cases/registry.ts` with `enable: true`
3. [ ] Date entry added to `lib/cases/dates.ts`
4. [ ] Images uploaded to `public/cases/{slug}/`
5. [ ] `ogImage` path matches actual image path
6. [ ] `teaser` written (2-3 sentences, includes closing question)
7. [ ] Build compiles: `npm run build` or check dev server
8. [ ] Instagram cards exported: `npm run export:social -- case {slug}`
9. [ ] Research sources saved to `sources/` directory

---

## 9. Research Sources

Save research materials to `sources/` with naming convention:

```
sources/research_YYYYMMDD_topic.md
sources/pubmed_YYYYMMDD_topic.json
```

These are reference-only files; not deployed or served.
