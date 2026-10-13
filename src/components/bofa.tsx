import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { bofaItems, type BofaItem } from "@/data/projects";
import { LightboxTrigger } from "./lightbox";
import { PhoneFrame } from "./project-cover";
import { BofaArchiveGrid } from "./bofa-archive";

/* ----------------------------------------------------- Grouped featured set */

export function BofaFeatured() {
  const groups: { name: string; items: BofaItem[] }[] = [];
  for (const it of bofaItems) {
    let g = groups.find((x) => x.name === it.group);
    if (!g) groups.push((g = { name: it.group, items: [] }));
    g.items.push(it);
  }
  if (groups.length === 0) return null;
  return (
    <section aria-labelledby="bofa-featured-title" className="bg-paper-2 py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="bofa-featured-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            Featured campaigns
          </h2>
          <p className="max-w-[28rem] text-lg leading-relaxed text-muted lg:col-span-5 lg:pt-3">
            Selected builds, grouped by line of business. Select any email to read it at full length, disclosures
            included.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-20">
          {groups.map((g) => (
            <div key={g.name}>
              <h3 className="border-t border-ink/25 pt-4 text-sm text-ink">{g.name}</h3>
              <ul className={`mt-8 grid grid-cols-1 gap-x-6 gap-y-12 xs:grid-cols-2 ${g.items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                {g.items.map((im) => (
                  <li key={im.src} className="flex flex-col">
                    <LightboxTrigger
                      src={im.src}
                      label={`Open ${im.title} at full size`}
                      className="group relative block w-full cursor-zoom-in text-left"
                    >
                      <div className="email-shadow relative aspect-[4/5] overflow-hidden rounded-[4px] bg-white">
                        <Image
                          src={im.src}
                          alt={im.alt}
                          width={im.width}
                          height={im.height}
                          sizes="(min-width: 1024px) 23vw, (min-width: 416px) 46vw, 92vw"
                          quality={90}
                          className="block h-auto w-full origin-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                        />
                        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />
                        <span className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-full bg-ink/90 px-3.5 text-xs font-medium text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                          <Maximize2 size={13} aria-hidden="true" />
                          Read full email
                        </span>
                      </div>
                    </LightboxTrigger>
                    <h4 className="mt-4 font-medium leading-snug text-ink">{im.title}</h4>
                    {im.caption && <p className="mt-1.5 text-sm leading-relaxed text-muted">{im.caption}</p>}
                    <p className="mt-2 text-xs tabular-nums text-muted">{im.code}</p>
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

/* ------------------------------------------------------ Desktop and mobile */

export function BofaDevices() {
  const pairs = bofaItems.filter((i) => i.mobile);
  if (pairs.length === 0) return null;
  return (
    <section aria-labelledby="bofa-devices-title" className="overflow-hidden bg-[#dfe6f2] py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="bofa-devices-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            One build, two layouts
          </h2>
          <p className="max-w-[28rem] text-lg leading-relaxed text-ink/70 lg:col-span-5 lg:pt-3">
            Each pair is the same HTML file at 550px and at 320px. Mastheads, offer art and modules swap at the
            breakpoint instead of shrinking. Scroll inside the phone to read the whole message.
          </p>
        </div>
        <ul className="scrollbar-thin -mx-4 mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pb-6 sm:-mx-8 sm:px-8 lg:gap-12">
          {pairs.map((p) => (
            <li key={p.src} className="flex shrink-0 snap-start items-start gap-4 sm:gap-6">
              <LightboxTrigger
                src={p.src}
                label={`Open the desktop version of ${p.title}`}
                className="email-shadow block w-[46vw] max-w-[20rem] cursor-zoom-in overflow-hidden rounded-[4px] bg-white sm:w-[18rem]"
              >
                <div className="relative aspect-[3/5] overflow-hidden">
                  <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="20rem" quality={90} className="block h-auto w-full" />
                </div>
              </LightboxTrigger>
              <div className="w-[34vw] max-w-[11.5rem] pt-10 sm:w-[11.5rem]">
                <PhoneFrame scroll label={`${p.title}, mobile version, scrollable`}>
                  {p.mobile && (
                    <Image
                      src={p.mobile.src}
                      alt={p.mobile.alt}
                      width={p.mobile.width}
                      height={p.mobile.height}
                      sizes="12rem"
                      quality={90}
                      className="block h-auto w-full"
                    />
                  )}
                </PhoneFrame>
                <p className="mt-4 text-sm font-medium leading-snug text-ink">{p.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Archive */

export function BofaArchive() {
  return (
    <section aria-labelledby="bofa-archive-title" className="py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="bofa-archive-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            The whole archive
          </h2>
          <p className="max-w-[28rem] text-lg leading-relaxed text-muted lg:col-span-5 lg:pt-3">
            Every campaign, filed by line of business with its job number. Merge fields and bracketed placeholders are
            shown as built, before personalization.
          </p>
        </div>
        <BofaArchiveGrid />
      </div>
    </section>
  );
}
