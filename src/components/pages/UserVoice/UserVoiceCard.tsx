// components/pages/UserVoice/UserVoiceCard.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./UserVoice.module.css";
import { useRecorder } from "./useRecorder";
import type { Mood } from "@/components/pages/data/types";

interface Props {
  mood: Mood;
  index: number;
  total: number;
}

export default function UserVoiceCard({ mood, index, total }: Props) {
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
    setExternalURL(mood.id);
  }, [mood.id, setExternalURL]);

  const handlePlay = () => {
    if (!audioURL || !audioRef.current) return;
    audioRef.current.src = audioURL;
    audioRef.current.play().catch(() => {});
  };

  return (
    <div className={styles.voiceCard}>
      <div className={styles.stepIndicator}>
        🧭 Քայլ {index + 1} / {total}
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
            onClick={() => startRecording(6000, mood.id)}
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
            <audio ref={audioRef} controls className={styles.audioPlayer} />
            <div className={styles.actions}>
              <button onClick={handlePlay}>▶️ Play</button>
              <button
                onClick={() => {
                  resetRecording();
                  setExternalURL(mood.id);
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
}
