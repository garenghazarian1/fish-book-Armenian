"use client";

import styles from "./CaptionBubble.module.css";

interface CaptionBubbleProps {
  text: string;
  index: number;
}

const CaptionBubble = ({ text, index }: CaptionBubbleProps) => {
  return (
    <div className={styles.captionContainer}>
      <div key={`caption-${index}`} className={styles.caption}>
        {text}
      </div>
    </div>
  );
};

export default CaptionBubble;
