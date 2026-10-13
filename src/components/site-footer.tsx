import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { projects } from "@/data/projects";

export function SiteFooter() {
  return (
    <footer className="bg-night text-night-muted">
      <div className="shell border-t border-white/10 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-medium text-night-ink">{site.name}</p>
            <p className="mt-2 max-w-[24rem] text-sm leading-relaxed">
              Marketing technology, CRM and digital development. Based in {site.location.replace(", United States", "")}.
            </p>
          </div>
          <nav aria-label="Footer: site" className="lg:col-span-2">
            <p className="text-sm text-night-ink">Site</p>
            <ul className="mt-3 space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <Link href={`/#${l.id}`} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer: case studies" className="lg:col-span-3">
            <p className="text-sm text-night-ink">Case studies</p>
            <ul className="mt-3 space-y-2 text-sm">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="hover:text-white">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-2">
            <p className="text-sm text-night-ink">Elsewhere</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  Email
                </a>
              </li>
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. Client work is shown for portfolio purposes; all trademarks
            belong to their owners.
          </p>
          <a href="#top" className="inline-flex items-center gap-2 text-night-ink hover:text-white">
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
