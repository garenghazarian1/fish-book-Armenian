"use client";

import { useState } from "react";
import styles from "./AutoplayToggle.module.css";
import BubbleBurstBack from "@/components/bubble/BubbleBurst/BubbleBurst";

interface AutoplayToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

const AutoplayToggle = ({ isPlaying, onToggle }: AutoplayToggleProps) => {
  const [burstKey, setBurstKey] = useState<number | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setBurstKey((prev) => (prev === null ? 1 : prev + 1)); // Only activate after click
    if (navigator.vibrate) navigator.vibrate(40);
    onToggle();
  };

  return (
    <div className={styles.autoplayBtnContainer}>
      <button
        className={styles.autoplayBtn}
        onClick={handleClick}
        aria-label={isPlaying ? "Stop autoplay" : "Start autoplay"}
      >
        {isPlaying ? "⏸ Stop" : "▶️ Auto"}
        {burstKey !== null && (
          <div className={styles.bubbleBurstWrapper}>
            <BubbleBurstBack triggerKey={burstKey} />
          </div>
        )}
      </button>
    </div>
  );
};

export default AutoplayToggle;
