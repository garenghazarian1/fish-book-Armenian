"use client";

import { useParams } from "next/navigation";
import type { FC } from "react";
import Happy from "@/components/pages/FishMoods/FishMood";
import RedFish from "@/components/pages/RedFish/RedFish";
import FishCarousel from "@/components/pages/FishCarousel/FishCarousel";
import RedFishCarousel from "@/components/pages/FishCarouselRed/FishCarouselRed";

const moodComponents: Record<string, FC> = {
  happy: Happy,
  redfish: RedFish,
  fishcarousel: FishCarousel,
  redfishcarousel: RedFishCarousel,

  // Add more moods here as needed
};

export default function FishMoodPage() {
  const params = useParams();
  const nameParam = Array.isArray(params.name) ? params.name[0] : params.name;
  const moodKey = nameParam?.toLowerCase(); // normalize casing

  const SelectedMoodComponent = moodKey ? moodComponents[moodKey] : null;

  if (SelectedMoodComponent) {
    return <SelectedMoodComponent />;
  }

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
