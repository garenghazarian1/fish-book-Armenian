"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./UserVoiceAction.module.css";
import BubbleBurstBack from "@/components/bubble/BubbleBurst/BubbleBurst";

interface Props {
  model: string;
  onConfirmResetAll: () => void;
}

const UserVoiceActions = ({ model, onConfirmResetAll }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [burstBack, setBurstBack] = useState(0);
  const [burstReset, setBurstReset] = useState(0);
  const [burstListen, setBurstListen] = useState(0);
  const [burstConfirm, setBurstConfirm] = useState(0);
  const [burstCancel, setBurstCancel] = useState(0);
  const bubbleSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bubbleSoundRef.current = new Audio("/sounds/bubble.mp3");
    bubbleSoundRef.current.volume = 0.7;
  }, []);

  const playBubbleEffect = () => {
    bubbleSoundRef.current?.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className={styles.resetWrapper}>
      {/* ⬅️  Back */}
      <motion.button
        className={styles.backButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playBubbleEffect();
          setBurstBack((prev) => prev + 1);
          setTimeout(() => {
            window.location.href = "/customize";
          }, 600);
        }}
      >
        ⬅️ Վերադառնալ
        {burstBack > 0 && (
          <div className={styles.bubbleBurstWrapper}>
            <BubbleBurstBack triggerKey={burstBack} />
          </div>
        )}
      </motion.button>

      {/* 🔄 Reset All */}
      <motion.button
        className={styles.resetAllBtn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playBubbleEffect();
          setBurstReset((prev) => prev + 1);
          setTimeout(() => {
            setShowModal(true);
          }, 600);
        }}
      >
        🔄 Սկսել նորից
        {burstReset > 0 && (
          <div className={styles.bubbleBurstWrapper}>
            <BubbleBurstBack triggerKey={burstReset} />
          </div>
        )}
      </motion.button>

      {/* 🎧 Listen */}

      <motion.a
        href={`/generated/${model}`}
        className={styles.generateBtn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playBubbleEffect();
          setBurstListen((prev) => prev + 1);
        }}
      >
        🎧 Իմ ձայներով լսել
        {burstListen > 0 && (
          <div className={styles.bubbleBurstWrapper}>
            <BubbleBurstBack triggerKey={burstListen} />
          </div>
        )}
      </motion.a>

      {/* 🧼 Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
              Ցանկանու՞մ եք ջնջել բոլոր ձայնագրությունները։
            </h3>
            <div className={styles.modalActions}>
              <motion.button
                className={styles.cancelBtn}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playBubbleEffect();
                  setBurstCancel((prev) => prev + 1);
                  setTimeout(() => {
                    setShowModal(false);
                  }, 600);
                }}
              >
                ❌ Չեղարկել
                {burstCancel > 0 && (
                  <div className={styles.bubbleBurstWrapper}>
                    <BubbleBurstBack triggerKey={burstCancel} />
                  </div>
                )}
              </motion.button>
              <motion.button
                className={styles.confirmBtn}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playBubbleEffect();
                  setBurstConfirm((prev) => prev + 1);
                  setTimeout(() => {
                    onConfirmResetAll();
                  }, 600);
                }}
              >
                ✅ Այո, ջնջել
                {burstConfirm > 0 && (
                  <div className={styles.bubbleBurstWrapper}>
                    <BubbleBurstBack triggerKey={burstConfirm} />
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVoiceActions;
