import type { Mood } from "@/components/pages/data/types";

export function generateFishBookHtml(moods: Mood[], model: string): string {
  const absolute = (src: string) => {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://babyban.kids";
    return `${base}${src}`;
  };

  const pages = moods
    .map(
      (m, i) => `
        <section class="page">
          <img src="${absolute(m.image)}" alt="Fish mood" />
          <p>${m.text}</p>
          <span class="page-number">${i + 1}</span>
        </section>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="hy">
    <head>
      <meta charset="UTF-8" />
      <title>${model}</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian&display=swap" rel="stylesheet">
      <style>
        @font-face {
          font-family: 'Cartoon';
          src: url('${absolute(
            "/fonts/Cartoon/Cartoon.ttf"
          )}') format('truetype');
          font-display: swap;
        }
        :root {
          --bg-image: url('${absolute("/backgroundB.webp")}');
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

      ${pages}

      <section class="ending">
        <h2>Շնորհակալություն 📘</h2>
        <a href="https://babyban.kids">👉 babyban.kids</a>
      </section>
    </body>
  </html>`;
}
