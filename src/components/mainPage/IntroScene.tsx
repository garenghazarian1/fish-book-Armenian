"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import BubbleBurst from "../BubbleBurst/BubbleBurst";
import styles from "./IntroScene.module.css";
import FishModel from "@/components/FishModel/FishModel";
import { Canvas } from "@react-three/fiber";

export default function IntroScene() {
  const [burstKey, setBurstKey] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const bubbleSoundRef = useRef<HTMLAudioElement | null>(null);

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

    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    if (bubbleSoundRef.current) {
      bubbleSoundRef.current.currentTime = 0;
      bubbleSoundRef.current.play().catch(() => {});
    }
  };

  const handleHover = () => {
    if (!isTouch) setShowSubtitle(true);
  };

  const handleLeave = () => {
    if (!isTouch) setShowSubtitle(false);
  };

  return (
    <section className={styles.introWrapper}>
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
          initial={false}
          animate={{
            opacity: showSubtitle ? 1 : 0,
            y: showSubtitle ? 20 : -20,
            pointerEvents: showSubtitle ? "auto" : "none",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Այստեղ կծանոթանաս 20 ձկների, որոնք ցույց են տալիս իրենց հույզերն ու
          զգացմունքները։
        </motion.p>
      </motion.div>
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
            width: "100%",
            height: "100%",
            background: "transparent",
            // zIndex: "1",
            // pointerEvents: "none",
          }}
          camera={{ position: [0, 0, 2.5], fov: 60 }}
        >
          <mesh>
            {/* <boxGeometry args={[2, 2, 2]} /> */}
            <meshStandardMaterial />

            <ambientLight intensity={1.2} />
            <directionalLight position={[0, 0, 1]} intensity={2} />
            <Suspense fallback={null}>
              <FishModel />
            </Suspense>
          </mesh>
        </Canvas>
      </motion.div>

      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94], // easeOutBack
          delay: 1.2,
        }}
      >
        Ստեղծվել է Կարէն Ղազարեանի եւ Նաիրա Պետրոսյանի կողմից
      </motion.footer>
    </section>
  );
}
