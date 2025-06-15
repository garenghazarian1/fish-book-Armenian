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
  <html lang="hy">
  <head>
    <meta charset="UTF-8" />
    <title>${model}</title>
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

      .page, .cover, .intro-page, .ending {
        position: relative;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        page-break-after: always;
        overflow: hidden;
      }

      .page::before, .cover::before, .intro-page::before, .ending::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(var(--bg-overlay), var(--bg-overlay)), var(--bg-image) top / cover no-repeat;
        z-index: -1;
      }

      .cover {
        font-family: var(--display-font);
        color: #fff;
        text-align: left;
        padding: 60px 40px;
        gap: 48px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      .cover h1 {
        font-size: 48px;
        color: var(--accent);
        text-shadow: 2px 2px #000;
        margin: 0 0 16px;
      }
      .cover h2 {
        font-size: 24px;
        margin: 0 0 24px;
        text-shadow: 1px 1px #000;
      }
      .cover img {
        width: 400px;
        padding: 16px;
        border-radius: 16px;
      }

      .intro-page {
        padding: 60px;
        text-align: left;
        color: white;
      }
      .intro-text {
        max-width: 640px;
        font-family: var(--display-font);
      }
      .intro-text h1 {
        font-size: 36px;
        margin-bottom: 20px;
        color: var(--accent);
        text-shadow: 2px 2px #000;
      }
      .intro-text p {
        font-size: 20px;
        margin-bottom: 16px;
        line-height: 1.6;
        text-shadow: 1px 1px 2px #000;
      }
      .intro-text .age { font-size: 18px; color: #fff9c4; }
      .intro-text .authors { font-size: 16px; opacity: 0.9; }
      .intro-text .year { font-size: 14px; display: block; margin-top: 4px; color: #ccc; }

      .page img { width: 400px; margin-bottom: 20px; }
      .page p {
      margin: 40px;
        font-family: var(--display-font);
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
      .legal {
        margin-top: 40px;
        font-size: 14px;
        color: #eee;
        text-align: center;
        max-width: 480px;
        line-height: 1.6;
      }
      .legal h3, .legal h4 {
        font-size: 16px;
        margin-bottom: 6px;
        color: var(--accent);
        text-shadow: 1px 1px #000;
      }
      .legal a {
        color: #fff;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <section class="cover">
      <div class="cover-text">
        <h1>Զգացմունքների Ձկնիկը</h1>
        <h2>Խաղային ուսուցում փոքրիկների համար</h2>
      </div>
      <img src="${absolute("/fishRed/happy.webp")}" alt="Fish cover" />
    </section>

    <section class="intro-page">
      <div class="intro-text">
        <h1>Սկսենք հույզերի ծովաշխարհ</h1>
        <p>Այստեղ կծանոթանաս <strong>13 ձկների</strong>, որոնք ցույց են տալիս իրենց հույզերն ու զգացմունքները։</p>
        <p class="age">Հարմար է 2 տարեկանից սկսած։</p>
        <p class="authors">
          Ստեղծվել է Կարէն Ղազարեանի եւ Նաիրա Պետրոսյանի կողմից<br />
          <span class="year">©2025</span>
        </p>
      </div>
    </section>

    ${moods
      .map(
        (m, i) => `
        <section class="page">
         <p>${m.text}</p>
          <img src="${absolute(m.image)}" alt="Fish mood" />
          
          <p>${m.longText}</p>
          <span class="page-number">${i + 1}</span>
        </section>`
      )
      .join("")}

    <section class="ending">
      <h2>Շնորհակալություն 📘</h2>
      <a href="https://babyban.kids">👉 babyban.kids</a>

      <div class="legal">
        <h3>Պատասխանատու՝ §5 TMG համաձայն</h3>
        <p>
          Կարէն Ղազարեան<br />
          Ottilie-Hoffmann-Str. 40<br />
          28213 Bremen<br />
          Գերմանիա
        </p>
        <h4>Կապի Տվյալներ</h4>
        <p>
          Հեռախոս՝ <a href="tel:+4915257398979">+49 152 573 98979</a><br />
          Էլ. փոստ՝ <a href="mailto:garenghazarian1@gmail.com">garenghazarian1@gmail.com</a>
        </p>
      </div>
    </section>
  </body>
</html>
`;
}
