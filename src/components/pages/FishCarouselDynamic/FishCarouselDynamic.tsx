"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  TouchEvent,
  WheelEvent,
  MouseEvent,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

  const clear = (ref: typeof playTmr | typeof autoTmr) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  };

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

  const next = useCallback(() => {
    goTo(index + 1, true);
  }, [goTo, index]);

  const prev = useCallback(() => {
    goTo(index - 1, true);
  }, [goTo, index]);

  const loop = useCallback(() => {
    clear(autoTmr);
    if (!autoplay) return;
    autoTmr.current = setTimeout(() => {
      next();
      loop();
    }, 4000);
  }, [autoplay, next]);

  useEffect(() => {
    loop();
    return () => {
      clear(autoTmr);
    };
  }, [autoplay, index, moods, loop]);
  useEffect(() => {
    audioRef.current = new Audio();
    scheduleAudio(moods[0]);
    setIndex(0);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      clear(playTmr); // ✅ Line 127
      clear(autoTmr); // ✅ Line 128
    };
  }, [moods, scheduleAudio]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        prev();
      } else {
        next();
      }
    }

    hadGesture.current = true;
    touchStartY.current = null;
  };

  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return;
    lastWheel.current = now;
    hadGesture.current = true;

    if (e.deltaY > 0) {
      next();
    } else {
      prev();
    }
  };

  const onClickSlide = (e: MouseEvent<HTMLDivElement>) => {
    hadGesture.current = true;
    if (e.clientY < window.innerHeight / 2) prev();
    else next();
  };

  useEffect(() => {
    console.log("Mounted FishCarouselDynamic");
  }, []);

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
      </div>
    </div>
  );
};

export default FishCarouselDynamic;
