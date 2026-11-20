import Image from "next/image";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import type { ConceptStudy, ProjectImage } from "@/data/projects";
import { EmailFrame } from "./case-study";
import { PhoneFrame } from "./project-cover";
import { LightboxTrigger } from "./lightbox";

/** Small pill that marks self-initiated work for a fictional brand. */
export function ConceptBadge({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-ink/25 bg-paper px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-ink ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
      {label}
    </span>
  );
}

function LiveLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="group inline-flex items-center gap-3 text-[0.95rem] font-medium text-ink"
    >
      <span className="link-underline pb-0.5">{children}</span>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-signal group-hover:bg-signal group-hover:text-white">
        <ArrowUpRight size={18} aria-hidden="true" />
      </span>
    </a>
  );
}

/* --------------------------------------------------------- The email */

function ScrollEmail({ image, label }: { image: ProjectImage; label: string }) {
  return (
    <EmailFrame image={image} label={label}>
      <div
        className="scrollbar-thin h-[min(70vh,40rem)] overflow-y-auto overscroll-contain"
        tabIndex={0}
        role="region"
        aria-label={`${label} email preview, scrollable`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 44vw, 94vw"
          quality={90}
          className="block h-auto w-full"
        />
      </div>
    </EmailFrame>
  );
}

function ScrollPhone({ image, label }: { image: ProjectImage; label: string }) {
  return (
    <div className="w-full max-w-[17rem]">
      <PhoneFrame scroll label={`${label} email preview, scrollable`}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 640px) 17rem, 70vw"
          quality={90}
          className="block h-auto w-full"
        />
      </PhoneFrame>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <p className="text-ink/70">{label}</p>
        <LightboxTrigger
          src={image.src}
          label={`Open ${image.title} at full size`}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-ink/20 px-3.5 text-ink hover:border-ink"
        >
          <Maximize2 size={13} aria-hidden="true" />
          Full size
        </LightboxTrigger>
      </div>
    </div>
  );
}

