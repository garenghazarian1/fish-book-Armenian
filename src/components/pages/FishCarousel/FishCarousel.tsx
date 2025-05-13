// FishCarousel.tsx  – Next.js / React-TSX carousel
// • waits 1 s then plays a single audio track (never overlaps)
// • swipe / wheel / click navigation
// • optional Auto-play that stops cleanly on the current slide
// • browser audio-policy safe (needs first user gesture)

"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  MouseEvent,
  WheelEvent,
} from "react";
// 👉 adjust this path if your data file lives elsewhere
import moods from "./FishMoodData";
import styles from "./FishCarousel.module.css";

/* ------------------------------------------------------------------------ */
/* Types & Context                                                          */
/* ------------------------------------------------------------------------ */
interface Mood {
  id: string;
  image: string;
  text: string;
  audio: string;
}

interface MoodCarouselCtx {
  index: number;
  next: () => void;
  prev: () => void;
  autoplay: boolean;
  toggleAutoplay: () => void;
  registerGesture: () => void;
}

const MoodCarouselContext = createContext<MoodCarouselCtx | null>(null);

export const useMoodCarousel = (): MoodCarouselCtx => {
  const ctx = useContext(MoodCarouselContext);
  if (!ctx)
    throw new Error(
      "useMoodCarousel must be used inside <MoodCarouselProvider>"
    );
  return ctx;
};

/* ------------------------------------------------------------------------ */
/* Provider                                                                 */
/* ------------------------------------------------------------------------ */
interface ProviderProps {
  children: ReactNode;
  autoStart?: boolean;
  autoDelay?: number; // ms
}

export const MoodCarouselProvider = ({
  children,
  autoStart = false,
  autoDelay = 4000,
}: ProviderProps) => {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(autoStart);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstGestureRef = useRef(false);

  /* one Audio element for the whole life-time */
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const clearTimer = (ref: typeof playTimerRef | typeof autoTimerRef) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = null;
  };

  const scheduleAudio = useCallback((mood: Mood) => {
    clearTimer(playTimerRef);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = mood.audio;
      audioRef.current.load();
    }

    playTimerRef.current = setTimeout(() => {
      if (firstGestureRef.current && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 1000);
  }, []);

  /* core navigation ------------------------------------------------------ */
  const goTo = useCallback(
    (newIdx: number, fromUser = false) => {
      if (fromUser) firstGestureRef.current = true;
      setIndex(() => {
        const idx = (newIdx + moods.length) % moods.length;
        scheduleAudio(moods[idx]);
        return idx;
      });
    },
    [scheduleAudio]
  );

  const next = useCallback(() => goTo(index + 1, false), [goTo, index]);

  /* auto-play: chain timeouts so no stray tick after stop ---------------- */
  const scheduleNext = useCallback(() => {
    clearTimer(autoTimerRef);
    if (!autoplay) return;
    autoTimerRef.current = setTimeout(() => {
      next();
      scheduleNext();
    }, autoDelay);
  }, [autoplay, autoDelay, next]);

  useEffect(() => {
    scheduleNext();
    return () => clearTimer(autoTimerRef);
  }, [scheduleNext]);

  /* play first slide’s audio (will fail silently until gesture) ---------- */
  useEffect(() => {
    scheduleAudio(moods[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* public API ----------------------------------------------------------- */
  const registerGesture = () => {
    firstGestureRef.current = true;
  };

  const toggleAutoplay = () => {
    firstGestureRef.current = true;
    setAutoplay((a) => !a);
  };

  const value: MoodCarouselCtx = {
    index,
    next: () => goTo(index + 1, true),
    prev: () => goTo(index - 1, true),
    autoplay,
    toggleAutoplay,
    registerGesture,
  };

  return (
    <MoodCarouselContext.Provider value={value}>
      {children}
    </MoodCarouselContext.Provider>
  );
};

/* ------------------------------------------------------------------------ */
/* UI component                                                             */
/* ------------------------------------------------------------------------ */

const FishCarouselInner = () => {
  const { index, next, prev, autoplay, toggleAutoplay, registerGesture } =
    useMoodCarousel();

  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);

  /* swipe */
  const onTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(diff) > 30) {
      registerGesture();
      if (diff > 0) {
        prev();
      } else {
        next();
      }
    }
    touchStartY.current = null;
  };

  /* wheel */
  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return;
    lastWheel.current = now;
    registerGesture();
    if (e.deltaY > 0) {
      next();
    } else {
      prev();
    }
  };

  /* click (top/bottom) */
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    registerGesture();
    if (e.clientY < window.innerHeight / 2) {
      prev();
    } else {
      next();
    }
  };

  return (
    <div
      className={styles.carousel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
      onClick={onClick}
    >
      <Image
        src={moods[index].image}
        alt={moods[index].id}
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />

      <div className={styles.caption}>{moods[index].text}</div>

      {/* Auto-play toggle – stopPropagation keeps it from being a navigation click */}
      <button
        className={styles.autoplayBtn}
        onClick={(e) => {
          e.stopPropagation();
          toggleAutoplay();
        }}
      >
        {autoplay ? "⏸ Stop" : "▶️ Auto"}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------------ */
/* Exported wrapper                                                         */
/* ------------------------------------------------------------------------ */

const FishCarousel = () => (
  <MoodCarouselProvider>
    <FishCarouselInner />
  </MoodCarouselProvider>
);

export default FishCarousel;
