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
};

export default function RecordPage() {
  const { model } = useParams();
  const [moods, setMoods] = useState<Mood[] | null>(null);

  useEffect(() => {
    if (typeof model === "string") {
      const loader = moodSources[model];
      if (loader) {
        loader().then((mod) => {
          const enriched = mod.default.map((mood) => ({
            ...mood,
            model, // inject model
          }));
          setMoods(enriched);
        });
      }
    }
  }, [model]); // ✅ only depend on `model`

  if (!moods) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Բեռնում է ձայները...
      </div>
    );
  }

  return <UserVoice moods={moods} />;
}
