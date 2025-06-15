import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import type { Mood } from "@/components/pages/data/types";

/* ----------------------------------------------------------
   Map fish-model → dynamic mood loader
---------------------------------------------------------- */
const moodLoaders: Record<
  string,
  { loader: () => Promise<{ default: Mood[] }> }
> = {
  fishcarouseldynamic: {
    loader: () => import("@/components/pages/data/moods/blue"),
  },
  redfishcarousel: {
    loader: () => import("@/components/pages/data/moods/red"),
  },
  "diko-german": {
    loader: () => import("@/components/pages/data/moods/diko-german"),
  },
  "lilit-german": {
    loader: () => import("@/components/pages/data/moods/lilit-german"),
  },
  "ani-armenian": {
    loader: () => import("@/components/pages/data/moods/ani-armenian"),
  },
};

/* ----------------------------------------------------------
   GET /api/generate-fishbook/[model]
---------------------------------------------------------- */
export async function GET(req: NextRequest) {
  const model = req.nextUrl.pathname.split("/").pop()?.toLowerCase();

  const entry = model ? moodLoaders[model] : undefined;

  if (!entry) {
    return NextResponse.json(
      { error: "Fish model not found" },
      { status: 404 }
    );
  }

  /* 1️⃣ Load mood data */
  const moods = (await entry.loader()).default;

  /* 2️⃣ Build HTML with global styles */
  const html = `
  <html lang="hy">
    <head>
      <meta charset="UTF-8" />
      <title>${model}</title>

      <!-- Armenian base font -->
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian&display=swap" rel="stylesheet">
      <style>
        @font-face {
          font-family: 'Cartoon';
          src: url('https://babyban.kids/fonts/Cartoon/Cartoon.ttf') format('truetype');
          font-display: swap;
        }
      </style>

      <style>
        :root {
          --bg-image: url('https://babyban.kids/backgroundB.webp');
          --bg-overlay: rgba(0,0,0,0.4);
          --base-font: 'Noto Sans Armenian', sans-serif;
          --display-font: 'Cartoon', var(--base-font);
          --accent: #ffdd57;
        }

        * { box-sizing: border-box; margin: 0; }

        body { font-family: var(--base-font); }

        .page, .cover, .ending {
          position: relative;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          page-break-after: always;
          overflow: hidden;
        }

        .page::before, .cover::before, .ending::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(var(--bg-overlay), var(--bg-overlay)), var(--bg-image) top / cover no-repeat;
          z-index: -1;
        }

        .cover {
          font-family: var(--display-font);
          color: #fff;
          text-align: center;
        }

        .cover h1 {
          font-size: 48px;
          color: var(--accent);
          text-shadow: 2px 2px #000;
        }

        .cover h2 {
          font-size: 24px;
          margin: 12px 0 24px;
          text-shadow: 1px 1px #000;
        }

        .cover img {
          width: 240px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }

        .page img {
          width: 280px;
          margin-bottom: 20px;
        }

        .page p {
          font-size: 22px;
          color: #fff;
          text-align: center;
          text-shadow: 1px 1px 2px #000;
          padding: 0 20px;
        }

        .page-number {
          position: absolute;
          bottom: 32px;
          right: 40px;
          font-size: 14px;
          color: #eee;
        }

        .ending {
          font-family: var(--display-font);
          text-align: center;
          color: #fff;
          page-break-after: avoid;
        }

        .ending h2 {
          font-size: 32px;
          color: var(--accent);
          text-shadow: 2px 2px #000;
        }

        .ending a {
          font-size: 20px;
          color: #fff;
          text-decoration: none;
          margin-top: 12px;
        }
      </style>
    </head>

    <body>

      <section class="cover">
        <h1>Զգացմունքների Ձկնիկը</h1>
        <h2>Խաղային ուսուցում փոքրիկների համար</h2>
        <img src="${absolute("/fishRed/happy.webp")}" alt="Fish cover" />
      </section>

      ${moods
        .map(
          (m, i) => `
          <section class="page">
            <img src="${absolute(m.image)}" alt="Fish mood" />
            <p>${m.text}</p>
            <span class="page-number">${i + 1}</span>
          </section>`
        )
        .join("")}

      <section class="ending">
        <h2>Շնորհակալություն 📘</h2>
        <a href="https://babyban.kids">👉 babyban.kids</a>
      </section>

    </body>
  </html>
  `;

  /* 3️⃣ Render to PDF */
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true,
  });

  await browser.close();

  /* 4️⃣ Return PDF */
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${model}-fishbook.pdf"`,
    },
  });
}

/* ----------------------------------------------------------
   Helper: make image URLs absolute for Puppeteer
---------------------------------------------------------- */
function absolute(src: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://babyban.kids";
  return `${base}${src}`;
}
