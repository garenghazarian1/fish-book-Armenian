"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  TouchEvent,
  WheelEvent,
} from "react";
import styles from "./FishCarouselDynamic.module.css";
import type { Mood } from "@/components/pages/data/types";
import {
  FishImage,
  CaptionBubble,
  BackButton,
  AutoplayToggle,
  NoData,
} from "@/components/pages/FishCarouselDynamic";

interface Props {
  moods: Mood[];
}

const FishCarouselDynamic = ({ moods }: Props) => {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTmr = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTmr = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hadGesture = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);

  const slide = moods?.[index];

  // Clear timeout helper
  const clear = (ref: typeof playTmr | typeof autoTmr) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  };

  // Play audio
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

  // Navigation
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

  const next = useCallback(() => goTo(index + 1, true), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, true), [goTo, index]);

  // Autoplay logic
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
        }, 1000);
      };

      audioRef.current.play().catch(() => {});
    }
  }, [autoplay, slide, next]);

  // Autoplay effect
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

  // Init audio on mount
  useEffect(() => {
    audioRef.current = new Audio();
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

  // Touch + Wheel handling
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
    if (e.deltaY > 0) next();
    else prev();
  };

  // Replay current audio on click
  const onClickReplayAudio = () => {
    hadGesture.current = true;
    if (!slide || !audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = slide.audio;
    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  };

  // Lock scroll
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

  // Fallback if no slide
  if (!slide) {
    return <NoData />;
  }
  return (
    <div className={styles.container}>
      <div
        className={styles.carousel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        onClick={onClickReplayAudio}
      >
        {/* 🎛 Buttons at the Top */}
        <div className={styles.controlsRow}>
          <BackButton />
          <AutoplayToggle
            isPlaying={autoplay}
            onToggle={() => {
              hadGesture.current = true;
              setAutoplay((prev) => !prev);
            }}
          />
        </div>

        {/* 📢 Caption */}
        <CaptionBubble text={slide.text} index={index} />

        {/* 🐟 Image */}
        <FishImage
          src={slide.image}
          alt={slide.id}
          index={index}
          priority={index === 0}
        />
      </div>
    </div>
  );
};

export default FishCarouselDynamic;
