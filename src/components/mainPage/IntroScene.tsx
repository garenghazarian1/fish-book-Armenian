"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BubbleBurst from "../bubble/BubbleBurst/BubbleBurst";
import BubbleBurstButton from "../bubble/BubbleBurstButton/BubbleBurstButton";
import styles from "./IntroScene.module.css";

export default function IntroScene() {
  const [burstKeyTitle, setBurstKeyTitle] = useState(0);
  const [burstKeyButton, setBurstKeyButton] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const bubbleSoundRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      bubbleSoundRef.current = new Audio("/sounds/bubble.mp3");
      bubbleSoundRef.current.volume = 0.7;

      introAudioRef.current = new Audio("/sounds/intro.mp3"); // Your voice file
      introAudioRef.current.volume = 1;
    }

    return () => {
      // ✅ Cleanup: Stop and reset the audio on unmount
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleTitleInteraction = () => {
    setBurstKeyTitle((k) => k + 1);
    if (navigator.vibrate) navigator.vibrate(80);
    bubbleSoundRef.current?.play().catch(() => {});
  };

  const handleStartClick = () => {
    setBurstKeyButton((prev) => (prev === null ? 0 : prev + 1));

    bubbleSoundRef.current?.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);

    // ✅ Stop the intro audio before leaving
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
    }
    setTimeout(() => {
      router.push("/fishSelect");
    }, 1000);
  };

  const handleToggleAudio = () => {
    const audio = introAudioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0; // Optional: reset to beginning
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  // 🛑 Reset playing state when audio ends
  useEffect(() => {
    const audio = introAudioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <section className={styles.introWrapper}>
      {/* Title and subtitle */}
      <motion.div
        className={styles.titleContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className={styles.title} onPointerDown={handleTitleInteraction}>
          <span className={styles.wordRed}>Սկսենք&nbsp;</span>
          <span className={styles.wordBlue}>հույզերի&nbsp;</span>
          <span className={styles.wordOrange}>ծովաշխարհ</span>
          {burstKeyTitle > 0 && (
            <div className={styles.bubbleBurstWrapper}>
              <BubbleBurst triggerKey={burstKeyTitle} />
            </div>
          )}
        </h1>

        <p className={styles.subtitle}>
          Այստեղ կծանոթանաս 13 ձկների, որոնք ցույց են տալիս իրենց հույզերն ու
          զգացմունքները։
        </p>

        <p className={styles.subtitle}>2 տաեկանից սկսած</p>
        <button
          onClick={handleToggleAudio}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggleAudio();
            }
          }}
          className={styles.playAudioButton}
          tabIndex={0}
          role="button"
          aria-label={
            isPlaying ? "Կանգնեցնել ձայնը" : "Լսել բացատրությունը ձայնով"
          }
        >
          {isPlaying ? "⏹️" : "🔊"}
        </button>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        className={styles.startButtonContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className={styles.bubbleButtonWrapper}>
          <motion.button
            onClick={handleStartClick}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
            className={styles.startButton}
          >
            Սկսել
            {hasMounted && burstKeyButton !== null && (
              <div className={styles.bubbleBurstWrapper}>
                <BubbleBurstButton triggerKey={burstKeyButton} />
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
