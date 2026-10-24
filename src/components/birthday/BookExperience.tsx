"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { CoverBack, CoverFront } from "./BookCover";
import { Fireworks } from "./Fireworks";
import { EnvelopePage } from "./pages/EnvelopePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { CameraPage } from "./pages/CameraPage";
import { SongPage } from "./pages/SongPage";
import { PhotoPage } from "./pages/PhotoPage";
import { NotesPage } from "./pages/NotesPage";

const PAGE_W = 440;
const PAGE_H = 600;
const BOOK_W = PAGE_W * 2;
const FLIP_DUR = 1.1;
const BOOK_DUR = 1.35;
const EASE: [number, number, number, number] = [0.35, 0, 0.25, 1];
const DRAG_START_PX = 9; // jarak minimum sebelum dianggap drag, bukan klik
const COMMIT_PROGRESS = 0.42; // progress minimum agar flip diselesaikan saat dilepas

type Stage = "front" | "open" | "back";
type AnimKind =
  | "opening"
  | "closeFront"
  | "openBack"
  | "closeBack"
  | "next"
  | "back";

/** Status flip: sedang ditarik (mengikuti pointer) atau sedang dianimasikan */
type Flip =
  | { mode: "drag"; kind: AnimKind; from: number; to: number; progress: number }
  | {
      mode: "animate";
      kind: AnimKind;
      from: number;
      to: number;
      initialAngle: number;
      snapBack?: boolean;
    };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Sudut rotasi halaman (deg) pada sebuah progress flip 0..1 */
function angleFor(kind: AnimKind, p: number): number {
  switch (kind) {
    case "opening":
    case "next":
      return -180 * p;
    case "closeFront":
    case "back":
      return -180 + 180 * p;
    case "closeBack":
      return 180 * p;
    case "openBack":
      return 180 - 180 * p;
  }
}

/** apakah poros flip ada di punggung kiri (elemen berada di sisi kanan buku) */
function originLeft(kind: AnimKind): boolean {
  return (
    kind === "opening" || kind === "closeFront" || kind === "next" || kind === "back"
  );
}

/** durasi penuh untuk tiap jenis flip */
function baseDur(kind: AnimKind): number {
  switch (kind) {
    case "opening":
    case "closeFront":
    case "closeBack":
    case "openBack":
      return BOOK_DUR; // gerakan sampul
    default:
      return FLIP_DUR; // balik halaman biasa
  }
}

/** Blokir klik sesaat setelah drag selesai, supaya tombol di halaman tidak ikut ter-trigger */
function useClickBlockAfterDrag() {
  const lastEnd = React.useRef(0);
  const mark = React.useCallback(() => {
    lastEnd.current = Date.now();
  }, []);
  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (Date.now() - lastEnd.current < 350) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("click", h, true);
    return () => window.removeEventListener("click", h, true);
  }, []);
  return mark;
}

function useIsMobile() {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    const f = () => setMobile(window.innerWidth < 768);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return mobile;
}

/** Satu lembar dua-sisi (depan + belakang) untuk animasi flip */
function Face({
  front,
  back,
  interactive = false,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  interactive?: boolean;
}) {
  const hidden: React.CSSProperties = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };
  return (
    <>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ ...hidden, pointerEvents: interactive ? undefined : "none" }}
      >
        {front}
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ ...hidden, transform: "rotateY(180deg)", pointerEvents: "none" }}
      >
        {back}
      </div>
    </>
  );
}

/** Tepian tumpukan halaman (fore-edge) */
function PageEdges() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute rounded-r-[5px]"
        style={{
          right: -5,
          top: 14,
          bottom: 12,
          width: 6,
          background:
            "repeating-linear-gradient(to bottom, #fdf8ee 0 2px, #e2d5bd 2px 3.5px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute rounded-b-[6px]"
        style={{
          bottom: -6,
          left: 18,
          right: 8,
          height: 6,
          background:
            "repeating-linear-gradient(to right, #fdf8ee 0 2px, #e2d5bd 2px 3.5px)",
        }}
      />
    </>
  );
}

