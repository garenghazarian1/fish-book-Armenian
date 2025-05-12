"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./FishMood.module.css";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import BubbleParticles from "@/components/BubbleParticles/BubbleParticles";
import { useRouter } from "next/navigation";
import moods from "./FishMoodData.js";

export default function Happy() {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [exitEnabled, setExitEnabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [autoplayState, setAutoplayState] = useState<"play" | "pause" | "stop">(
    "stop"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const unlockedAudiosRef = useRef<HTMLAudioElement[]>([]);
  const router = useRouter();

  // ✅ Lock scroll
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.height = "100%";

    return () => {
      html.style.overflow = "";
      html.style.overscrollBehavior = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.height = "";
    };
  }, []);

  // ✅ Unlock all audios on first gesture
  useEffect(() => {
    const unlockAllAudios = async () => {
      const promises = moods.map((mood) => {
        const audio = new Audio(mood.audio);
        unlockedAudiosRef.current.push(audio);
        return audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
          })
          .catch(() => {});
      });

      await Promise.all(promises);
      setIsUnlocked(true);
    };

    const onUserGesture = () => {
      unlockAllAudios();
    };

    document.addEventListener("click", onUserGesture, { once: true });
    document.addEventListener("touchend", onUserGesture, { once: true });

    return () => {
      document.removeEventListener("click", onUserGesture);
      document.removeEventListener("touchend", onUserGesture);
    };
  }, []);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      unlockedAudiosRef.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      unlockedAudiosRef.current = [];
    };
  }, []);

  const startAutoplay = () => {
    if (!isUnlocked || isPlaying) return;
    setIsPlaying(true);
    setAutoplayState("play");
    autoplayStep(index);
  };

  const pauseAutoplay = () => {
    setIsPlaying(false);
    setAutoplayState("pause");
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
  };

  const stopAutoplay = () => {
    pauseAutoplay();
    setIndex(0);
    setShowText(false);
    setAutoplayState("stop");
  };

  const autoplayStep = (currentIndex: number) => {
    setIndex(currentIndex);
    setShowText(false);

    autoplayTimeoutRef.current = setTimeout(() => {
      setShowText(true);

      const currentAudio = unlockedAudiosRef.current[currentIndex];
      if (currentAudio) {
        currentAudio.currentTime = 0;
        currentAudio.play().catch(() => {});
      }

      autoplayTimeoutRef.current = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % moods.length;
        autoplayStep(nextIndex);
      }, 4000);
    }, 1000);
  };

  const handleFishClick = () => {
    setShowText((prev) => {
      const next = !prev;
      if (next) {
        const currentAudio = unlockedAudiosRef.current[index];
        if (currentAudio) {
          currentAudio.currentTime = 0;
          currentAudio.play().catch(() => {});
        }
      }
      return next;
    });
  };

  const handleBackClick = () => {
    router.push("/fishSelect");
  };

  const handleScroll = (dir: "next" | "prev") => {
    if (timeoutRef.current) return;
    setDirection(dir);
    setShowText(false);
    setIndex((prev) =>
      dir === "next"
        ? (prev + 1) % moods.length
        : (prev - 1 + moods.length) % moods.length
    );

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
    }, 800);
  };

  useEffect(() => {
    if (index === 0) setExitEnabled(true);
  }, [index]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) handleScroll("next");
      else if (e.deltaY < -20) handleScroll("prev");
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = e.changedTouches[0].clientY - touchStartY;
      if (delta < -30) handleScroll("next");
      else if (delta > 30) handleScroll("prev");
    };

    container.addEventListener("wheel", onWheel);
    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const toggleTooltip = () => setShowTooltip((prev) => !prev);

  const fishVariants = {
    initial: (direction: "next" | "prev") => ({
      opacity: 0,
      rotate: direction === "next" ? -90 : 90,
      y: direction === "next" ? 100 : -100,
      scale: 0.8,
    }),
    animate: {
      opacity: 1,
      rotate: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: (direction: "next" | "prev") => ({
      opacity: 0,
      rotate: direction === "next" ? 90 : -90,
      y: direction === "next" ? -100 : 100,
      scale: 0.8,
      transition: { duration: 0.6, ease: "easeInOut" },
    }),
  };

  return (
    <div className={styles.swipeContainer} ref={containerRef}>
      <div className={styles.helpWrapper}>
        <button onClick={toggleTooltip} className={styles.helpButton}>
          ❓
        </button>
        {showTooltip && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            Կտտացրու ձկան վրա՝ տեսնելու հույզերի և լսելու ձայնը։
            <br />
            Քաշիր ներքև՝ համար ձուկը տեսնելու համար։
          </motion.div>
        )}
      </div>

      <div className={styles.canvasOverlay}>
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 60 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 3, 5]} intensity={1.2} />
          <Environment preset="sunset" background={false} />
          <BubbleParticles count={20} />
        </Canvas>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          className={styles.slide}
          variants={fishVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className={styles.fishImageWrapper} onClick={handleFishClick}>
            <Image
              src={moods[index].image}
              alt="Fish"
              fill
              priority
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 60vw, 40vw"
              className={styles.fishImage}
            />
            {showText && (
              <motion.div
                className={styles.speechBubble}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {moods[index].text}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {exitEnabled && (
        <button className={styles.backButton} onClick={handleBackClick}>
          ⬅️ Վերադառնալ
        </button>
      )}

      <div className={styles.autoplayControls}>
        <button
          className={`${styles.controlButton} ${
            autoplayState === "play" ? styles.active : ""
          }`}
          onClick={startAutoplay}
        >
          ▶️
        </button>
        <button
          className={`${styles.controlButton} ${
            autoplayState === "pause" ? styles.active : ""
          }`}
          onClick={pauseAutoplay}
        >
          ⏸️
        </button>
        <button
          className={`${styles.controlButton} ${
            autoplayState === "stop" ? styles.active : ""
          }`}
          onClick={stopAutoplay}
        >
          ⏹️
        </button>
      </div>
    </div>
  );
}
