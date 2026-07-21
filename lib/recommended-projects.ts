export type RecommendedProject = {
  name: string;
  href: string;
  logoSrc: string;
  logoAlt: string;
  tagline: string;
  desc: string;
  whyItFits: string;
  podcastQuestion?: string;
  podcastDesc?: string;
};

export const RECOMMENDED_PROJECTS: RecommendedProject[] = [
  {
    name: "The Host Response",
    href: "https://www.firstcallid.ca/",
    logoSrc: "/recommended-projects/firstcallid-logo.png",
    logoAlt: "FirstCallID logo",
    tagline: "A practical Infectious Diseases podcast",
    desc: "The Host Response is a clinically focused, practical podcast built for learners who want high-yield Infectious Diseases teaching in a clear and approachable format. Hosted by Dr. Paul Bunce, whose soothing voice makes it an especially inviting listen, it is also a thoughtful space for reflecting on what it means to work in Infectious Diseases.",
    whyItFits:
      "We share a similar perspective on medical education: learning should be practical, grounded in clinical reasoning, and honest about the fact that much of Infectious Diseases requires living with uncertainty.",
    podcastQuestion: "Rotating in ID? Start with FirstCallID.",
    podcastDesc:
      "Beyond the podcast, FirstCallID is a practical Infectious Diseases education resource that helps students, residents, and early trainees build a strong starting framework for common ID questions and bedside learning. It is a strong place to start if you want concise review and useful clinical pearls before or during an ID rotation.",
  },
  {
    name: "SIGIT",
    href: "https://sigit.uniandes.edu.co/",
    logoSrc: "/recommended-projects/sigit-logo.png",
    logoAlt: "SIGIT logo",
    tagline:
      "Public Health and Tropical Medicine Research from Universidad de los Andes, Colombia",
    desc: "SIGIT is an interdisciplinary research group at Universidad de los Andes focused on health systems, childhood, gender, interculturality, and tropical health. Their work connects applied research, education, and community action, with a strong emphasis on equity and improving health outcomes in vulnerable communities across Colombia.",
    whyItFits:
      "Its work is notable for its interdisciplinary academic approach, linking population health research, implementation, and medical education to the study of tropical diseases and health inequities.",
  },
];
