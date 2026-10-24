"use client";

import { Polaroid } from "../Polaroid";
import { PageShell, TapeNote } from "./PageShell";

const PHOTOS = [
  { src: "/images/polaroid1.png", cap: "rooftop date ☕", rot: -4 },
  { src: "/images/polaroid2.png", cap: "manis bareng 🍦", rot: 3 },
  { src: "/images/polaroid3.png", cap: "ombak & kamu 🌊", rot: 2.5 },
  { src: "/images/polaroid4.png", cap: "lampu kota ✨", rot: -3 },
];

/**
 * Halaman kanan: note "orang favoritku" + 5 foto polaroid.
 */
export function FavoritesPage() {
  return (
    <PageShell side="right">
      <header>
        <TapeNote>
          <h2 className="font-script text-[30px] font-semibold leading-none text-[#8a5a40]">
            Orang Favoritku 🤍
          </h2>
        </TapeNote>
        <p className="mt-2.5 text-center font-elegant text-[12px] italic text-[#9a7a5c]">
          lima momen yang pengen aku bawa sampai kita tua nanti
        </p>
      </header>

      <div className="bk-scroll mt-3 min-h-0 flex-1 overflow-y-auto pb-2">
        <div className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-4">
          {PHOTOS.map((p) => (
            <Polaroid
              key={p.src}
              src={p.src}
              caption={p.cap}
              rotate={p.rot}
              aspect="square"
              className="w-[112px]"
              captionClassName="text-[15px]"
            />
          ))}
          <Polaroid
            src="/images/polaroid5.png"
            caption="rumah = kamu 🏠"
            rotate={1}
            aspect="square"
            className="col-span-2 -mt-1 w-[134px]"
            captionClassName="text-[15px]"
          />
        </div>
      </div>
    </PageShell>
  );
}
