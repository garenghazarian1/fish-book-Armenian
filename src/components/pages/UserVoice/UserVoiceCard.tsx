import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./UserVoice.module.css";
import { useRecorder } from "./useRecorder";
import { deleteRecording } from "@/utils/audioDB";
import type { Mood } from "@/components/pages/data/types";

interface Props {
  mood: Mood;
  index: number;
  total: number;
}

export default function UserVoiceCard({ mood, index, total }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedMsg, setShowDeletedMsg] = useState(false);

  const {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    resetRecording,
    setExternalURL,
    playAudio,
    audioRef,
    setAudioURL,
  } = useRecorder();

  const recordingKey = `${mood.model}_${mood.id}`;

  useEffect(() => {
    if (!showDeletedMsg) {
      setExternalURL(recordingKey);
    }
  }, [recordingKey, setExternalURL, showDeletedMsg]);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioRef]);

  const handlePlayClick = async () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      setIsPlaying(true);
      await playAudio();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleRedo = async () => {
    await resetRecording();
    await setExternalURL(recordingKey);
    setIsPlaying(false);
  };

  const confirmDelete = async () => {
    await deleteRecording(recordingKey);
    setAudioURL(null); // ✅ clear blob URL from state
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = ""; // ✅ force remove from <audio>
    }
    setIsPlaying(false);
    setShowDeletedMsg(true);
    setShowDeleteModal(false);
    setTimeout(() => setShowDeletedMsg(false), 2000);
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

        {showDeletedMsg && (
          <div className={styles.deletedMsg}>✅ Ձայնը ջնջված է</div>
        )}

        {!isRecording && audioURL && !showDeletedMsg && (
          <div className={styles.audioBlock}>
            <audio
              ref={audioRef}
              className={styles.audioPlayer}
              preload="auto"
              playsInline={true}
            />

            <div className={styles.actions}>
              <button onClick={handlePlayClick}>
                {isPlaying ? "⏹ Stop" : "▶️ Play"}
              </button>
              <button onClick={handleRedo}>♻️ Redo</button>
              <button onClick={() => setShowDeleteModal(true)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Ջնջե՞լ այս ձայնագրությունը։</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowDeleteModal(false)}>
                ❌ Չեղարկել
              </button>
              <button onClick={confirmDelete}>✅ Ջնջել</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
