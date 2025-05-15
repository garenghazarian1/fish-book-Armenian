"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { TouchEvent, WheelEvent, MouseEvent, useRef } from "react";

import {
  MoodCarouselProvider,
  useMoodCarousel,
} from "@/components/context/useMoodCarousel";
import moods from "./FishMoodData";
import styles from "./FishCarousel.module.css";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import BubbleParticles from "@/components/BubbleParticles/BubbleParticles";

/* ------------------------------------------------------------------ */
/* Inner UI                                                           */
/* ------------------------------------------------------------------ */
const FishCarouselInner = () => {
  const { index, next, prev, autoplay, toggleAutoplay, registerGesture } =
    useMoodCarousel();
  const router = useRouter();

  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);
  const slide = moods[index];

  /* ---------------------------- swipe handlers -------------------- */
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
      registerGesture();
    }
    touchStartY.current = null;
  };

  /* ---------------------------- wheel handler --------------------- */
  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return; // debounce

    lastWheel.current = now;
    registerGesture();

    if (e.deltaY > 0) {
      next();
    } else {
      prev();
    }
  };

  /* -------------------------- click top / bottom ------------------ */
  const onClickSlide = (e: MouseEvent<HTMLDivElement>) => {
    registerGesture();

    if (e.clientY < window.innerHeight / 2) {
      prev();
    } else {
      next();
    }
  };

  /* ------------------------------------------------------------------ */
  /* JSX                                                               */
  /* ------------------------------------------------------------------ */
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
              e.stopPropagation();
              router.push("/fishSelect");
            }}
          >
            ⬅️ Վերադառնալ
          </button>
        </div>
        {/* Slide caption */}
        <div className={styles.captionContainer}>
          <div key={`caption-${index}`} className={styles.caption}>
            {slide.text}
          </div>
        </div>

        {/* Fish image */}
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
            registerGesture();
            toggleAutoplay();
          }}
        >
          {autoplay ? "⏸ Stop" : "▶️ Auto"}
        </button>

        {/* 3‑D decorative bubbles */}
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

/* ------------------------------------------------------------------ */
/* Public export                                                      */
/* ------------------------------------------------------------------ */
const FishCarousel = () => (
  <MoodCarouselProvider moods={moods}>
    <FishCarouselInner />
  </MoodCarouselProvider>
);

export default FishCarousel;
