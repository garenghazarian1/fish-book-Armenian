import Link from "next/link";
import styles from "./FishCarouselDynamicRecord.module.css";

interface Props {
  autoplay: boolean;
  onToggleAutoplay: () => void;
}

export default function NavigationButtons({
  autoplay,
  onToggleAutoplay,
}: Props) {
  return (
    <>
      <div className={styles.backButtonContainer}>
        <Link
          href="/fishSelect"
          className={styles.backButton}
          aria-label="Back to fish selection"
        >
          ⬅️ Վերադառնալ
        </Link>
      </div>
      <button
        className={styles.autoplayBtn}
        aria-label={autoplay ? "Stop autoplay" : "Start autoplay"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleAutoplay();
        }}
      >
        {autoplay ? "⏸ Stop" : "▶️ Auto"}
      </button>
    </>
  );
}
