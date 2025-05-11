"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./TermsOfUse.module.css";

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

export default function TermsOfUsePage() {
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
        Օգտագործման Պայմաններ
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
        <h2 className={styles.subheading}>1. Ընդհանուր Տեղեկություններ</h2>
        <p className={styles.paragraph}>
          Այս հավելվածը նախատեսված է փոքր երեխաների համար՝ ձկների միջոցով
          հույզերի ճանաչման նպատակով։ Օգտագործելով հավելվածը՝ դուք համաձայնում
          եք այս պայմաններին։
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={2}
      >
        <h2 className={styles.subheading}>2. Տվյալների Հավաքագրում</h2>
        <p className={styles.paragraph}>
          Մենք չենք հավաքում անձնական տվյալներ։ Հավելվածը չի օգտագործում cookies
          կամ tracking համակարգեր։
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={3}
      >
        <h2 className={styles.subheading}>3. Իրավունքներ և Սահմանափակումներ</h2>
        <p className={styles.paragraph}>
          Դուք չեք կարող փոխել, վերարտադրել կամ տարածել հավելվածի
          բովանդակությունը առանց թույլտվության։ Բոլոր պատկերներն ու ձայները
          պաշտպանված են հեղինակային իրավունքով։
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={4}
      >
        <h2 className={styles.subheading}>
          4. Պատասխանատվության Սահմանափակում
        </h2>
        <p className={styles.paragraph}>
          Մենք պատասխանատվություն չենք կրում հավելվածի օգտագործման ընթացքում
          առաջացած վնասների համար։
        </p>
      </motion.section>

      <motion.section
        className={styles.section}
        variants={sectionVariants}
        custom={5}
      >
        <h2 className={styles.subheading}>5. Կոնտակտային Տվյալներ</h2>
        <p className={styles.paragraph}>
          Հարցերի դեպքում կարող եք գրել{" "}
          <Link href="mailto:garenghazarian1@gmail.com" className={styles.link}>
            garenghazarian1@gmail.com
          </Link>
          :
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
