/**
 * Single source of truth for every piece of copy on the site.
 *
 * Editing this file is how you change the website — no component edits needed.
 * Everything here is drawn from Adedoyin Omolola's CV and portfolio brief.
 * Nothing is invented.
 */

/* -------------------------------------------------------------------------- */
/*  Identity                                                                   */
/* -------------------------------------------------------------------------- */

export const site = {
  name: "Adedoyin Omolola",
  firstName: "Doyin",
  nameWords: ["Adedoyin", "Omolola"],
  role: "Real Estate Paralegal",
  roleLong: "Real Estate Paralegal — Commercial Transactions",
  /** The red chip in the hero, followed by the `focus` chips */
  heroLabel: "Paralegal",
  focus: [
    "Real Estate",
    "Commercial Transactions",
    "Project & Stakeholder Management",
  ],
  motto: "Careful analysis, clear outcomes.",
  location: "Manchester, United Kingdom",
  photo: "/adedoyin-omolola.png",
  // Résumé download. Replace the file in ./public/ to update it, or set this
  // to "" to hide every download button on the site.
  cv: "/Adedoyin-Omolola-CV.pdf",
  url: "https://adedoyinomolola.com", // ← change once you buy a domain
  heroIntro: [
    "Real estate paralegal with 2+ years of experience turning complex, ambiguous instructions into clear, scalable processes that keep commercial transactions on track.",
    "I turn ambiguous problems into measurable results, combining legal analysis, AI, data and execution to deliver real estate and commercial transactions that create business impact.",
  ],
  metaDescription:
    "Adedoyin Omolola is a real estate paralegal in Manchester, UK, supporting commercial and residential property acquisitions, commercial contracts and due diligence. LLM (SQE1 & SQE2), BPP Law School; LLB (2:1), University of Sheffield.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const contact = {
  email: "omololaa226@gmail.com",
  linkedin: "https://www.linkedin.com/in/adedoyin-omolola-849805256/",
} as const;

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: "linkedin" | "mail";
};

const allSocials: SocialLink[] = [
  {
    label: "Email",
    handle: contact.email,
    href: `mailto:${contact.email}`,
    icon: "mail",
  },
  {
    label: "LinkedIn",
    handle: "in/adedoyin-omolola",
    href: contact.linkedin,
    icon: "linkedin",
  },
];

/** Any link left blank in `contact` above is dropped rather than rendered dead. */
export const socials: SocialLink[] = allSocials.filter(
  (social) => social.href.trim().length > 0,
);

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export const navLinks = [
  { number: "01", label: "About", href: "#about" },
  { number: "02", label: "Expertise", href: "#capabilities" },
  { number: "03", label: "Experience", href: "#experience" },
  { number: "05", label: "Education", href: "#education" },
  { number: "07", label: "Reviews", href: "#reviews" },
  { number: "08", label: "Contact", href: "#contact" },
] as const;

/** Every numbered section, in page order — drives the section counter. */
export const sectionIndex = [
  { number: "01", label: "About", id: "about" },
  { number: "02", label: "Expertise", id: "capabilities" },
  { number: "03", label: "Experience", id: "experience" },
  { number: "04", label: "In numbers", id: "metrics" },
  { number: "05", label: "Education", id: "education" },
  { number: "06", label: "Principles", id: "philosophy" },
  { number: "07", label: "Reviews", id: "reviews" },
  { number: "08", label: "Contact", id: "contact" },
] as const;

/* -------------------------------------------------------------------------- */
/*  About                                                                      */
/* -------------------------------------------------------------------------- */

