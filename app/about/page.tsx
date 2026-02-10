export default function AboutPage() {
  return (
    <main className="py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 text-justify">
          About IDHub
        </h1>

        <p className="mt-6 text-lg text-gray-700 text-justify">
          IDHub is an educational space built around one idea: infectious diseases
          are best learned—and relearned—through careful clinical reasoning.
        </p>

        <p className="mt-4 text-lg text-gray-700 text-justify">
          Rather than presenting rigid algorithms or definitive answers, IDHub
          focuses on the process of thinking through clinical problems: weighing
          probabilities, interpreting imperfect data, and navigating the gray
          zones that define real-world infectious diseases practice.
        </p>

        <p className="mt-4 text-lg text-gray-700 text-justify">
          The site brings together problem-solving clinical cases, reflective
          writing, and practical tools designed for physicians and trainees who
          want to continually sharpen how they think about syndromes, pathogens,
          diagnostics, and antimicrobial therapy.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900 text-justify">
          Why case-based learning?
        </h2>

        <p className="mt-4 text-lg text-gray-700 text-justify">
          Infectious diseases is rich with unexpected and often fascinating 
          diagnoses. IDHub uses clinical cases to surface these moments—whether common 
          syndromes with uncommon causes or rare entities hiding behind familiar presentations. 
          The goal is not to test knowledge, but to repeatedly expose learners to the kinds 
          of cases that sharpen diagnostic instincts and make infectious diseases so 
          compelling to practice.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900 text-justify">
          Who is this for?
        </h2>

        <p className="mt-4 text-lg text-gray-700 text-justify">
          IDHub is primarily intended for infectious diseases fellows, trainees,
          and practicing clinicians. That said, anyone interested in how
          infectious diseases are approached at the bedside—from diagnostics to
          management—may find value here.
        </p>
        <h2 className="mt-10 text-2xl font-bold text-gray-900 text-justify">
          Clinical tools
        </h2>

        <p className="mt-4 text-lg text-gray-700 text-justify">
          In addition to cases and written reflections, IDHub includes practical tools
          designed to support day-to-day learning in infectious diseases. These tools
          are not meant to replace reference texts or institutional guidelines, but to
          complement them by reinforcing clinical reasoning.
        </p>

        <p className="mt-4 text-lg text-gray-700 text-justify">
          One example is <strong>MechID</strong>, an interactive tool focused on
          antimicrobial mechanisms and resistance patterns. It is designed to help
          clinicians and trainees think through how organisms behave, how antibiotics
          work, and how resistance emerges—concepts that are often understood best when
          revisited repeatedly in different clinical contexts.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900 text-justify">
          A note on scope
        </h2>

        <p className="mt-4 text-lg text-gray-700 text-justify">
          This project does not aim to provide definitive guidance, replace
          clinical judgment, or offer medical advice. The content reflects
          individual interpretation, experience, and evolving evidence. Clinical
          decisions should always be made in the context of local guidelines,
          expert consultation, and patient-specific factors.
        </p>

        <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
          Educational content only. Not medical advice. Always use clinical
          judgment and local guidance.
        </div>
      </div>
    </main>
  );
}
