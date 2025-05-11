"use client";

import styles from "./Impressum.module.css";

export default function ImpressumPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Իմպրեսում</h1>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Պատասխանատու՝ §5 TMG համաձայն</h2>
        <p className={styles.paragraph}>
          Կարէն Ղազարեան
          <br />
          Ottilie-Hoffmann-Str. 40
          <br />
          28213 Bremen
          <br />
          Գերմանիա
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Կապի Տվյալներ</h2>
        <p className={styles.paragraph}>
          Հեռախոս՝ <a href="tel:+4915257398979">+49 152 573 98979</a>
          <br />
          Էլ. փոստ՝{" "}
          <a href="mailto:garenghazarian1@gmail.com">
            garenghazarian1@gmail.com
          </a>
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>
          Պատասխանատվություն բովանդակության համար
        </h2>
        <p className={styles.paragraph}>
          Այս հավելվածի բովանդակությունը պատրաստվել է մեծ ուշադրությամբ և
          խնամքով։ Այնուամենայնիվ, մենք չենք երաշխավորում դրա ճշգրտությունն ու
          ամբողջականությունը։ Եթե նկատում եք իրավական խնդիրներ, խնդրում ենք մեզ
          տեղյակ պահել։
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Հղումների Պատասխանատվություն</h2>
        <p className={styles.paragraph}>
          Մեր հավելվածում կարող են լինել արտաքին հղումներ։ Մենք
          պատասխանատվություն չենք կրում այդ կայքերի բովանդակության համար։
        </p>
      </section>
    </main>
  );
}
