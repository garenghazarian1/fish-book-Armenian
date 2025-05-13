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
 * Kid-centric UX — stepped reveal per slide:
 *  1️⃣ Swipe up/down → fish image animates in immediately.
 *  2️⃣ After 1 s its speech bubble fades in.
 *  3️⃣ After another 1 s the corresponding audio plays.
 */
export default function Happy() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [showText, setShowText] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [exitEnabled, setExitEnabled] = useState(true);
  const router = useRouter();
  const firstUnlockRef = useRef(false);

  // refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hintTimers = useRef<{ t1?: NodeJS.Timeout; t2?: NodeJS.Timeout }>({});

  // Preload audio element
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current = null;
    };
  }, []);

  /* ──────── STAGGERED TEXT + SOUND ──────── */
  useEffect(() => {
    // Reset
    setShowText(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = moods[index].audio;
    }
    clearTimeout(textTimeoutRef.current!);
    clearTimeout(audioTimeoutRef.current!);

    // 1 s → show speech bubble
    textTimeoutRef.current = setTimeout(() => {
      setShowText(true);
    }, 1000);

    // 2 s → play audio
    audioTimeoutRef.current = setTimeout(() => {
      audioRef.current?.play().catch((err) => {
        console.warn("Delayed play still blocked?", err);
      });
    }, 1000);

    // Back button enabled as soon as slide 0 appears
    setExitEnabled(true);

    return () => {
      clearTimeout(textTimeoutRef.current!);
      clearTimeout(audioTimeoutRef.current!);
    };
  }, [index]);

  /* ──────── ALWAYS-SHOW SWIPE HINT ──────── */
  useEffect(() => {
    hintTimers.current.t1 = setTimeout(() => setShowSwipeHint(true), 3000);
    hintTimers.current.t2 = setTimeout(() => setShowSwipeHint(false), 5000);
    return () => {
      clearTimeout(hintTimers.current.t1);
      clearTimeout(hintTimers.current.t2);
    };
  }, []);

  /* ──────── SWIPE / WHEEL HANDLERS ──────── */
  const handleScroll = (dir: "next" | "prev") => {
    if (!firstUnlockRef.current && audioRef.current) {
      // Kick-start the media element so the browser considers it “user‐initiated”
      audioRef.current
        .play()
        .catch(() => {})
        .then(() => {
          audioRef.current!.pause();
          audioRef.current!.currentTime = 0;
          firstUnlockRef.current = true;
        });
    }
    if (scrollThrottleRef.current) return;
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
    const node = containerRef.current;
    if (!node) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) handleScroll("next");
      else if (e.deltaY < -20) handleScroll("prev");
    };

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
    node.addEventListener("wheel", onWheel, opts);
    node.addEventListener("touchstart", onTouchStart, opts);
    node.addEventListener("touchend", onTouchEnd, opts);

    return () => {
      node.removeEventListener("wheel", onWheel, opts);
      node.removeEventListener("touchstart", onTouchStart, opts);
      node.removeEventListener("touchend", onTouchEnd, opts);
    };
  }, []);

  /* ─────────── LOCK SCROLL ─────────── */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const orig = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyHeight: body.style.height,
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.height = "100%";

    return () => {
      html.style.overflow = orig.htmlOverflow;
      html.style.overscrollBehavior = orig.htmlOverscroll;
      body.style.overflow = orig.bodyOverflow;
      body.style.position = orig.bodyPosition;
      body.style.height = orig.bodyHeight;
    };
  }, []);

  /* ─────── RENDER ─────── */
  return (
    <div className={styles.swipeContainer} ref={containerRef}>
      {/* Swipe hint */}
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
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className={styles.tooltip}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              Քաշիր վերև կամ ներքև՝ հաջորդ ձուկը → 1 վ հետո խոսքը → էլի 1 վ հետո
              ձայնը։
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3-D bubbles backdrop */}
      <div className={styles.canvasOverlay}>
        <Canvas
          frameloop="demand"
          gl={{ antialias: true }}
          camera={{ position: [0, 0, 2.5], fov: 60 }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
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
          variants={{
            initial: (d) => ({
              opacity: 0,
              rotate: d === "next" ? -90 : 90,
              y: d === "next" ? 100 : -100,
              scale: 0.8,
            }),
            animate: {
              opacity: 1,
              rotate: 0,
              y: 0,
              scale: 1,
              transition: { duration: 0.6, ease: "easeInOut" },
            },
            exit: (d) => ({
              opacity: 0,
              rotate: d === "next" ? 90 : -90,
              y: d === "next" ? -100 : 100,
              scale: 0.8,
              transition: { duration: 0.6, ease: "easeInOut" },
            }),
          }}
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
              sizes="(max-width:768px) 80vw, (max-width:1200px) 60vw, 40vw"
              className={styles.fishImage}
            />
            {showText && (
              <motion.div
                className={styles.speechBubble}
                key={moods[index].text}
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
