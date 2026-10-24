"use client";

import * as React from "react";

/**
 * Kerangka halaman kertas buku.
 * side="left" → bayangan punggung di kanan; side="right" → bayangan di kiri.
 */
export function PageShell({
  side,
  children,
  className,
}: {
  side: "left" | "right";
  children: React.ReactNode;
  className?: string;
}) {
  const isLeft = side === "left";
  return (
    <div
      className={`bk-paper absolute inset-0 overflow-hidden ${
        isLeft ? "bk-paper-left" : "bk-paper-right"
      } ${className ?? ""}`}
    >
      {/* bayangan dekat punggung buku */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 ${isLeft ? "right-0" : "left-0"} w-10`}
        style={{
          background: isLeft
            ? "linear-gradient(270deg, rgba(80,45,25,0.16), rgba(80,45,25,0.04) 45%, transparent)"
            : "linear-gradient(90deg, rgba(80,45,25,0.16), rgba(80,45,25,0.04) 45%, transparent)",
        }}
      />
      {/* garis tepi halaman */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 ${isLeft ? "left-0" : "right-0"} w-px bg-[#d9c8a8]/60`}
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col p-5">
        {children}
      </div>
    </div>
  );
}

/** Judul halaman bergaya kertas note + selotip */
export function TapeNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex justify-center ${className ?? ""}`}>
      <div className="relative mt-2 rotate-[-1.2deg]">
        <div className="rounded-[3px] border border-[#ead9bd] bg-[#fff8ec] px-5 py-1.5 shadow-[0_5px_14px_rgba(96,54,40,0.18)]">
          {children}
        </div>
        <span
          aria-hidden="true"
          className="absolute -top-[9px] left-1/2 h-[18px] w-[64px] -translate-x-1/2 rotate-[2deg] bg-[#f6e3c0]/85 shadow-sm"
        />
      </div>
    </div>
  );
}
