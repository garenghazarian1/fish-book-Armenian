"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import type { Mood } from "@/components/context/types";
import FishCarouselDynamic from "@/components/pages/FishCarouselDynamic/FishCarouselDynamic";

// Map the [name] to the correct moods.ts file
const moodLoaders: Record<string, () => Promise<{ default: Mood[] }>> = {
  fishcarouseldynamic: () => import("@/components/pages/data/moods/blue"),
  redfishcarousel: () => import("@/components/pages/data/moods/red"),
  // Add more here...
};

export default function FishMoodPage() {
  const params = useParams();
  const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
  const moodKey = nameParam?.toLowerCase();

  const loader = moodKey ? moodLoaders[moodKey] : null;

  if (!loader) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "white",
          fontSize: "1.25rem",
        }}
      >
        Ձուկը՝ <strong>"{nameParam}"</strong> դեռ պատրաստ չէ։
      </div>
    );
  }

  const LazyLoaded = dynamic(
    async () => {
      const moods = (await loader()).default;
      return () => <FishCarouselDynamic moods={moods} />;
    },
    { ssr: false }
  );

  return <LazyLoaded />;
}
