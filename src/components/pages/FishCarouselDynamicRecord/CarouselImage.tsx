import Image from "next/image";
import styles from "./FishCarouselDynamicRecord.module.css";

interface Props {
  image: string;
  id: string;
  index: number;
}

export default function CarouselImage({ image, id, index }: Props) {
  return (
    <div className={styles.imageContainer}>
      <Image
        key={index}
        src={image}
        alt={`${id} mood image`}
        fill
        sizes="100%"
        priority={index === 0}
        loading={index === 0 ? "eager" : "lazy"}
        className={styles.image}
      />
    </div>
  );
}
