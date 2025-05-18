"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BubbleBurst from "@/components/bubble/BubbleBurstButton/BubbleBurstButton";
import styles from "./page.module.css";

const fishList = [
  {
    name: "Blue Fish",
    route: "fishcarouseldynamic",
    src: "/fishBlue/happy.png",
  },
  {
    name: "Red Fish",
    route: "redfishcarousel",
    src: "/fishRed/happy.png",
  },
  {
    name: "Dikran Fish",
    route: "dikogerman",
    src: "/fishDikoGerman/glücklich.png",
  },
  {
    name: "Lilit Fish",
    route: "lilitgerman",
    src: "/fishLilitGerman/glücklich.png",
  },
  // Add more fish here
];

function FishCard({
  fish,
}: {
  fish: { name: string; route: string; src: string };
}) {
  const router = useRouter();
  const [burstKey, setBurstKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [clickDisabled, setClickDisabled] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/bubble.mp3");
    audioRef.current.volume = 0.7;

    // Prefetch route for faster transition
    router.prefetch(`/fish/${fish.route}`);
  }, [router, fish.route]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickDisabled) return;
    setClickDisabled(true);

    setBurstKey((k) => k + 1);
    audioRef.current?.play().catch(() => {});

    setTimeout(() => {
      router.push(`/fish/${fish.route}`);
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
      <div className={styles.fishName}>{fish.name}</div>
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
        Ընտրիր ձուկը
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
        {fishList.map((fish) => (
          <FishCard key={fish.route} fish={fish} />
        ))}
      </motion.div>
    </div>
  );
}
