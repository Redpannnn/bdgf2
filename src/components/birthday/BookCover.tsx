"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { BirthdayCake } from "./Cake";
import { Butterfly, Flower, Sprig, Sparkles } from "./Ornaments";

/** Lapisan kulit buku wine + tekstur + bingkai emas + ornamen sudut */
function CoverChrome({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden text-[#f3e2c7]"
      style={{
        background:
          "linear-gradient(140deg, #93404f 0%, #72293a 48%, #541f2c 100%)",
      }}
    >
      {/* tekstur kulit */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 7px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.1) 0 3px, transparent 3px 8px)",
        }}
      />
      {/* vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 110px rgba(0,0,0,0.5)" }}
      />
      {/* bayangan punggung buku (kiri) */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-12"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.12) 55%, transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] bg-black/45"
      />

      {/* bingkai emas ganda */}
      <div className="pointer-events-none absolute inset-[14px] rounded-[4px] border border-[#d9b26a]/85" />
      <div className="pointer-events-none absolute inset-[24px] rounded-[3px] border border-[#d9b26a]/40" />
      {/* sudut emas */}
      {[
        "left-[10px] top-[10px] border-l-2 border-t-2 rounded-tl-[6px]",
        "right-[10px] top-[10px] border-r-2 border-t-2 rounded-tr-[6px]",
        "left-[10px] bottom-[10px] border-l-2 border-b-2 rounded-bl-[6px]",
        "right-[10px] bottom-[10px] border-r-2 border-b-2 rounded-br-[6px]",
      ].map((c) => (
        <span
          key={c}
          aria-hidden="true"
          className={`pointer-events-none absolute h-7 w-7 border-[#e5c88c] ${c}`}
        />
      ))}

      {/* ornamen kupu & bunga */}
      <Butterfly
        className="bk-float absolute left-7 top-8 z-10 h-11 w-11 text-[#e8c583] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
        style={{ animationDelay: "0.4s" }}
      />
      <Butterfly
        className="bk-float absolute right-7 top-12 z-10 h-9 w-9 rotate-12 text-[#e8c583]/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
        style={{ animationDelay: "1.6s" }}
      />
      <Flower
        className="absolute bottom-9 left-8 z-10 h-10 w-10 text-[#e8c583]/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
      />
      <Sprig
        className="absolute bottom-2 left-[70px] z-10 h-16 w-10 -scale-x-100 text-[#e8c583]/70"
      />
      <Flower
        className="absolute bottom-12 right-7 z-10 h-8 w-8 rotate-45 text-[#e8c583]/85"
      />
      <Sprig
        className="absolute -right-2 bottom-2 z-10 h-20 w-12 text-[#e8c583]/70"
      />
      <Sparkles count={9} className="z-0" />

      {children}
    </div>
  );
}

/** Sampul depan: judul note + nama + hint buka */
export function CoverFront({ onOpen }: { onOpen?: () => void }) {
  return (
    <CoverChrome>
      <div
        role={onOpen ? "button" : undefined}
        tabIndex={onOpen ? 0 : undefined}
        aria-label={onOpen ? "Buka bukunya" : undefined}
        onKeyDown={
          onOpen
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen();
                }
              }
            : undefined
        }
        onClick={onOpen}
        className={`relative z-20 flex h-full w-full flex-col items-center justify-between px-9 pb-9 pt-9 text-center ${
          onOpen ? "cursor-pointer" : ""
        }`}
      >
        {/* note judul di tengah atas */}
        <div className="relative rotate-[-2deg]">
          <div className="relative bg-[#fdf6e8] px-6 py-2.5 shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
            <span className="font-script text-[27px] font-semibold leading-none text-[#7a4a35]">
              Buku Kecil Kita
            </span>
          </div>
          <span
            aria-hidden="true"
            className="absolute -top-[10px] left-1/2 h-[20px] w-[74px] -translate-x-1/2 rotate-[2deg] bg-[#f6e3c0]/80 shadow-sm"
          />
        </div>

        {/* nama */}
        <div className="flex flex-col items-center">
          <span
            aria-hidden="true"
            className="mb-3 flex items-center gap-2 text-[#e5c88c]"
          >
            <span className="block h-px w-14 bg-gradient-to-r from-transparent to-[#e5c88c]" />
            <Heart className="h-3.5 w-3.5" fill="currentColor" />
            <span className="block h-px w-14 bg-gradient-to-l from-transparent to-[#e5c88c]" />
          </span>
          <h1 className="font-elegant text-[54px] font-semibold italic leading-none tracking-wide text-[#f6dfae] drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]">
            Septi
          </h1>
          <span className="mt-3 font-script text-[22px] leading-none text-[#eed9b8]/95">
            dari Tama
          </span>
        </div>

        {/* hint */}
        <div className="bk-hint flex flex-col items-center gap-1 text-[#f3e2c7]/90">
          <span className="font-elegant text-[10px] uppercase tracking-[0.34em] text-[#e5c88c]/90">
            edisi ulang tahun
          </span>
          <span className="font-script text-[19px] leading-none">
            ketuk bukunya untuk membuka 🤍
          </span>
        </div>
      </div>
    </CoverChrome>
  );
}

/** Sampul akhir: kue ulang tahun + tombol kembang api */
export function CoverBack({
  onCakeClick,
  celebrated,
  onRestart,
}: {
  onCakeClick?: () => void;
  celebrated?: boolean;
  onRestart?: () => void;
}) {
  return (
    <CoverChrome>
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-between px-9 pb-8 pt-9 text-center">
        <div>
          <span className="font-elegant text-[10px] uppercase tracking-[0.34em] text-[#e5c88c]/90">
            halaman terakhir
          </span>
          <h2 className="mt-1.5 font-script text-[34px] font-semibold leading-none text-[#f6dfae] drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]">
            Selamat Ulang Tahun!
          </h2>
          <p className="mt-2 font-script text-[21px] leading-none text-[#eed9b8]">
            make a wish, Septi 🤍
          </p>
        </div>

        {/* kue */}
        <div className="flex flex-col items-center">
          <BirthdayCake onClick={onCakeClick} celebrated={celebrated} />
          <span className="bk-hint mt-2 font-script text-[18px] leading-none text-[#f3e2c7]/95">
            klik kuenya, nyalain kembang apinya 🎆
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          {celebrated ? (
            <p className="font-script text-[19px] leading-tight text-[#ffe9b0]">
              wish-nya udah dikirim ke semesta ✨
            </p>
          ) : null}
          {onRestart ? (
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full border border-[#d9b26a]/60 px-4 py-1.5 font-elegant text-[11px] uppercase tracking-[0.22em] text-[#e5c88c] transition-colors hover:bg-[#d9b26a]/15"
            >
              baca lagi dari awal
            </button>
          ) : null}
        </div>
      </div>
    </CoverChrome>
  );
}
