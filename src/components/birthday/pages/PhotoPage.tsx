"use client";

import { Heart } from "lucide-react";
import { Polaroid } from "../Polaroid";
import { Tape } from "../Ornaments";
import { PageShell } from "./PageShell";

/**
 * Halaman kiri: satu foto besar berdua, gaya polaroid.
 */
export function PhotoPage() {
  return (
    <PageShell side="left">
      <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center">
        <div className="relative">
          <Polaroid
            src="/images/big-photo.png"
            caption="kita. selalu. 🤍"
            rotate={-2.5}
            aspect="portrait"
            className="w-[252px]"
            captionClassName="text-[21px]"
            eager
          />
          {/* tape ekstra di sudut kanan atas foto */}
          <Tape
            className="right-[-26px] top-[-4px] rotate-[42deg]"
            style={{ width: 58, height: 20 }}
          />
        </div>

        <p className="mt-7 text-center font-script text-[22px] leading-tight text-[#8a5a40]">
          sejak hari itu — dan terus, sampai nanti-nanti
        </p>

        <div className="mt-3 flex items-center gap-2 text-[#c96a80]" aria-hidden="true">
          <span className="block h-px w-12 bg-gradient-to-r from-transparent to-[#d9869d]" />
          <Heart className="bk-heartbeat h-4 w-4" fill="currentColor" />
          <span className="block h-px w-12 bg-gradient-to-l from-transparent to-[#d9869d]" />
        </div>
      </div>
    </PageShell>
  );
}
