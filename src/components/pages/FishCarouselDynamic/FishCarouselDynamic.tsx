"use client";

/**
 * FishCarouselDynamic
 * -------------------
 * Displays an interactive mood-based carousel for fish emotions.
 * - Receives a list of moods as a prop (images, audio, text)
 * - Supports swipe, mouse, wheel, and button navigation
 * - Plays associated audio for each mood
 * - Optional autoplay (cycles moods every 4s)
 * - Locks background scroll while open
 */
import {
  useEffect,
  useRef,
  useState,
  TouchEvent,
  WheelEvent,
  MouseEvent,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import BubbleParticles from "@/components/BubbleParticles/BubbleParticles";
import styles from "./FishCarouselDynamic.module.css";
console.log("Mounting FishCarouselDynamic");

// Mood type (one fish mood)
export interface Mood {
  id: string; // Unique ID for the mood
  image: string; // Image URL
  text: string; // Caption (localized)
  audio: string; // Audio URL
}

// Component props
interface Props {
  moods: Mood[];
}

const FishCarouselDynamic = ({ moods }: Props) => {
  const router = useRouter();

  // Carousel state
  const [index, setIndex] = useState(0); // Current mood index
  const [autoplay, setAutoplay] = useState(false); // Autoplay toggle

  // Audio management and timing
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTmr = useRef<ReturnType<typeof setTimeout> | null>(null); // For audio delay
  const autoTmr = useRef<ReturnType<typeof setTimeout> | null>(null); // For autoplay
  const hadGesture = useRef(false); // Required to unlock audio on iOS/Chrome

  // Gesture navigation (touch/wheel)
  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);

  // Current mood slide
  const slide = moods[index];

  // --- Navigation (manual and autoplay) ---
  /**
   * goTo: move to a mood at position i, playing audio
   * fromUser: if triggered by user gesture, unlock audio
   */
  const goTo = (i: number, fromUser = false) => {
    if (fromUser) hadGesture.current = true;
    setIndex(() => {
      const n = (i + moods.length) % moods.length; // wrap around
      scheduleAudio(moods[n]);
      return n;
    });
  };

  const next = () => goTo(index + 1, true);
  const prev = () => goTo(index - 1, true);

  // --- Audio Scheduling ---
  /**
   * Stops any pending audio playback and schedules the new mood's audio
   * Plays audio after 1s delay (after mood image/text is shown)
   */
  const clear = (ref: typeof playTmr | typeof autoTmr) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = null;
  };

  const scheduleAudio = (m: Mood) => {
    clear(playTmr);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = m.audio;
      audioRef.current.load();
    }
    playTmr.current = setTimeout(() => {
      // Play only after user gesture (required on iOS/Chrome)
      if (hadGesture.current) audioRef.current?.play().catch(() => {});
    }, 1000);
  };

  // --- Autoplay Loop ---
  /**
   * Starts a timer to advance to next mood every 4 seconds
   */
  const loop = () => {
    clear(autoTmr);
    if (!autoplay) return;
    autoTmr.current = setTimeout(() => {
      next();
      loop();
    }, 4000);
  };

  // --- Effects ---
  /**
   * Restart autoplay timer when autoplay/index/moods change
   */
  useEffect(() => {
    loop();
    return () => clear(autoTmr);
    // eslint-disable-next-line
  }, [autoplay, index, moods]);

  /**
   * Initialize audio, reset index on new moods array
   * Clean up timers and audio on unmount
   */
  useEffect(() => {
    audioRef.current = new Audio();
    scheduleAudio(moods[0]);
    setIndex(0);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      clear(playTmr);
      clear(autoTmr);
    };
    // eslint-disable-next-line
  }, [moods]);

  // --- UI Event Handlers (Touch/Mouse/Wheel) ---
  /**
   * Touch start: save Y position
   */
  const onTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  /**
   * Touch end: compare Y movement, trigger prev/next
   */
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(diff) > 30) {
      diff > 0 ? prev() : next();
    }
    hadGesture.current = true;
    touchStartY.current = null;
  };

  /**
   * Wheel scroll: trigger prev/next (with debounce)
   */
  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return; // Debounce: 500ms
    lastWheel.current = now;
    hadGesture.current = true;
    e.deltaY > 0 ? next() : prev();
  };

  /**
   * Mouse click: upper half = prev, lower half = next
   */
  const onClickSlide = (e: MouseEvent<HTMLDivElement>) => {
    hadGesture.current = true;
    if (e.clientY < window.innerHeight / 2) prev();
    else next();
  };

  // --- Prevent background scroll when open ---
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

  // --- Render UI ---
  if (!slide) {
    // If moods array is empty, show error message
    return <div className={styles.container}>Տվյալներ չեն գտնվել։</div>;
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.carousel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        onClick={onClickSlide}
      >
        {/* Back button to fish select */}
        <div className={styles.backButtonContainer}>
          <button
            className={styles.backButton}
            onClick={(e) => {
              e.stopPropagation();
              router.push("/fishSelect");
            }}
          >
            ⬅️ Վերադառնալ
          </button>
        </div>

        {/* Caption for current mood */}
        <div className={styles.captionContainer}>
          <div key={`caption-${index}`} className={styles.caption}>
            {slide.text}
          </div>
        </div>

        {/* Mood image */}
        <div className={styles.imageContainer}>
          <Image
            key={index}
            src={slide.image}
            alt={slide.id}
            fill
            sizes="100%"
            priority
            className={styles.image}
          />
        </div>

        {/* Autoplay toggle */}
        <button
          className={styles.autoplayBtn}
          onClick={(e) => {
            e.stopPropagation();
            hadGesture.current = true;
            setAutoplay((a) => !a);
          }}
        >
          {autoplay ? "⏸ Stop" : "▶️ Auto"}
        </button>

        {/* 3D Bubble background */}
        <Canvas
          className={styles.canvasOverlay}
          frameloop="always"
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
  );
};

export default FishCarouselDynamic;
