"use client";

import { useRef, useState } from "react";
import styles from "./TestPage.module.css";
import Image from "next/image";
import Link from "next/link";
import type { Mood } from "@/components/pages/data/types";
import moods from "@/components/pages/data/moods/lilitGerman";

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollToSlide = (targetIndex: number) => {
    if (!containerRef.current) return;

    const slideWidth = containerRef.current.offsetWidth;
    containerRef.current.scrollTo({
      left: targetIndex * slideWidth,
      behavior: "smooth",
    });
    setIndex(targetIndex);
  };

  const nextSlide = () => scrollToSlide((index + 1) % moods.length);
  const prevSlide = () =>
    scrollToSlide((index - 1 + moods.length) % moods.length);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>🎯 JS-Controlled Carousel</h1>
      <Link href="/" className={styles.backLink}>
        🔙 Back to Main Page
      </Link>

      {/* Navigation buttons */}
      <div className={styles.controls}>
        <button onClick={prevSlide} className={styles.navButton}>
          ⬅️
        </button>
        <button onClick={nextSlide} className={styles.navButton}>
          ➡️
        </button>
      </div>

      {/* JS-scrolling carousel */}
      <div className={styles.carouselViewport} ref={containerRef}>
        <div className={styles.carouselTrack}>
          {moods.map((mood: Mood) => (
            <div key={mood.id} className={styles.slide}>
              <p>{mood.text}</p>
              <Image
                src={mood.image}
                alt={mood.text}
                width={100}
                height={100}
                className={styles.moodImage}
              />
              <audio
                controls
                src={mood.audio}
                className={styles.audioPlayer}
              ></audio>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
