"use client";

import { motion } from "framer-motion";
import { useMemo, useState, MouseEvent } from "react";

/* ------------------------------------------------------------------ */
/* BubbleEffect – visual burst you can overlay anywhere               */
/* ------------------------------------------------------------------ */
export interface BubbleEffectProps {
  /** Change this value (e.g. by incrementing a counter) to trigger a new burst */
  triggerKey: number;
  /** How many bubbles in each burst */
  numBubbles?: number;
  /** Bubble min + max diameter (px) */
  minSize?: number;
  maxSize?: number;
  /** How far the bubbles travel (px) */
  minDistance?: number;
  maxDistance?: number;
  /** Palette for random bubble colours */
  colors?: string[];
  /** Base animation duration (s) */
  duration?: number;
}

export const BubbleEffect = ({
  triggerKey,
  numBubbles = 20,
  minSize = 8,
  maxSize = 22,
  minDistance = 60,
  maxDistance = 140,
  colors = ["#6EE7B7", "#93C5FD", "#FBCFE8", "#FDE68A"],
  duration = 1.3,
}: BubbleEffectProps) => {
  /* Build a deterministic "burst" based on triggerKey so React can diff */
  const burst = useMemo(() => {
    return Array.from({ length: numBubbles }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance =
        minDistance + Math.random() * (maxDistance - minDistance);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = minSize + Math.random() * (maxSize - minSize);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotate = Math.random() * 360;
      const delay = Math.random() * 0.05; // subtle stagger
      const life = duration + Math.random() * 0.4;
      return { x, y, size, color, rotate, delay, life };
    });
  }, [
    triggerKey,
    numBubbles,
    minSize,
    maxSize,
    minDistance,
    maxDistance,
    colors,
    duration,
  ]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {burst.map((b, i) => (
        <motion.span
          key={`${triggerKey}-${i}`}
          initial={{ opacity: 0.9, scale: 0.6, x: 0, y: 0 }}
          animate={{ opacity: 0, scale: 1.3, x: b.x, y: b.y, rotate: b.rotate }}
          transition={{ duration: b.life, ease: "easeOut", delay: b.delay }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginLeft: `-${b.size / 2}px`,
            marginTop: `-${b.size / 2}px`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: "50%",
            backgroundColor: b.color,
          }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* BubblyButton – drop‑in replacement for <button>                    */
/* ------------------------------------------------------------------ */
export interface BubblyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  numBubbles?: number;
  bubbleColors?: string[];
}

export const BubblyButton = ({
  children,
  numBubbles,
  bubbleColors,
  onClick,
  ...btnProps
}: BubblyButtonProps) => {
  const [burstId, setBurstId] = useState(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // trigger new burst → ++key
    setBurstId((id) => id + 1);
    onClick?.(e);
  };

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        {...btnProps}
        onClick={handleClick}
        style={{ position: "relative", zIndex: 1, ...btnProps.style }}
      >
        {children}
      </button>

      <BubbleEffect
        triggerKey={burstId}
        numBubbles={numBubbles}
        colors={bubbleColors}
      />
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Usage examples:

1️⃣  Wrap an existing button:

  <BubblyButton onClick={()=>alert('hi!')}>Click me</BubblyButton>

2️⃣  Use the raw effect somewhere else:

  const [key,setKey] = useState(0)
  return (
    <div onMouseEnter={()=>setKey(k=>k+1)} style={{position:'relative'}}>
      Hover me
      <BubbleEffect triggerKey={key} />
    </div>
  )
------------------------------------------------------------------- */
