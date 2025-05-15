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

/* ------------------------------------------------ Inner UI only -- */
const FishCarouselInner = () => {
  const { index, next, prev, autoplay, toggleAutoplay, registerGesture } =
    useMoodCarousel();
  const router = useRouter();
  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);
  const slide = moods[index];

  /* swipes */
  const onTouchStart = (e: TouchEvent) =>
    void (touchStartY.current = e.touches[0].clientY);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(diff) > 30) (diff > 0 ? prev : next)(), registerGesture();
    touchStartY.current = null;
  };

  /* wheel */
  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return;
    lastWheel.current = now;
    registerGesture();
    (e.deltaY > 0 ? next : prev)();
  };

  /* click top / bottom */
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    registerGesture();
    (e.clientY < window.innerHeight / 2 ? prev : next)();
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.carousel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        onClick={onClick}
      >
        {/* Back */}
        <button
          className={styles.backButton}
          onClick={(e) => (e.stopPropagation(), router.push("/fishSelect"))}
        >
          ⬅️ Վերադառնալ
        </button>

        {/* Caption */}
        <div className={styles.captionContainer}>
          <div key={`caption-${index}`} className={styles.caption}>
            {slide.text}
          </div>
        </div>

        {/* Image */}
        <div className={styles.imageContainer}>
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

        {/* Autoplay */}
        <button
          className={styles.autoplayBtn}
          onClick={(e) => (
            e.stopPropagation(), registerGesture(), toggleAutoplay()
          )}
        >
          {autoplay ? "⏸ Stop" : "▶️ Auto"}
        </button>

        {/* 3-D bubbles overlay */}
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

/* ------------------------------------------------ Public export --- */
/** Only thing a page imports: `<FishCarousel />` */
const FishCarousel = () => (
  <MoodCarouselProvider moods={moods}>
    <FishCarouselInner />
  </MoodCarouselProvider>
);

export default FishCarousel;
