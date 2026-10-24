import type { Metadata, Viewport } from "next";
import { Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Buku Kecil Kita — untuk Septi 🤍",
  description:
    "Sebuah buku kecil berisi kenangan, doa, dan sayang — kado ulang tahun digital dari Tama untuk Septi.",
};

export const viewport: Viewport = {
  themeColor: "#6e2c3a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${caveat.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
