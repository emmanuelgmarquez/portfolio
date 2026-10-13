import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Maximize2 } from "lucide-react";
import type { Detail, Project, ProjectImage } from "@/data/projects";
import { rialtoAssets } from "@/data/projects";
import { ProjectCover, PhoneFrame } from "./project-cover";
import { LightboxTrigger } from "./lightbox";
import { Parallax } from "./parallax";
import { Reveal } from "./reveal";

/* ------------------------------------------------------------------ Hero */

export function CaseHero({ project, total }: { project: Project; total: number }) {
  const meta = [
    { k: project.clientLabel, v: project.client },
    { k: "Industry", v: project.industry },
    { k: "Discipline", v: project.category },
    { k: "Scope", v: project.scope },
  ];
  return (
    <header className="pt-24 sm:pt-28">
      <div className="shell">
        <div className="flex items-center justify-between gap-4 border-b border-rule pb-4 text-sm">
          <Link href="/#work" className="group inline-flex items-center gap-2 text-muted hover:text-ink">
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true" />
            All work
          </Link>
          <p className="tabular-nums text-muted">
            Case study {project.number} of {String(total).padStart(2, "0")}
          </p>
        </div>

        <div className="grid gap-8 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-12 lg:gap-10">
          <h1
            className={`display lg:col-span-8 ${
              project.title.length > 14 ? "text-[clamp(3rem,8vw,7.25rem)]" : "text-[clamp(3.4rem,11vw,10rem)]"
            }`}
          >
            {project.title}
          </h1>
          <p className="max-w-[32rem] self-end text-lg leading-relaxed text-ink/85 lg:col-span-4 lg:pb-4">
            {project.intro}
          </p>
        </div>
      </div>

      <div className="shell">
        <Reveal>
          <Parallax>
            <ProjectCover project={project} variant="hero" priority />
          </Parallax>
        </Reveal>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-rule py-8 text-sm lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.k}>
              <dt className="text-muted">{m.k}</dt>
              <dd className="mt-1.5 text-[0.98rem] text-ink">{m.v}</dd>
            </div>
          ))}
          {project.related && (
            <div className="col-span-2 lg:col-span-4">
              <dt className="text-muted">Related role</dt>
              <dd className="mt-1.5 text-[0.98rem] text-ink">{project.related}</dd>
            </div>
          )}
        </dl>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------- Overview */

