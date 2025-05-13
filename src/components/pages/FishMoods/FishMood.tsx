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

/**
 * Kid‑centric UX — stepped reveal per slide:
 *  1️⃣ Swipe up/down → fish image animates in immediately.
 *  2️⃣ After **1 s** its speech bubble fades in.
 *  3️⃣ After **another 1 s** the corresponding audio plays.
 */
export default function Happy() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [showText, setShowText] = useState(true);

  // refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [exitEnabled, setExitEnabled] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();

  // ――― top-level state & refs (place near your other useState / useRef lines)
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const hintTimers = useRef<{ t1?: NodeJS.Timeout; t2?: NodeJS.Timeout }>({});
  /* ────────────────────────────  LOCK SCROLL  ─────────────────────────── */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const originalHtml = {
      overflow: html.style.overflow,
      overscrollBehavior: html.style.overscrollBehavior,
    };
    const originalBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      height: body.style.height,
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.height = "100%";

    return () => {
      html.style.overflow = originalHtml.overflow;
      html.style.overscrollBehavior = originalHtml.overscrollBehavior;
      body.style.overflow = originalBody.overflow;
      body.style.position = originalBody.position;
      body.style.height = originalBody.height;
    };
  }, []);

  /* ─────────────────────  STAGGERED TEXT + SOUND  ─────────────────────── */
  useEffect(() => {
    // Cleanup any pending reveals when index changes quickly
    clearTimeout(textTimeoutRef.current as NodeJS.Timeout);
    clearTimeout(audioTimeoutRef.current as NodeJS.Timeout);

    // Reset visual/audio state
    setShowText(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // 🔸 1 s → show speech bubble
    textTimeoutRef.current = setTimeout(() => {
      setShowText(true);
    }, 1000);

    // 🔸 2 s → play audio
    audioTimeoutRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 1000);

    // Enable back button after first slide loads
    if (index === 0) setExitEnabled(true);

    return () => {
      clearTimeout(textTimeoutRef.current as NodeJS.Timeout);
      clearTimeout(audioTimeoutRef.current as NodeJS.Timeout);
    };
  }, [index]);

  // 👋 Always-show swipe hint (runs on every refresh)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // show after 3 s
    hintTimers.current.t1 = setTimeout(() => setShowSwipeHint(true), 3000);

    // hide 2 s later ( = 5 s after page load )
    hintTimers.current.t2 = setTimeout(() => setShowSwipeHint(false), 5000);

    return () => {
      clearTimeout(hintTimers.current.t1);
      clearTimeout(hintTimers.current.t2);
    };
  }, []);

  /* ───────────────────────  SWIPE / WHEEL HANDLERS  ───────────────────── */
  const handleScroll = (dir: "next" | "prev") => {
    if (scrollThrottleRef.current) return; // simple throttle

    setDirection(dir);
    setIndex((prev) =>
      dir === "next"
        ? (prev + 1) % moods.length
        : (prev - 1 + moods.length) % moods.length
    );

    scrollThrottleRef.current = setTimeout(() => {
      scrollThrottleRef.current = null;
    }, 800);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wheel handler
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) handleScroll("next");
      else if (e.deltaY < -20) handleScroll("prev");
    };

    // Touch handler
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = e.changedTouches[0].clientY - startY;
      if (delta < -30) handleScroll("next");
      else if (delta > 30) handleScroll("prev");
    };

    const opts: AddEventListenerOptions = { passive: true };

    container.addEventListener("wheel", onWheel, opts);
    container.addEventListener("touchstart", onTouchStart, opts);
    container.addEventListener("touchend", onTouchEnd, opts);

    return () => {
      container.removeEventListener("wheel", onWheel, opts);
      container.removeEventListener("touchstart", onTouchStart, opts);
      container.removeEventListener("touchend", onTouchEnd, opts);
    };
  }, []);

  /* ─────────────────────────────  VARIANTS  ────────────────────────────── */
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
  } as const;

  /* ─────────────────────────────  RENDER  ──────────────────────────────── */
  return (
    <div className={styles.swipeContainer} ref={containerRef}>
      {/*  === inside your JSX, replace the previous <AnimatePresence> block === */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            key="swipeHint"
            className={styles.swipeHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.half}>
              <span className={styles.fingerUp}>👆</span>
            </div>
            <div className={styles.half}>
              <span className={styles.fingerDown}>👇</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help / tooltip */}
      <div className={styles.helpWrapper}>
        <button
          onClick={() => setShowTooltip((p) => !p)}
          className={styles.helpButton}
        >
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
            Քաշիր վերև կամ ներքև, որ հերթական ձուկը տեսնես → 1 վ հետո կտեսնես
            խոսքը, էլի 1 վ հետո՝ ձայնը։
          </motion.div>
        )}
      </div>

      {/* 3‑D bubbles & lighting overlay */}
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
          <BubbleParticles count={5} />
        </Canvas>
      </div>

      {/* Swipeable slides */}
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
          <div className={styles.fishImageWrapper}>
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
                key={moods[index].text} // restart animation each slide
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
        <button
          className={styles.backButton}
          onClick={() => router.push("/fishSelect")}
        >
          ⬅️ Վերադառնալ
        </button>
      )}
    </div>
  );
}
