"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowDown } from "lucide-react";
import { apokynAssets, bofaAssets, cartAssets, rialtoAssets, threeAssets, type ProjectImage } from "@/data/projects";

type WallItem = { image: ProjectImage; href: string; project: string };

const B = "/work/bank-of-america";
const bofaWall = (im: ProjectImage | undefined): WallItem[] => (im ? [{ image: im, href: B, project: "Bank of America" }] : []);

const columns: WallItem[][] = [
  [
    ...bofaWall(bofaAssets.vehicles),
    { image: cartAssets.registration, href: "/work/car-t-talk", project: "CAR-T TALK" },
  ],
  [
    ...bofaWall(bofaAssets.merrill),
    { image: threeAssets.renewal, href: "/work/three-insurance", project: "THREE Insurance" },
  ],
  [
    ...bofaWall(bofaAssets.travel),
    { image: rialtoAssets.desktop, href: "/work/rialto", project: "Rialto" },
  ],
  [
    ...bofaWall(bofaAssets.helocA),
    { image: apokynAssets.onTime, href: "/work/apokyn", project: "APOKYN" },
  ],
];

const ease = [0.16, 1, 0.3, 1] as const;
const headline = "I engineer digital experiences that move brands forward.";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = [
    useTransform(scrollYProgress, [0, 1], [0, -90]),
    useTransform(scrollYProgress, [0, 1], [0, -220]),
    useTransform(scrollYProgress, [0, 1], [0, -40]),
    useTransform(scrollYProgress, [0, 1], [0, -160]),
  ];

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="shell relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-12 lg:gap-8">
        {/* Copy */}
        <div className="relative z-10 flex flex-col justify-center pb-10 pt-28 sm:pt-32 lg:col-span-6 lg:pb-24 lg:pt-36">
          <motion.p
            className="mb-7 text-[0.7rem] font-medium tracking-[0.16em] text-muted sm:text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            MARKETING TECHNOLOGY · CRM · DIGITAL DEVELOPMENT
          </motion.p>

          <h1 id="hero-title" className="display text-[clamp(3rem,12vw,4.6rem)] text-ink sm:text-[clamp(4rem,8.4vw,6rem)] lg:text-[clamp(4.25rem,5.6vw,6.4rem)]">
            {headline.split(" ").map((word, i) => (
              <Fragment key={i}>
              <span className="inline-block overflow-hidden pb-[0.1em] align-top">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.05, delay: 0.12 + i * 0.045, ease }}
                >
                  {word}
                </motion.span>
              </span>{" "}
              </Fragment>
            ))}
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          >
            <p className="mt-8 max-w-[34rem] text-[1.075rem] leading-relaxed text-muted sm:text-lg">
              I build the systems behind exceptional marketing, connecting creative, customer data, automation and
              development to deliver sophisticated digital experiences.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="#work"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-ink pl-6 pr-5 text-[0.95rem] font-medium text-paper transition-colors duration-300 hover:bg-signal"
              >
                Explore My Work
                <ArrowDown size={17} className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex h-12 items-center rounded-full border border-ink/25 px-6 text-[0.95rem] font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                Get in Touch
              </Link>
            </div>

            <Link
              href="#recognition"
              className="group mt-8 inline-flex items-center gap-3 text-sm text-ink"
            >
              <span className="flex -space-x-1" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-[#C9A227] ring-2 ring-paper" />
                <span className="h-3 w-3 rounded-full bg-[#A7ADB5] ring-2 ring-paper" />
                <span className="h-3 w-3 rounded-full bg-[#B0713F] ring-2 ring-paper" />
              </span>
              <span className="link-underline">Gold, Silver and Bronze, FCS Portfolio Awards for Bank of America email</span>
            </Link>

            <dl className="mt-10 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-1 border-t border-rule pt-5 text-sm">
              <div>
                <dt className="text-muted">Currently</dt>
                <dd className="mt-1 text-ink">
                  Email Developer, Tamman Inc.
                  <span className="block text-muted">for Bank of America</span>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Focus</dt>
                <dd className="mt-1 text-ink">
                  Salesforce Marketing Cloud,
                  <span className="block text-muted">CRM and lifecycle email</span>
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* Proof wall of real work */}
        <div className="relative -mx-4 h-[118vw] max-h-[44rem] sm:-mx-8 sm:h-[78vw] lg:absolute lg:bottom-0 lg:top-[4.5rem] lg:right-0 lg:mx-0 lg:h-auto lg:max-h-none lg:w-[50%]">
          <div
            className="absolute inset-0 flex gap-3 px-4 sm:gap-4 sm:px-8 lg:gap-5 lg:pl-4 lg:pr-12"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 78%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 78%, transparent 100%)",
            }}
          >
            {columns.map((col, ci) => (
              <WallColumn key={ci} items={col} index={ci} y={drift[ci]} reduce={Boolean(reduce)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WallColumn({
  items,
  index,
  y,
  reduce,
}: {
  items: WallItem[];
  index: number;
  y: MotionValue<number>;
  reduce: boolean;
}) {
  const startOffsets = ["14%", "4%", "22%", "9%"];
  return (
    <motion.div
      className={`min-w-0 flex-1 ${index === 3 ? "hidden sm:block" : ""}`}
      style={{ paddingTop: startOffsets[index] }}
      initial={reduce ? false : { opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.3, delay: 0.25 + index * 0.1, ease }}
    >
      <motion.div className="flex flex-col gap-3 sm:gap-4 lg:gap-5" style={{ y: reduce ? 0 : y }}>
        {items.map((it, i) => (
          <Link
            key={it.image.src}
            href={it.href}
            className="group/sheet relative block shrink-0"
            aria-label={`${it.project}: ${it.image.title}. View case study`}
          >
            <Image
              src={it.image.src}
              width={it.image.width}
              height={it.image.height}
              alt=""
              sizes="(min-width: 1024px) 12vw, (min-width: 640px) 22vw, 31vw"
              quality={90}
              priority={i === 0}
              className="email-shadow block h-auto w-full rounded-[3px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/sheet:-translate-y-1.5"
            />
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper opacity-0 transition-opacity duration-300 group-hover/sheet:opacity-100 group-focus-visible/sheet:opacity-100">
              {it.project}
            </span>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}
