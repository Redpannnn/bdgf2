"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PageShell } from "./PageShell";

/**
 * Halaman kiri: amplop dengan segel hati.
 * Klik hati → flap terbuka → surat ucapan ulang tahun naik ke atas.
 */
export function EnvelopePage() {
  const [open, setOpen] = React.useState(false);

  return (
    <PageShell side="left">
      <header className="text-center">
        <h2 className="font-script text-[30px] font-semibold leading-none text-[#8a5a40]">
          ada pesan buatmu ✉️
        </h2>
        <p className="mt-1.5 font-elegant text-[12px] italic text-[#9a7a5c]">
          sesuatu yang dulu cuma pengen aku bisikin diam-diam…
        </p>
      </header>

      {/* panggung amplop */}
      <div className="relative mt-2 min-h-0 flex-1">
        {/* surat */}
        <motion.div
          initial={false}
          animate={
            open
              ? { top: 4, opacity: 1 }
              : { top: "calc(100% - 158px)", opacity: 0 }
          }
          transition={{
            top: open
              ? { type: "spring", stiffness: 88, damping: 15, delay: 0.42 }
              : { duration: 0.3 },
            opacity: { duration: 0.45, delay: open ? 0.42 : 0 },
          }}
          className="absolute left-1/2 z-10 w-[296px] max-w-[92%] -translate-x-1/2"
        >
          <div className="bk-scroll max-h-[248px] overflow-y-auto rounded-md border border-[#ead9bd] bg-[#fffdf6] p-4 shadow-[0_16px_34px_rgba(96,54,40,0.3)]">
            <p className="text-center font-script text-[23px] font-semibold leading-tight text-[#b45468]">
              Selamat Ulang Tahun, Sayangku 🎂
            </p>
            <p className="mt-2 font-elegant text-[12px] leading-relaxed text-[#6b4a34]">
              Terima kasih sudah lahir ke dunia dan jadi bagian terbaik dalam
              hidupku. Semoga panjang umur, sehat selalu, dan mimpi-mimpimu satu
              per satu terwujud.
            </p>
            <p className="mt-1.5 font-elegant text-[12px] leading-relaxed text-[#6b4a34]">
              Aku bangga banget sama kamu — dan aku sayang kamu, kemarin, hari
              ini, dan seterusnya.
            </p>
            <p className="mt-2 text-right font-script text-[19px] leading-none text-[#8a5a40]">
              — Tama 🤍
            </p>
          </div>
        </motion.div>

        {/* amplop */}
        <div className="absolute inset-x-0 bottom-9 z-20 mx-auto w-[320px] max-w-[94%]">
          <div
            className="relative h-[205px] w-full"
            style={{ perspective: "900px" }}
          >
            {/* panel belakang */}
            <div className="absolute inset-0 rounded-md bg-[#efdcbb] shadow-[0_18px_36px_rgba(96,54,40,0.32)]" />

            {/* saku depan */}
            <div
              className="absolute inset-0 z-20 rounded-md"
              style={{
                background:
                  "linear-gradient(180deg, #f6e8cd 0%, #efdcbb 100%)",
                clipPath:
                  "polygon(0 26%, 50% 60%, 100% 26%, 100% 100%, 0 100%)",
                boxShadow: "inset 0 2px 6px rgba(120,80,40,0.18)",
              }}
            />
            <span className="absolute inset-x-0 bottom-3 z-20 text-center font-script text-[19px] leading-none text-[#a5744f]/85">
              untuk: seseorang yang paling kusayang 🤍
            </span>

            {/* flap */}
            <motion.div
              initial={false}
              animate={{ rotateX: open ? -180 : 0 }}
              transition={{ duration: 0.68, ease: "easeInOut" }}
              className="absolute inset-x-0 top-0 z-30 h-[56%]"
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                background: "linear-gradient(180deg, #ecd7ae 0%, #e6cf9f 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 96%)",
                borderRadius: "6px 6px 0 0",
                boxShadow: "0 2px 5px rgba(120,80,40,0.22)",
              }}
            />

            {/* segel hati */}
            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Buka amplopnya"
                className="absolute left-1/2 top-[51%] z-40 flex h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_6px_16px_rgba(150,50,70,0.45)] outline-none ring-offset-2 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#b45468] active:scale-95"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #ef8ba3, #c94f6d 70%)",
                }}
              >
                <Heart className="bk-heartbeat h-5 w-5 text-white" fill="currentColor" />
              </button>
            )}

            {/* hint */}
            {!open && (
              <span className="bk-hint absolute -bottom-9 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap font-script text-[19px] leading-none text-[#a5744f]">
                klik hatinya 💗
              </span>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
