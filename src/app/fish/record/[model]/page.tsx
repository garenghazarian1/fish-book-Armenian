"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Mood } from "@/components/pages/data/types";
import UserVoice from "@/components/pages/UserVoice/UserVoice";

const moodSources: Record<string, () => Promise<{ default: Mood[] }>> = {
  blue: () => import("@/components/pages/data/moods/blue"),
  red: () => import("@/components/pages/data/moods/red"),
  aniArmenian: () => import("@/components/pages/data/moods/aniArmenian"),
  dikogerman: () => import("@/components/pages/data/moods/dikoGerman"),
  lilitgerman: () => import("@/components/pages/data/moods/lilitGerman"),
  // add more here as you expand
};

export default function RecordPage() {
  const { model } = useParams();
  const loader = moodSources[model as string];
  const [moods, setMoods] = useState<Mood[] | null>(null);

  useEffect(() => {
    if (loader) {
      loader().then((mod) => setMoods(mod.default));
    }
  }, [loader]);

  if (!moods) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Բեռնում է ձայները...
      </div>
    );
  }

  return <UserVoice moods={moods} />;
}
