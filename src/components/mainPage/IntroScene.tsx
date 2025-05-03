"use client";

import { motion } from "framer-motion";
import styles from "./IntroScene.module.css";

export default function IntroScene() {
  return (
    <section className={styles.introWrapper}>
      <motion.div
        className={styles.titleContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className={styles.title}>Բարի գալուստ հույզերի ծովաշխարհ</h1>
        <p className={styles.subtitle}>
          Այստեղ կծանոթանաս 21 ձկների, որոնք ցույց են տալիս իրենց հույզերն ու
          զգացմունքները։
        </p>
      </motion.div>

      <div className={styles.fishArea}>
        <motion.img
          src="/fishBlue/happy.png"
          alt="Ուրախ ձուկ"
          className={styles.fish}
          initial={{ x: "-100vw" }}
          animate={{ x: "0" }}
          transition={{ type: "spring", stiffness: 50, delay: 0.5 }}
        />
        <motion.img
          src="/fishBlue/angry.png"
          alt="Բարկացած ձուկ"
          className={styles.fishReverse}
          initial={{ x: "100vw" }}
          animate={{ x: "0" }}
          transition={{ type: "spring", stiffness: 50, delay: 0.8 }}
        />
      </div>

      <footer className={styles.footer}>
        Ստեղծվել է Կարէն Ղազարեանի եւ Նաիրա Պետրոսյանի կողմից
      </footer>
    </section>
  );
}
