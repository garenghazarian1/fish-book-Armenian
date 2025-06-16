"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import FishCarouselDynamic from "@/components/pages/FishCarouselDynamic/FishCarouselDynamic";
import UserVoice from "@/components/pages/UserVoice/UserVoice";
import type { Mood } from "@/components/pages/data/types";
import DownloadFishBookButton from "@/components/buttons/DownloadFishBookButton";

// Map each route name to both the loader and the carousel component type
const moodLoaders: Record<
  string,
  { loader: () => Promise<{ default: Mood[] }>; component: "default" | "user" }
> = {
  fishcarouseldynamic: {
    loader: () => import("@/components/pages/data/moods/blue"),
    component: "default",
  },
  redfishcarousel: {
    loader: () => import("@/components/pages/data/moods/red"),
    component: "default",
  },
  "diko-german": {
    loader: () => import("@/components/pages/data/moods/diko-german"),
    component: "default",
  },
  "lilit-german": {
    loader: () => import("@/components/pages/data/moods/lilit-german"),
    component: "default",
  },
  "ani-armenian": {
    loader: () => import("@/components/pages/data/moods/ani-armenian"),
    component: "default",
  },
  uservoice: {
    loader: () => import("@/components/pages/data/moods/blue"),
    component: "user",
  },

  // Add more mappings as needed
};

export default function FishMoodPage() {
  const params = useParams();
  const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
  const moodKey = nameParam?.toLowerCase();

  const entry = moodKey ? moodLoaders[moodKey] : null;

  if (!entry) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "white",
          fontSize: "1.25rem",
        }}
      >
        Ձուկը՝ <strong>&quot;{nameParam}&quot;</strong> դեռ պատրաստ չէ։
      </div>
    );
  }

  const LazyLoaded = dynamic(
    async () => {
      const rawMoods = (await entry.loader()).default;
      const moods: Mood[] = rawMoods.map((m) => ({
        ...m,
        model: moodKey || "", // Add model name to every mood
      }));

      const Wrapper = () => {
        return entry.component === "default" ? (
          <FishCarouselDynamic moods={moods} />
        ) : (
          <UserVoice moods={moods} />
        );
      };

      Wrapper.displayName = "FishWrapper";
      return Wrapper;
    },
    { ssr: false }
  );

  return (
    <div
      style={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <DownloadFishBookButton model={moodKey} />
      </div>
      <LazyLoaded />
    </div>
  );
}
