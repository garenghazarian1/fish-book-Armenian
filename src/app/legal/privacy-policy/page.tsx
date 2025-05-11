"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./PrivacyPolicy.module.css";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function PrivacyPolicyPage() {
  return (
    <motion.main
      className={styles.container}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.3 }}
    >
      <motion.h1
        className={styles.heading}
        variants={sectionVariants}
        custom={0}
      >
        Գաղտնիության Քաղաքականություն
      </motion.h1>
      <motion.div
        className={styles.backWrapper}
        variants={sectionVariants}
        custom={6}
      >
        <Link href="/" className={styles.backButton}>
          ⬅️ Վերադառնալ Գլխավոր
        </Link>
      </motion.div>
      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={1}
      >
        <h2 className={styles.subheading}>Ներածություն</h2>
        <p className={styles.paragraph}>
          Այս էջը տեղեկացնում է Ձեզ մեր գաղտնիության քաղաքականություն
          վերաբերյալ, ինչպես ենք մենք հավաքում, օգտագործում և պաշտպանում Ձեր
          անձնական տվյալները մեր FishBook հավելվածում:
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={2}
      >
        <h2 className={styles.subheading}>Տվյալների Հավաքագրում</h2>
        <p className={styles.paragraph}>
          Մենք չենք հավաքում անձնական տվյալներ առանց Ձեր համաձայնության:
          FishBook-ը նախատեսված է երեխաների համար, ուստի տվյալների
          պաշտպանությունը առաջնահերթ է:
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={3}
      >
        <h2 className={styles.subheading}>Cookies և Վերլուծություն</h2>
        <p className={styles.paragraph}>
          Հավելվածը ներկայումս չի օգտագործում cookies կամ վերլուծական գործիքներ,
          սակայն ապագայում հնարավոր է օգտագործվի Google Analytics-ը:
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={4}
      >
        <h2 className={styles.subheading}>Տվյալների Պահպանություն</h2>
        <p className={styles.paragraph}>
          Եթե ապագայում տվյալներ հավաքվեն, դրանք կպահպանվեն անվտանգ եղանակով և
          սահմանափակ ժամանակով՝ համաձայն գործող օրենսդրության:
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={5}
      >
        <h2 className={styles.subheading}>Կապ Մեզ Հետ</h2>
        <p className={styles.paragraph}>
          Եթե ունեք հարցեր կամ առաջարկներ՝ կապված գաղտնիության հետ, խնդրում ենք
          գրել{" "}
          <Link href="mailto:garenghazarian1@gmail.com" className={styles.link}>
            garenghazarian1@gmail.com
          </Link>{" "}
          հասցեին:
        </p>
      </motion.section>

      <motion.div
        className={styles.backWrapper}
        variants={sectionVariants}
        custom={6}
      >
        <Link href="/" className={styles.backButton}>
          ⬅️ Վերադառնալ Գլխավոր
        </Link>
      </motion.div>
    </motion.main>
  );
}
