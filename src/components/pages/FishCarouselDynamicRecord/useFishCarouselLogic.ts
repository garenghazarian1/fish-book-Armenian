"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  TouchEvent,
  WheelEvent,
} from "react";
import type { Mood } from "@/components/pages/data/types";

export const useFishCarouselLogic = (moods: Mood[]) => {
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

  useEffect(() => {
    if (autoplay) {
      loop();
    } else {
      clear(autoTmr);
      if (audioRef.current) audioRef.current.onended = null;
    }

    return () => {
      clear(autoTmr);
      if (audioRef.current) audioRef.current.onended = null;
    };
  }, [autoplay, index, loop]);

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

  const onClickReplayAudio = () => {
    hadGesture.current = true;
    if (!slide || !audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = slide.audio;
    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      hadGesture.current = true;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setAutoplay((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, prev]);

  return {
    index,
    slide,
    autoplay,
    setAutoplay,
    onTouchStart,
    onTouchEnd,
    onWheel,
    onClickReplayAudio,
  };
};
