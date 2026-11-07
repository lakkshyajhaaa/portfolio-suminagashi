"use client";

import { useEffect, useState, useRef } from "react";
import { useHandTracking } from "@/lib/HandTrackingContext";

export default function InvertedCursorBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const visibleRef = useRef(false);
  const { isCameraActive, getHandPosition } = useHandTracking();

  // Instant 1:1 hardware cursor tracking without spring lag or frame delay
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Synchronize with gesture hand tracking if camera is active
  useEffect(() => {
    if (!isCameraActive) return;
    let animId: number;
    const loop = () => {
      const hand = getHandPosition ? getHandPosition() : null;
      if (hand && typeof window !== "undefined") {
        const hX = ((hand.x + 1) / 2) * window.innerWidth;
        const hY = ((-hand.y + 1) / 2) * window.innerHeight;
        if (containerRef.current) {
          containerRef.current.style.transform = `translate3d(${hX}px, ${hY}px, 0)`;
        }
        if (!visibleRef.current) {
          visibleRef.current = true;
          setIsVisible(true);
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isCameraActive, getHandPosition]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed top-0 left-0 z-40 hidden sm:block transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-1000px, -1000px, 0)",
        willChange: "transform",
      }}
    >
      {/* 
        Strict 3:2 Width:Length (Height) Ratio Box:
        Desktop: 240px width x 160px height (240 / 160 = 1.5 = 3/2)
        Tablet/Small: 180px width x 120px height (180 / 120 = 1.5 = 3/2)
        The child translates (-50%, -50%) so its geometric center is strictly attached to the cursor!
      */}
      <div
        className="relative w-[180px] h-[120px] md:w-[240px] md:h-[160px] border border-white/70"
        style={{
          transform: "translate(-50%, -50%)",
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
    </div>
  );
}