export function Overview({ project }: { project: Project }) {
  return (
    <section aria-labelledby="overview-title" className="py-20 sm:py-28">
      <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-10">
        <h2 id="overview-title" className="display-tight text-[2rem] sm:text-[2.6rem] lg:col-span-4">
          Overview
        </h2>
        <div className="space-y-6 text-lg leading-[1.7] text-ink/85 lg:col-span-7 lg:col-start-6">
          {project.overview.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>

      <div className="shell mt-20 grid gap-8 sm:mt-28 lg:grid-cols-12 lg:gap-10">
        <h2 className="display-tight text-[2rem] sm:text-[2.6rem] lg:col-span-4">Technical scope</h2>
        <div className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {project.technicalScope.map((s) => (
            <div key={s.title} className="min-w-0 border-t border-ink/20 py-6">
              <h3 className="font-medium text-ink">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted [overflow-wrap:anywhere]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Gallery */

export function Gallery({ project }: { project: Project }) {
  const many = project.gallery.length > 6;
  return (
    <section aria-labelledby="gallery-title" className="bg-paper-2 py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="gallery-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            {project.galleryTitle}
          </h2>
          <p className="max-w-[28rem] text-lg leading-relaxed text-muted lg:col-span-5 lg:pt-3">{project.galleryIntro}</p>
        </div>

        <ol
          className={`mt-14 grid grid-cols-1 gap-x-6 gap-y-14 xs:grid-cols-2 ${
            many ? "lg:grid-cols-4 xl:grid-cols-5" : "lg:grid-cols-3"
          }`}
        >
          {project.gallery.map((im, i) => (
            <li key={im.src} className="flex flex-col">
              <LightboxTrigger
                src={im.src}
                label={`Open ${im.title} at full size`}
                className="group relative block w-full cursor-zoom-in text-left"
              >
                <div className="email-shadow relative aspect-[4/5] overflow-hidden rounded-[4px] bg-white xs:aspect-[3/4]">
                  <Image
                    src={im.src}
                    alt={im.alt}
                    width={im.width}
                    height={im.height}
                    sizes={many ? "(min-width: 1280px) 18vw, (min-width: 1024px) 23vw, (min-width: 416px) 46vw, 92vw" : "(min-width: 1024px) 30vw, (min-width: 416px) 46vw, 92vw"}
                    quality={90}
                    className="block h-auto w-full origin-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />
                  <span className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-full bg-ink/90 px-3.5 text-xs font-medium text-paper opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Maximize2 size={13} aria-hidden="true" />
                    Read full email
                  </span>
                </div>
              </LightboxTrigger>
              <div className="mt-4 flex gap-3">
                {project.sequential && (
                  <span className="pt-[0.1rem] text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                )}
                <div>
                  <h3 className="font-medium leading-snug text-ink">{im.title}</h3>
                  {im.caption && <p className="mt-1.5 text-sm leading-relaxed text-muted">{im.caption}</p>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Full-length view */

function EmailFrame({ image, label, children }: { image: ProjectImage; label: string; children: React.ReactNode }) {
  return (
    <div className="email-shadow overflow-hidden rounded-[8px] border border-ink/10 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-[#f7f7f4] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        </div>
        <p className="truncate text-xs text-muted">{label}</p>
        <LightboxTrigger
          src={image.src}
          label={`Open ${image.title} in the viewer`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
        >
          <Maximize2 size={14} aria-hidden="true" />
        </LightboxTrigger>
      </div>
      {children}
    </div>
  );
}

export function FullLength({ project }: { project: Project }) {
  if (!project.featured) return null;
  const { image, title, notes } = project.featured;
  const displayMax = Math.min(620, Math.round(image.width * 1.6));
  return (
    <section aria-labelledby="full-title" className="py-20 sm:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="full-title" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
              {title}
            </h2>
            <p className="mt-5 max-w-[28rem] text-muted">
              {image.title}, shown complete. Scroll alongside the notes, or open it in the viewer to zoom.
            </p>
            <ol className="mt-10 space-y-0">
              {notes.map((n, i) => (
                <li key={n.title} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-ink/20 py-5">
                  <span className="text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-medium text-ink">{n.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted">{n.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="mx-auto" style={{ maxWidth: displayMax + 2 }}>
            <EmailFrame image={image} label={image.title}>
              <LightboxTrigger src={image.src} label={`Open ${image.title} at full size`} className="block w-full cursor-zoom-in">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes={`(min-width: 1024px) ${displayMax}px, 94vw`}
                  quality={90}
                  className="block h-auto w-full"
                />
              </LightboxTrigger>
            </EmailFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- Rialto device pair */

export function DevicePair() {
  const { desktop, mobile } = rialtoAssets;
  return (
    <section aria-labelledby="devices-title" className="overflow-hidden bg-[#cfe3ee] py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="devices-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            Side by side
          </h2>
          <p className="max-w-[28rem] text-lg leading-relaxed text-ink/70 lg:col-span-5 lg:pt-3">
            The same HTML at desktop and mobile widths. Scroll inside each frame to read the whole email.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <EmailFrame image={desktop} label="Desktop">
              <div
                className="scrollbar-thin h-[min(78vh,46rem)] overflow-y-auto overscroll-contain"
                tabIndex={0}
                role="region"
                aria-label="Desktop email preview, scrollable"
              >
                <Image
                  src={desktop.src}
                  alt={desktop.alt}
                  width={desktop.width}
                  height={desktop.height}
                  sizes="(min-width: 768px) 60vw, 94vw"
                  quality={90}
                  className="block h-auto w-full"
                />
              </div>
            </EmailFrame>
          </div>
          <div className="mx-auto w-full max-w-[19rem] md:col-span-4 md:pt-16">
            <PhoneFrame scroll label="Mobile email preview, scrollable">
              <Image
                src={mobile.src}
                alt={mobile.alt}
                width={mobile.width}
                height={mobile.height}
                sizes="(min-width: 768px) 19rem, 80vw"
                quality={90}
                className="block h-auto w-full"
              />
            </PhoneFrame>
            <div className="mt-5 text-center">
              <LightboxTrigger
                src={mobile.src}
                label="Open the mobile build at full size"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-ink/20 px-4 text-sm text-ink hover:border-ink"
              >
                <Maximize2 size={14} aria-hidden="true" />
                Open mobile at full size
              </LightboxTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Details */

export function Details({ details }: { details: Detail[] }) {
  if (details.length === 0) return null;
  return (
    <section aria-labelledby="details-title" className="py-20 sm:py-28">
      <div className="shell">
        <h2 id="details-title" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
          Up close
        </h2>
        <div className="mt-14 flex flex-col gap-20 sm:gap-28">
          {details.map((d, i) => {
            const flip = i % 2 === 1;
            const narrow = d.image.width / d.image.height < 0.8;
            return (
              <figure key={d.image.src} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
                <div
                  className={`w-full lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""} ${
                    narrow ? "mx-auto max-w-[26rem] lg:max-w-[30rem]" : "max-w-[46rem]"
                  } ${flip && !narrow ? "lg:justify-self-end" : ""}`}
                >
                  <LightboxTrigger
                    src={d.image.src}
                    label={`Open close-up: ${d.title}`}
                    className="group block w-full cursor-zoom-in"
                  >
                    <div className="email-shadow overflow-hidden rounded-[6px] bg-white">
                      <Image
                        src={d.image.src}
                        alt={d.image.alt}
                        width={d.image.width}
                        height={d.image.height}
                        sizes="(min-width: 1024px) 55vw, 94vw"
                        quality={90}
                        className="block h-auto w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                      />
                    </div>
                  </LightboxTrigger>
                </div>
                <figcaption className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
                  <h3 className="display-tight text-[1.85rem] sm:text-[2.2rem]">{d.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-muted">{d.body}</p>
                  <p className="mt-5 text-sm text-muted">Excerpt. Select it to zoom; the complete email is shown above.</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ Considerations + tech */

export function Considerations({ project }: { project: Project }) {
  return (
    <section aria-labelledby="considerations-title" className="border-t border-rule py-20 sm:py-28">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h2 id="considerations-title" className="display-tight text-[2rem] sm:text-[2.6rem]">
            Technical considerations
          </h2>
          <div className="mt-8">
            {project.considerations.map((c) => (
              <div key={c.title} className="grid gap-2 border-t border-ink/20 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
                <h3 className="font-medium text-ink">{c.title}</h3>
                <p className="leading-relaxed text-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="display-tight text-[2rem] sm:text-[2.6rem]">Technologies and capabilities</h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li key={t} className="rounded-full border border-ink/15 bg-white/50 px-3.5 py-1.5 text-sm text-ink">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Next project */

export function NextProject({ project }: { project: Project }) {
  return (
    <section aria-label="Next case study" className="pb-20 sm:pb-28">
      <div className="shell">
        <Link href={`/work/${project.slug}`} className="group block border-t border-ink pt-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm text-muted">Next case study</p>
              <p className="display mt-3 text-[clamp(2.75rem,8vw,7rem)] transition-colors duration-300 group-hover:text-signal">
                {project.title}
              </p>
            </div>
            <span className="mb-3 hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-signal group-hover:bg-signal group-hover:text-white sm:inline-flex">
              <ArrowUpRight size={26} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-4 max-w-[40rem] text-lg leading-relaxed text-muted">{project.summary}</p>
          <div className="mt-10 h-[min(52vw,26rem)] overflow-hidden rounded-[4px]">
            <ProjectCover project={project} variant="feature" />
          </div>
        </Link>
      </div>
    </section>
  );
}
