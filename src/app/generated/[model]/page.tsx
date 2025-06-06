"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FishCarouselDynamicRecord from "@/components/pages/FishCarouselDynamicRecord/FishCarouselDynamicRecord";
import { getRecording } from "@/utils/audioDB";
import type { Mood } from "@/components/pages/data/types";

const GeneratedVoicePage = () => {
  const { model } = useParams();
  const [userMoods, setUserMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoods = async () => {
      try {
        // ✅ Corrected dynamic import path
        const moodsModule = await import(
          `@/components/pages/data/moods/${model}`
        );
        const rawMoods: Mood[] = moodsModule.default;

        const recordedMoods: Mood[] = [];

        for (const mood of rawMoods) {
          const key = `${model}_${mood.id}`; // model name used in key
          const blob = await getRecording(key);
          if (blob) {
            const url = URL.createObjectURL(blob);
            recordedMoods.push({ ...mood, model: model as string, audio: url });
          }
        }

        setUserMoods(recordedMoods);
      } catch (error) {
        console.error("❌ Failed to load moods:", error);
        setUserMoods([]);
      } finally {
        setLoading(false);
      }
    };

    if (model) loadMoods();
  }, [model]);

  if (loading) return <div>⏳ Ստուգվում է ձայնագրությունները…</div>;
  if (userMoods.length === 0)
    return <div>❌ Ձայնագրություններ չեն գտնվել։</div>;

  return <FishCarouselDynamicRecord moods={userMoods} />;
};

export default GeneratedVoicePage;
