"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./BubbleBurstButton.module.css";

const NUM_BUBBLES = 20;

export default function BubbleBurstButton({
  triggerKey,
}: {
  triggerKey: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.burst}>
      {Array.from({ length: NUM_BUBBLES }).map((_, i) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 80 + Math.random() * 120;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const size = 10 + Math.random() * 20;

        return (
          <motion.span
            key={`${triggerKey}-${i}`}
            className={styles.bubble}
            initial={{ opacity: 0.8, scale: 0.5, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: 1.2,
              x,
              y,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 1.2 + Math.random(),
              ease: "easeOut",
            }}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: `hsla(${Math.random() * 360}, 90%, 70%, 0.6)`,
            }}
          />
        );
      })}
    </div>
  );
}
