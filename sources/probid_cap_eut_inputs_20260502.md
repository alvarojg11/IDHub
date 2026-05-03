# ProbID CAP EUT Inputs

Date: 2026-05-02

Purpose: tighten the first CAP expected-utility treatment model in ProbID using published data where available.

## Summary

Direct bedside utility weights for adult community-acquired pneumonia are sparse. The most usable published evidence for a practical v1 model comes from:

- functional and health-related quality-of-life impairment during CAP hospitalization
- early clinical response in modern adult CABP antibiotic trials
- outpatient CAP antibiotic adverse-event data from randomized trials and systematic reviews

For that reason, the CAP utility terms in `lib/probidExpectedUtility.ts` remain structured estimates, but they are now anchored more explicitly to published disease-burden and adverse-event data rather than syndrome-level heuristic harms.

## Disease-side evidence

### 0. Adult CAP cost-utility literature exists, but the reusable bedside state utilities are not fully exposed in accessible text

Edwards SJ, Wordsworth S, Clarke MJ. Treating pneumonia in critical care in the United Kingdom following failure of initial antibiotic: a cost-utility analysis comparing meropenem with piperacillin/tazobactam. Eur J Health Econ. 2012;13(2):181-192. DOI: `10.1007/s10198-011-0296-0`

Key extract from abstract:

- severe pneumonia in UK critical care
- lifetime Markov model
- `4.768` QALYs with meropenem vs `4.654` with piperacillin/tazobactam
- utility weights were obtained from published sources

What is useful:

- confirms that adult pneumonia has been modeled with QALYs and EQ-5D-linked utility methods
- confirms utility differences are clinically meaningful enough to move lifetime QALYs

What is still missing:

- the accessible abstract and publisher preview do **not** expose the exact acute health-state utility values used in the Markov states

Important methodological clue from the visible reference list:

- the paper cites `UK Population norms for EQ-5D` (Kind et al.)
- it cites ICU survivor quality-of-life literature
- it cites the `Ara and Brazier` SF-36 to EQ-5D mapping paper

Interpretation:

- the adult CAP CUA appears to derive utility from published generic QoL sources and critical-care outcome literature rather than from directly measured CAP-specific EQ-5D states
- this supports the approach used in ProbID v1: use transparent structured estimates when direct CAP bedside utilities are unavailable

### 1. Hospitalized CAP causes meaningful short-term functional and HRQoL impairment

Jose A, Corso SD. Patients hospitalized for community-acquired pneumonia present reduced functional performance. Braz J Phys Ther. 2013;17(4):351-358. DOI: `10.1590/S1413-35552013005000098`

Key extract:

- CAP inpatients had worse health-related quality of life than controls during hospitalization.
- 6-minute walk distance: `381.3 +/- 108 m` vs controls `587.1 +/- 86.8 m`
- Functional limitations correlated with length of stay and dyspnea.

Use in model:

- Supports a real utility gap between treated CAP and untreated/delayed CAP.
- Supports keeping `U(no treat, CAP)` meaningfully lower than `U(treat, CAP)`.

### 2. Prompt treatment in modern adult CABP trials yields early symptom improvement by 72-120 hours

Stets R, et al. Omadacycline for Community-Acquired Bacterial Pneumonia. N Engl J Med. 2019;380(6):517-527. DOI: `10.1056/NEJMoa1800201`

Key extract:

- Early clinical response at 72-120 h: `81.1%` with omadacycline vs `82.7%` with moxifloxacin.
- Clinical response at post-treatment evaluation: `87.6%` vs `85.1%`.

File TM Jr, et al. Omadacycline versus moxifloxacin for community-acquired bacterial pneumonia (OPTIC-2). EClinicalMedicine. 2025;90:103656. DOI: `10.1016/j.eclinm.2025.103656`

Key extract:

- Early clinical response: `89.6%` vs `87.7%`.
- Post-therapy evaluation response: `86.0%` vs `87.7%`.

