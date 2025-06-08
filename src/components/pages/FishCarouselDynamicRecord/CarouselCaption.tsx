import styles from "./FishCarouselDynamicRecord.module.css";

interface Props {
  text: string;
  index: number;
}

export default function CarouselCaption({ text, index }: Props) {
  return (
    <div className={styles.captionContainer}>
      <div key={`caption-${index}`} className={styles.caption}>
        {text}
      </div>
    </div>
  );
}
