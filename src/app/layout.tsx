// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Noto_Sans_Armenian, Fredoka } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import styles from "./layout.module.css";

// Armenian font
const notoArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-armenian",
});

// Latin/emoji font
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

// Site metadata for SEO and sharing
export const metadata: Metadata = {
  metadataBase: new URL("https://fish-book-armenian.vercel.app"), // ✅ correct for current hosting
  title: "ձկնորսական գիրք (FishBook)",
  description: "Մանկական ծրագրաշար ձկների ու զգացմունքների ճանաչման համար",
  openGraph: {
    title: "ձկնորսական գիրք (FishBook)",
    description: "Ձկների միջոցով սովորիր ճանաչել հույզերը։",
    images: [
      {
        url: "/icons/preview.png", // becomes absolute via metadataBase
        width: 1200,
        height: 630,
        alt: "FishBook App",
      },
    ],
    type: "website",
    locale: "hy_AM",
    url: "https://fish-book-armenian.vercel.app", // optional, good practice
  },
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-512x512.png",
  },
  manifest: "/manifest.webmanifest",
};

// Viewport and theme color (must be outside `metadata`)
export const viewport: Viewport = {
  themeColor: "#38bdf8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hy" className="scroll-smooth">
      <body
        className={`${notoArmenian.variable} ${fredoka.variable} antialiased`}
      >
        <main className={styles.main}>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
