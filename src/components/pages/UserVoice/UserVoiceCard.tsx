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

  const recordingKey = `${mood.model}_${mood.id}`;

  useEffect(() => {
    setExternalURL(recordingKey);
  }, [recordingKey, setExternalURL]);

  const handlePlay = async () => {
    if (!audioURL || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = audioURL;

    // ✅ iOS-friendly playback
    (audio as any).playsInline = true;
    audio.load(); // Ensure it's loaded in memory
    try {
      await audio.play();
    } catch (err) {
      console.warn("iOS playback failed:", err);
    }
  };

  const handleRedo = async () => {
    await resetRecording();
    await setExternalURL(recordingKey);
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
            onClick={() => startRecording(6000, recordingKey)}
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
            {/* ✅ Add playsInline + preload explicitly */}
            <audio
              ref={audioRef}
              className={styles.audioPlayer}
              controls
              preload="auto"
              // @ts-ignore
              playsInline
            />
            <div className={styles.actions}>
              <button onClick={handlePlay}>▶️ Play</button>
              <button onClick={handleRedo}>♻️ Redo</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
