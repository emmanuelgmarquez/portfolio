"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which homepage section is in view.
  useEffect(() => {
    if (!isHome) return;
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, r] of visible) {
          if (r > bestRatio) {
            best = id;
            bestRatio = r;
          }
        }
        setActive(bestRatio > 0 ? best : null);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  // Lock scroll and handle Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => firstLink.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);
  const solid = scrolled || !isHome || open;
  const shownActive = isHome ? active : pathname.startsWith("/work") ? "work" : null;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid
          ? "border-b border-rule/70 bg-paper/85 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Link
          href="/"
          className="relative z-10 whitespace-nowrap text-[0.95rem] font-semibold tracking-[-0.01em] text-ink"
          aria-label={`${site.name}, home`}
          onClick={() => setOpen(false)}
        >
          {site.wordmark}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <Link
                href={href(l.id)}
                aria-current={shownActive === l.id ? "true" : undefined}
                className={`relative rounded-full px-3 py-2 text-sm lg:px-4 transition-colors duration-300 ${
                  shownActive === l.id ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {shownActive === l.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-ink/[0.07]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href={href("contact")}
            className="hidden whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-signal sm:inline-flex md:hidden lg:inline-flex"
          >
            Let&rsquo;s Talk
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

    </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-paper md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="shell flex flex-1 flex-col justify-center gap-1">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={href(l.id)}
                    onClick={() => setOpen(false)}
                    className="display block py-2 text-[clamp(2.75rem,13vw,4.5rem)] text-ink"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="shell flex flex-col gap-3 border-t border-rule pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
              <Link
                href={href("contact")}
                onClick={() => setOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink text-paper"
              >
                Let&rsquo;s Talk
              </Link>
              <a href={`mailto:${site.email}`} className="py-2 text-center text-sm text-muted">
                {site.email}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
