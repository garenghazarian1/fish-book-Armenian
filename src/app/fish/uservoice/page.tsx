// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import UserVoice from "@/components/pages/UserVoice/UserVoice";
// import type { Mood } from "@/components/pages/data/types";

// const moodSources: Record<string, () => Promise<{ default: Mood[] }>> = {
//   blue: () => import("@/components/pages/data/moods/blue"),
//   red: () => import("@/components/pages/data/moods/red"),
//   aniArmenian: () => import("@/components/pages/data/moods/aniArmenian"),
//   // Add more model keys as needed
// };

// export default function UserVoicePage() {
//   const searchParams = useSearchParams();
//   const model = searchParams.get("model");
//   const [moods, setMoods] = useState<Mood[] | null>(null);

//   useEffect(() => {
//     if (!model || !moodSources[model]) return;
//     moodSources[model]().then((mod) => setMoods(mod.default));
//   }, [model]);

//   if (!model) {
//     return <p style={{ padding: "2rem" }}>❌ Մոդելը նշված չէ։</p>;
//   }

//   if (!moods) {
//     return <p style={{ padding: "2rem" }}>⏳ Բեռնում է ձայները...</p>;
//   }

//   return <UserVoice moods={moods} />;
// }
