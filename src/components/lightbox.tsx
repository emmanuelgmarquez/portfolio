"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, Minus, Plus, X } from "lucide-react";
import type { ProjectImage } from "@/data/projects";

type LightboxApi = { open: (src: string) => void };
const LightboxContext = createContext<LightboxApi | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used inside <LightboxProvider>");
  return ctx;
}

const ZOOMS = [1, 1.5, 2, 3];
/** Comfortable reading width for a 600px email captured at 2x. */
const BASE_WIDTH = 760;

export function LightboxProvider({
  items,
  label,
  children,
}: {
  items: ProjectImage[];
  label: string;
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const api = useMemo<LightboxApi>(
    () => ({
      open: (src: string) => {
        const i = items.findIndex((it) => it.src === src);
        if (i === -1) return;
        opener.current = document.activeElement as HTMLElement | null;
        setIndex(i);
      },
    }),
    [items],
  );

  const close = useCallback(() => {
    setIndex(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  return (
    <LightboxContext.Provider value={api}>
      {children}
      <Portal>
        <AnimatePresence>
          {index !== null && (
            <Viewer key="viewer" items={items} index={index} setIndex={setIndex} onClose={close} label={label} />
          )}
        </AnimatePresence>
      </Portal>
    </LightboxContext.Provider>
  );
}

function Viewer({
  items,
  index,
  setIndex,
  onClose,
  label,
}: {
  items: ProjectImage[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
  label: string;
}) {
  const item = items[index];
  const [zoomStep, setZoomStep] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [loaded, setLoaded] = useState<string | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);
  const count = items.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setZoomStep(0);
      setIndex((index + dir + count) % count);
    },
    [index, count, setIndex],
  );

  // Measure the scroll stage for sizing.
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageWidth(el.clientWidth));
    ro.observe(el);
    setStageWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Reset scroll position when the image changes.
  useEffect(() => {
    stage.current?.scrollTo({ top: 0, left: 0 });
  }, [index]);

  // Body scroll lock + initial focus.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Preload neighbours.
  useEffect(() => {
    [items[(index + 1) % count], items[(index - 1 + count) % count]].forEach((it) => {
      const i = new Image();
      i.src = it.src;
    });
  }, [index, items, count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      setZoomStep((z) => Math.min(z + 1, ZOOMS.length - 1));
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      setZoomStep((z) => Math.max(z - 1, 0));
    } else if (e.key === "0") {
      setZoomStep(0);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog.
      const focusables = dialog.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Fit: emails read best near 760px; never wider than the stage; small sources get a modest lift.
  const padding = stageWidth < 640 ? 24 : 64;
  const available = Math.max(stageWidth - padding, 200);
  const isWide = item.width > item.height;
  const fitWidth = isWide ? Math.min(available, 1400) : Math.min(available, Math.max(BASE_WIDTH, Math.min(item.width, 900)));
  const zoom = ZOOMS[zoomStep];
  const displayWidth = Math.round(fitWidth * zoom);
  const zoomedPastStage = displayWidth > available + 1;

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} image viewer`}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[90] flex flex-col bg-[#0b0d12]/95 text-white backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2 sm:px-5">
        <div className="min-w-0 pl-1">
          <p className="truncate text-sm font-medium" aria-live="polite">
            {item.title}
          </p>
          <p className="text-xs text-white/55">
            {index + 1} of {count}
            <span className="hidden sm:inline">
              {" "}
              &nbsp;&middot;&nbsp; {item.width}&times;{item.height}px
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ToolButton
            label="Zoom out"
            onClick={() => setZoomStep((z) => Math.max(z - 1, 0))}
            disabled={zoomStep === 0}
          >
            <Minus size={18} />
          </ToolButton>
          <button
            type="button"
            onClick={() => setZoomStep(0)}
            className="hidden h-10 min-w-14 rounded-full px-2 text-xs tabular-nums text-white/75 hover:bg-white/10 sm:block"
            aria-label="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <ToolButton
            label="Zoom in"
            onClick={() => setZoomStep((z) => Math.min(z + 1, ZOOMS.length - 1))}
            disabled={zoomStep === ZOOMS.length - 1}
          >
            <Plus size={18} />
          </ToolButton>
          <a
            href={item.src}
            target="_blank"
            rel="noopener"
            className="hidden h-10 items-center gap-2 rounded-full px-3 text-xs text-white/75 hover:bg-white/10 hover:text-white md:inline-flex"
          >
            <ExternalLink size={15} aria-hidden="true" />
            Open original
          </a>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-105"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={stage}
          tabIndex={0}
          aria-label="Image, scroll to read the full email"
          className="scrollbar-thin absolute inset-0 overflow-auto overscroll-contain focus-visible:outline-none"
          style={{ touchAction: zoomedPastStage ? "auto" : "pan-y pinch-zoom" }}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse") return;
            swipe.current = { x: e.clientX, y: e.clientY, t: Date.now() };
          }}
          onPointerUp={(e) => {
            const s = swipe.current;
            swipe.current = null;
            if (!s || zoomedPastStage) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - s.t < 700) {
              go(dx < 0 ? 1 : -1);
            }
          }}
        >
          <div
            className="mx-auto py-6 sm:py-10"
            style={{ width: Math.max(displayWidth, 0), paddingInline: 0 }}
          >
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: loaded === item.src ? 1 : 0.4, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-[6px] bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
            >
              {/* Full-resolution original: next/image would resample it, which defeats inspection. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                onLoad={() => setLoaded(item.src)}
                draggable={false}
                className="block h-auto w-full select-none"
                style={{ cursor: zoomStep === ZOOMS.length - 1 ? "zoom-out" : "zoom-in" }}
                onClick={() => setZoomStep((z) => (z === ZOOMS.length - 1 ? 0 : z + 1))}
              />
            </motion.div>
            {item.caption && (
              <p className="mx-auto mt-5 max-w-[60ch] px-1 text-sm leading-relaxed text-white/70">{item.caption}</p>
            )}
          </div>
        </div>

        {count > 1 && (
          <>
            <NavButton side="left" label="Previous image" onClick={() => go(-1)}>
              <ChevronLeft size={22} />
            </NavButton>
            <NavButton side="right" label="Next image" onClick={() => go(1)}>
              <ChevronRight size={22} />
            </NavButton>
          </>
        )}
      </div>

      {/* Filmstrip */}
      {count > 1 && (
        <div className="hidden border-t border-white/10 px-5 py-3 md:block">
          <ul className="flex justify-center gap-2 overflow-x-auto" aria-label="All images">
            {items.map((it, i) => (
              <li key={it.src}>
                <button
                  type="button"
                  onClick={() => {
                    setZoomStep(0);
                    setIndex(i);
                  }}
                  aria-label={`Show ${it.title}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`block h-14 w-10 overflow-hidden rounded-[3px] bg-white transition-all duration-300 ${
                    i === index ? "opacity-100 ring-2 ring-signal-night ring-offset-2 ring-offset-[#0b0d12]" : "opacity-45 hover:opacity-80"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.src} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="sr-only">
        Use the left and right arrow keys to move between images, plus and minus to zoom, and Escape to close.
      </p>
    </motion.div>
  );
}

function ToolButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function NavButton({
  side,
  label,
  onClick,
  children,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-ink sm:inline-flex ${
        side === "left" ? "left-3 lg:left-6" : "right-3 lg:right-6"
      }`}
    >
      {children}
    </button>
  );
}

/** Wrap any trigger to open the viewer at a given image. */
export function LightboxTrigger({
  src,
  label,
  className,
  children,
}: {
  src: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useLightbox();
  return (
    <button type="button" onClick={() => open(src)} aria-label={label} className={className}>
      {children}
    </button>
  );
}

const noopSubscribe = () => () => {};

/** Render into <body> so no transformed ancestor can trap the fixed-position viewer. */
function Portal({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  return mounted ? createPortal(children, document.body) : null;
}
