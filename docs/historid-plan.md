# HistorID Plan

## Purpose

`HistorID` is a dedicated IDHub section for short, image-led historical teaching briefs related to Infectious Diseases.

Positioning:

- `HistorID`
- `The history behind infectious diseases`

Primary audience:

- clinicians
- trainees

Core editorial idea:

- short historical facts that are medically grounded
- strong enough for the website
- easy to adapt into Instagram and social cards

## Product Decisions

- HistorID is its own top-level section, not part of `Blog` or `Cases`.
- No subscription or email integration in v1.
- No comments in v1.
- Each entry has one required hero image.
- Additional images can be added inline inside the MDX file when useful.
- Prefer public-domain historical images whenever possible.
- Prefer direct institutional or archival image sources when possible: Library of Congress, CDC, NIH/NIAID, NLM, Wellcome Collection, National Archives, museum collections.
- Wikimedia Commons is acceptable as a fallback or discovery layer, but HistorID should not depend on Wikipedia article pages as the preferred image source.

## Current Implementation

Routes:

- `/historid`
- `/historid/<slug>`

Key files:

- `app/historid/page.tsx`
- `components/HistorIDShell.tsx`
- `lib/historid/registry.ts`
- `lib/historid/seo.ts`
- `app/api/og/historid/[slug]/route.tsx`
- `app/api/ig/historid/[slug]/route.tsx`
- `app/api/ig/historid/[slug]/teaser/route.tsx`
- `app/api/ig/historid/[slug]/story/route.tsx`

Site integration:

- top nav entry in `app/layout.tsx`
- homepage library entry in `app/page.tsx`
- sitemap support in `app/sitemap.ts`

## Content Model

Each HistorID entry exports a `fact` object from its MDX file.

```ts
type HistorIDMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  historicalDateLabel: string;
  historicalYearSort?: number;
  categories: HistorIDCategory[];
  tags: string[];
  hook: string;
  takeaway: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageCredit?: string;
  heroImageSourceUrl?: string;
  heroImageLicense?: string;
  socialHeadline?: string;
  socialDek?: string;
  socialFacts?: string[];
  hookImageFit?: "cover" | "contain";
  featured?: boolean;
};
```

Supported categories:

- `organisms`
- `antibiotics`
- `wars-outbreaks`
- `people-illness`
- `diagnostics-vaccines`

## Entry Structure

Recommended section order for each brief:

1. Hook
2. Historical Scene
3. What Happened
4. Why It Changed Infectious Diseases
5. Why It Still Matters Now
6. References

Reference formatting standard:

- every HistorID reference should include a second line with a clickable DOI or direct source URL
- prefer DOI links for journal articles when available
- when no DOI exists, include a stable direct URL to the publisher, archive, library, guideline, or institutional source
- for books without DOI, include a publisher, archive, library, or Google Books/Open Library link rather than leaving the citation unlinked
- avoid placeholder references without an outbound link

The shell already displays:

- HistorID label
- title
- publication date
- historical date label
- category chips
- hero image
- image credit / source / license
- article body

## Image Rules

Hero image path convention:

- `public/historid/<slug>/hero.jpg`

Supported alternatives for the publish workflow:

- `public/historid/<slug>/hero.jpeg`
- `public/historid/<slug>/hero.png`
- `public/historid/<slug>/hero.webp`

Optional supporting image convention:

- `public/historid/<slug>/figure-1.jpg`
- `public/historid/<slug>/figure-2.jpg`

Current expectation:

- `hero.jpg` is required for each HistorID entry
- the same hero image powers the page, card grid, OG image, and Instagram assets
- extra images are optional and should be placed directly in the MDX body

Source metadata expectation:

- `heroImageSourceUrl` should point to the original archive, museum, library, agency, or institutional record page whenever possible
- if an image is first discovered on Wikimedia Commons, treat Commons as a discovery layer and replace `heroImageSourceUrl` with the underlying institutional source before publishing when that source can be verified
- if no reliable direct source can be verified, Wikimedia Commons is an acceptable fallback, but it should be treated as temporary rather than preferred

