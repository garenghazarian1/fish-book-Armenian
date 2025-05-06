"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
import styles from "./Happy.module.css";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import BubbleParticles from "@/components/BubbleParticles/BubbleParticles";

interface HappyProps {
  imageSrc?: string;
}

export default function Happy({
  imageSrc = "/fishBlue/happySh.png",
}: HappyProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    let lastPlayed = 0;
    const cooldown = 2000; // time in ms between plays

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const now = Date.now();

        if (
          entry.isIntersecting &&
          audioRef.current &&
          now - lastPlayed > cooldown
        ) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
          lastPlayed = now;
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      // className="pageBackground"
      className={styles.pageBackground}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className={styles.bubbleCanvasContainer}>
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 60 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 3, 5]} intensity={1.2} />
          <Suspense fallback={null}>
            <Environment preset="sunset" background={false} />
            <BubbleParticles count={20} />
          </Suspense>
        </Canvas>
      </div>
      <motion.div
        className={styles.fishImageWrapper}
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1.02, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      >
        <Image
          src={imageSrc}
          alt="Ուրախ ձուկ"
          className={styles.fishImage}
          fill
          priority
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* <motion.h2
        className={styles.moodLabel}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        ուրախ
      </motion.h2> */}

      <audio ref={audioRef} src="/sounds/bubble.mp3" preload="auto" />
    </motion.section>
  );
}
