"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./Happy.module.css";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import BubbleParticles from "@/components/BubbleParticles/BubbleParticles";
import { useRouter } from "next/navigation";
import moods from "./HammyMood.js";

export default function Happy() {
  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [exitEnabled, setExitEnabled] = useState(false);
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  // autoplay
  // autoplay
  const [autoplayState, setAutoplayState] = useState<"play" | "pause" | "stop">(
    "stop"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setAutoplayState("play");
    autoplayStep(index);
  };

  const pauseAutoplay = () => {
    setIsPlaying(false);
    setAutoplayState("pause");
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
  };

  const stopAutoplay = () => {
    pauseAutoplay();
    setIndex(0);
    setShowText(false);
    setAutoplayState("stop");
  };

  const autoplayStep = (currentIndex: number) => {
    setIndex(currentIndex); // Step 1: Show image
    setShowText(false); // Hide text initially

    autoplayTimeoutRef.current = setTimeout(() => {
      setShowText(true); // Step 2: Show text + play audio
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      autoplayTimeoutRef.current = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % moods.length;
        autoplayStep(nextIndex); // Step 3: Move to next
      }, 4000); // wait 4s after showing text/audio
    }, 1000); // wait 1s after image
  };

  // end

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  const handleBackClick = () => {
    router.push("/fishSelect");
  };

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

  useEffect(() => {
    if (index === 0) setExitEnabled(true);
  }, [index]);

  const handleFishClick = () => {
    setShowText((prev) => {
      const next = !prev;
      if (next && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return next;
    });
  };

  const handleScroll = (dir: "next" | "prev") => {
    if (timeoutRef.current) return;

    setDirection(dir); // ✅ set direction for animation
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
              placeholder="blur"
              blurDataURL="/fishBlue/blur-placeholder.jpg" // You can generate a tiny 10x10 blurred version
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
          <audio ref={audioRef} src={moods[index].audio} preload="auto" />
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
          title="Play"
        >
          ▶️
        </button>
        <button
          className={`${styles.controlButton} ${
            autoplayState === "pause" ? styles.active : ""
          }`}
          onClick={pauseAutoplay}
          title="Pause"
        >
          ⏸️
        </button>
        <button
          className={`${styles.controlButton} ${
            autoplayState === "stop" ? styles.active : ""
          }`}
          onClick={stopAutoplay}
          title="Stop"
        >
          ⏹️
        </button>
      </div>
    </div>
  );
}