export function ConceptEmail({ concept, panel }: { concept: ConceptStudy; panel: string }) {
  const { desktopLight, desktopDark, mobileLight, mobileDark } = concept.screens;
  return (
    <section aria-labelledby="email-title" className="overflow-hidden py-20 sm:py-28" style={{ background: panel }}>
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="email-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            The email
          </h2>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[28rem] text-lg leading-relaxed text-ink/70">
              One HTML file at desktop and mobile widths, in light and dark. These are Chromium renders of the built
              email, not email-client screenshots. Scroll inside each frame to read it.
            </p>
            <div className="mt-6">
              <LiveLink href={concept.liveUrl}>View the live HTML email</LiveLink>
            </div>
          </div>
        </div>

        <h3 className="mt-14 text-sm text-ink/70">Desktop, 600px</h3>
        <div className="mt-4 grid gap-8 md:grid-cols-2">
          <ScrollEmail image={desktopLight} label="Light" />
          <ScrollEmail image={desktopDark} label="Dark" />
        </div>

        <h3 className="mt-16 text-sm text-ink/70">Mobile, 375px</h3>
        <div className="mt-4 flex flex-col items-center gap-12 sm:flex-row sm:items-start sm:justify-center sm:gap-16">
          <ScrollPhone image={mobileLight} label="Light" />
          <ScrollPhone image={mobileDark} label="Dark" />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- How it's built */

export function HowBuilt({ concept }: { concept: ConceptStudy }) {
  return (
    <section aria-labelledby="built-title" className="py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <h2 id="built-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-4">
            How it&rsquo;s built
          </h2>
          <div className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {concept.build.map((g) => (
              <div key={g.title} className="min-w-0 border-t border-ink/20 py-6">
                <h3 className="font-medium text-ink">{g.title}</h3>
                <ul className="mt-3 space-y-3">
                  {g.points.map((p) => (
                    <li key={p.slice(0, 32)} className="flex gap-3 leading-relaxed text-muted [overflow-wrap:anywhere]">
                      <span aria-hidden="true" className="mt-[0.65em] h-[5px] w-[5px] shrink-0 rounded-full bg-signal" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-ink pt-6 sm:mt-28">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <h3 className="display-tight text-[2rem] sm:text-[2.6rem] lg:col-span-5">Three data states, one template</h3>
            <p className="max-w-[34rem] text-lg leading-relaxed text-muted lg:col-span-6 lg:col-start-7 lg:pt-2">
              The same Liquid template rendered with three sample JSON files. Each crop runs from the greeting to
              the button, the part of the email that changes, so the third is short because the grid is gone.
            </p>
          </div>
          <ol className="mt-12 grid items-start gap-x-6 gap-y-14 md:grid-cols-3">
            {concept.states.map((s, i) => (
              <li key={s.image.src} className="flex flex-col">
                <LightboxTrigger
                  src={s.image.src}
                  label={`Open ${s.image.title} at full size`}
                  className="group relative block w-full cursor-zoom-in text-left"
                >
                  <div className="email-shadow relative overflow-hidden rounded-[4px] bg-[#FAF8F4]">
                    <Image
                      src={s.image.src}
                      alt={s.image.alt}
                      width={s.image.width}
                      height={s.image.height}
                      sizes="(min-width: 768px) 30vw, 92vw"
                      quality={90}
                      className="block h-auto w-full origin-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
                    />
                    <span className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-full bg-ink/90 px-3.5 text-xs font-medium text-paper opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Maximize2 size={13} aria-hidden="true" />
                      Open
                    </span>
                  </div>
                </LightboxTrigger>
                <div className="mt-4 flex gap-3">
                  <span className="pt-[0.1rem] text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4 className="font-medium leading-snug text-ink">{s.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------- AI-assisted, human-reviewed */

export function AiReview({ concept }: { concept: ConceptStudy }) {
  const { intro, rows } = concept.review;
  return (
    <section aria-labelledby="review-title" className="bg-paper-2 py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="review-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            AI-assisted, human-reviewed
          </h2>
          <p className="max-w-[30rem] text-lg leading-relaxed text-muted lg:col-span-5 lg:pt-3">{intro}</p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[6px] border border-ink/15 bg-paper">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Issues in the AI first draft of the product grid, and the reviewed fix for each</caption>
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-ink/15 text-sm text-muted">
                <th scope="col" className="w-[14%] px-6 py-4 font-normal">Area</th>
                <th scope="col" className="w-[43%] px-6 py-4 font-normal">Before: the AI first draft</th>
                <th scope="col" className="w-[43%] px-6 py-4 font-normal">After: reviewed and fixed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.issue} className="block border-b border-ink/10 px-5 py-5 last:border-b-0 md:table-row md:px-0 md:py-0">
                  <th scope="row" className="block pb-2 align-top font-medium text-ink md:table-cell md:px-6 md:py-5">
                    {r.issue}
                  </th>
                  <td className="block pb-3 align-top leading-relaxed text-muted [overflow-wrap:anywhere] md:table-cell md:px-6 md:py-5">
                    <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-muted md:hidden">Before</span>
                    {r.before}
                  </td>
                  <td className="block align-top leading-relaxed text-ink [overflow-wrap:anywhere] md:table-cell md:px-6 md:py-5">
                    <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-muted md:hidden">After</span>
                    {r.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ Tested across clients */

export function ClientTests({ concept }: { concept: ConceptStudy }) {
  const tests = concept.clientTests;
  const done = tests.filter((t) => t.image).length;
  const groups = [...new Set(tests.map((t) => t.group))];
  return (
    <section aria-labelledby="clients-title" className="py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="clients-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            Tested across clients
          </h2>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[30rem] text-lg leading-relaxed text-muted">
              {done === 0
                ? "Not yet. This is the test plan, and every client on it is pending. A client is marked tested only when its real screenshot is added here; the automated checks and Chromium renders above do not count."
                : done === tests.length
                  ? "Real renders from Email on Acid (Mailgun Inspect), not emulations. The first run caught two Outlook bugs, the button label going dark in Outlook's dark mode and the layout stretching to 648px in classic Outlook, both fixed before these screenshots were taken. Select any client to see the full render."
                  : "A client is marked tested only when its real screenshot is shown here. The rest are still pending."}
            </p>
            <p className="mt-4 text-sm tabular-nums text-muted">
              {done === tests.length ? `${done} clients tested` : `${done} of ${tests.length} tested, ${tests.length - done} pending`}
            </p>
          </div>
        </div>

        {groups.map((group) => (
          <div key={group} className="mt-14">
            <h3 className="border-t border-ink pt-4 text-sm text-muted">{group}</h3>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {tests
                .filter((t) => t.group === group)
                .map((t) => (
                  <li key={t.id}>
                    {t.image ? (
                      <LightboxTrigger
                        src={t.image.src}
                        label={`Open the ${t.name} screenshot`}
                        className="email-shadow block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[4px] bg-white"
                      >
                        <Image
                          src={t.image.src}
                          alt={t.image.alt}
                          width={t.image.width}
                          height={t.image.height}
                          sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 46vw"
                          quality={90}
                          className="block h-auto w-full"
                        />
                      </LightboxTrigger>
                    ) : (
                      <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-[4px] border border-dashed border-ink/30 bg-paper-2/60 px-3 text-center">
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink">Pending</span>
                        <span className="text-xs leading-snug text-muted">Screenshot not added yet</span>
                      </div>
                    )}
                    <p className="mt-3 text-sm leading-snug text-ink">{t.name}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-muted">{t.image ? "Tested" : "Pending"}</p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Live HTML link */

export function LiveEmail({ concept }: { concept: ConceptStudy }) {
  return (
    <section aria-labelledby="live-title" className="border-t border-rule py-16 sm:py-20">
      <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-10">
        <h2 id="live-title" className="display-tight text-[2rem] sm:text-[2.6rem] lg:col-span-5">
          See the real thing
        </h2>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="max-w-[34rem] text-lg leading-relaxed text-muted">
            The built email is served as plain HTML, exactly as it would be handed to a sending platform. View
            source to read the MSO conditionals, the VML and the dark-mode rules.
          </p>
          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
            <LiveLink href={concept.liveUrl}>View the live HTML email</LiveLink>
            <LiveLink href={concept.plainTextUrl}>Plain-text version</LiveLink>
          </div>
        </div>
      </div>
    </section>
  );
}
