"use client";

import * as React from "react";

/** Kupu-kupu siluet elegan (gold) */
export function Butterfly({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M49 47 C40 22 15 10 8 24 C1 38 24 50 43 51 C26 55 10 62 16 74 C22 86 42 72 48 55 Z" />
      <path d="M51 47 C60 22 85 10 92 24 C99 38 76 50 57 51 C74 55 90 62 84 74 C78 86 58 72 52 55 Z" />
      <ellipse cx="50" cy="53" rx="2.6" ry="17" />
      <path
        d="M48 37 C44 29 38 25 33 23 M52 37 C56 29 62 25 67 23"
        stroke="currentColor"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Bunga 5 kelopak */
export function Flower({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const angles = [0, 72, 144, 216, 288];
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      {angles.map((a) => (
        <ellipse
          key={a}
          cx="50"
          cy="27"
          rx="12.5"
          ry="21"
          transform={`rotate(${a} 50 50)`}
          opacity="0.88"
        />
      ))}
      <circle cx="50" cy="50" r="9.5" />
    </svg>
  );
}

/** Ranting kecil dengan daun-daun */
export function Sprig({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M52 156 C46 110 46 66 54 8"
        stroke="currentColor"
        strokeWidth="3.4"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="52" rx="17" ry="7" transform="rotate(-34 32 52)" />
      <ellipse cx="72" cy="76" rx="17" ry="7" transform="rotate(30 72 76)" />
      <ellipse cx="34" cy="102" rx="16" ry="6.6" transform="rotate(-28 34 102)" />
      <ellipse cx="70" cy="124" rx="15" ry="6.4" transform="rotate(26 70 124)" />
    </svg>
  );
}

/** Deterministic pseudo-random (aman SSR / anti hydration-mismatch) */
function rnd(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Bulatkan ke 2 desimal agar style SSR & client identik */
function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

/** Hujan kelopak bunga lembut di background */
export function PetalRain({ count = 14 }: { count?: number }) {
  const petals = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: r2(rnd(i + 1) * 100),
        delay: r2(rnd(i + 21) * 14),
        duration: r2(11 + rnd(i + 41) * 10),
        size: r2(9 + rnd(i + 61) * 10),
        drift: r2((rnd(i + 81) - 0.5) * 160),
        opacity: r2(0.3 + rnd(i + 101) * 0.35),
        rot: r2(rnd(i + 121) * 360),
      })),
    [count]
  );
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="bk-petal"
          style={
            {
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `-${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        >
          <span
            style={{
              display: "block",
              width: p.size,
              height: p.size * 0.72,
              background:
                "linear-gradient(135deg, rgba(248,177,196,0.95), rgba(240,133,163,0.9))",
              borderRadius: "72% 28% 72% 28%",
              transform: `rotate(${p.rot}deg)`,
              opacity: p.opacity,
              boxShadow: "0 2px 6px rgba(190,90,110,0.18)",
            }}
          />
        </span>
      ))}
    </div>
  );
}

/** Titik-titik kilau kecil */
export function Sparkles({
  count = 10,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const dots = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: r2(6 + rnd(i + 7) * 88),
        top: r2(6 + rnd(i + 27) * 88),
        size: r2(3 + rnd(i + 47) * 4),
        delay: r2(rnd(i + 67) * 2.4),
        dur: r2(1.8 + rnd(i + 87) * 1.6),
      })),
    [count]
  );
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="bk-twinkle absolute rounded-full bg-[#ffe9b0]"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
            boxShadow: "0 0 6px 1px rgba(255,225,150,0.65)",
          }}
        />
      ))}
    </div>
  );
}

/** Strip washi tape untuk polaroid / kertas */
export function Tape({
  className,
  style,
  color = "rgba(252, 231, 187, 0.75)",
}: {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-[22px] w-[64px] shadow-sm ${className ?? ""}`}
      style={{
        background: `linear-gradient(100deg, transparent 2%, ${color} 8%, ${color} 92%, transparent 98%)`,
        backdropFilter: "saturate(1.1)",
        ...style,
      }}
    />
  );
}
