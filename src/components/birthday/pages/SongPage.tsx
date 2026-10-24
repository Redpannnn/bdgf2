"use client";

import * as React from "react";
import { Music, Pause, Play } from "lucide-react";
import { PageShell, TapeNote } from "./PageShell";

const EQ_DELAYS = ["0s", "0.18s", "0.36s", "0.1s", "0.28s"];

/**
 * Halaman kanan: "Lagu Kita" — cover lagu, vinyl berputar, dan kata-kata.
 */
export function SongPage() {
  const [playing, setPlaying] = React.useState(false);

  return (
    <PageShell side="right">
      <header>
        <TapeNote>
          <h2 className="font-script text-[30px] font-semibold leading-none text-[#8a5a40]">
            Lagu Kita 🎵
          </h2>
        </TapeNote>
      </header>

      {/* vinyl + cover */}
      <div className="relative mx-auto mt-4 h-[150px] w-[214px]">
        {/* piringan hitam */}
        <div
          className={`absolute left-[64px] top-0 h-[150px] w-[150px] rounded-full shadow-[0_10px_26px_rgba(40,20,10,0.45)] ${
            playing ? "bk-spin" : ""
          }`}
          style={{
            background:
              "radial-gradient(circle, #5a4232 0 17%, #2b1d15 17.5% 100%)",
          }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0 1px, transparent 1px 5px)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-inner">
            <img
              src="/images/song-cover.png"
              alt=""
              className="h-full w-full object-cover"
            />
            <span className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f8f0de]" />
          </div>
        </div>

        {/* cover lagu */}
        <div className="absolute left-0 top-0 h-[150px] w-[150px] overflow-hidden rounded-lg shadow-[0_14px_30px_rgba(70,35,20,0.4)] ring-1 ring-black/10">
          <img
            src="/images/song-cover.png"
            alt="Cover lagu kita — gitar akustik dan bunga kering"
            className="h-full w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 32%)",
            }}
          />
        </div>
      </div>

      {/* judul */}
      <div className="mt-3 text-center">
        <p className="font-elegant text-[26px] font-semibold italic leading-none text-[#6b4630]">
          Perfect
        </p>
        <p className="mt-1 font-elegant text-[10.5px] uppercase tracking-[0.3em] text-[#a5744f]">
          — Ed Sheeran —
        </p>
      </div>

      {/* kata-kata */}
      <div className="mx-auto mt-3 w-[90%] rounded-md border border-[#ead9bd] bg-white/70 p-3 text-center shadow-sm">
        <p className="font-elegant text-[13px] italic leading-snug text-[#6b4a34]">
          &ldquo;Baby, I&rsquo;m dancing in the dark, with you between my
          arms&rdquo;
        </p>
        <p className="mt-1.5 font-script text-[17px] leading-tight text-[#a5744f]">
          yang bilang ini lagu kita? aku setuju banget — tiap dengernya yang
          kebayang cuma kamu 🤍
        </p>
      </div>

      {/* pemutar */}
      <div className="relative mt-4 flex items-center justify-center gap-4">
        {playing && (
          <>
            <Music
              aria-hidden="true"
              className="bk-note-rise absolute -top-2 left-[38%] h-4 w-4 text-[#c96a80]"
            />
            <Music
              aria-hidden="true"
              className="bk-note-rise absolute -top-1 left-[58%] h-3.5 w-3.5 text-[#d9869d]"
              style={{ animationDelay: "1.2s" }}
            />
          </>
        )}
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Jeda visualizer lagu" : "Putar visualizer lagu"}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#b45468] text-white shadow-[0_8px_18px_rgba(150,60,80,0.45)] transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
          )}
        </button>
        <div className="flex h-[28px] items-end gap-[4px]" aria-hidden="true">
          {EQ_DELAYS.map((d, i) => (
            <span
              key={i}
              className="bk-eq-bar block h-full w-[5px] rounded-full bg-[#d9869d]"
              style={{
                animationDelay: d,
                animationPlayState: playing ? "running" : "paused",
                transform: playing ? undefined : "scaleY(0.25)",
                opacity: playing ? 1 : 0.45,
              }}
            />
          ))}
        </div>
      </div>

      <p className="mt-2.5 text-center font-script text-[15px] leading-none text-[#a5744f]/90">
        visualizer-nya hiasan doang — lagunya tetep diputar terus di hati 🎶
      </p>
    </PageShell>
  );
}
