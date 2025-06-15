"use client";

import { useEffect, useState } from "react";

const sampleMoods = [
  {
    text: "Կարմիր ձուկը ուրախ է։ Նա ժպտում է ու լողում ուրախ ջրում։",
    image: "/fishRed/happy.webp",
  },
  {
    text: "Կարմիր ձուկը տխուր է։ Նա դանդաղ լողում է մենակ։",
    image: "/fishRed/sad.webp",
  },
];

export default function BookPreview() {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const pages = sampleMoods
      .map(
        (mood, index) => `
          <section class="page">
            <img src="${mood.image}" alt="Fish mood" />
            <p>${mood.text}</p>
            <span class="page-number">${index + 1}</span>
          </section>`
      )
      .join("");

    const htmlContent = `
      <!-- Fonts -->
      <style>
        @font-face {
          font-family: 'Cartoon';
          src: url('/fonts/Cartoon/Cartoon.ttf') format('truetype');
        }
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian&display=swap');
      </style>

      <!-- Styles -->
      <style>
        :root {
          --bg-image: url('/backgroundB.webp');
          --bg-overlay: rgba(0,0,0,0.4);
          --base-font: 'Noto Sans Armenian', sans-serif;
          --display-font: 'Cartoon', var(--base-font);
          --accent: #ffdd57;
        }

        body {
          font-family: var(--base-font);
          margin: 0;
        }

        .page,
        .cover,
        .ending {
          position: relative;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          page-break-after: always;
          overflow: hidden;
        }

        .page::before,
        .cover::before,
        .ending::before {
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

     .cover {
  font-family: var(--display-font);
  color: #fff;
  text-align: left;
  padding: 60px 40px;
  gap: 48px;
  display: flex;
  flex-direction: row; /* ✅ makes text and image side-by-side */
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

      <section class="cover">
  <div class="cover-text">
    <h1>Զգացմունքների Ձկնիկը</h1>
    <h2>Խաղային ուսուցում փոքրիկների համար</h2>
  </div>
  <img src="/fishRed/happy.webp" alt="Fish cover" />
</section>

      ${pages}

      <section class="ending">
        <h2>Շնորհակալություն 📘</h2>
        <a href="https://babyban.kids">👉 babyban.kids</a>
      </section>
    `;

    setHtml(htmlContent);
  }, []);

  return (
    <main>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
