"use client";

import Image from "next/image";
import styles from "./FishImage.module.css";

interface FishImageProps {
  src: string;
  alt: string;
  index: number;
  priority?: boolean;
}

const FishImage = ({ src, alt, index, priority = false }: FishImageProps) => {
  return (
    <div className={styles.imageContainer}>
      <Image
        key={index}
        src={src}
        alt={alt}
        fill
        sizes="80%"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={styles.image}
      />
    </div>
  );
};

export default FishImage;
