"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import FishCarouselDynamic from "@/components/pages/FishCarouselDynamic/FishCarouselDynamic";
import UserVoice from "@/components/pages/UserVoice/UserVoice";

export interface Mood {
  id: string;
  image: string;
  text: string;
  audio: string;
  customAudio?: string;
}

// Map each route name to both the loader and the carousel component type
const moodLoaders: Record<
  string,
  {
    loader: () => Promise<{ default: Mood[] }>;
    component: "default" | "user";
  }
> = {
  fishcarouseldynamic: {
    loader: () => import("@/components/pages/data/moods/blue"),
    component: "default",
  },
  redfishcarousel: {
    loader: () => import("@/components/pages/data/moods/red"),
    component: "default",
  },
  dikogerman: {
    loader: () => import("@/components/pages/data/moods/dikoGerman"),
    component: "default",
  },
  lilitgerman: {
    loader: () => import("@/components/pages/data/moods/lilitGerman"),
    component: "default",
  },
  aniarmenian: {
    loader: () => import("@/components/pages/data/moods/aniArmenian"),
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
      const moods = (await entry.loader()).default;

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

  return <LazyLoaded />;
}
