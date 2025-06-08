"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BubbleBurstBack from "@/components/bubble/BubbleBurst/BubbleBurst";
import styles from "./BackButton.module.css";

const BackButton = () => {
  const router = useRouter();
  const [burstKey, setBurstKey] = useState<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const bubbleSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bubbleSoundRef.current = new Audio("/sounds/bubble.mp3");
    bubbleSoundRef.current.volume = 0.7;
  }, []);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        window.location.href = "/fishSelect"; // ⛔ Avoid router.push
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isExiting]);

  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setBurstKey((prev) => (prev === null ? 1 : prev + 1));
    bubbleSoundRef.current?.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);
    setIsExiting(true);
  };

  return (
    <div className={styles.backButtonContainer}>
      <motion.button
        className={styles.backButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBackClick}
        aria-label="Go back"
      >
        ⬅️ Վերադառնալ
        {burstKey !== null && (
          <div className={styles.bubbleBurstWrapper}>
            <BubbleBurstBack triggerKey={burstKey} />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default BackButton;
