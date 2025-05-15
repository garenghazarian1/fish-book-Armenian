/* Hook + context + provider – logic only, no JSX */
"use client";

import {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import { Mood } from "./types";

interface MoodCarouselCtx {
  index: number;
  next: () => void;
  prev: () => void;
  autoplay: boolean;
  toggleAutoplay: () => void;
  registerGesture: () => void;
}

/* ──────────────────────────────────────────── CONTEXT ─────────── */
const Ctx = createContext<MoodCarouselCtx | null>(null);
export const useMoodCarousel = (): MoodCarouselCtx => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMoodCarousel must be used within provider");
  return ctx;
};

interface ProviderProps {
  moods: Mood[];
  children: ReactNode;
  autoStart?: boolean;
  autoDelay?: number;
}

/* ──────────────────────────────────────────── PROVIDER ─────────── */
export const MoodCarouselProvider = ({
  moods,
  children,
  autoStart = false,
  autoDelay = 4000,
}: ProviderProps) => {
  const [index, setIndex] = useState(0);
  const [autoplay, setAuto] = useState(autoStart);

  /* refs ---------------------------------------------------------- */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTmr = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTmr = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hadGesture = useRef(false);

  /* ---------------------------------------------------- Audio ---- */
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const clear = (ref: typeof playTmr | typeof autoTmr) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = null;
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
      if (hadGesture.current) audioRef.current?.play().catch(() => {});
    }, 1000);
  }, []);

  /* ------------------------------------------------ Navigation --- */
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

  /* ------------------------------------------------ Autoplay ----- */
  const loop = useCallback(() => {
    clear(autoTmr);
    if (!autoplay) return;

    autoTmr.current = setTimeout(() => {
      /* use functional update so we don’t depend on `next` */
      setIndex((curr) => {
        const n = (curr + 1) % moods.length;
        scheduleAudio(moods[n]);
        return n;
      });
      loop();
    }, autoDelay);
  }, [autoplay, autoDelay, moods, scheduleAudio]);

  useEffect(() => {
    loop();
    return () => clear(autoTmr);
  }, [loop]);

  /* first slide audio --------------------------------------------- */
  useEffect(() => {
    if (moods.length) scheduleAudio(moods[0]);
  }, [moods, scheduleAudio]);

  /* ------------------------------------------------ API object ---- */
  const value: MoodCarouselCtx = {
    index,
    next,
    prev,
    autoplay,
    toggleAutoplay: () => {
      hadGesture.current = true;
      setAuto((a) => !a);
    },
    registerGesture: () => {
      hadGesture.current = true;
    },
  };

  /* ----------- lock page scroll while carousel is mounted -------- */
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

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
