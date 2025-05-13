// FishCarousel.tsx – Next.js / React-TSX carousel
// • waits 1 s then plays a single audio track (never overlaps)
// • swipe / wheel / click navigation
// • optional Auto-play that stops cleanly on the current slide
// • all browser audio-policy safe (first user gesture required)

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
  /** mark that we already had at least one user gesture */
  registerGesture: () => void;
}

const MoodCarouselContext = createContext<MoodCarouselCtx | null>(null);

export const useMoodCarousel = (): MoodCarouselCtx => {
  const ctx = useContext(MoodCarouselContext);
  if (!ctx) {
    throw new Error(
      "useMoodCarousel must be used inside <MoodCarouselProvider>"
    );
  }
  return ctx;
};

/* ------------------------------------------------------------------------ */
/* Provider                                                                 */
/* ------------------------------------------------------------------------ */
interface ProviderProps {
  children: ReactNode;
  /** auto-start after the first gesture (default false) */
  autoStart?: boolean;
  /** ms a slide stays visible during auto-play (default 4000) */
  autoDelay?: number;
}

export const MoodCarouselProvider = ({
  children,
  autoStart = false,
  autoDelay = 4000,
}: ProviderProps) => {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(autoStart);

  /* refs ----------------------------------------------------------------- */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstGestureRef = useRef(false);

  /* create exactly ONE <audio> element ----------------------------------- */
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  /* helper: clear a timeout ---------------------------------------------- */
  const clearTimer = (ref: typeof playTimerRef | typeof autoTimerRef) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = null;
  };

  /* schedule audio exactly once, 1 s after slide became visible ---------- */
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
        audioRef.current.play().catch(() => {}); // ignore policy errors
      }
    }, 1000);
  }, []);

  /* navigation helpers --------------------------------------------------- */
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
  const prev = useCallback(() => goTo(index - 1, false), [goTo, index]);

  /* mark first gesture – exposed to UI layer ----------------------------- */
  const registerGesture = () => {
    firstGestureRef.current = true;
  };

  /* auto-play (self-chained setTimeout so no stray tick after “Stop”) ---- */
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

  /* initial audio scheduling --------------------------------------------- */
  useEffect(() => {
    scheduleAudio(moods[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* public API ----------------------------------------------------------- */
  const toggleAutoplay = () => {
    firstGestureRef.current = true; // user clicked button
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

  /* swipe refs */
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
      diff > 0 ? prev() : next();
    }
    touchStartY.current = null;
  };

  /* wheel */
  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return; // 0.5 s throttle
    lastWheel.current = now;
    registerGesture();
    e.deltaY > 0 ? next() : prev();
  };

  /* click (top/bottom) */
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    registerGesture();
    const y = e.clientY;
    y < window.innerHeight / 2 ? prev() : next();
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

      {/* autoplay toggle – stopPropagation keeps it from being a navigation click */}
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
