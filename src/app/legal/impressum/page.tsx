"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./Impressum.module.css";

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

export default function ImpressumPage() {
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
        Իմպրեսում
      </motion.h1>
      <Link href="/" className={styles.backButton}>
        ⬅️ Վերադառնալ Գլխավոր
      </Link>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={1}
      >
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
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={2}
      >
        <h2 className={styles.subheading}>Կապի Տվյալներ</h2>
        <p className={styles.paragraph}>
          Հեռախոս՝{" "}
          <Link href="tel:+4915257398979" className={styles.link}>
            +49 152 573 98979
          </Link>
          <br />
          Էլ. փոստ՝{" "}
          <Link href="mailto:garenghazarian1@gmail.com" className={styles.link}>
            garenghazarian1@gmail.com
          </Link>
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={3}
      >
        <h2 className={styles.subheading}>
          Պատասխանատվություն բովանդակության համար
        </h2>
        <p className={styles.paragraph}>
          Այս հավելվածի բովանդակությունը պատրաստվել է մեծ ուշադրությամբ և
          խնամքով։ Այնուամենայնիվ, մենք չենք երաշխավորում դրա ճշգրտությունն ու
          ամբողջականությունը։ Եթե նկատում եք իրավական խնդիրներ, խնդրում ենք մեզ
          տեղյակ պահել։
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={4}
      >
        <h2 className={styles.subheading}>Հղումների Պատասխանատվություն</h2>
        <p className={styles.paragraph}>
          Մեր հավելվածում կարող են լինել արտաքին հղումներ։ Մենք
          պատասխանատվություն չենք կրում այդ կայքերի բովանդակության համար։
        </p>
      </motion.section>
      <motion.div
        className={styles.backWrapper}
        variants={sectionVariants}
        custom={5}
      >
        <Link href="/" className={styles.backButton}>
          ⬅️ Վերադառնալ Գլխավոր
        </Link>
      </motion.div>
    </motion.main>
  );
}