Preferred source hierarchy:

- Library of Congress
- CDC / PHIL / CDC Museum
- NIH / NIAID / NLM / PubChem
- Wellcome Collection
- National Archives
- museum and university digital collections
- Wikimedia Commons only as fallback

License metadata expectation:

- `heroImageLicense` should match the source actually being cited, not the discovery layer used to find it
- when the source URL is updated from Commons to a direct institutional record, update the credit and license text if needed so they stay accurate

## Social Asset Workflow

HistorID assets are generated from app routes and exported into the local Google Drive sync folder.

Export command:

```bash
npm run export:social -- historid <slug>
```

One-step HistorID publish export:

```bash
npm run publish:historid -- <slug>
```

What `publish:historid` does:

- verifies `app/historid/<slug>/page.mdx` exists
- verifies `public/historid/<slug>/hero.jpg` exists
- checks the page route
- checks the OG route
- checks the Instagram routes
- exports generated files into Google Drive

Default Drive root:

- `/Users/alvaroayala/Library/CloudStorage/GoogleDrive-alvaro.ayala@infectiousdiseasehub.com/My Drive/Media`

HistorID export destinations:

- Instagram: `Media/Instagram/HistorID/<slug>/`
- OG: `Media/OG/HistorID/<slug>/`

HistorID exported files:

- `hook.png`
- `teaching.png`
- `cta.png`
- `story.png`
- `og.png`

Recommended HistorID carousel order:

1. `hook.png` — hero image with the title and engaging line below it
2. `teaching.png` — 4 to 5 fun facts that make the story memorable
3. `cta.png` — read the full brief on IDHub

Optional vertical asset:

- `story.png`

Hook image treatment:

- default `hook.png` hero treatment is `cover`
- use `hookImageFit: "contain"` for portrait paintings, posters, engravings, or any art where cropping removes the important historical content
- keep `cover` for wider photos or images that benefit from a tighter, more cinematic crop

Notes:

- the local app must be running when export commands are used
- default base URL is `http://localhost:3000`

## Current Pilot

Published pilot entry:

- `pasteurs-rabies-gamble`

Files:

- `app/historid/pasteurs-rabies-gamble/page.mdx`
- `public/historid/pasteurs-rabies-gamble/hero.jpg`

Status:

- page built
- hero image added
- OG route works
- Instagram routes work
- Drive export verified

## Planned Pilot Topics

Next recommended entries:

- `the-medical-student-who-became-the-experiment`
- `the-hotel-outbreak-that-named-a-pathogen`
- `the-mold-that-went-to-war`

Additional launch candidates:

- `the-map-that-rewired-epidemiology`
- `the-doctor-who-was-right-too-early`
- `the-soil-that-changed-tuberculosis`
- `the-five-cases-that-changed-medicine`
- `typhus-lice-and-the-collapse-of-armies`
- `the-campaign-that-cornered-smallpox`

## Workflow For New HistorID Entries

1. Choose the topic and slug.
2. Draft the `fact` metadata object.
3. Write the first draft using the `historid-writer` skill standard.
4. Run a cleanup pass using the `humanizer` skill standard.
5. Add `hero.jpg` under `public/historid/<slug>/`.
   Accepted alternatives: `hero.jpeg`, `hero.png`, `hero.webp`.
6. Write or revise the MDX brief with the final copy.
7. Review page rendering locally.
8. Run `npm run publish:historid -- <slug>`.
9. Review exported IG and OG assets in Google Drive.

This order should be treated as the default HistorID writing workflow in future sessions:

1. `historid-writer`
2. `humanizer`
3. local render review
4. `publish:historid`

## Open Future Enhancements

- add more HistorID entries
- refine Instagram visual style after reviewing multiple live exports
- add category filtering on `/historid`
- consider a structured supporting-images array if many entries need multi-image layouts
- consider a `publish:case` wrapper matching `publish:historid`
