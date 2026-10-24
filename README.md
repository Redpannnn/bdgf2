# Buku Kecil Kita 🤍

Website ulang tahun bertema buku interaktif — kado digital dari **Tama** untuk **Septi**.

Dibuat dengan Next.js 16 + Tailwind CSS 4 + Framer Motion. Fully static, gak perlu database, gak perlu env variable.

## ✨ Isi Buku

- **Sampul depan** — buku kulit dengan kupu & bunga emas, klik bukunya untuk membuka
- **Halaman 1** — amplop bersegel hati (klik hatinya!) + 5 foto polaroid "orang favoritku"
- **Halaman 2** — kamera klik-3x yang ngeluarin foto + halaman "lagu kita" dengan vinyl berputar
- **Halaman 3** — foto kenangan besar + daftar "hal yang aku suka dari kamu"
- **Sampul belakang** — kue ulang tahun, klik lilinnya → kembang api! 🎆

Halaman bisa dibalik pakai tombol panah, keyboard (←/→), atau **tahan & tarik halamannya langsung** kayak buku beneran.

## 🚀 Deploy ke Vercel

Pilih salah satu cara:

### Cara 1 — Lewat GitHub (recommended)

1. Extract zip ini
2. Push ke repo GitHub baru:
   ```bash
   git init
   git add .
   git commit -m "buku kecil kita"
   git remote add origin https://github.com/USERNAME/birthday-gf-2.git
   git push -u origin main
   ```
3. Buka [vercel.com/new](https://vercel.com/new) → import repo tersebut
4. Vercel otomatis mendeteksi Next.js — **langsung klik Deploy, gak perlu setting apapun**

### Cara 2 — Lewat Vercel CLI

```bash
npm i -g vercel
cd birthday-gf-2
vercel --prod
```

### Cara 3 — Drag & Drop

Buka [vercel.com/new](https://vercel.com/new), atau pakai [deploy button](https://vercel.com/deploy) dengan upload folder ini (tanpa `node_modules`).

## 💻 Jalankan Lokal

Butuh Node.js 20.9+.

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## 📸 Ganti Foto

Semua foto ada di `public/images/`:

| File                     | Dipakai di                  |
| ------------------------ | --------------------------- |
| `polaroid1.png` s/d `5`  | Halaman "orang favoritku"   |
| `big-photo.png`          | Halaman foto besar          |
| `song-cover.png`         | Cover "lagu kita"           |

Tinggal timpa file dengan foto kalian (rasio potret 3:4 paling pas), nama file harus sama.

## 📁 Struktur

```
src/
├── app/                    # halaman utama + layout + font
└── components/birthday/    # semua komponen buku, halaman, kue, kembang api
```
