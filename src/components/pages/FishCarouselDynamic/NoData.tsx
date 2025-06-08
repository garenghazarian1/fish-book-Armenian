"use client";

import styles from "./FishCarouselDynamic.module.css";
import BackButton from "./BackButton";

const NoData = () => {
  return (
    <div className={styles.container}>
      <BackButton />
      <div className={styles.captionContainer}>Տվյալներ չեն գտնվել։</div>
    </div>
  );
};

export default NoData;
