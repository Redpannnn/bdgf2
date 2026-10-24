"use client";

import { PageShell, TapeNote } from "./PageShell";

const NOTES = [
  "Senyummu — obat paling ampuh buat hari-hariku yang berat.",
  "Caramu marah sebentar, tapi sayangnya nggak pernah turun.",
  "Suara tawamu: playlist favorit yang nggak pernah bikin bosen.",
  "Pelukmu — tempat pulang paling nyaman di seluruh dunia.",
  "Kamu ngertiin aku, bahkan pas aku nggak ngerti diri sendiri.",
  "Karena kamu nggak perlu jadi apa-apa. Kamu cukup jadi kamu.",
];

const ROT = [-1.2, 1, -0.8, 1.4, -1, 0.8];

/**
 * Halaman kanan: daftar hal-hal yang aku suka dari kamu.
 */
export function NotesPage() {
  return (
    <PageShell side="right">
      <header>
        <TapeNote>
          <h2 className="font-script text-[26px] font-semibold leading-none text-[#8a5a40]">
            Hal yang Aku Suka dari Kamu 🤍
          </h2>
        </TapeNote>
        <p className="mt-2 text-center font-elegant text-[12px] italic text-[#9a7a5c]">
          daftar ini bakal terus nambah — you&rsquo;ve been warned
        </p>
      </header>

      <div className="bk-scroll mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
        <ul className="flex flex-col gap-2.5 pb-2">
          {NOTES.map((n, i) => (
            <li
              key={i}
              className="relative rounded-md border border-[#ead9bd] bg-[#fff8ec] px-4 py-2.5 shadow-[0_4px_12px_rgba(96,54,40,0.12)]"
              style={{ transform: `rotate(${ROT[i]}deg)` }}
            >
              <span
                aria-hidden="true"
                className="absolute -left-2 top-1/2 h-[16px] w-[42px] -translate-y-1/2 -rotate-90 bg-[#f6e3c0]/85 shadow-sm"
              />
              <span className="mr-1.5 font-elegant text-[11px] font-semibold italic text-[#c9a37a]">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="font-script text-[19px] leading-snug text-[#6f4a34]">
                {n}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-2 text-center font-script text-[17px] leading-none text-[#a5744f]/90">
        …dan masih banyak lagi, nggak muat di satu halaman ✍️
      </p>
    </PageShell>
  );
}
