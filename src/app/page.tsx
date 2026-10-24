import { Heart } from "lucide-react";
import { BookExperience } from "@/components/birthday/BookExperience";
import { PetalRain } from "@/components/birthday/Ornaments";

const PRELOAD_IMAGES = [
  "/images/polaroid1.png",
  "/images/polaroid2.png",
  "/images/polaroid3.png",
  "/images/polaroid4.png",
  "/images/polaroid5.png",
  "/images/big-photo.png",
  "/images/song-cover.png",
];

export default function Home() {
  return (
    <main
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 720px at 50% -12%, #fcEEE0 0%, #f7e4d6 46%, #efd0c5 100%)",
      }}
    >
      <PetalRain count={12} />

      {/* preload aset foto */}
      <div className="hidden" aria-hidden="true">
        {PRELOAD_IMAGES.map((src) => (
          <img key={src} src={src} alt="" width={1} height={1} />
        ))}
      </div>

      <header className="relative z-10 flex items-center justify-center gap-2.5 px-4 pt-4 text-[#8a5a40]">
        <Heart className="h-3.5 w-3.5 text-[#c96a80]" fill="currentColor" aria-hidden="true" />
        <h1 className="font-elegant text-[11px] uppercase tracking-[0.32em]">
          buku kecil kita — edisi ulang tahun
        </h1>
        <Heart className="h-3.5 w-3.5 text-[#c96a80]" fill="currentColor" aria-hidden="true" />
      </header>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-3 py-6">
        <BookExperience />
      </section>

      <footer className="relative z-10 mt-auto pb-[max(14px,env(safe-area-inset-bottom))] pt-1 text-center">
        <p className="font-script text-[17px] leading-none text-[#9a6b4d]">
          dibuat dengan 🤍 oleh Tama, untuk Septi
        </p>
      </footer>
    </main>
  );
}
