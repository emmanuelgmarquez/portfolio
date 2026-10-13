import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/lib/site";
import { CopyEmail } from "./copy-email";

export function Contact({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-night text-night-ink"
    >
      <div className={`shell ${compact ? "py-24 sm:py-28" : "pb-20 pt-28 sm:pb-24 sm:pt-40"}`}>
        <h2
          id="contact-title"
          className={`display max-w-[14ch] text-night-ink ${
            compact ? "text-[clamp(2.75rem,7vw,6rem)]" : "text-[clamp(3.25rem,10vw,9.5rem)]"
          }`}
        >
          Let&rsquo;s build something exceptional.
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <p className="max-w-[32rem] text-lg leading-relaxed text-night-muted lg:col-span-5">
            Looking for someone who understands both the technology and the marketing behind great digital
            experiences? Let&rsquo;s connect.
          </p>
          <div className="flex flex-col gap-4 lg:col-span-7 lg:items-end">
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-white pl-6 pr-7 text-base font-medium text-night transition-colors duration-300 hover:bg-signal hover:text-white"
              >
                <Mail size={18} aria-hidden="true" />
                Email Me
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-14 items-center gap-3 rounded-full border border-white/25 pl-7 pr-6 text-base font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
              >
                Connect on LinkedIn
                <ArrowUpRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <CopyEmail />
          </div>
        </div>
      </div>
    </section>
  );
}
