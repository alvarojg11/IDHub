# IDHub — Project Reference

## What is IDHub?

**InfectiousDiseaseHub** (infectiousdiseasehub.com) is a medical education platform focused on Infectious Diseases. Built by **Alvaro Ayala, MD** (ID Fellow at Stanford University).

**Mission:** Make ID clinical reasoning more accessible to clinicians, learners, and care teams through structured content, interactive tools, and cases.

---

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, CSS Modules
- **Content:** MDX (blog posts and cases as files)
- **Email:** Resend (subscriptions + contact form)
- **DB:** Postgres/Neon (subscribers, comments) with local JSON fallback

---

## Site Structure (`/app`)

| Route | Purpose |
|---|---|
| `/` | Home — hero, featured tools, library grid |
| `/about` | About the author / mission |
| `/blog` | Teaching essays (MDX files per post) |
| `/cases` | Case-based learning modules |
| `/assistant` | IDAssistant (AI clinical reasoning) |
| `/probid` | ProbID tool — pretest probability framing |
| `/mechid` | MechID — resistance mechanism interpretation |
| `/tools/immunoid` | ImmunoID — immunosuppression & infection risk |
| `/tools/doseid` | DoseID — antimicrobial dosing support |
| `/research` | Research collaborations |
| `/recommended-projects` | Curated ID education resources |
| `/contact` | Feedback & collaboration form |
| `/subscribe` | Email subscription signup |
| `/admin` | Admin: subscriptions, comments moderation |

---

## Content

### Cases (`/app/cases/`)
30+ case modules covering: actinomycosis, aerococcus, blastomycosis, brucella endocarditis, Carrión's disease, CGD/CGATTI, CMV, coccidioidomycosis, dengue, erythrasma, giardiasis, gnathostomiasis, HAM/TSP, HIV on hemodialysis, HZO, LBRF, listeria rhombencephalitis, lobomycosis, louse-borne relapsing fever, M. bovis, nocardia brasiliensis, paragonimiasis, parvovirus, pneumococcemia/myeloma, Powassan, rhinoscleroma, SANCC, shigellosis, spirochetosis, S. suis, strongyloides hyperinfection, talaromyces, tetanus, trachoma, tungiasis, urogenital schistosomiasis.

### Blog (`/app/blog/`)
~15 posts: Bartonella, BDG in ICU, Viridans streptococci, echo in endocarditis, helminths, gentamicin in IE, antibiotic efflux, horseshoe crab, Streptomyces, TB prevention, CMV resistance, etc.

---

## Key Components (`/components`)

- `CaseReveal.tsx` — progressive case disclosure
- `CaseNavAuto.tsx` — case navigation
- `ProbIDTool.tsx` — probability tool UI
- `DoseIDTool.tsx` — dosing tool UI
- `ImmunoTool.tsx` — immunosuppression tool UI
- `LRWorkbench.tsx` / `FaganChart.tsx` — likelihood ratio workbench + Fagan nomogram
- `EvidenceDrawer.tsx` — evidence panel
- `BlogComments.tsx` / `CommentsAdminPanel.tsx` — comment system
- `SubscribeForm.tsx` / `SubscriptionsAdminPanel.tsx` — email subscriptions
- `ContactForm.tsx` — contact page

---

## Email / Notifications

- Subscription flow: `/subscribe`, `/subscribe/unsubscribe`
- Notify endpoint: `POST /api/subscriptions/notify` (requires `SUBSCRIPTIONS_NOTIFY_SECRET`)
- Triggers on new cases or blog posts
- Admin UI at `/admin/subscriptions`

---

## Priorities / Work Areas

> Update this section as tasks are agreed upon.

- [ ] TBD — add specific features/bugs here as they come up
