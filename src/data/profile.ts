export type Role = {
  employer: string;
  client?: string;
  title: string;
  start: string;
  end: string;
  summary: string;
  capabilities: string[];
};

export const experience: Role[] = [
  {
    employer: "Tamman Inc.",
    client: "Bank of America",
    title: "Email Developer",
    start: "Dec 2023",
    end: "Present",
    summary:
      "Builds enterprise customer communications for Bank of America and Merrill, from responsive development and personalization through accessibility review and production QA. Email work for the Enterprise Creative Solutions team has won Gold, Silver and Bronze at the FCS Portfolio Awards.",
    capabilities: [
      "Responsive HTML/CSS",
      "Personalization",
      "Accessibility",
      "Production QA",
      "Cross-client compatibility",
      "Regulated workflows",
    ],
  },
  {
    employer: "Next Level Solutions",
    client: "THREE Insurance",
    title: "Salesforce Marketing Engineer",
    start: "Oct 2022",
    end: "Nov 2023",
    summary:
      "Engineered Salesforce Marketing Cloud programs for a direct insurer: Journey Builder automation, Data Extensions and SQL segmentation, and transactional and lifecycle email.",
    capabilities: [
      "Salesforce Marketing Cloud",
      "Journey Builder",
      "Data Extensions",
      "SQL",
      "Segmentation",
      "Transactional email",
    ],
  },
  {
    employer: "Snow Companies",
    title: "Lead Email Developer",
    start: "Oct 2020",
    end: "Oct 2022",
    summary:
      "Led enterprise email development for healthcare programs: modular templates, cross-client testing, Salesforce-related workflows, quality assurance and technical production.",
    capabilities: ["Modular templates", "Cross-client testing", "Salesforce workflows", "Quality assurance", "Technical production"],
  },
  {
    employer: "Socius Marketing",
    title: "Front-End Developer",
    start: "Jan 2020",
    end: "Oct 2020",
    summary:
      "Built and maintained responsive production WordPress sites in HTML, CSS, JavaScript and PHP, including custom page templates using Advanced Custom Fields (ACF), and ran website QA on every change.",
    capabilities: ["WordPress", "PHP & ACF", "HTML/CSS", "JavaScript", "Website QA"],
  },
];

export type ExpertiseGroup = {
  title: string;
  practice: string;
  items: string[];
};

export const expertise: ExpertiseGroup[] = [
  {
    title: "Marketing automation & CRM",
    practice: "Turning customer data into the right message at the right moment.",
    items: [
      "Salesforce Marketing Cloud",
      "Journey Builder",
      "Data Extensions",
      "SQL",
      "AMPscript",
      "HubSpot",
      "Customer segmentation",
      "Lifecycle automation",
    ],
  },
  {
    title: "Enterprise email engineering",
    practice: "Email that renders, reads and behaves the same everywhere it lands.",
    items: [
      "Responsive HTML/CSS",
      "Outlook compatibility",
      "Dynamic content",
      "Modular email architecture",
      "Accessibility",
      "Litmus",
      "Email on Acid",
      "QA",
    ],
  },
  {
    title: "CMS & digital platforms",
    practice: "Structuring content so teams can publish without breaking things.",
    items: [
      "Contentful",
      "Shopify",
      "WordPress",
      "HubSpot CMS",
      "Salesforce ecosystem",
      "Content management",
      "Digital experience development",
    ],
  },
  {
    title: "Front end & integrations",
    practice: "The web skills underneath every email and landing page.",
    items: ["HTML", "CSS", "JavaScript", "Responsive interfaces", "REST APIs", "Git", "Front-end troubleshooting"],
  },
  {
    title: "Creative & production",
    practice: "Taking a design file to a production-ready build without losing the intent.",
    items: ["Figma", "Photoshop", "Illustrator", "Visual asset preparation", "Design implementation", "Production workflows"],
  },
];

export type Award = {
  level: "Gold" | "Silver" | "Bronze";
  title: string;
  category: string;
  program: string;
  year: number;
  url: string;
};

/**
 * Financial Communications Society (FCS) Portfolio Awards won by Bank of America
 * email work credited to Bank of America, Enterprise Creative Solutions.
 * Sources: https://thefcs.org/portfolio-awards/fcs-portfolio-awards-2024
 *          https://thefcs.org/portfolio-awards/fcs-portfolio-awards-2025
 */
export const awards: Award[] = [
  {
    level: "Gold",
    title: "Keep the Change Email",
    category: "Email, Consumer",
    program: "FCS Portfolio Awards",
    year: 2024,
    url: "https://thefcs.org/portfolio-awards/fcs-portfolio-awards-2024",
  },
  {
    level: "Silver",
    title: "Merrill Year End Checklist Email",
    category: "Email, Consumer",
    program: "FCS Portfolio Awards",
    year: 2024,
    url: "https://thefcs.org/portfolio-awards/fcs-portfolio-awards-2024",
  },
  {
    level: "Bronze",
    title: "Preferred Rewards Engagement Travel Email",
    category: "Email, Consumer",
    program: "FCS Portfolio Awards",
    year: 2024,
    url: "https://thefcs.org/portfolio-awards/fcs-portfolio-awards-2024",
  },
  {
    level: "Bronze",
    title: "Preferred Rewards Lifestyle Benefits Email Series",
    category: "Email, Consumer",
    program: "FCS Portfolio Awards",
    year: 2025,
    url: "https://thefcs.org/portfolio-awards/fcs-portfolio-awards-2025",
  },
];
