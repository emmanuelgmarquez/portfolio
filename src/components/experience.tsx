import { experience } from "@/data/profile";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="py-24 sm:py-32">
      <div className="shell">
        <div className="grid gap-6 border-t border-ink pt-6 lg:grid-cols-12">
          <h2 id="experience-title" className="display text-[clamp(2.75rem,6vw,5.5rem)] lg:col-span-7">
            Experience
          </h2>
          <p className="max-w-[30rem] text-lg leading-relaxed text-muted lg:col-span-5 lg:pt-3">
            From building WordPress sites to engineering Salesforce Marketing Cloud programs and enterprise email for
            regulated brands.
          </p>
        </div>

        <ol className="relative mt-14 sm:mt-20">
          {experience.map((r, i) => (
            <li
              key={r.employer}
              className="relative grid gap-4 border-t border-rule py-10 pl-8 sm:pl-10 lg:grid-cols-12 lg:gap-10 lg:pl-0"
            >
              {/* Timeline rail */}
              <span aria-hidden="true" className="absolute bottom-0 left-[3px] top-0 w-px bg-rule lg:hidden" />
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[2.85rem] h-[7px] w-[7px] rounded-full lg:hidden ${i === 0 ? "bg-signal" : "bg-ink"}`}
              />

              <p className="text-sm tabular-nums text-muted lg:col-span-3 lg:pt-2">
                <time>{r.start}</time> &ndash; <time>{r.end}</time>
                {i === 0 && (
                  <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-signal-soft px-2.5 py-0.5 text-xs text-signal">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                    Current
                  </span>
                )}
              </p>
              <div className="lg:col-span-4">
                <h3 className="display-tight text-[1.9rem] sm:text-[2.3rem]">{r.employer}</h3>
                <p className="mt-2 text-ink">{r.title}</p>
                {r.client && <p className="mt-0.5 text-sm text-muted">Client: {r.client}</p>}
              </div>
              <div className="lg:col-span-5 lg:pt-2">
                <p className="leading-relaxed text-ink/85">{r.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Capabilities at ${r.employer}`}>
                  {r.capabilities.map((c) => (
                    <li key={c} className="rounded-full bg-ink/[0.06] px-3 py-1 text-xs text-ink/80">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
