// app/test/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import type { Mood } from "@/components/pages/data/types";
import moods from "@/components/pages/data/moods/lilitGerman";

export default function TestPage() {
  return (
    <>
      <div>
        <h1>Hello from Test Page</h1>
        <Link href="/">🔙 Back to Main Page</Link>
        <ul>
          {moods.map((mood: Mood) => (
            <li key={mood.id}>
              <p>{mood.text}</p>
              <Image
                src={mood.image}
                alt={mood.text}
                width={100}
                height={100}
              />
              <audio controls src={mood.audio}></audio>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
