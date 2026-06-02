/**
 * Homepage people-first SEO blocks. Visible copy must match FAQPage schema in sync-home-seo.js.
 */

export const HOME_LEARN = {
  howItWorks: {
    title: "How it works",
    paragraphs: [
      "Enter your gross monthly salary and pick the city you are paid in today. We compare that paycheck to 100+ destinations using Numbeo cost-of-living indices (excluding rent).",
      "For each city you see a spending-power equivalent in your home currency — the monthly pay that would buy a similar basket of goods there — plus a simple vs-home label (better, similar, or tougher than home).",
    ],
    link: { href: "how-it-works.html", label: "Full walkthrough of the calculator" },
  },
  methodology: {
    title: "Methodology",
    paragraphs: [
      "We divide your home city’s cost index by each destination’s index, then multiply your salary to get an equivalent figure. Local average rows compare you to approximate gross pay in that city using public salary benchmarks and FX — useful context, not a job-market survey.",
    ],
    link: { href: "methodology.html", label: "Formulas, data sources, and limitations" },
  },
  whenUseful: {
    title: "When this helps",
    items: [
      "Remote job offers in a new country",
      "Shortlisting cities before a move",
      "Explaining why the same number feels different abroad",
    ],
  },
};

/** Subset shown on homepage; text must match FAQPage JSON-LD exactly. */
export const HOME_FAQ = [
  {
    id: "equivalent-salary",
    question: "What does equivalent salary mean?",
    answer:
      "The monthly pay you would need in another city to afford a similar standard of living to your salary at home, adjusted using Numbeo cost-of-living indices (excluding rent). Amounts stay in your home currency.",
  },
  {
    id: "vs-home",
    question: 'What do "better than home" and "worse than home" mean?',
    answer:
      "They describe purchasing power versus your selected home city: better when the equivalent is at least 1.55× your pay, similar between 0.75× and 1.55×, and tougher at 0.75× or below. Directional labels only — not personal finance advice.",
  },
  {
    id: "local-average",
    question: "How is local average different from vs home?",
    answer:
      "Vs home compares your spending power to your own city. Local average compares you to a typical gross monthly earner in the destination. You can feel worse than home but still above the local average, or the reverse.",
  },
  {
    id: "after-tax",
    question: "Is this after tax?",
    answer:
      "No. Enter gross monthly pay as you understand it. We do not model income tax, social contributions, benefits, or visa rules.",
  },
  {
    id: "data-source",
    question: "What data powers the comparisons?",
    answer:
      "Numbeo cost-of-living indices (excluding rent) plus approximate gross monthly salaries per city. Figures are refreshed manually — see our methodology page for the latest pass date and limits.",
  },
  {
    id: "rent",
    question: "Is rent included?",
    answer:
      "No. Housing can change how far your pay goes. The calculator uses Numbeo’s basket excluding rent; treat rent-heavy cities with extra caution.",
  },
];

export function homeFaqSchemaEntities() {
  return HOME_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));
}
