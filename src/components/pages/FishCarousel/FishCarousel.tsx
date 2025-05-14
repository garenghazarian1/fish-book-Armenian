// FishCarousel.tsx  – Next.js / React-TSX carousel
// • waits 1 s then plays a single audio track (never overlaps)
// • swipe / wheel / click navigation
// • optional 4 s Auto-play that stops cleanly on the current slide
// • Back button to /fishSelect
// • browser audio-policy safe (needs first user gesture)

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
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

import moods from "./FishMoodData"; // adjust path if needed
import styles from "./FishCarousel.module.css";
import BubbleParticles from "@/components/BubbleParticles/BubbleParticles";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

/* ------------------------------------------------------------------ */
/* Types & Context                                                    */
/* ------------------------------------------------------------------ */
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
  if (!ctx) throw new Error("useMoodCarousel must be used inside provider");
  return ctx;
};

/* ------------------------------------------------------------------ */
/* Provider (audio + autoplay logic)                                  */
/* ------------------------------------------------------------------ */
interface ProviderProps {
  children: ReactNode;
  autoStart?: boolean;
  autoDelay?: number;
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

  /* one <audio> element for life-time */
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

  /* navigation */
  const goTo = useCallback(
    (newIdx: number, fromUser = false) => {
      if (fromUser) firstGestureRef.current = true;
      setIndex(() => {
        const i = (newIdx + moods.length) % moods.length;
        scheduleAudio(moods[i]);
        return i;
      });
    },
    [scheduleAudio]
  );

  const next = useCallback(() => goTo(index + 1, false), [goTo, index]);

  /* autoplay */
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

  /* first slide audio (silent until gesture) */
  useEffect(() => {
    scheduleAudio(moods[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* API */
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

  return (
    <MoodCarouselContext.Provider value={value}>
      {children}
    </MoodCarouselContext.Provider>
  );
};

/* ------------------------------------------------------------------ */
/* UI component                                                       */
/* ------------------------------------------------------------------ */
const FishCarouselInner = () => {
  const { index, next, prev, autoplay, toggleAutoplay, registerGesture } =
    useMoodCarousel();

  const router = useRouter();
  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);

  /* swipe ---------------------------------------------------------- */
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

  /* wheel ---------------------------------------------------------- */
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

  /* click (top / bottom) ------------------------------------------ */
  const onClickSlide = (e: MouseEvent<HTMLDivElement>) => {
    registerGesture();
    if (e.clientY < window.innerHeight / 2) {
      prev();
    } else {
      next();
    }
  };

  const slide = moods[index];

  return (
    <div className={styles.container}>
      <div
        className={styles.carousel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        onClick={onClickSlide}
      >
        {/* Back button */}
        <div className={styles.backButtonContainer}>
          <button
            className={styles.backButton}
            onClick={(e) => {
              e.stopPropagation(); // avoid also triggering prev/next
              router.push("/fishSelect");
            }}
          >
            ⬅️ Վերադառնալ
          </button>
        </div>
        <div className={styles.captionContainer}>
          <div className={styles.caption}>{slide.text}</div>
        </div>

        <div className={styles.imageContainer}>
          {/* Fish image */}
          <Image
            key={index}
            src={slide.image}
            alt={slide.id}
            fill
            priority
            sizes="100%"
            className={styles.image}
          />
        </div>

        {/* Auto-play toggle */}
        <div className={styles.autoplayBtnContainer}>
          <button
            className={styles.autoplayBtn}
            onClick={(e) => {
              e.stopPropagation();
              registerGesture();
              toggleAutoplay();
            }}
          >
            {autoplay ? "⏸ Stop" : "▶️ Auto"}
          </button>
          <Canvas
            className={styles.canvasOverlay} /* fills full viewport */
            frameloop="always" /* animate each frame  */
            gl={{ antialias: true }}
            camera={{ position: [0, 0, 2.5], fov: 60 }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 3, 5]} intensity={1.2} />
            <Environment preset="sunset" background={false} />
            <BubbleParticles count={5} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Wrapped export                                                     */
/* ------------------------------------------------------------------ */
const FishCarousel = () => (
  <MoodCarouselProvider>
    <FishCarouselInner />
  </MoodCarouselProvider>
);

export default FishCarousel;
