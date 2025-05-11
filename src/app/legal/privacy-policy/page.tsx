"use client";

import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Գաղտնիության Քաղաքականություն</h1>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Ներածություն</h2>
        <p className={styles.paragraph}>
          Այս էջը տեղեկացնում է Ձեզ մեր գաղտնիության քաղաքականություն
          վերաբերյալ, ինչպես ենք մենք հավաքում, օգտագործում և պաշտպանում Ձեր
          անձնական տվյալները մեր FishBook հավելվածում:
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Տվյալների Հավաքագրում</h2>
        <p className={styles.paragraph}>
          Մենք չենք հավաքում անձնական տվյալներ առանց Ձեր համաձայնության:
          FishBook-ը նախատեսված է երեխաների համար, ուստի տվյալների
          պաշտպանությունը առաջնահերթ է:
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Cookies և Վերլուծություն</h2>
        <p className={styles.paragraph}>
          Հավելվածը ներկայումս չի օգտագործում cookies կամ վերլուծական գործիքներ,
          սակայն ապագայում հնարավոր է օգտագործվի Google Analytics-ը:
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Տվյալների Պահպանություն</h2>
        <p className={styles.paragraph}>
          Եթե ապագայում տվյալներ հավաքվեն, դրանք կպահպանվեն անվտանգ եղանակով և
          սահմանափակ ժամանակով՝ համաձայն գործող օրենսդրության:
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.subheading}>Կապ Մեզ Հետ</h2>
        <p className={styles.paragraph}>
          Եթե ունեք հարցեր կամ առաջարկներ՝ կապված գաղտնիության հետ, խնդրում ենք
          գրել info@garenghazarian.de հասցեին:
        </p>
      </section>
    </main>
  );
}
