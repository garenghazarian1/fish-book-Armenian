"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./UserVoice.module.css";
import { useRecorder } from "./useRecorder";
import { deleteRecording } from "@/utils/audioDB";
import type { Mood } from "@/components/pages/data/types";
import Link from "next/link";

interface Props {
  moods: Mood[];
}

export default function UserVoice({ moods }: Props) {
  // const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [showInstructions, setShowInstructions] = useState(false);

  const confirmResetAll = async () => {
    for (const mood of moods) {
      try {
        await deleteRecording(mood.id);
      } catch (e) {
        console.warn(`Could not delete from IndexedDB: ${mood.id}`, e);
      }
    }
    location.reload();
  };

  return (
    <div className={styles.voiceWrapper}>
      {/* ✅ Top Sticky Instructions */}
      <div className={styles.instructions}>
        <h2 onClick={() => setShowInstructions((prev) => !prev)}>
          🎤 Եկեք ձայնագրենք Ձեր ձայնը
          <span className={styles.toggleHint}>
            {showInstructions ? "▲" : "▼"}
          </span>
        </h2>

        {showInstructions && (
          <div className={styles.instructionText}>
            <p>
              Յուրաքանչյուր ձկան զգացողության համար սեղմեք{" "}
              <strong>«Ձայնագրել»</strong> և խոսեք մինչև{" "}
              <strong>6 վայրկյան</strong>&#1423;
            </p>
            <p>Ավարտելուց հետո Դուք ավտոմատ կանցնեք հաջորդ ձկանը&#1423;</p>
          </div>
        )}
      </div>

      {/* 🔄 Reset All Recordings Button + Modal */}
      <div className={styles.resetWrapper}>
        <Link href="/fish/customize" className={styles.backButton}>
          🔙 Վերադառնալ
        </Link>
        <button
          className={styles.resetAllBtn}
          onClick={() => setShowModal(true)}
        >
          🔄 Սկսել նորից
        </button>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>
                Ցանկանու՞մ եք ջնջել բոլոր ձայնագրությունները։
              </h3>
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  ❌ Չեղարկել
                </button>
                <button className={styles.confirmBtn} onClick={confirmResetAll}>
                  ✅ Այո, ջնջել
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🎣 Mood Recorder Cards */}
      {moods.map((mood, index) => {
        const audioRef = useRef<HTMLAudioElement | null>(null);
        const {
          isRecording,
          audioURL,
          startRecording,
          stopRecording,
          resetRecording,
          setExternalURL,
        } = useRecorder();

        useEffect(() => {
          setExternalURL(mood.id); // Fetch from IndexedDB
        }, [mood.id, setExternalURL]);

        const handlePlay = () => {
          if (!audioURL || !audioRef.current) return;
          audioRef.current.src = audioURL;
          audioRef.current.play().catch(() => {});
        };

        return (
          <div key={mood.id} className={styles.voiceCard}>
            <div className={styles.stepIndicator}>
              🧭 Քայլ {index + 1} / {moods.length}
            </div>

            <div className={styles.imageWrapper}>
              <Image
                src={mood.image}
                alt={mood.id}
                fill
                sizes="100%"
                className={styles.image}
              />
            </div>

            <div className={styles.caption}>{mood.text}</div>

            <div className={styles.recorder}>
              {!isRecording ? (
                <button
                  onClick={() => {
                    // setCurrentStep(index + 1);
                    startRecording(6000, mood.id);
                  }}
                  className={styles.recordBtn}
                >
                  🎤 Record (max 6s)
                </button>
              ) : (
                <button onClick={stopRecording} className={styles.stopBtn}>
                  ⏹ Stop
                </button>
              )}

              {isRecording && (
                <div className={styles.recordingIndicator}>🔴 Recording...</div>
              )}

              {audioURL !== null && (
                <div className={styles.audioBlock}>
                  <audio
                    ref={audioRef}
                    controls
                    className={styles.audioPlayer}
                  />
                  <div className={styles.actions}>
                    <button onClick={handlePlay}>▶️ Play</button>
                    <button
                      onClick={() => {
                        resetRecording();
                        setExternalURL(mood.id); // update immediately
                      }}
                    >
                      ♻️ Redo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