/** Buku tertutup (dipakai untuk sampul depan & belakang saat idle) */
function ClosedBook({
  children,
  onClick,
  clickable,
  ariaLabel,
  onPointerDown,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
  ariaLabel?: string;
  onPointerDown?: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      className="absolute top-0 z-20"
      style={{ left: PAGE_W, width: PAGE_W, height: PAGE_H }}
    >
      {/* papan belakang buku */}
      <div
        aria-hidden="true"
        className="absolute rounded-l-[4px] rounded-r-[10px]"
        style={{
          left: 5,
          top: 6,
          width: PAGE_W,
          height: PAGE_H - 2,
          background: "linear-gradient(140deg, #5d2433, #3a1320)",
          boxShadow: "0 22px 44px rgba(40,10,20,0.5)",
        }}
      />
      <PageEdges />
      <div
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-label={ariaLabel}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        onClick={clickable ? onClick : undefined}
        onPointerDown={onPointerDown}
        className={`absolute inset-0 select-none overflow-hidden rounded-l-[4px] rounded-r-[10px] touch-none ${
          clickable
            ? "cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function NavButton({
  dir,
  onClick,
  disabled,
  label,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9bfa4] bg-white/85 text-[#8a5a40] shadow-[0_6px_16px_rgba(96,54,40,0.22)] backdrop-blur transition-all hover:scale-105 hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function ProgressHearts({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Halaman ${current} dari 3`}>
      {[0, 1, 2].map((i) => (
        <Heart
          key={i}
          className={`h-3.5 w-3.5 transition-colors ${
            i < current ? "text-[#c96a80]" : "text-[#cfab8a]/60"
          }`}
          fill={i < current ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

/* ============================ DESKTOP ============================ */

function DesktopBook() {
  const [stage, setStage] = React.useState<Stage>("front");
  const [spread, setSpread] = React.useState(0);
  const [flip, setFlip] = React.useState<Flip | null>(null);
  const [celebrated, setCelebrated] = React.useState(false);
  const [fireworks, setFireworks] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const fwTimer = React.useRef<number | null>(null);
  const markDragEnd = useClickBlockAfterDrag();

  const leftPages = [
    <EnvelopePage key="l0" />,
    <CameraPage key="l1" />,
    <PhotoPage key="l2" />,
  ];
  const rightPages = [
    <FavoritesPage key="r0" />,
    <SongPage key="r1" />,
    <NotesPage key="r2" />,
  ];

  React.useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const availW = Math.min(vw - 28, 990);
      const availH = vh - 235;
      setScale(Math.max(0.42, Math.min(1, availW / BOOK_W, availH / PAGE_H)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  React.useEffect(() => {
    return () => {
      if (fwTimer.current) window.clearTimeout(fwTimer.current);
    };
  }, []);

  const busy = flip !== null;

  const lightFireworks = () => {
    setCelebrated(true);
    setFireworks(true);
    if (fwTimer.current) window.clearTimeout(fwTimer.current);
    fwTimer.current = window.setTimeout(() => setFireworks(false), 9500);
  };

  const restart = () => {
    setStage("front");
    setSpread(0);
    setCelebrated(false);
    setFireworks(false);
  };

  const startFlip = React.useCallback(
    (kind: AnimKind, from: number, to: number) => {
      setFlip({ mode: "animate", kind, from, to, initialAngle: angleFor(kind, 0) });
    },
    []
  );

  const goNext = React.useCallback(() => {
    if (busy) return;
    if (stage === "front") startFlip("opening", 0, 0);
    else if (stage === "open") {
      if (spread < 2) startFlip("next", spread, spread + 1);
      else startFlip("closeBack", 2, 2);
    } else startFlip("openBack", 2, 2);
  }, [busy, stage, spread, startFlip]);

  const goBack = React.useCallback(() => {
    if (busy || stage === "front") return;
    if (stage === "open") {
      if (spread > 0) startFlip("back", spread, spread - 1);
      else startFlip("closeFront", 0, 0);
    } else startFlip("openBack", 2, 2);
  }, [busy, stage, spread, startFlip]);

  const onFlipComplete = () => {
    setFlip((f) => {
      if (!f || f.mode !== "animate" || f.snapBack) return null;
      switch (f.kind) {
        case "opening":
          setStage("open");
          setSpread(0);
          break;
        case "closeFront":
          setStage("front");
          break;
        case "openBack":
          setStage("open");
          setSpread(2);
          break;
        case "closeBack":
          setStage("back");
          break;
        case "next":
          setSpread(f.to);
          break;
        case "back":
          setSpread(f.to);
          break;
      }
      return null;
    });
  };

  // navigasi keyboard
  React.useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goBack();
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [goNext, goBack]);

  /* ---- interaksi tahan & tarik halaman ---- */
  const beginPress = (e: React.PointerEvent, side: "left" | "right") => {
    if (flip) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const startX = e.clientX;
    const pid = e.pointerId;

    let active = false;
    let kind: AnimKind | null = null;
    let from = 0;
    let to = 0;

    // tentukan jenis flip berdasarkan arah tarikan & posisi buku
    const pick = (dx: number): { kind: AnimKind; from: number; to: number } | null => {
      // tarik halaman kiri ke kanan → mundur / tutup buku
      if (side === "left" && dx > 0 && stage === "open") {
        if (spread === 2) return { kind: "closeBack", from: 2, to: 2 };
        if (spread > 0) return { kind: "back", from: spread, to: spread - 1 };
        return { kind: "closeFront", from: 0, to: 0 };
      }
      // tarik halaman kanan ke kiri → maju / buka buku
      if (side === "right" && dx < 0) {
        if (stage === "front") return { kind: "opening", from: 0, to: 0 };
        if (stage === "open") {
          return spread < 2
            ? { kind: "next", from: spread, to: spread + 1 }
            : null; // halaman terakhir: tidak ada lembar kanan untuk dibalik
        }
        return { kind: "openBack", from: 2, to: 2 };
      }
      return null;
    };

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return;
      const dx = ev.clientX - startX;
      if (!active) {
        if (Math.abs(dx) < DRAG_START_PX) return;
        const k = pick(dx);
        if (!k) {
          cleanup();
          return;
        }
        active = true;
        kind = k.kind;
        from = k.from;
        to = k.to;
        setFlip({ mode: "drag", kind: k.kind, from: k.from, to: k.to, progress: 0 });
      }
      const leftward = kind === "opening" || kind === "next" || kind === "openBack";
      const p = clamp01((leftward ? -dx : dx) / PAGE_W);
      setFlip((f) => (f && f.mode === "drag" ? { ...f, progress: p } : f));
    };

    const finish = (commitAllowed: boolean) => {
      cleanup();
      if (!active) return;
      markDragEnd();
      setFlip((f) => {
        if (!f || f.mode !== "drag") return null;
        const commit = commitAllowed && f.progress >= COMMIT_PROGRESS;
        return {
          mode: "animate",
          kind: f.kind,
          from: f.from,
          to: f.to,
          initialAngle: angleFor(f.kind, f.progress),
          snapBack: !commit,
        };
      });
    };

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return;
      finish(true);
    };
    const onCancel = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return;
      finish(false);
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  };

  const isBigMove =
    !!flip &&
    (flip.kind === "opening" ||
      flip.kind === "closeFront" ||
      flip.kind === "openBack" ||
      flip.kind === "closeBack");

  const xTarget = (() => {
    if (flip) {
      if (flip.kind === "opening" || flip.kind === "openBack") return 0;
      if (flip.kind === "closeFront" || flip.kind === "closeBack") return -PAGE_W;
      return stage === "open" ? 0 : -PAGE_W;
    }
    return stage === "open" ? 0 : -PAGE_W;
  })();

  // geser buku mengikuti tarikan (untuk gerakan sampul)
  const dragX = (() => {
    if (!flip || flip.mode !== "drag") return null;
    const p = flip.progress;
    if (flip.kind === "opening" || flip.kind === "openBack") return -PAGE_W * (1 - p);
    if (flip.kind === "closeFront" || flip.kind === "closeBack") return -PAGE_W * p;
    return stage === "open" ? 0 : -PAGE_W;
  })();

  const showPages = stage === "open" || !!flip;
  const under = (() => {
    if (!flip) {
      if (stage === "open") return [leftPages[spread], rightPages[spread]];
      return [null, null];
    }
    switch (flip.kind) {
      case "opening":
        return [null, rightPages[0]];
      case "closeFront":
        return [null, rightPages[0]];
      case "next":
        return [leftPages[flip.from], rightPages[flip.to]];
      case "back":
        return [leftPages[flip.to], rightPages[flip.from]];
      case "closeBack":
        return [null, rightPages[2]];
      case "openBack":
        return [null, rightPages[2]];
    }
  })();

  const flipFace = (kind: AnimKind, from: number, to: number) => {
    switch (kind) {
      case "opening":
      case "closeFront":
        return <Face front={<CoverFront />} back={leftPages[0]} />;
      case "next":
        return <Face front={rightPages[from]} back={leftPages[to]} />;
      case "back":
        return <Face front={rightPages[to]} back={leftPages[from]} />;
      case "closeBack":
      case "openBack":
        return <Face front={leftPages[2]} back={<CoverBack celebrated={celebrated} />} />;
    }
  };

  const flipGeom = flip
    ? {
        left: originLeft(flip.kind) ? PAGE_W : 0,
        transformOrigin: originLeft(flip.kind)
          ? ("left center" as const)
          : ("right center" as const),
      }
    : null;

  const dragging = flip?.mode === "drag";

  return (
    <div className="flex flex-col items-center">
      {/* kotak skala agar layout mengikuti ukuran buku yang diskalakan */}
      <div
        className="relative mx-auto"
        style={{ width: BOOK_W * scale, height: PAGE_H * scale }}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            width: BOOK_W,
            height: PAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          onDragStart={(e) => e.preventDefault()}
        >
          <div className="h-full w-full" style={{ perspective: 2600 }}>
            <motion.div
              initial={{ opacity: 0, y: 26, x: -PAGE_W }}
              animate={{ opacity: 1, y: 0, x: dragX ?? xTarget }}
              transition={{
                opacity: { duration: 0.9, ease: "easeOut" },
                y: { duration: 0.9, ease: "easeOut" },
                x:
                  dragging
                    ? { duration: 0 }
                    : { duration: isBigMove ? BOOK_DUR : 0.9, ease: EASE },
              }}
              className="relative h-full w-full select-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* bayangan di meja */}
              <div
                aria-hidden="true"
                className="absolute inset-x-[6%] bottom-[-26px] h-9 rounded-[50%] bg-black/30 blur-xl"
              />

              {/* tumpukan halaman buku terbuka */}
              {showPages && (
                <div
                  className="absolute inset-0 z-10 flex"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className={`relative h-full touch-none overflow-hidden rounded-l-[10px] ${
                      dragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{ width: PAGE_W }}
                    onPointerDown={(e) => beginPress(e, "left")}
                  >
                    {under[0]}
                  </div>
                  <div
                    className={`relative h-full touch-none overflow-hidden rounded-r-[10px] ${
                      dragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{ width: PAGE_W }}
                    onPointerDown={(e) => beginPress(e, "right")}
                  >
                    {under[1]}
                    <PageEdges />
                  </div>
                  {/* punggung tengah */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-[5px] -translate-x-1/2 rounded"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0.4), rgba(0,0,0,0.22))",
                    }}
                  />
                </div>
              )}

              {/* ---- overlay halaman yang dibalik (drag / animasi) ---- */}
              {flip && flip.mode === "drag" && flipGeom && (
                <div
                  className="pointer-events-none absolute top-0 z-40"
                  style={{
                    left: flipGeom.left,
                    width: PAGE_W,
                    height: PAGE_H,
                    transformOrigin: flipGeom.transformOrigin,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${angleFor(flip.kind, flip.progress)}deg)`,
                  }}
                >
                  {flipFace(flip.kind, flip.from, flip.to)}
                </div>
              )}

              {flip && flip.mode === "animate" && flipGeom && (
                <motion.div
                  initial={{ rotateY: flip.initialAngle }}
                  animate={{
                    rotateY: flip.snapBack
                      ? angleFor(flip.kind, 0)
                      : angleFor(flip.kind, 1),
                  }}
                  transition={
                    flip.snapBack
                      ? {
                          duration: Math.max(
                            0.3,
                            (0.55 *
                              Math.abs(angleFor(flip.kind, 0) - flip.initialAngle)) /
                              180
                          ),
                          ease: "easeOut",
                        }
                      : {
                          duration: Math.max(
                            0.34,
                            (baseDur(flip.kind) *
                              Math.abs(angleFor(flip.kind, 1) - flip.initialAngle)) /
                              180
                          ),
                          ease: EASE,
                        }
                  }
                  onAnimationComplete={onFlipComplete}
                  className="pointer-events-none absolute top-0 z-40"
                  style={{
                    left: flipGeom.left,
                    width: PAGE_W,
                    height: PAGE_H,
                    transformOrigin: flipGeom.transformOrigin,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {flipFace(flip.kind, flip.from, flip.to)}
                </motion.div>
              )}

              {/* ---- sampul idle ---- */}
              {stage === "front" && !flip && (
                <ClosedBook
                  clickable
                  ariaLabel="Buka buku kecil kita"
                  onClick={goNext}
                  onPointerDown={(e) => beginPress(e, "right")}
                >
                  <CoverFront onOpen={goNext} />
                </ClosedBook>
              )}
              {stage === "back" && !flip && (
                <ClosedBook
                  ariaLabel="Sampul akhir dengan kue ulang tahun"
                  onPointerDown={(e) => beginPress(e, "right")}
                >
                  <CoverBack
                    onCakeClick={lightFireworks}
                    celebrated={celebrated}
                    onRestart={restart}
                  />
                </ClosedBook>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* navigasi */}
      <div className="mt-7 flex items-center gap-5">
        <NavButton
          dir="left"
          label="Halaman sebelumnya"
          onClick={goBack}
          disabled={busy || stage === "front"}
        />
        {stage === "open" ? (
          <ProgressHearts current={spread + 1} />
        ) : (
          <span className="font-script text-[17px] leading-none text-[#9a6b4d]/90">
            {stage === "front" ? "buka bukunya 🤍" : "klik kuenya 🎂"}
          </span>
        )}
        <NavButton
          dir="right"
          label="Halaman berikutnya"
          onClick={goNext}
          disabled={busy}
        />
      </div>
      <p className="mt-3 font-script text-[15px] leading-none text-[#9a6b4d]/80">
        psst — boleh juga tahan &amp; tarik halamannya 🤍
      </p>

      <Fireworks active={fireworks} />
    </div>
  );
}

/* ============================ MOBILE ============================ */

const MOBILE_SCREENS = [
  <EnvelopePage key="m0" />,
  <FavoritesPage key="m1" />,
  <CameraPage key="m2" />,
  <SongPage key="m3" />,
  <PhotoPage key="m4" />,
  <NotesPage key="m5" />,
];

function MobileBook() {
  const [step, setStep] = React.useState(-1); // -1 = sampul, 0..5 = isi, 6 = sampul akhir
  const [dir, setDir] = React.useState(1);
  const [celebrated, setCelebrated] = React.useState(false);
  const [fireworks, setFireworks] = React.useState(false);
  const [dragX, setDragX] = React.useState(0);
  const [dragActive, setDragActive] = React.useState(false);
  const dragXRef = React.useRef(0);
  const press = React.useRef<{
    startX: number;
    pid: number;
    active: boolean;
  } | null>(null);
  const fwTimer = React.useRef<number | null>(null);
  const markDragEnd = useClickBlockAfterDrag();

  React.useEffect(() => {
    return () => {
      if (fwTimer.current) window.clearTimeout(fwTimer.current);
    };
  }, []);

  const lightFireworks = () => {
    setCelebrated(true);
    setFireworks(true);
    if (fwTimer.current) window.clearTimeout(fwTimer.current);
    fwTimer.current = window.setTimeout(() => setFireworks(false), 9500);
  };

  const go = (d: number) => {
    setDir(d);
    setStep((s) => Math.min(6, Math.max(-1, s + d)));
  };

  const restart = () => {
    setStep(-1);
    setCelebrated(false);
    setFireworks(false);
  };

  const atStart = step <= -1;
  const atEnd = step >= 6;

  /* ---- geser (swipe) halaman ---- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (press.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const startX = e.clientX;
    const pid = e.pointerId;
    const state = { startX, pid, active: false };
    press.current = state;

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pid) return;
      const dx = ev.clientX - startX;
      if (!state.active) {
        if (Math.abs(dx) < 12) return;
        state.active = true;
        setDragActive(true);
      }
      const resisted = (atStart && dx > 0) || (atEnd && dx < 0);
      const next = resisted ? dx * 0.22 : dx;
      dragXRef.current = next;
      setDragX(next);
    };

    const finish = () => {
      cleanup();
      press.current = null;
      if (!state.active) return;
      setDragActive(false);
      markDragEnd();
      const dx = dragXRef.current;
      dragXRef.current = 0;
      setDragX(0);
      if (dx < -70) go(1);
      else if (dx > 70) go(-1);
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className="w-[min(92vw,400px)]"
        style={{ perspective: 1400 }}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          className="relative select-none overflow-hidden rounded-[16px] shadow-[0_26px_60px_rgba(60,20,15,0.5)] ring-4 ring-[#4a1b26]/85"
          style={{
            height: "min(70vh, 640px)",
            transformStyle: "preserve-3d",
            transform: `translateX(${dragX}px)`,
            transition: dragActive
              ? "none"
              : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
            touchAction: "pan-y",
          }}
          onPointerDown={onPointerDown}
        >
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              initial={{ x: dir * 90, opacity: 0, rotateY: dir * 12 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: -dir * 90, opacity: 0, rotateY: -dir * 10 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {step === -1 && <CoverFront onOpen={() => go(1)} />}
              {step >= 0 && step <= 5 && MOBILE_SCREENS[step]}
              {step === 6 && (
                <CoverBack
                  onCakeClick={lightFireworks}
                  celebrated={celebrated}
                  onRestart={restart}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* navigasi */}
      <div className="mt-6 flex items-center gap-5">
        <NavButton
          dir="left"
          label="Halaman sebelumnya"
          onClick={() => go(-1)}
          disabled={step <= -1}
        />
        {step >= 0 && step <= 5 ? (
          <div className="flex items-center gap-1.5" aria-label={`Halaman ${step + 1} dari 6`}>
            {MOBILE_SCREENS.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all ${
                  i === step
                    ? "h-2.5 w-5 bg-[#c96a80]"
                    : "h-2 w-2 bg-[#cfab8a]/60"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <span className="font-script text-[16px] leading-none text-[#9a6b4d]/90">
            {step === -1 ? "buka bukunya 🤍" : "klik kuenya 🎂"}
          </span>
        )}
        <NavButton
          dir="right"
          label="Halaman berikutnya"
          onClick={() => go(1)}
          disabled={step >= 6}
        />
      </div>
      <p className="mt-3 font-script text-[15px] leading-none text-[#9a6b4d]/80">
        psst — geser halamannya juga bisa 🤍
      </p>

      <Fireworks active={fireworks} />
    </div>
  );
}

/* ============================ ROOT ============================ */

export function BookExperience() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileBook /> : <DesktopBook />;
}
