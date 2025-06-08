"use client";

import styles from "./FishCarouselDynamicRecord.module.css";
import { useRouter } from "next/navigation";
import type { Mood } from "@/components/pages/data/types";
import CarouselImage from "./CarouselImage";
import CarouselCaption from "./CarouselCaption";
import NavigationButtons from "./NavigationButtons";
import { useFishCarouselLogic } from "./useFishCarouselLogic";

interface Props {
  moods: Mood[];
}

const FishCarouselDynamicRecord = ({ moods }: Props) => {
  const router = useRouter();

  const {
    index,
    slide,
    autoplay,
    setAutoplay,
    onTouchStart,
    onTouchEnd,
    onWheel,
    onClickReplayAudio,
  } = useFishCarouselLogic(moods);

  // ========================
  // ❌ Fallback: no data
  // ========================
  if (!slide) {
    return (
      <div className={styles.container}>
        <div className={styles.backButtonContainer}>
          <button className={styles.backButton} onClick={() => router.back()}>
            ⬅️ Վերադառնալ
          </button>
        </div>
        <div className={styles.captionContainer}>Տվյալներ չեն գտնվել։</div>
      </div>
    );
  }

  // ========================
  // ✅ UI
  // ========================
  return (
    <div className={styles.container}>
      <div
        className={styles.carousel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
        onClick={onClickReplayAudio}
      >
        <NavigationButtons
          autoplay={autoplay}
          onToggleAutoplay={() => {
            setAutoplay((prev) => !prev);
          }}
        />

        <CarouselCaption text={slide.text} index={index} />
        <CarouselImage image={slide.image} id={slide.id} index={index} />
      </div>
    </div>
  );
};

export default FishCarouselDynamicRecord;
