"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import { PageShell, TapeNote } from "./PageShell";

const FILM = [
  { src: "/images/camera1.jpg", cap: "klik! manis banget 🍦", rot: -5 },
  { src: "/images/camera2.jpg", cap: "yang ini aesthetic ✨", rot: 4 },
  { src: "/images/camera3.jpg", cap: "terakhir… buatku ya 🤍", rot: -2 },
];

/**
 * Halaman kiri: mainan kamera polaroid — bisa ditekan 3 kali saja.
 */
export function CameraPage() {
  const [shots, setShots] = React.useState(0);
  const [flash, setFlash] = React.useState(0);
  const done = shots >= FILM.length;

  const takePhoto = () => {
    if (done) return;
    setFlash((f) => f + 1);
    window.setTimeout(() => setShots((s) => Math.min(s + 1, FILM.length)), 240);
  };

  return (
    <PageShell side="left">
      <header className="text-center">
        <TapeNote>
          <h2 className="font-script text-[30px] font-semibold leading-none text-[#8a5a40]">
            Tekan kameranya! 📸
          </h2>
        </TapeNote>
        <p className="mt-2.5 font-elegant text-[12px] italic text-[#9a7a5c]">
          psst — film-nya cuma ada 3, jangan boros ya
        </p>
      </header>

      {/* kamera */}
      <div className="relative mt-4 flex justify-center">
        <motion.button
          type="button"
          onClick={takePhoto}
          whileTap={done ? undefined : { scale: 0.92, rotate: -1.5 }}
          disabled={done}
          aria-label="Tekan kamera untuk motret"
          className="group relative block cursor-pointer outline-none disabled:cursor-default"
        >
          {/* tombol shutter */}
          <span className="absolute -top-[15px] right-5 block h-[11px] w-[26px] rounded-t-[4px] bg-[#e0b25c] shadow-sm" />
          <span className="absolute -top-[10px] left-1/2 block h-[13px] w-[72px] -translate-x-1/2 rounded-t-[7px] bg-[#7a4c38] shadow-sm" />

          <span className="relative block h-[118px] w-[192px] rounded-[18px] bg-gradient-to-b from-[#8a5a44] to-[#64402d] shadow-[0_16px_30px_rgba(70,40,25,0.35),inset_0_2px_3px_rgba(255,255,255,0.25)] transition-transform group-hover:-translate-y-0.5 group-disabled:translate-y-0">
            {/* jendela viewfinder */}
            <span className="absolute left-4 top-3.5 block h-[16px] w-[24px] rounded-[3px] bg-[#3a261c] shadow-inner" />
            {/* lampu flash */}
            <span className="absolute right-4 top-3 block h-[13px] w-[13px] rounded-full bg-[#fff3d6] shadow-[0_0_10px_2px_rgba(255,235,180,0.8)]" />
            {/* lensa */}
            <span className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-[#a97c5c] bg-[#3a261c] shadow-[inset_0_3px_8px_rgba(0,0,0,0.6)]">
              <span
                className="block h-[44px] w-[44px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 36% 32%, #8a6a4e 0%, #4a3020 45%, #241608 100%)",
                }}
              >
                <span className="mt-[7px] ml-[8px] block h-[10px] w-[10px] rounded-full bg-white/35" />
              </span>
            </span>
          </span>

          <span className="mt-2.5 block text-center font-script text-[18px] leading-none text-[#a5744f]">
            {done ? "film-nya habis! 🤍" : "klik di sini"}
          </span>
        </motion.button>

        {/* efek kilatan */}
        <AnimatePresence>
          {flash > 0 && !done && (
            <motion.div
              key={flash}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, times: [0, 0.16, 1] }}
              className="pointer-events-none absolute inset-[-24px] z-40 rounded-xl bg-white"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </div>

      {/* baki hasil foto */}
      <div className="mt-5 flex min-h-[168px] items-start justify-center gap-3">
        <AnimatePresence>
          {FILM.slice(0, shots).map((f, i) => (
            <motion.div
              key={f.src}
              initial={{
                y: 30,
                opacity: 0,
                scale: 0.7,
                rotate: -10,
                filter: "sepia(0.9) contrast(0.75) brightness(1.2)",
              }}
              animate={{
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: f.rot,
                filter: "sepia(0) contrast(1) brightness(1)",
              }}
              exit={{ opacity: 0 }}
              transition={{
                y: { type: "spring", stiffness: 130, damping: 14 },
                opacity: { duration: 0.25 },
                rotate: { type: "spring", stiffness: 120, damping: 12 },
                filter: { duration: 1.6, delay: 0.35 },
              }}
              className="relative w-[98px] shrink-0 bg-white p-[5px] pb-1 shadow-[0_10px_22px_rgba(96,54,40,0.3)]"
            >
              <img
                src={f.src}
                alt={f.cap}
                draggable={false}
                className="block aspect-square w-full select-none object-cover"
              />
              <p className="font-script pt-1 text-center text-[13px] leading-tight text-[#7a5a44]">
                {f.cap}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* indikator sisa film */}
      <div className="mt-1 flex items-center justify-center gap-2">
        {FILM.map((_, i) => (
          <span
            key={i}
            className={`block h-[9px] w-[9px] rounded-full transition-colors duration-300 ${
              i < shots ? "bg-[#c96a80]" : "bg-transparent shadow-[inset_0_0_0_1.5px_#cfab8a]"
            }`}
            aria-hidden="true"
          />
        ))}
        {done && (
          <span className="ml-1 font-script text-[16px] leading-none text-[#a5744f]">
            3/3 — semua fotonya bagus banget 🤍
          </span>
        )}
      </div>

      {/* ikon kamera kecil dekoratif */}
      <Camera
        aria-hidden="true"
        className="absolute right-4 top-4 h-4 w-4 text-[#c9a37a]/60"
      />
    </PageShell>
  );
}
