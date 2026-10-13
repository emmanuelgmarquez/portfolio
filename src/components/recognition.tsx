import { ArrowUpRight } from "lucide-react";
import { awards } from "@/data/profile";

const medal: Record<string, string> = {
  Gold: "bg-[#C9A227]",
  Silver: "bg-[#A7ADB5]",
  Bronze: "bg-[#B0713F]",
};

export function Recognition({ compact = false }: { compact?: boolean }) {
  const counts = (["Gold", "Silver", "Bronze"] as const)
    .map((l) => ({ l, n: awards.filter((a) => a.level === l).length }))
    .filter((c) => c.n > 0);

  return (
    <section
      id={compact ? "awards" : "recognition"}
      aria-labelledby="recognition-title"
      className={compact ? "py-20 sm:py-28" : "pb-24 sm:pb-32"}
    >
      <div className="shell">
        <div className="grid gap-6 border-t border-ink pt-6 lg:grid-cols-12">
          <h2 id="recognition-title" className="display text-[clamp(2.75rem,6vw,5.5rem)] lg:col-span-7">
            Recognition
          </h2>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[30rem] text-lg leading-relaxed text-muted">
              Bank of America email work for the Enterprise Creative Solutions team, recognized in the email
              categories of the Financial Communications Society&rsquo;s Portfolio Awards.
              {compact && " Two of the four winners are Preferred Rewards emails, the same program as the lifestyle-benefits series above."}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Award totals">
              {counts.map((c) => (
                <li key={c.l} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3.5 py-1.5 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${medal[c.l]}`} aria-hidden="true" />
                  {c.n} {c.l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="mt-12">
          {awards.map((a) => (
            <li key={`${a.year}-${a.title}`} className="border-t border-rule first:border-ink/20">
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-1 py-6 sm:grid-cols-[8rem_1fr_14rem_auto] sm:gap-x-8"
              >
                <span className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
                  <span className={`h-3 w-3 rounded-full ${medal[a.level]}`} aria-hidden="true" />
                  {a.level}
                </span>
                <span className="display-tight text-[1.45rem] leading-tight transition-colors duration-300 group-hover:text-signal sm:text-[1.8rem]">
                  {a.title}
                </span>
                <span className="col-start-2 text-sm text-muted sm:col-start-auto">
                  {a.program} {a.year}
                  <span className="block">{a.category}</span>
                </span>
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="col-start-3 row-start-1 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal sm:col-start-auto sm:row-start-auto"
                />
                <span className="sr-only"> (winners list, opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
