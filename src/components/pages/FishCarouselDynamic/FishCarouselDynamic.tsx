"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { TouchEvent, WheelEvent, MouseEvent, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

import {
  MoodCarouselProvider,
  useMoodCarousel,
} from "@/components/context/useMoodCarousel";
import BubbleParticles from "@/components/BubbleParticles/BubbleParticles";
import styles from "./FishCarouselDynamic.module.css";

import type { Mood } from "@/components/context/types";

console.log("🐟 FishCarouselDynamic module loaded");

interface Props {
  moods: Mood[];
}

const FishCarouselInner = () => {
  const {
    index,
    next,
    prev,
    autoplay,
    toggleAutoplay,
    registerGesture,
    moods,
  } = useMoodCarousel();

  const router = useRouter();
  const touchStartY = useRef<number | null>(null);
  const lastWheel = useRef(0);
  const slide = moods[index];

  const onTouchStart = (e: TouchEvent) =>
    (touchStartY.current = e.touches[0].clientY);

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(diff) > 30) diff > 0 ? prev() : next();
    registerGesture();
    touchStartY.current = null;
  };

  const onWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return;
    lastWheel.current = now;
    registerGesture();
    e.deltaY > 0 ? next() : prev();
  };

  const onClickSlide = (e: MouseEvent<HTMLDivElement>) => {
    registerGesture();
    e.clientY < window.innerHeight / 2 ? prev() : next();
  };

  useEffect(() => {
    console.log("✅ FishCarouselInner mounted");
    return () => {
      console.log("❌ FishCarouselInner unmounted");
    };
  }, []);

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
            registerGesture();
            toggleAutoplay();
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

const FishCarouselDynamic = ({ moods }: Props) => (
  <MoodCarouselProvider moods={moods}>
    <FishCarouselInner />
  </MoodCarouselProvider>
);

export default FishCarouselDynamic;

console.log("🐟 FishCarouselDynamic module loaded");
