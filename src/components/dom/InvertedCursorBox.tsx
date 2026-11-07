"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useHandTracking } from "@/lib/HandTrackingContext";

export default function InvertedCursorBox() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const [hasMoved, setHasMoved] = useState(false);
  const { isCameraActive, getHandPosition } = useHandTracking();

  // High-performance spring for silky smooth 120fps tracking
  const springX = useSpring(mouseX, { stiffness: 1400, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 1400, damping: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!hasMoved) setHasMoved(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, hasMoved]);

  // Synchronize with gesture hand tracking if camera is active
  useEffect(() => {
    if (!isCameraActive) return;
    let animId: number;
    const loop = () => {
      const hand = getHandPosition ? getHandPosition() : null;
      if (hand && typeof window !== "undefined") {
        const hX = ((hand.x + 1) / 2) * window.innerWidth;
        const hY = ((-hand.y + 1) / 2) * window.innerHeight;
        mouseX.set(hX);
        mouseY.set(hY);
        if (!hasMoved) setHasMoved(true);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isCameraActive, getHandPosition, mouseX, mouseY, hasMoved]);

  return (
    <motion.div
      className={`pointer-events-none fixed top-0 left-0 z-40 -translate-x-1/2 -translate-y-1/2 hidden sm:block transition-opacity duration-300 ${
        hasMoved ? "opacity-100" : "opacity-0"
      }`}
      style={{
        x: springX,
        y: springY,
      }}
    >
      {/* 
        Strict 3:2 Width:Length (Height) Ratio Box:
        Desktop: 240px width x 160px height (240 / 160 = 1.5 = 3/2)
        Tablet/Small: 180px width x 120px height (180 / 120 = 1.5 = 3/2)
      */}
      <div
        className="relative w-[180px] h-[120px] md:w-[240px] md:h-[160px] border border-white/70"
        style={{
          backdropFilter: "invert(100%)",
          WebkitBackdropFilter: "invert(100%)",
        }}
      >
        {/* Brutalist Corner Framing Brackets */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />

        {/* Center Reticle Crosshair aligned to cursor point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-70">
          <div className="absolute top-1/2 left-0 w-3 h-[1px] -translate-y-1/2 bg-white" />
          <div className="absolute top-0 left-1/2 w-[1px] h-3 -translate-x-1/2 bg-white" />
        </div>

        {/* 3:2 Ratio Technical Tag */}
        <div className="absolute bottom-1 right-1.5 font-mono text-[7px] tracking-widest text-white/70 uppercase select-none pointer-events-none">
          3:2 // INV
        </div>
      </div>
    </motion.div>
  );
}
