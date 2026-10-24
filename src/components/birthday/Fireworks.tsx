"use client";

import * as React from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
};

const COLORS = [
  "#ff8fab",
  "#ffb3c6",
  "#ffd166",
  "#ffe9a8",
  "#ffffff",
  "#f9a1bc",
  "#ffc4d6",
];

/**
 * Kembang api canvas full-screen. Aktif saat `active` = true;
* partikel yang tersisa akan meluruh dengan sendirinya setelah berhenti.
 */
export function Fireworks({ active }: { active: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const activeRef = React.useRef(active);

  React.useEffect(() => {
    activeRef.current = active;
  }, [active]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const explode = (x: number, y: number, color: string) => {
      const n = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.2;
        const speed = 1.6 + Math.random() * 3.4;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 55 + Math.random() * 40,
          color: Math.random() < 0.75 ? color : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1.4 + Math.random() * 1.8,
        });
      }
    };

    const loop = () => {
      if (!running) return;
      const W = window.innerWidth;
      const H = window.innerHeight;

      // Luncurkan roket baru saat aktif
      if (activeRef.current && rockets.length < 4 && Math.random() < 0.1) {
        rockets.push({
          x: W * (0.18 + Math.random() * 0.64),
          y: H + 8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(8.5 + Math.random() * 3.5),
          targetY: H * (0.16 + Math.random() * 0.3),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }

      ctx.clearRect(0, 0, W, H);

      // roket
      rockets = rockets.filter((r) => {
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.09;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(r.x - r.vx * 2, r.y - r.vy * 2, 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.targetY || r.vy >= -1.2) {
          explode(r.x, r.y, r.color);
          return false;
        }
        return true;
      });

      // partikel
      particles = particles.filter((p) => {
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.055;
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        const alpha = 1 - p.life / p.maxLife;
        if (alpha <= 0) return false;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.6 + alpha * 0.4), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        return true;
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
    />
  );
}
