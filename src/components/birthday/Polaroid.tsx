"use client";

import * as React from "react";
import { Tape } from "./Ornaments";

/**
 * Foto polaroid klasik: frame putih, kertas agak tebal, caption tulisan tangan,
 * sedikit miring + selotip di atas.
 */
export function Polaroid({
  src,
  caption,
  alt,
  rotate = 0,
  aspect = "portrait",
  tape = true,
  tapeColor,
  className,
  captionClassName,
  style,
  eager = false,
}: {
  src: string;
  caption?: string;
  alt?: string;
  rotate?: number;
  aspect?: "portrait" | "square";
  tape?: boolean;
  tapeColor?: string;
  className?: string;
  captionClassName?: string;
  style?: React.CSSProperties;
  eager?: boolean;
}) {
  return (
    <figure
      className={`relative bg-white shadow-[0_10px_26px_rgba(96,54,40,0.28)] ${className ?? ""}`}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <div className="p-[5%] pb-0">
        <div className="relative overflow-hidden bg-[#e9e2d4]">
          <img
            src={src}
            alt={alt ?? caption ?? "Foto kenangan kita"}
            draggable={false}
            loading={eager ? "eager" : "lazy"}
            className="block w-full select-none object-cover"
            style={{ aspectRatio: aspect === "square" ? "1 / 1" : "3 / 3.4" }}
          />
          {/* kilau tipis kaca foto */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 30%)",
            }}
          />
        </div>
      </div>
      {caption ? (
        <figcaption
          className={`font-script px-2 pb-1 pt-[3%] text-center leading-tight text-[#7a5a44] ${captionClassName ?? ""}`}
        >
          {caption}
        </figcaption>
      ) : null}
      {tape ? (
        <Tape
          className="left-1/2 top-[-11px] -translate-x-1/2 rotate-[-4deg]"
          color={tapeColor}
        />
      ) : null}
    </figure>
  );
}
