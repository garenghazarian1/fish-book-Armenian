"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./UserVoice.module.css";
import { deleteRecording } from "@/utils/audioDB";
import type { Mood } from "@/components/pages/data/types";
import UserVoiceCard from "./UserVoiceCard";

interface Props {
  moods: Mood[];
}

export default function UserVoice({ moods }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const confirmResetAll = async () => {
    for (const mood of moods) {
      try {
        await deleteRecording(`${mood.model}_${mood.id}`);
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
              <strong>6 վայրկյան</strong>։
            </p>
            <p>Ավարտելուց հետո Դուք ավտոմատ կանցնեք հաջորդ ձկանը։</p>
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
