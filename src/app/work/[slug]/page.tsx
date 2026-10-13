import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bofaArchiveItems, bofaItems, getNextProject, getProject, projects, type ProjectImage } from "@/data/projects";
import { BofaArchive, BofaDevices, BofaFeatured } from "@/components/bofa";
import { site } from "@/lib/site";
import { awards } from "@/data/profile";
import { LightboxProvider } from "@/components/lightbox";
import {
  CaseHero,
  Considerations,
  Details,
  DevicePair,
  FullLength,
  Gallery,
  NextProject,
  Overview,
} from "@/components/case-study";
import { Contact } from "@/components/contact";
import { CodeExcerpts } from "@/components/code-excerpts";
import { Recognition } from "@/components/recognition";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title}: ${project.category.charAt(0).toUpperCase()}${project.category.slice(1)}`;
  const url = `/work/${project.slug}`;
  return {
    title,
    description: project.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} | ${site.name}`,
      description: project.seoDescription,
      images: [{ url: `/og/${project.slug}.png`, width: 1200, height: 630, alt: `${project.title} case study` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description: project.seoDescription,
      images: [`/og/${project.slug}.png`],
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(project.slug);
  const isDevicePair = project.slug === "rialto";
  const isBofa = project.slug === "bank-of-america";

  // Everything on the page that can be opened in the viewer, in reading order.
  const seen = new Set<string>();
  const viewerItems: ProjectImage[] = [];
  const extra: ProjectImage[] = isBofa
    ? [...bofaItems.flatMap((i) => (i.mobile ? [i.mobile] : [])), ...bofaArchiveItems]
    : [];
  for (const im of [
    ...project.gallery,
    ...(project.featured ? [project.featured.image] : []),
    ...project.details.map((d) => d.image),
    ...extra,
  ]) {
    if (!seen.has(im.src)) {
      seen.add(im.src);
      viewerItems.push(im);
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: `${project.title}: ${project.category}`,
    description: project.seoDescription,
    url: `${site.url}/work/${project.slug}`,
    genre: project.category,
    keywords: project.technologies.join(", "),
    creator: { "@type": "Person", name: site.name, url: site.url },
    image: viewerItems.slice(0, 4).map((i) => `${site.url}${i.src}`),
    ...(project.showAwards ? { award: awards.map((a) => `${a.program} ${a.year}, ${a.level}: ${a.title}`) } : {}),
  };

  return (
    <LightboxProvider items={viewerItems} label={project.title}>
      <main id="main">
        <CaseHero project={project} total={projects.length} />
        <Overview project={project} />
        {isBofa ? (
          <BofaFeatured />
        ) : isDevicePair ? (
          <DevicePair />
        ) : (
          project.gallery.length > 0 && <Gallery project={project} />
        )}
        {project.showAwards && <Recognition compact />}
        {isBofa && <BofaDevices />}
        <FullLength project={project} />
        {project.code && <CodeExcerpts excerpts={project.code} />}
        {isBofa && <BofaArchive />}
        <Details details={project.details} />
        <Considerations project={project} />
        <NextProject project={next} />
        <Contact compact />
      </main>
      <SiteFooter />
      <JsonLd data={jsonLd} />
    </LightboxProvider>
  );
}
