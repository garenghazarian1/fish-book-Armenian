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

export interface Mood {
  id: string;
  image: string;
  text: string;
  audio: string;
}

interface Props {
  moods: Mood[];
}

const FishCarouselDynamic = ({ moods }: Props) => {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTmr = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTmr = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hadGesture = useRef(false);

  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);

  const slide = moods?.[index];

  const goTo = (i: number, fromUser = false) => {
    if (fromUser) hadGesture.current = true;
    setIndex(() => {
      const n = (i + moods.length) % moods.length;
      scheduleAudio(moods[n]);
      return n;
    });
  };

  const next = () => goTo(index + 1, true);
  const prev = () => goTo(index - 1, true);

  const clear = (ref: typeof playTmr | typeof autoTmr) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
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
      if (hadGesture.current) {
        audioRef.current?.play().catch(() => {});
      }
    }, 1000);
  };

  const loop = () => {
    clear(autoTmr);
    if (!autoplay) return;
    autoTmr.current = setTimeout(() => {
      next();
      loop();
    }, 4000);
  };

  useEffect(() => {
    loop();
    return () => clear(autoTmr);
  }, [autoplay, index, moods]);

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
  }, [moods]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(diff) > 30) {
      diff > 0 ? prev() : next();
    }
    hadGesture.current = true;
    touchStartY.current = null;
  };

  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return;
    lastWheel.current = now;
    hadGesture.current = true;
    e.deltaY > 0 ? next() : prev();
  };

  const onClickSlide = (e: MouseEvent<HTMLDivElement>) => {
    hadGesture.current = true;
    if (e.clientY < window.innerHeight / 2) prev();
    else next();
  };

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

  if (!slide) {
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
            priority
            className={styles.image}
          />
        </div>

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
