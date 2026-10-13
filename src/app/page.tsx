import { Hero } from "@/components/hero";
import { FeaturedWork } from "@/components/featured-work";
import { Expertise } from "@/components/expertise";
import { Recognition } from "@/components/recognition";
import { Experience } from "@/components/experience";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { awards, experience } from "@/data/profile";
import { projects } from "@/data/projects";
import { site } from "@/lib/site";

export default function Home() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.title,
    description: site.description,
    url: site.url,
    email: `mailto:${site.email}`,
    sameAs: [site.linkedin],
    address: { "@type": "PostalAddress", addressRegion: "UT", addressCountry: "US" },
    worksFor: { "@type": "Organization", name: experience[0].employer },
    award: awards.map((a) => `${a.program} ${a.year}, ${a.level}: ${a.title}`),
    knowsAbout: [
      "Salesforce Marketing Cloud",
      "Journey Builder",
      "AMPscript",
      "SQL",
      "HTML email development",
      "CRM",
      "Lifecycle marketing",
      "Marketing automation",
      "Front-end development",
    ],
  };
  const portfolio = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Selected work",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/work/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <main id="main">
        <span id="top" className="absolute top-0" aria-hidden="true" />
        <Hero />
        <FeaturedWork />
        <Recognition />
        <Expertise />
        <Experience />
        <About />
        <Contact />
      </main>
      <SiteFooter />
      <JsonLd data={person} />
      <JsonLd data={portfolio} />
    </>
  );
}
