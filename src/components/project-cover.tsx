import Image from "next/image";
import type { Project, ProjectImage } from "@/data/projects";
import { apokynAssets, bofaAssets, cartAssets, patientAssets, rialtoAssets, threeAssets } from "@/data/projects";
import { Highlight } from "./code-excerpts";

type Variant = "feature" | "pair" | "hero";

/** A single email sheet, top-aligned and allowed to run off the bottom of the panel. */
function Sheet({
  image,
  sizes,
  offset,
  delay,
  className = "",
  priority,
}: {
  image: ProjectImage;
  sizes: string;
  offset: string;
  delay: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative min-w-0 flex-1 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 ${className}`}
      style={{ paddingTop: offset, transitionDelay: `${delay}ms` }}
    >
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt=""
        sizes={sizes}
        quality={90}
        priority={priority}
        className="email-shadow block h-auto w-full rounded-[3px] bg-white"
      />
    </div>
  );
}

function PanelFade({ color }: { color: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
      style={{ background: `linear-gradient(to bottom, transparent, ${color})` }}
    />
  );
}

export function ProjectCover({
  project,
  variant,
  priority = false,
}: {
  project: Project;
  variant: Variant;
  priority?: boolean;
}) {
  const panel = project.theme.panel;
  const aspect =
    variant === "feature"
      ? "aspect-square sm:aspect-[16/10] lg:aspect-[16/7.5]"
      : variant === "hero"
        ? "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/7.5]"
        : "aspect-[4/5]";

  const base = `relative overflow-hidden rounded-[4px] ${aspect}`;

  if (project.slug === "bank-of-america") {
    const order = [bofaAssets.vehicles, bofaAssets.merrill, bofaAssets.travel, bofaAssets.helocA, bofaAssets.homeEn].filter(
      (x): x is NonNullable<typeof x> => Boolean(x),
    );
    if (order.length >= 3) {
      const offsets = ["8%", "16%", "4%", "12%", "19%"];
      return (
        <div className={base} style={{ background: panel }}>
          <div className="absolute inset-0 flex gap-[2.5%] px-[6%]">
            {order.slice(0, variant === "pair" ? 3 : 5).map((im, i) => (
              <Sheet
                key={im.src}
                image={im}
                offset={offsets[i]}
                delay={i * 45}
                priority={priority && i < 2}
                sizes="(min-width: 1024px) 17vw, (min-width: 640px) 18vw, 45vw"
                className={i > 1 ? "hidden sm:block" : ""}
              />
            ))}
          </div>
          <PanelFade color={panel} />
        </div>
      );
    }
    // Code-led cover until the email screenshots are supplied.
    const snippet = project.code?.[0]?.code ?? "";
    return (
      <div className={base} style={{ background: panel }}>
        <div className="absolute inset-0 flex items-center justify-center p-[6%]">
          <div className="w-full max-w-[46rem] -rotate-1 rounded-[8px] bg-[#070c22] p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10 transition-transform duration-700 group-hover:rotate-0 sm:p-8">
            <div className="mb-4 flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <pre
              className="overflow-hidden whitespace-pre-wrap text-[0.62rem] leading-[1.7] text-[#d6dbef] sm:text-[0.8rem] lg:text-[0.9rem]"
              style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' }}
              aria-hidden="true"
            >
              <Highlight code={snippet} />
            </pre>
          </div>
        </div>
        <div className="absolute bottom-[6%] left-[6%] flex gap-2" aria-hidden="true">
          {["#C9A227", "#A7ADB5", "#B0713F"].map((c) => (
            <span key={c} className="h-4 w-4 rounded-full ring-2 ring-[#0E1B3D]" style={{ background: c }} />
          ))}
        </div>
      </div>
    );
  }

  if (project.slug === "car-t-talk") {
    const order = [cartAssets.registration, cartAssets.reminder, cartAssets.missed, cartAssets.reminderMerge, cartAssets.final, cartAssets.followUp];
    const offsets = ["9%", "15%", "5%", "19%", "11%", "7%"];
    return (
      <div className={base} style={{ background: panel }}>
        <div className="absolute inset-0 flex gap-[2.2%] px-[5%]">
          {order.map((im, i) => (
            <Sheet
              key={im.src}
              image={im}
              offset={offsets[i]}
              delay={i * 45}
              priority={priority && i < 3}
              sizes="(min-width: 1024px) 15vw, (min-width: 640px) 16vw, 30vw"
              className={i > 1 ? "hidden sm:block" : ""}
            />
          ))}
        </div>
        <PanelFade color={panel} />
      </div>
    );
  }

  if (project.slug === "three-insurance") {
    const order = [threeAssets.quote, threeAssets.invoice, threeAssets.renewal, threeAssets.receipt, threeAssets.flat];
    const offsets = ["12%", "5%", "16%", "8%", "20%"];
    return (
      <div className={base} style={{ background: panel }}>
        <div className="absolute inset-0 flex gap-[2.5%] px-[6%]">
          {order.map((im, i) => (
            <Sheet
              key={im.src}
              image={im}
              offset={offsets[i]}
              delay={i * 45}
              priority={priority && i < 3}
              sizes="(min-width: 1024px) 17vw, (min-width: 640px) 18vw, 30vw"
              className={i > 1 ? "hidden sm:block" : ""}
            />
          ))}
        </div>
        <PanelFade color={panel} />
      </div>
    );
  }

  if (project.slug === "apokyn") {
    const order = [apokynAssets.onTime, apokynAssets.offEpisodes, apokynAssets.consider];
    const offsets = ["8%", "14%", "4%"];
    const wide = variant !== "pair";
    return (
      <div className={base} style={{ background: panel }}>
        <div className={`absolute inset-0 flex gap-[4%] ${wide ? "px-[12%] lg:px-[22%]" : "px-[9%]"}`}>
          {order.map((im, i) => (
            <Sheet
              key={im.src}
              image={im}
              offset={offsets[i]}
              delay={i * 60}
              priority={priority}
              sizes={wide ? "(min-width: 1024px) 18vw, 28vw" : "(min-width: 1024px) 14vw, 28vw"}
            />
          ))}
        </div>
        <PanelFade color={panel} />
      </div>
    );
  }

  if (project.slug === "patient-programs") {
    const order = [patientAssets.ofevMentor, patientAssets.lemsA, patientAssets.ofevReminder, patientAssets.alunbrig, patientAssets.lemsInvite];
    const offsets = ["10%", "4%", "16%", "8%", "13%"];
    const wide = variant !== "pair";
    const shown = wide ? order : order.slice(0, 3);
    return (
      <div className={base} style={{ background: panel }}>
        <div className={`absolute inset-0 flex gap-[2.5%] ${wide ? "px-[6%]" : "px-[7%]"}`}>
          {shown.map((im, i) => (
            <Sheet
              key={im.src}
              image={im}
              offset={offsets[i]}
              delay={i * 45}
              priority={priority && i < 2}
              sizes={wide ? "(min-width: 1024px) 17vw, (min-width: 640px) 18vw, 45vw" : "(min-width: 1024px) 14vw, 30vw"}
              className={i > 1 ? "hidden sm:block" : ""}
            />
          ))}
        </div>
        <PanelFade color={panel} />
      </div>
    );
  }

  // Rialto: resort photography with the desktop build and the phone build layered over it.
  return (
    <div className={base} style={{ background: panel }}>
      <Image
        src={rialtoAssets.photo.src}
        alt=""
        fill
        sizes={variant === "pair" ? "(min-width: 1024px) 45vw, 100vw" : "100vw"}
        quality={75}
        priority={priority}
        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0c2236]/55 via-[#0c2236]/10 to-transparent" />
      <div
        className={`absolute top-[10%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 ${
          variant === "pair" ? "left-[8%] w-[56%]" : "left-[8%] w-[56%] sm:left-[14%] sm:w-[42%] lg:w-[34%]"
        }`}
      >
        <Image
          src={rialtoAssets.desktop.src}
          width={rialtoAssets.desktop.width}
          height={rialtoAssets.desktop.height}
          alt=""
          sizes="(min-width: 1024px) 30vw, 55vw"
          quality={90}
          priority={priority}
          className="email-shadow h-auto w-full rounded-[4px] bg-white"
        />
      </div>
      <div
        className={`absolute top-[24%] transition-transform delay-75 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-5 ${
          variant === "pair" ? "right-[7%] w-[34%]" : "right-[7%] w-[34%] sm:right-[16%] sm:w-[22%] lg:w-[16%]"
        }`}
      >
        <PhoneFrame>
          <Image
            src={rialtoAssets.mobile.src}
            width={rialtoAssets.mobile.width}
            height={rialtoAssets.mobile.height}
            alt=""
            sizes="(min-width: 1024px) 16vw, 34vw"
            quality={90}
            priority={priority}
            className="block h-auto w-full"
          />
        </PhoneFrame>
      </div>
    </div>
  );
}

/** Minimal phone bezel; content is clipped to a 9:19.5 screen. */
export function PhoneFrame({ children, scroll = false, label }: { children: React.ReactNode; scroll?: boolean; label?: string }) {
  return (
    <div className="email-shadow rounded-[14%/6.5%] bg-[#101114] p-[4.5%]">
      <div
        className={`relative aspect-[9/19.5] rounded-[10%/4.6%] bg-white ${scroll ? "scrollbar-thin overflow-y-auto overflow-x-hidden overscroll-contain" : "overflow-hidden"}`}
        tabIndex={scroll ? 0 : undefined}
        aria-label={label}
        role={scroll ? "region" : undefined}
      >
        {children}
      </div>
    </div>
  );
}
