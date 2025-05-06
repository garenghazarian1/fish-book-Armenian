"use client";

import { useParams } from "next/navigation";
import Happy from "@/components/pages/Happy/Happy";

export default function FishMoodPage() {
  const { name } = useParams();

  if (name === "happy") {
    return <Happy />;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
      Ձուկը՝ &quot;{name}&quot; դեռ պատրաստ չէ։
    </div>
  );
}
