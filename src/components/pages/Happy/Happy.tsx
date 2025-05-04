"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./Happy.module.css";

interface HappyProps {
  imageSrc?: string;
}

export default function Happy({
  imageSrc = "/fishBlue/happy.png",
}: HappyProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && audioRef.current) {
          audioRef.current.play().catch(() => {});
          observer.disconnect(); // play once only
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
      className="pageBackground"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
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

      <motion.h2
        className={styles.moodLabel}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        ուրախ
      </motion.h2>

      <audio ref={audioRef} src="/sounds/bubble.mp3" preload="auto" />
    </motion.section>
  );
}
