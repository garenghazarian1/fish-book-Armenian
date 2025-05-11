"use client";

import styles from "./TermsOfUse.module.css";

export default function TermsOfUse() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Օգտագործման Պայմաններ</h1>

      <section className={styles.section}>
        <h2 className={styles.subheading}>1. Ընդհանուր Տեղեկություններ</h2>
        <p className={styles.paragraph}>
          Այս հավելվածը նախատեսված է փոքր երեխաների համար՝ ձկների միջոցով
          հույզերի ճանաչման նպատակով։ Օգտագործելով հավելվածը՝ դուք համաձայնում
          եք այս պայմաններին։
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>2. Տվյալների Հավաքագրում</h2>
        <p className={styles.paragraph}>
          Մենք չենք հավաքում անձնական տվյալներ։ Հավելվածը չի օգտագործում cookies
          կամ tracking համակարգեր։
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>3. Իրավունքներ և Սահմանափակումներ</h2>
        <p className={styles.paragraph}>
          Դուք չեք կարող փոխել, վերարտադրել կամ տարածել հավելվածի
          բովանդակությունը առանց թույլտվության։ Բոլոր պատկերներն ու ձայները
          պաշտպանված են հեղինակային իրավունքով։
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>
          4. Պատասխանատվության Սահմանափակում
        </h2>
        <p className={styles.paragraph}>
          Մենք պատասխանատվություն չենք կրում հավելվածի օգտագործման ընթացքում
          առաջացած վնասների համար։
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>5. Կոնտակտային Տվյալներ</h2>
        <p className={styles.paragraph}>
          Հարցերի դեպքում կարող եք գրել{" "}
          <a href="mailto:garenghazarian1@gmail.com">
            garenghazarian1@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}
