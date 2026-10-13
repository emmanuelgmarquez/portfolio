import { expertise } from "@/data/profile";

export function Expertise() {
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="bg-paper-2 py-24 sm:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="expertise-title" className="display text-[clamp(2.75rem,6vw,5.5rem)]">
              Expertise
            </h2>
            <p className="mt-6 max-w-[26rem] text-lg leading-relaxed text-muted">
              An email is the visible end of a longer system: creative, content, customer data, CRM, automation,
              code, QA and deployment. These are the parts of that system I work in.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          {expertise.map((g) => (
            <div key={g.title} className="grid gap-5 border-t border-ink/20 py-9 first:border-ink sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:gap-10">
              <div>
                <h3 className="display-tight text-[1.85rem] sm:text-[2.1rem]">{g.title}</h3>
                <p className="mt-3 max-w-[22rem] leading-relaxed text-muted">{g.practice}</p>
              </div>
              <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 self-start xs:grid-cols-2 sm:pt-2">
                {g.items.map((item) => (
                  <li key={item} className="flex items-baseline gap-3 text-[0.98rem] text-ink">
                    <span aria-hidden="true" className="h-[5px] w-[5px] shrink-0 translate-y-[-2px] rounded-full bg-signal" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
