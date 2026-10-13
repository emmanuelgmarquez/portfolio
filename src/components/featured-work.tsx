import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { ProjectCover } from "./project-cover";
import { Reveal } from "./reveal";

export function FeaturedWork() {
  const [first, second, ...rest] = projects;
  const pairs: Project[][] = [];
  for (let i = 0; i < rest.length; i += 2) pairs.push(rest.slice(i, i + 2));
  return (
    <section id="work" aria-labelledby="work-title" className="pb-24 pt-20 sm:pb-32 sm:pt-28">
      <div className="shell">
        <div className="grid gap-6 border-t border-ink pt-6 lg:grid-cols-12">
          <h2 id="work-title" className="display text-[clamp(2.75rem,6vw,5.5rem)] lg:col-span-7">
            Selected work
          </h2>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[30rem] text-lg leading-relaxed text-muted">
              Email programs across banking, insurance, healthcare and travel. Every case study opens the real
              emails at full resolution, so you can read them the way a recipient would.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-24 sm:mt-20 sm:gap-32">
          {first && <FeatureRow project={first} />}
          {second && <FeatureRow project={second} />}
          {pairs.map((pair) =>
            pair.length === 2 ? (
              <div key={pair[0].slug} className="grid gap-24 sm:gap-32 lg:grid-cols-2 lg:gap-10">
                <PairCard project={pair[0]} />
                <div className="lg:pt-40">
                  <PairCard project={pair[1]} />
                </div>
              </div>
            ) : (
              <FeatureRow key={pair[0].slug} project={pair[0]} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function Meta({ project, compact = false }: { project: Project; compact?: boolean }) {
  const rows = [
    { k: project.clientLabel, v: project.client },
    { k: "Industry", v: project.industry },
    { k: "Work", v: project.category },
  ];
  return (
    <dl className={`grid gap-x-6 gap-y-4 text-sm ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
      {rows.map((r) => (
        <div key={r.k} className={compact && r.k === "Work" ? "col-span-2" : ""}>
          <dt className="text-muted">{r.k}</dt>
          <dd className="mt-1 text-ink">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
      {tags.map((t) => (
        <li key={t} className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/80">
          {t}
        </li>
      ))}
    </ul>
  );
}

function CaseLink() {
  return (
    <span className="inline-flex items-center gap-3 text-[0.95rem] font-medium text-ink">
      <span className="link-underline pb-0.5">View case study</span>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-signal group-hover:bg-signal group-hover:text-white">
        <ArrowUpRight size={18} aria-hidden="true" />
      </span>
    </span>
  );
}

function FeatureRow({ project }: { project: Project }) {
  return (
    <article>
      <Link href={`/work/${project.slug}`} className="group block" aria-label={`${project.title}: view case study`}>
        <Reveal>
          <ProjectCover project={project} variant="feature" />
        </Reveal>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-sm tabular-nums text-muted">{project.number}</p>
            <h3 className="display mt-2 text-[clamp(2.5rem,5.4vw,4.75rem)] transition-colors duration-300 group-hover:text-signal">
              {project.title}
            </h3>
          </div>
          <div className="flex flex-col gap-7 lg:col-span-7 lg:pt-8">
            <p className="max-w-[40rem] text-lg leading-relaxed text-ink/85">{project.summary}</p>
            <Meta project={project} />
            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <Tags tags={project.tags} />
              <CaseLink />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function PairCard({ project }: { project: Project }) {
  return (
    <article>
      <Link href={`/work/${project.slug}`} className="group block" aria-label={`${project.title}: view case study`}>
        <Reveal>
          <ProjectCover project={project} variant="pair" />
        </Reveal>
        <div className="mt-8 flex flex-col gap-6">
          <div>
            <p className="text-sm tabular-nums text-muted">{project.number}</p>
            <h3 className="display mt-2 text-[clamp(2.5rem,4.6vw,4.25rem)] transition-colors duration-300 group-hover:text-signal">
              {project.title}
            </h3>
          </div>
          <p className="max-w-[36rem] text-lg leading-relaxed text-ink/85">{project.summary}</p>
          <Meta project={project} compact />
          <Tags tags={project.tags} />
          <CaseLink />
        </div>
      </Link>
    </article>
  );
}
