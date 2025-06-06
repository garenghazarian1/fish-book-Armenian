"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  TouchEvent,
  WheelEvent,
} from "react";
import Image from "next/image";
import styles from "./FishCarouselDynamic.module.css";
import BubbleBurstBack from "@/components/bubble/BubbleBurst/BubbleBurst";
import { motion } from "framer-motion";
import type { Mood } from "@/components/pages/data/types";

interface Props {
  moods: Mood[];
}

const FishCarouselDynamic = ({ moods }: Props) => {
  // ========================
  // 🔁 State & Refs
  // ========================
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTmr = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTmr = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hadGesture = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);

  const slide = moods?.[index];

  const [hasMounted, setHasMounted] = useState(false);

  const [isExiting, setIsExiting] = useState(false);

  // ========================
  // 🔙 Back button: bubble animation setup
  // ========================
  const [burstKey, setBurstKey] = useState(0);
  const bubbleSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setHasMounted(true); // ✅ prevent SSR mismatch
    bubbleSoundRef.current = new Audio("/sounds/bubble.mp3");
    bubbleSoundRef.current.volume = 0.7;
  }, []);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        window.location.href = "/fishSelect"; // 💥 Avoid router.push to delay page swap
      }, 600); // Match this to your animation duration

      return () => clearTimeout(timer);
    }
  }, [isExiting]);

  // Handle back button click with animation + sound + vibration
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setBurstKey((k) => k + 1);
    bubbleSoundRef.current?.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);

    setIsExiting(true); // ✅ Trigger exit state
  };

  // ========================
  // 🧹 Clear timeout helper
  // ========================
  const clear = (ref: typeof playTmr | typeof autoTmr) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  };

  // ========================
  // 🔊 Play audio with delay (manual)
  // ========================
  const scheduleAudio = useCallback((m: Mood) => {
    clear(playTmr);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = m.audio;
      audioRef.current.load();
    }

    playTmr.current = setTimeout(() => {
      if (hadGesture.current) {
        audioRef.current?.play().catch(() => {});
      }
    }, 1000);
  }, []);

  // ========================
  // 🔁 Go to specific index
  // ========================
  const goTo = useCallback(
    (i: number, fromUser = false) => {
      if (fromUser) hadGesture.current = true;
      setIndex(() => {
        const n = (i + moods.length) % moods.length;
        scheduleAudio(moods[n]);
        return n;
      });
    },
    [moods, scheduleAudio]
  );

  // ========================
  // ⏭️ Next / Previous
  // ========================
  const next = useCallback(() => {
    goTo(index + 1, true);
  }, [goTo, index]);

  const prev = useCallback(() => {
    goTo(index - 1, true);
  }, [goTo, index]);

  // ========================
  // 🔁 Autoplay loop: play audio, wait 1s, then next
  // ========================
  const loop = useCallback(() => {
    if (!autoplay || !slide) return;

    clear(autoTmr);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = slide.audio;
      audioRef.current.load();

      audioRef.current.onended = () => {
        autoTmr.current = setTimeout(() => {
          next();
          loop();
        }, 1000); // ✅ 1 second after audio ends
      };

      audioRef.current.play().catch(() => {});
    }
  }, [autoplay, slide, next]);

  // ========================
  // 🧠 Autoplay Effect
  // ========================
  useEffect(() => {
    if (autoplay) {
      loop();
    } else {
      clear(autoTmr);
      if (audioRef.current) {
        audioRef.current.onended = null;
      }
    }

    return () => {
      clear(autoTmr);
      if (audioRef.current) {
        audioRef.current.onended = null;
      }
    };
  }, [autoplay, index, loop]);

  // ========================
  // 🧠 On mount: init audio and index
  // ========================
  useEffect(() => {
    audioRef.current = new Audio();
    scheduleAudio(moods[0]);
    setIndex(0);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      clear(playTmr);
      clear(autoTmr);
    };
  }, [moods, scheduleAudio]);

  // ========================
  // 👆 Touch & Scroll Events
  // ========================
  const onTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(diff) > 30) {
      if (diff > 0) prev();
      else next();
    }

    hadGesture.current = true;
    touchStartY.current = null;
  };

  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return;
    lastWheel.current = now;

    hadGesture.current = true;
    if (e.deltaY > 0) next();
    else prev();
  };

  // ========================
  // 🔁 Replay audio on click
  // ========================
  const onClickReplayAudio = () => {
    hadGesture.current = true;

    if (!slide || !audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = slide.audio;
    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  };

  // ========================
  // 🧠 Lock scroll
  // ========================
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      hO: html.style.overflow,
      hOS: html.style.overscrollBehavior,
      bO: body.style.overflow,
      bP: body.style.position,
      bH: body.style.height,
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.height = "100%";

    return () => {
      html.style.overflow = prev.hO;
      html.style.overscrollBehavior = prev.hOS;
      body.style.overflow = prev.bO;
      body.style.position = prev.bP;
      body.style.height = prev.bH;
    };
  }, []);

  // ========================
  // ❌ Fallback: no data
  // ========================
  if (!slide) {
    return (
      <motion.div
        className={styles.container}
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: isExiting ? 0 : 1, x: isExiting ? 100 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        Տվյալներ չեն գտնվել։
      </motion.div>
    );
  }

  // ========================
  // ✅ UI
  // ========================
  return (
    <div className={styles.container}>
      <div
        className={styles.carousel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        onClick={onClickReplayAudio}
      >
        {/* 🔙 Back Button with Bubble Animation */}
        <div className={styles.backButtonContainer}>
          <motion.button
            className={styles.backButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackClick}
          >
            ⬅️ Վերադառնալ
            {hasMounted && (
              <div className={styles.bubbleBurstWrapper}>
                <BubbleBurstBack triggerKey={burstKey} />
              </div>
            )}
          </motion.button>
        </div>

        <div className={styles.captionContainer}>
          <div key={`caption-${index}`} className={styles.caption}>
            {slide.text}
          </div>
        </div>

        <div className={styles.imageContainer}>
          <Image
            key={index}
            src={slide.image}
            alt={slide.id}
            fill
            sizes="100%"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            className={styles.image}
          />
        </div>

        {/* ▶️ Autoplay Toggle Button */}
        <button
          className={styles.autoplayBtn}
          onClick={(e) => {
            e.stopPropagation();
            hadGesture.current = true;
            setAutoplay((prev) => !prev);
          }}
        >
          {autoplay ? "⏸ Stop" : "▶️ Auto"}
        </button>
      </div>
    </div>
  );
};

export default FishCarouselDynamic;
