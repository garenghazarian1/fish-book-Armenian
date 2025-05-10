"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BubbleBurst from "@/components/bubble/BubbleBurstButton/BubbleBurstButton";
import styles from "./page.module.css";

const fishList = [
  { name: "happy", src: "/fishBlue/happy.png" },
  // Add more fish here
];

function FishCard({ fish }: { fish: { name: string; src: string } }) {
  const router = useRouter();
  const [burstKey, setBurstKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/bubble.mp3");
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
    }
  }, []);

  const handleClick = () => {
    setBurstKey((k) => k + 1);
    audioRef.current?.play().catch(() => {});
    setTimeout(() => {
      router.push(`/fish/${fish.name}`);
    }, 700);
  };

  return (
    <motion.div
      className={styles.fishCard}
      whileHover={{ scale: 1.1, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      style={{ position: "relative" }}
    >
      <Image
        src={fish.src}
        alt={`Fish ${fish.name}`}
        width={120}
        height={120}
        className={styles.fishImage}
        priority
      />
      <div className={styles.bubbleBurstWrapper}>
        <BubbleBurst triggerKey={burstKey} />
      </div>
    </motion.div>
  );
}

export default function FishSelectPage() {
  const router = useRouter();

  return (
    <div className={styles.fishPage}>
      <motion.h1
        className={styles.heading}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Ընտրիր ձուկ
      </motion.h1>

      <motion.button
        className={styles.backButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/")}
      >
        ⬅️ Վերադառնալ
      </motion.button>

      <motion.div
        className={styles.fishGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        {fishList.map((fish, i) => (
          <FishCard key={i} fish={fish} />
        ))}
      </motion.div>
    </div>
  );
}
