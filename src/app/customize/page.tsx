"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import BubbleBurstBack from "@/components/bubble/BubbleBurst/BubbleBurst";

const fishOptions = [
  {
    name: "Կապույտ ձուկ",
    modelKey: "blue",
    src: "/fishBlue/happy.webp",
  },
  {
    name: "Կարմիր ձուկ",
    modelKey: "red",
    src: "/fishRed/happy.webp",
  },
  {
    name: "Անի ձուկ",
    modelKey: "aniArmenian",
    src: "/AniFish/carefree.webp",
  },
  {
    name: "Տիգրանի ձայնով (գերմաներեն)",
    modelKey: "dikogerman",
    src: "/fishDikoGerman/glücklich.webp",
  },
  {
    name: "Լիլիթի ձայնով (գերմաներեն)",
    modelKey: "lilitgerman",
    src: "/fishLilitGerman/glücklich.webp",
  },

  // Add more models here...
];

export default function CustomizeFishPage() {
  const router = useRouter();
  const [burstBack, setBurstBack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelect = (modelKey: string) => {
    router.push(`/customize/record/${modelKey}`);
  };

  useEffect(() => {
    audioRef.current = new Audio("/sounds/bubble.mp3");
    audioRef.current.volume = 0.7;
  }, []);

  const handleBackClick = () => {
    setBurstBack((k) => k + 1);
    audioRef.current?.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => {
      router.push("/fishSelect");
    }, 600);
  };
  return (
    <div className={styles.fishPage}>
      <motion.h1
        className={styles.heading}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Ընտրիր ձկան ոճը
      </motion.h1>

      {/* ⬅️ Back Button */}
      <div className={styles.buttonRow}>
        <motion.button
          className={styles.backButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackClick}
        >
          ⬅️ Վերադառնալ
          {burstBack > 0 && (
            <div className={styles.bubbleBurstWrapper}>
              <BubbleBurstBack triggerKey={burstBack} />
            </div>
          )}
        </motion.button>
      </div>

      <motion.div
        className={styles.fishFlex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {fishOptions.map((fish) => (
          <div
            key={fish.modelKey}
            className={styles.fishCard}
            onClick={() => handleSelect(fish.modelKey)}
          >
            <Image
              src={fish.src}
              alt={fish.name}
              width={160}
              height={160}
              className={styles.fishImage}
            />
            <p className={styles.fishName}>{fish.name}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
