"use client";

import { motion } from "framer-motion";
import styles from "./BubbleBurst.module.css";

const NUM_BUBBLES = 25;

export default function BubbleBurst({ triggerKey }: { triggerKey: number }) {
  return (
    <div className={styles.burst}>
      {Array.from({ length: NUM_BUBBLES }).map((_, i) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 150 + Math.random() * 300;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const size = 25 + Math.random() * 20; // ✅ Larger size

        return (
          <motion.span
            key={`${triggerKey}-${i}`}
            className={styles.bubble}
            initial={{ opacity: 0.6, scale: 0.8, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 1.4,
              x,
              y,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5, // ✅ slower
              ease: "easeOut",
            }}
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        );
      })}
    </div>
  );
}
