"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import styles from "./Footer.module.css";

const containerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      delayChildren: 0.4,
      staggerChildren: 0.25,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -10% 0px" });

  return (
    <motion.footer
      ref={ref}
      className={styles.footer}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div className={styles.text} variants={itemVariants}>
        Ստեղծվել է Կարէն Ղազարեանի եւ Նաիրա Պետրոսյանի կողմից ©2025
      </motion.div>

      <motion.nav className={styles.links} variants={itemVariants}>
        <motion.div variants={itemVariants}>
          <Link href="/legal/impressum" className={styles.link}>
            Իմպրեսում
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link href="/legal/privacy-policy" className={styles.link}>
            Գաղտնիության քաղաքականություն
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link href="/legal/terms-of-use" className={styles.link}>
            Օգտագործման պայմաններ
          </Link>
        </motion.div>
      </motion.nav>
    </motion.footer>
  );
}
