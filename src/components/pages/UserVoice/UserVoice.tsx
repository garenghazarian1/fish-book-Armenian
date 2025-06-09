"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UserVoice.module.css";
import { deleteRecording } from "@/utils/audioDB";
import type { Mood } from "@/components/pages/data/types";
import UserVoiceCard from "./UserVoiceCard";
import UserVoiceActions from "./UserVoiceActions";

interface Props {
  moods: Mood[];
}

export default function UserVoice({ moods }: Props) {
  const [showInstructions, setShowInstructions] = useState(false);

  const bubbleSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bubbleSoundRef.current = new Audio("/sounds/bubble.mp3");
    bubbleSoundRef.current.volume = 0.7;
  }, []);

  const confirmResetAll = async (): Promise<void> => {
    for (const mood of moods) {
      try {
        await deleteRecording(`${mood.model}_${mood.id}`);
      } catch (e) {
        console.warn(`Could not delete from IndexedDB: ${mood.id}`, e);
      }
    }
    window.location.reload(); // keep for now unless refactor
  };

  return (
    <div className={styles.voiceWrapper}>
      {/* ✅ Sticky Instructions */}
      <div className={styles.instructions}>
        <h2
          className={styles.h2}
          onClick={() => setShowInstructions((prev) => !prev)}
        >
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
              <strong>6 վայրկյան</strong>
            </p>
            <p>Ավարտելուց հետո Դուք ավտոմատ կանցնեք հաջորդ ձկանը։</p>
          </div>
        )}
      </div>
      {/* 🎣 action buttons */}
      <div className={styles.actionButtons}>
        <UserVoiceActions
          model={moods[0]?.model || ""}
          onConfirmResetAll={confirmResetAll}
        />
      </div>
      {/* 🎣 Mood Cards */}
      {moods.map((mood, index) => (
        <UserVoiceCard
          key={mood.id}
          mood={mood}
          index={index}
          total={moods.length}
        />
      ))}
    </div>
  );
}
