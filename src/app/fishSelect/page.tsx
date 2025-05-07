"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const fishList = [
  { name: "happy", src: "/fishBlue/happy.png" },
  { name: "red", src: "/fishBlue/angry.png" },
  { name: "ishxan", src: "/fishBlue/brave.png" },
  { name: "green", src: "/fishBlue/confused.png" },
];

export default function FishSelectPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/"); // navigate to homepage
  };

  return (
    <div className={styles.fishPage}>
      <h1 className={styles.heading}>Ընտրիր ձուկ</h1>
      <button className={styles.backButton} onClick={handleBack}>
        ⬅️ Վերադառնալ
      </button>

      <div className={styles.fishGrid}>
        {fishList.map((fish, i) => (
          <div
            key={i}
            className={styles.fishCard}
            onClick={() => router.push(`/fish/${fish.name}`)}
          >
            <Image
              src={fish.src}
              alt={`Fish ${fish.name}`}
              width={120}
              height={120}
              className={styles.fishImage}
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
