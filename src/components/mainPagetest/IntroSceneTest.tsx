"use client";
// import { useEffect } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./IntroSceneTest.module.css";
import BubbleBurstButton from "@/components/bubble/BubbleBurstButton/BubbleBurstButton";

export default function IntroScene() {
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);
  const [burstKey, setBurstKey] = useState<number | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // -----------------------------
  useEffect(() => {
    setHasMounted(true);
    const hasShown = sessionStorage.getItem("introShown");

    if (hasShown === "true") {
      // Already visited → show button instantly
      setShowButton(true);
    } else {
      // First time → delay and store flag
      const timer = setTimeout(() => {
        setShowButton(true);
        sessionStorage.setItem("introShown", "true");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);
  // -------------------

  const handleClickStart = () => {
    if (isClicked) {
      return;
    }

    setIsClicked(true);
    setBurstKey((prev) => {
      if (isClicked && prev !== null) return prev;
      return prev === null ? 0 : prev + 1;
    });

    // Step 1: Play sound
    const sound = new Audio("/sounds/bubble.mp3");
    sound
      .play()
      .then(() => {})
      .catch((err) => {
        console.error(err); // prevents lint error
      });

    // Step 2: Delayed navigation
    setTimeout(() => {
      router.push("/fishSelect");
    }, 600);
  };

  return (
    <>
      <div className={styles.startButtonContainer}>
        <div className={styles.bubbleButtonWrapper}>
          <button
            className={`${styles.startButton} ${
              hasMounted
                ? showButton
                  ? styles.visible
                  : styles.hidden
                : styles.hidden
            }`}
            onClick={handleClickStart}
          >
            Սկսել
            {burstKey !== null && <BubbleBurstButton triggerKey={burstKey} />}
          </button>
        </div>
      </div>
    </>
  );
}
