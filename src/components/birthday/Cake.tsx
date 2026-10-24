"use client";

import * as React from "react";

/** Deterministic sprinkle positions */
function rnd(seed: number): number {
  const x = Math.sin(seed * 91.3 + 47.7) * 24634.6345;
  return x - Math.floor(x);
}

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

const SPRINKLES = Array.from({ length: 14 }, (_, i) => ({
  left: r2(8 + rnd(i + 3) * 84),
  rot: r2(rnd(i + 33) * 360),
  color: ["#e56b8a", "#f4b8c8", "#f5d76e", "#fff", "#d98cab"][i % 5],
}));

const DRIP_COLORS: Record<string, string> = {
  rose: "#f3bfcd",
  cream: "#f9eed7",
  deep: "#e79fb2",
};

/** Barisan "netes" frosting di tepi atas tiap tier */
function Drips({ count, color }: { count: number; color: string }) {
  return (
    <div className="absolute -bottom-[7px] left-0 right-0 flex justify-between px-[2px]">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="block rounded-b-full"
          style={{
            background: color,
            width: `${90 / count}%`,
            height: 6 + (i % 3) * 3,
            opacity: 0.96,
          }}
        />
      ))}
    </div>
  );
}

function Candle({ left }: { left: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      <span
        className="bk-flame block h-[16px] w-[10px]"
        style={{
          borderRadius: "50% 50% 50% 50% / 64% 64% 36% 36%",
          background:
            "radial-gradient(circle at 50% 78%, #fff8d6 0%, #ffd45e 45%, #ff9d3c 78%, rgba(255,120,40,0) 100%)",
          boxShadow: "0 0 14px 5px rgba(255,180,80,0.55)",
        }}
      />
      <span className="block h-[5px] w-[2px] bg-[#6b4a34]" />
      <span
        className="block h-[34px] w-[9px] rounded-[3px] shadow-sm"
        style={{
          background: left
            ? "repeating-linear-gradient(45deg, #e56b8a 0 4px, #fff 4px 8px)"
            : "repeating-linear-gradient(45deg, #f4b8c8 0 4px, #fff 4px 8px)",
        }}
      />
    </div>
  );
}

/**
 * Kue ulang tahun CSS murni — bisa diklik untuk menyalakan kembang api.
 */
export function BirthdayCake({
  onClick,
  className,
 celebrated = false,
}: {
  onClick?: () => void;
  className?: string;
  celebrated?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Kue ulang tahun — klik untuk nyalain kembang api"
      className={`group relative block cursor-pointer border-0 bg-transparent p-0 outline-none transition-transform duration-200 active:scale-95 ${className ?? ""}`}
    >
      {/* lilin */}
      <div className="relative z-10 mx-auto flex items-end justify-center gap-[14px] pb-[2px]">
        <Candle left />
        <Candle left={false} />
        <Candle left />
      </div>

      {/* tumpukan kue */}
      <div className="relative mx-auto w-[178px]">
        {/* tier atas */}
        <div className="relative mx-auto h-[38px] w-[116px] rounded-t-[8px] bg-gradient-to-b from-[#f7c8d3] to-[#eeaec0] shadow-[inset_0_-6px_10px_rgba(160,70,90,0.18)]">
          <Drips count={6} color={DRIP_COLORS.rose} />
          <span className="absolute inset-x-0 top-0 h-[7px] rounded-t-[8px] bg-[#f9d4de]" />
          {SPRINKLES.slice(0, 6).map((s, i) => (
            <span
              key={i}
              className="absolute top-[13px] block h-[4px] w-[9px] rounded-full"
              style={{
                left: `${s.left * 0.9}%`,
                background: s.color,
                transform: `rotate(${s.rot}deg)`,
              }}
            />
          ))}
        </div>
        {/* tier tengah */}
        <div className="relative mx-auto h-[40px] w-[146px] bg-gradient-to-b from-[#f9eed7] to-[#efdfc0] shadow-[inset_0_-6px_10px_rgba(150,110,60,0.16)]">
          <Drips count={8} color={DRIP_COLORS.cream} />
          {SPRINKLES.slice(6, 10).map((s, i) => (
            <span
              key={i}
              className="absolute top-[14px] block h-[4px] w-[9px] rounded-full"
              style={{
                left: `${s.left}%`,
                background: s.color,
                transform: `rotate(${s.rot}deg)`,
              }}
            />
          ))}
        </div>
        {/* tier bawah */}
        <div className="relative mx-auto h-[44px] w-[178px] rounded-b-[10px] bg-gradient-to-b from-[#e79fb2] to-[#d9869d] shadow-[inset_0_-8px_12px_rgba(140,50,70,0.22)]">
          <Drips count={9} color={DRIP_COLORS.deep} />
          {SPRINKLES.slice(10).map((s, i) => (
            <span
              key={i}
              className="absolute top-[15px] block h-[4px] w-[9px] rounded-full"
              style={{
                left: `${s.left}%`,
                background: s.color,
                transform: `rotate(${s.rot}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* piring */}
      <div
        className="mx-auto mt-[3px] h-[15px] w-[225px] rounded-[50%] shadow-[0_10px_20px_rgba(70,30,40,0.35)]"
        style={{
          background: "linear-gradient(180deg, #f2e9db 0%, #d8c8b4 70%, #c3b09a 100%)",
        }}
      />

      {/* pita glow saat hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-2 -z-10 h-16 rounded-full bg-[#ffb3c1]/40 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ opacity: celebrated ? 1 : 0.55 }}
      />
    </button>
  );
}
