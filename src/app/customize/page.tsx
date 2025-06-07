"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./page.module.css";

const fishOptions = [
  {
    name: "Կապույտ ձուկ",
    modelKey: "blue",
    src: "/fishBlue/happy.webp",
  },
  {
    name: "Կարմիր ձուկ",
    modelKey: "red",
    src: "/fishRed/happy.webp",
  },
  {
    name: "Անի ձուկ",
    modelKey: "aniArmenian",
    src: "/AniFish/carefree.webp",
  },
  {
    name: "Տիգրանի ձայնով (գերմաներեն)",
    modelKey: "dikogerman",
    src: "/fishDikoGerman/glücklich.webp",
  },
  {
    name: "Լիլիթի ձայնով (գերմաներեն)",
    modelKey: "lilitgerman",
    src: "/fishLilitGerman/glücklich.webp",
  },

  // Add more models here...
];

export default function CustomizeFishPage() {
  const router = useRouter();

  const handleSelect = (modelKey: string) => {
    router.push(`/customize/record/${modelKey}`);
  };

  return (
    <div className={styles.wrapper}>
      <motion.h1
        className={styles.heading}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Ընտրիր ձկան ոճը
      </motion.h1>

      {/* ⬅️ Back Button */}
      <motion.button
        className={styles.backButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/fishSelect")}
      >
        ⬅️ Վերադառնալ
      </motion.button>

      <motion.div
        className={styles.grid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {fishOptions.map((fish) => (
          <div
            key={fish.modelKey}
            className={styles.card}
            onClick={() => handleSelect(fish.modelKey)}
          >
            <Image
              src={fish.src}
              alt={fish.name}
              width={160}
              height={160}
              className={styles.image}
            />
            <p className={styles.label}>{fish.name}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
