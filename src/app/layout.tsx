import type { Metadata } from "next";
import { Noto_Sans_Armenian, Fredoka } from "next/font/google";
import "./globals.css";

// Armenian font
const notoArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  variable: "--font-noto-armenian",
});

// Playful Latin font (optional, for emojis/headings)
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "ձկնորսական գիրք (FishBook)",
  description: "Մանկական ծրագրաշար ձկների ու զգացմունքների ճանաչման համար",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy">
      <head>
        {/* fallback for older Android */}
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#38bdf8" />
      </head>
      <body
        className={`${notoArmenian.variable} ${fredoka.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
