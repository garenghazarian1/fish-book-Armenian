"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BubbleBurst from "@/components/bubble/BubbleBurstButton/BubbleBurstButton";
import BubbleBurstBack from "@/components/bubble/BubbleBurst/BubbleBurst";
import styles from "./page.module.css";

// ✅ Fish List
const fishList = [
  {
    name: "Արհեստական ձայն",
    route: "fishcarouseldynamic",
    src: "/fishBlue/happy.webp",
  },
  {
    name: "Տիգրանի և Լիլիթի ձայներով",
    route: "redfishcarousel",
    src: "/fishRed/happy.webp",
  },
  {
    name: "Տիգրանի ձայնով (գերմաներեն)",
    route: "dikogerman",
    src: "/fishDikoGerman/glücklich.webp",
  },
  {
    name: "Լիլիթի ձայնով (գերմաներեն)",
    route: "lilitgerman",
    src: "/fishLilitGerman/glücklich.webp",
  },
  {
    name: "Անիի ձայնով ",
    route: "aniarmenian",
    src: "/AniFish/carefree.webp",
  },
  {
    name: "Ձայնագրիր",
    route: "/customize", // goes to /customize
    src: "/icons/microphone.png", // use a mic icon or reuse a fish
  },
  // Add more fish here
];

// ✅ FishCard Component
function FishCard({
  fish,
}: {
  fish: { name: string; route: string; src: string };
}) {
  const router = useRouter();
  const [burstKey, setBurstKey] = useState(0);
  const [clickDisabled, setClickDisabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/bubble.mp3");
    audioRef.current.volume = 0.7;
    router.prefetch(`/fish/${fish.route}`);
  }, [router, fish.route]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickDisabled) return;
    setClickDisabled(true);
    setBurstKey((k) => k + 1);
    audioRef.current?.play().catch(() => {});

    const isAbsolute = fish.route.startsWith("/");
    const targetRoute = isAbsolute
      ? fish.route
      : `/fishSelect/fish/${fish.route}`;

    setTimeout(() => {
      router.push(targetRoute);
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
      {burstKey > 0 && (
        <div className={styles.bubbleBurstWrapper}>
          <BubbleBurst triggerKey={burstKey} />
        </div>
      )}
    </motion.div>
  );
}

// ✅ Main Page
export default function FishSelectPage() {
  const router = useRouter();
  const [burstBack, setBurstBack] = useState(0);
  const [burstRecord, setBurstRecord] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/bubble.mp3");
    audioRef.current.volume = 0.7;
  }, []);

  const handleBackClick = () => {
    setBurstBack((k) => k + 1);
    audioRef.current?.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  const handleRecordClick = () => {
    setBurstRecord((k) => k + 1);
    audioRef.current?.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => {
      router.push("/customize");
    }, 600);
  };

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

        <motion.button
          className={styles.backButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRecordClick}
        >
          🎤 Ձայնագրիր
          {burstRecord > 0 && (
            <div className={styles.bubbleBurstWrapper}>
              <BubbleBurstBack triggerKey={burstRecord} />
            </div>
          )}
        </motion.button>
      </div>

      <motion.div
        className={styles.fishFlex}
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
