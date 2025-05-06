"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRouter } from "next/navigation";

import BubbleParticles from "../BubbleParticles/BubbleParticles";
import BubbleBurst from "../BubbleBurst/BubbleBurst";
import FishModel from "@/components/FishModel/FishModel";
import styles from "./IntroScene.module.css";

export default function IntroScene() {
  const [burstKey, setBurstKey] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const bubbleSoundRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);

    if (typeof window !== "undefined") {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
      bubbleSoundRef.current = new Audio("/sounds/bubble.mp3");
      bubbleSoundRef.current.volume = 0.7;
    }
  }, []);

  const handleInteraction = () => {
    setBurstKey((k) => k + 1);
    setShowSubtitle((prev) => !prev);

    if (navigator.vibrate) navigator.vibrate(40);

    bubbleSoundRef.current?.play().catch(() => {});
  };

  const handleHover = () => {
    if (!isTouch) setShowSubtitle(true);
  };

  const handleLeave = () => {
    if (!isTouch) setShowSubtitle(false);
  };

  const handleStartClick = () => {
    router.push("/fishSelect");
  };

  return (
    <section className={styles.introWrapper}>
      {/* Background bubble animation */}
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

      {/* Title and subtitle area */}
      <motion.div
        className={styles.titleContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1
          className={styles.title}
          onPointerDown={handleInteraction}
          onPointerEnter={handleHover}
          onPointerLeave={handleLeave}
        >
          <span className={styles.wordRed}>Սկսենք</span>
          <span className={styles.wordBlue}>հույզերի</span>
          <span className={styles.wordOrange}>ծովաշխարհ</span>
          {hasMounted && <BubbleBurst triggerKey={burstKey} />}
        </h1>

        <motion.p
          className={styles.subtitle}
          animate={{
            opacity: showSubtitle ? 1 : 0,
            y: showSubtitle ? 20 : -20,
            pointerEvents: showSubtitle ? "auto" : "none",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Այստեղ կծանոթանաս 13 ձկների, որոնք ցույց են տալիս իրենց հույզերն ու
          զգացմունքները։
        </motion.p>

        <motion.p
          className={styles.subtitle}
          animate={{
            opacity: showSubtitle ? 1 : 0,
            y: showSubtitle ? 20 : -20,
            pointerEvents: showSubtitle ? "auto" : "none",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          2 տաեկանից սկսած
        </motion.p>
      </motion.div>

      {/* CTA button */}
      <motion.button
        onClick={handleStartClick}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
        className={styles.startButton}
      >
        Սկսել
      </motion.button>

      {/* Fish model canvas */}
      <motion.div
        className={styles.canvasContainer}
        initial={{ opacity: 0, y: 60, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 1.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 1.2,
        }}
      >
        <Canvas
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "200%",
            height: "100%",
            background: "transparent",
          }}
          camera={{ position: [0, 0, 2.5], fov: 60 }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[0, 0, 1]} intensity={2} />
          <Suspense fallback={null}>
            <FishModel />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 1.2,
        }}
      >
        Ստեղծվել է Կարէն Ղազարեանի եւ Նաիրա Պետրոսյանի կողմից
      </motion.footer>
    </section>
  );
}