Use in model:

- Supports a relatively high `U(treat, CAP)` over a short acute horizon.
- Supports the assumption that empiric treatment meaningfully shortens the period of dyspnea/symptom burden for true CAP.

## Treatment-harm evidence

### 3. Modern CABP regimens have mostly mild adverse-event profiles, dominated by GI effects

Stets R, et al. N Engl J Med. 2019. DOI: `10.1056/NEJMoa1800201`

Key extract:

- Treatment-emergent adverse events: `41.1%` omadacycline vs `48.5%` moxifloxacin
- Gastrointestinal adverse events: `10.2%` vs `18.0%`
- Diarrhea: `1.0%` vs `8.0%`

File TM Jr, et al. EClinicalMedicine. 2025. DOI: `10.1016/j.eclinm.2025.103656`

Key extract:

- Most common TEAEs >=2% were low-frequency
- Diarrhea: `0%` omadacycline vs `3.0%` moxifloxacin
- Headache: `3.6%` vs `4.5%`

Use in model:

- Supports only a modest decrement for `U(treat, no CAP)`.
- Supports using GI toxicity as the main driver of unnecessary-treatment burden in CAP v1.

### 4. Older outpatient CAP evidence also suggests similar efficacy across regimens, with adverse-event differences mainly in GI burden

Pakhale S, et al. Antibiotics for community-acquired pneumonia in adult outpatients. Cochrane Database Syst Rev. 2014;CD002109. DOI: `10.1002/14651858.CD002109.pub4`

Key extract:

- No major efficacy differences across outpatient antibiotic comparisons.
- High-dose amoxicillin had more gastritis/diarrhea than clarithromycin, azithromycin, and levofloxacin.
- Some regimens showed significantly more nervous-system or GI adverse effects than comparators.

Choi SH, et al. Efficacy of Doxycycline for Mild-to-Moderate Community-Acquired Pneumonia in Adults. Clin Infect Dis. 2023;76(4):683-691. DOI: `10.1093/cid/ciac615`

Key extract:

- Doxycycline efficacy was comparable to macrolides or fluoroquinolones.
- Adverse-event rates were comparable between groups.

Use in model:

- Supports using small treatment-harm penalties for non-severe outpatient CAP.
- Supports the idea that side-effect sensitivity and prior CDI risk should move the threshold more than regimen efficacy differences in mild CAP.

## CAP utility choices used in v1

These are still structured estimates, not directly published EQ-5D values:

- `U(treat, CAP) = 0.972`
- `U(no treat, CAP) = 0.918`
- `U(treat, no CAP) = 0.993`
- `U(no treat, no CAP) = 1.000`

Interpretation:

- The treatment penalty for unnecessary antibiotics remains intentionally small, because trial data suggest most harms are transient and non-serious.
- The true-CAP untreated state remains materially worse than the treated state because hospitalized CAP is associated with reduced function and worse HRQoL, and modern trials show substantial early clinical improvement under treatment.
- The only clearly identified adult CAP cost-utility model was ICU/severe-pneumonia focused and did not expose bedside state utilities in accessible text, so it supports the existence of utility-based pneumonia modeling but does not provide plug-and-play values for outpatient CAP.

## Limitations

- We did not identify a strong adult CAP paper reporting directly reusable bedside utility weights for all four CAP outcome states.
- The best adult CAP cost-utility paper we identified modeled severe pneumonia in critical care and reported lifetime QALYs, but not the exact acute state-level utilities in accessible abstract/preview text.
- Published CAP economic reviews confirm heterogeneity of outcome measures, which limits direct portability of utility values into a compact bedside tool.
- Current CAP values should therefore be described as evidence-anchored structured estimates rather than validated patient-derived utilities.

## Immediate next improvement

If we want to tighten CAP further, the best next step is to review full texts of adult CAP cost-effectiveness studies identified in the systematic review by Sultana et al. to extract any explicit QALY or utility assumptions used in those models.