export const about = {
  number: "01",
  eyebrow: "About",
  heading: "A deal is never just its headline terms.",
  paragraphs: [
    "I completed an LLM in Corporate Law at BPP University, with modules in private acquisitions, debt finance and commercial transactions. That training taught me how deals are structured and negotiated, how transaction documents are analysed and drafted, and how legal risk is allocated between parties. It also taught me that a deal is never just its headline terms. It is the gaps between documents, the risks nobody priced, and the deadlines that refuse to move.",
    "I have applied that learning in practice across both property and commercial work. On the property side, I have reviewed title documents and searches for commercial and residential purchases, prepared exchange and post-completion checklists, and drafted leases and property agreements. In-house, I supported legal counsel on supply agreements, service contracts and compliance across 10+ active contracts.",
    "At EMMA-TOB Technologies, I used Harvey to run first-pass reviews of supply contracts, focusing on change-of-control clauses and liability caps measured against defined risk thresholds. I treated the tool’s output as a starting point, not an answer. I checked every flagged clause against the source document, identified three points the tool had missed or misread, and escalated two material risks to the supervising solicitor in a prioritised report. That combination of efficiency and human verification is how I believe legal technology should be used.",
    "These experiences have shaped how I work. I am used to operating in high-pressure environments that demand tight deadlines, accurate record-keeping and strict confidentiality. I am comfortable analysing risk and communicating it clearly, and colleagues have come to rely on me as the person who steps in when things get difficult.",
  ],
  pullQuote:
    "I bring the same calm, careful approach to every matter, large or small.",
  facts: [
    { label: "Based in", value: "Manchester, United Kingdom" },
    { label: "Experience", value: "2+ years" },
    { label: "Degree", value: "LLM SQE1 & SQE2" },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Where I add value                                                          */
/* -------------------------------------------------------------------------- */

export type Capability = {
  title: string;
  description: string;
  /** Short heading above the list, e.g. "Tools" or "In practice" */
  pointsLabel: string;
  /** "chips" for short tool names, "list" for full sentences */
  pointsStyle: "chips" | "list";
  points: string[];
  icon: "tracker" | "property" | "research" | "commerce";
};

export const capabilities: Capability[] = [
  {
    title: "Project & Stakeholder Management",
    description:
      "Files tracked so anyone can see where they stand, and deadlines that hold when the pressure is on.",
    pointsLabel: "Tools",
    pointsStyle: "chips",
    points: ["InfoTrack", "HighQ", "Power BI", "Microsoft Project"],
    icon: "tracker",
  },
  {
    title: "Real Estate & Transactions",
    description:
      "Deals where the detail decides the outcome, checked, chased and closed without surprises.",
    pointsLabel: "In practice",
    pointsStyle: "list",
    points: [
      "Residential and commercial purchases supported from instruction to post-completion, mostly commercial, with 3+ matters worked on every week",
      "Property searches reviewed on every purchase, with issues flagged to the supervising solicitor before exchange",
      "Exchange and post-completion checklists prepared on each transaction, so nothing was missed after completion",
    ],
    icon: "property",
  },
  {
    title: "Legal Research Tools",
    description:
      "Research that is accurate, current, and cited by the right authority.",
    pointsLabel: "Tools",
    pointsStyle: "chips",
    points: ["Westlaw", "LexisNexis", "HeinOnline", "BAILII"],
    icon: "research",
  },
  {
    title: "Commercial Awareness",
    description:
      "Following the commercial pressures behind the legal work: what clients need, how deals are funded and what regulators expect.",
    pointsLabel: "In practice",
    pointsStyle: "list",
    points: [
      "Procurement: Reviewed how tender processes, contract terms and compliance requirements shape the deals clients enter into",
      "Supplier relationships: Reviewed supplier contracts for risk allocation, performance obligations and termination rights, flagging issues before signing",
      "Asset finance: Understood how equipment and property financing works, including security arrangements and lender protections",
      "Financial services: Track FCA developments and consider their impact on client advice, through regular reading of the Law Society Gazette and current affairs",
    ],
    icon: "commerce",
  },
];

/* -------------------------------------------------------------------------- */
/*  Experience                                                                 */
/* -------------------------------------------------------------------------- */

export type Role = {
  title: string;
  organisation: string;
  place?: string;
  period: string;
  /** Practice area, shown as a small-caps tag after the organisation */
  domain: string;
  summary: string;
  work: string[];
  skills: string[];
};

export const roles: Role[] = [
  {
    title: "Paralegal (Real Estate)",
    organisation: "Bukola & Co. Law Firm",
    period: "Jun 2021 – Sep 2022",
    domain: "Real Estate",
    summary:
      "Supported commercial and residential property acquisitions from title review through to post-completion, catching gaps before they reached the supervising solicitor.",
    work: [
      "Reviewed 30+ title documents and property searches across at least 3 live commercial and residential acquisitions each week, identifying discrepancies, missing information and documentation gaps before solicitor review to support due diligence.",
      "Prepared exchange and post-completion checklists to track outstanding actions and support the smooth progression of purchases through to completion.",
      "Prepared, proofread and structured 30+ legal documents, ranging from property agreements and leases to client correspondence, with meticulous documentation and consistency with firm standards throughout.",
    ],
    skills: [
      "Title review",
      "Property searches",
      "Due diligence",
      "Exchange & completion",
      "Leases",
      "Drafting",
    ],
  },
  {
    title: "Virtual Experience Programme — Mergers & Acquisitions",
    organisation: "Freshfields Bruckhaus Deringer",
    period: "Aug 2026 – Sep 2026",
    domain: "Corporate",
    summary:
      "Worked through a live-style M&A due diligence exercise in a virtual data room, from contract review to externally facing information requests.",
    work: [
      "Reviewed two commercial contracts in a virtual data room, identifying change-of-control risks, assignment restrictions and uncapped financial obligations.",
      "Drafted a structured due diligence findings report using priority ratings and commercial-impact analysis to flag deal-critical contractual risks.",
      "Prepared a Request for Information list using a professional legal template, translating internal findings into externally facing document requests.",
    ],
    skills: [
      "M&A due diligence",
      "Contract review",
      "Risk reporting",
      "RFI lists",
    ],
  },
  {
    title: "Legal Clinic Assistant (Volunteer)",
    organisation: "BPP Law School Legal Advice Clinic",
    place: "Manchester",
    period: "Nov 2025 – Jun 2026",
    domain: "Pro Bono",
    summary:
      "Led a small team preparing case matter summaries for supervising solicitors, and supported a corporate pro bono initiative.",
    work: [
      "Led a team of 5 in preparing 20+ structured case matter summaries, identifying key legal issues, and flagging matters requiring supervising solicitor review.",
      "Conducted empirical research to support clinic operations, translating findings into clear recommendations that informed case preparation and client advice.",
      "Supported a corporate pro bono initiative by conducting due diligence research, preparing proposals and building working relationships with two senior legal representatives.",
    ],
    skills: [
      "Team leadership",
      "Case summaries",
      "Issue spotting",
      "Legal research",
    ],
  },
  {
    title: "Winter Vacation Scheme",
    organisation: "Legal Cheek",
    period: "Dec 2025 – Jan 2026",
    domain: "Commercial",
    summary:
      "Built commercial understanding of capital markets and asset finance alongside legal and financial professionals.",
    work: [
      "Strengthened commercial understanding of capital markets and asset finance by analysing transaction structures with legal and financial professionals.",
      "Developed transactional issue-spotting skills through a deal advisory exercise, assessing key legal and commercial considerations arising in corporate transactions.",
      "Applied commercial awareness to consider how stamp duty, inflation, market conditions and regulatory developments can influence deals and client decision-making.",
    ],
    skills: [
      "Capital markets",
      "Asset finance",
      "Deal advisory",
      "Commercial awareness",
    ],
  },
  {
    title: "Legal Intern / Legal & Commercial Assistant",
    organisation: "EMMA-TOB Technologies Ltd",
    period: "May 2025 – Aug 2025",
    domain: "Commercial",
    summary:
      "Supported in-house legal counsel on commercial contracts and compliance across engineering projects, procurement and supplier relationships.",
    work: [
      "Took ownership of contract and matter tracking, keeping accurate, up-to-date records across 10+ active contracts using Microsoft Word and Excel and monitoring documentation, deadlines and compliance obligations to support timely completion.",
      "Supported in-house legal counsel on commercial contracts and compliance matters across engineering projects, procurement and supplier relationships, reviewing 10+ contracts and identifying key contractual risks.",
      "Drafted, proofread and organised commercial documents, including supply agreements, service contracts, purchase orders and correspondence, ensuring meticulous accuracy and consistency with company standards and regulatory requirements.",
      "Managed stakeholders across clients, regulatory bodies and suppliers, chasing outstanding documentation to support efficient contractual and compliance processes.",
    ],
    skills: [
      "Commercial contracts",
      "Matter tracking",
      "Compliance",
      "Stakeholder management",
      "Harvey AI",
    ],
  },
  {
    title: "Digital Justice Volunteer",
    organisation: "University of Sheffield",
    place: "Sheffield",
    period: "Oct 2024 – Nov 2024",
    domain: "Outreach",
    summary:
      "Delivered data privacy, digital rights and online safety workshops, reaching 200+ students.",
    work: [
      "Analysed feedback from 70+ participants to identify recurring themes and areas for improvement in programme delivery.",
      "Delivered data privacy, digital rights and online safety workshops to groups of 20–30 participants, reaching 200+ students.",
      "Collaborated with the Law Department to develop written materials distributed through biweekly newsletters, expanding awareness of digital rights and data privacy.",
    ],
    skills: ["Data privacy", "Public speaking", "Research", "Written materials"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Experience in numbers                                                      */
/* -------------------------------------------------------------------------- */

export type Metric = {
  value: number | null;
  display: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  note: string;
};

export const metrics: Metric[] = [
  {
    value: 30,
    display: "30+",
    suffix: "+",
    label: "Title documents & searches",
    note: "Reviewed across property acquisitions",
  },
  {
    value: 20,
    display: "20+",
    suffix: "+",
    label: "Case matter summaries",
    note: "Prepared with a team of five",
  },
  {
    value: 10,
    display: "10+",
    suffix: "+",
    label: "Active contracts tracked",
    note: "In-house legal & commercial support",
  },
  {
    value: 200,
    display: "200+",
    suffix: "+",
    label: "Students reached",
    note: "Digital rights & online safety workshops",
  },
];

/* -------------------------------------------------------------------------- */
/*  Education                                                                  */
/* -------------------------------------------------------------------------- */

export type Qualification = {
  award: string;
  school: string;
  period: string;
  grade: string;
  detail?: string;
};

export const education: Qualification[] = [
  {
    award: "LLM Law (SQE1 & SQE2)",
    school: "BPP Law School, Manchester",
    period: "2025 – 2026",
    grade: "Distinction",
  },
  {
    award: "Bachelor of Laws (LLB)",
    school: "University of Sheffield",
    period: "2022 – 2025",
    grade: "Upper Second Class Honours (2:1)",
  },
  {
    award: "A Levels",
    school: "Oxbridge Tutorial College",
    period: "2021 – 2022",
    grade: "Economics (A*), Global Studies (A), Sociology (A), English (B)",
    detail:
      "Awarded the A-Level School Prize and the Contribution to Social Life Prize for academic excellence.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Principles                                                                 */
/* -------------------------------------------------------------------------- */

export const philosophy = [
  {
    index: "01",
    title: "Clarity over unnecessary complexity",
    body: "Good legal work should make a matter easier to understand and easier to act on. Complexity you did not need is a burden someone else carries, usually the client, and usually the night before a deadline.",
  },
  {
    index: "02",
    title: "Reliability is a professional duty",
    body: "Legal work has to hold up when things go wrong, not only when everything goes smoothly. Missed deadlines, difficult clients and incomplete instructions are part of the job, not exceptions to it.",
  },
  {
    index: "03",
    title: "Commercial awareness is part of the job",
    body: "Good legal work reflects the client’s business, not just the law. Following current affairs and legal news helps you understand what clients care about and anticipate what they will need next.",
  },
  {
    index: "04",
    title: "Listen before you advise",
    body: "The best advice starts with understanding what the client needs, which isn’t always what they first say. Taking the time to ask the right questions and hear the whole story means the work solves the real problem the first time.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Section headings                                                           */
/* -------------------------------------------------------------------------- */

export const sections = {
  capabilities: {
    number: "02",
    eyebrow: "Expertise",
    heading: "Where I Add Value",
    intro:
      "Four areas shape my day-to-day work, and the real challenges sit where they overlap.",
  },
  experience: {
    number: "03",
    eyebrow: "Experience",
    heading: "Where I have practised",
    intro:
      "Real estate practice first, then other legal experience, most recent first. Open any role for the detail.",
  },
  metrics: {
    number: "04",
    eyebrow: "Experience in numbers",
    heading: "Small details. Meaningful impact.",
    intro:
      "A snapshot of the matters, documents and people behind my practical legal experience.",
    footnote: "Figures drawn from my professional and volunteering experience.",
  },
  education: {
    number: "05",
    eyebrow: "Education",
    heading: "Trained in law and legal practice",
    intro:
      "From A Levels to the LLM — the academic foundation behind the practical work.",
  },
  philosophy: {
    number: "06",
    eyebrow: "Principles",
    heading: "How I think about corporate law",
    intro: "Opinions earned from practice, not from blog posts.",
  },
  reviews: {
    number: "07",
    eyebrow: "Reviews",
    heading: "What it is like to work with me",
    intro:
      "Colleagues, clients, managers — leave a note. Sign it or stay anonymous, whichever you prefer.",
  },
  contact: {
    number: "08",
    eyebrow: "Contact",
    heading: "Let’s make a meaningful connection",
    intro:
      "Whether you’re looking for thoughtful legal support, exploring a professional opportunity or simply sharing a perspective, I’d love to hear from you.",
  },
} as const;
