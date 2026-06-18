"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const { active, progress, total, loaded } = useProgress();
  
  const [show, setShow] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (sessionStorage.getItem('suminagashi_loaded')) {
      setShow(false);
    }
  }, []);

  const [displayValue, setDisplayValue] = useState(0);

  const targetProgress = (!active && total === 0) ? 100 : progress;

  // Smoothly animate displayValue towards the target progress
  useEffect(() => {
    let animationFrameId: number;
    let start = performance.now();
    const startValue = displayValue;
    
    // Force the counter to take 1.5 seconds to reach 100 for cinematic effect
    const duration = 1500;
    
    const animate = (time: number) => {
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1);
      
      // easeOutExpo curve for a snappy start and slow satisfying finish
      const easeT = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = startValue + (targetProgress - startValue) * easeT;
      
      setDisplayValue(current);
      
      if (t < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetProgress);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep it on screen for exactly 0.5 seconds AFTER the visual counter hits 100
  useEffect(() => {
    if (displayValue >= 99.9) {
      const timer = setTimeout(() => {
        setShow(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('suminagashi_loaded', 'true');
        }
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [displayValue]);

  const displayProgressStr = Math.floor(displayValue).toString().padStart(3, '0');
  const isReady = displayValue >= 99.9;

  if (!isMounted) return null;
  if (!show && displayValue === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-between p-6 md:p-12 pointer-events-auto cursor-wait overflow-hidden"
        >
          {/* Top HUD */}
          <div className="flex justify-between items-start font-sans text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-white/50 w-full z-10">
            <div className="flex flex-col gap-2">
              <span>STATUS // <span className={isReady ? "text-white" : ""}>{isReady ? "READY" : "COMPILING ASSETS"}</span></span>
              <span>ALLOCATION // <span className="text-white">{loaded} / {Math.max(total, 1)}</span></span>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span>SYSTEM // <span className="text-[#ff5500] drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">WEBGL ENGINE</span></span>
              <span>AUTHOR // <span className="text-white">LAKKSHYA JHA</span></span>
            </div>
          </div>

          {/* Central Monolithic Counter */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center">
            <motion.h1 
              className="font-sans text-[28vw] md:text-[22vw] leading-none tracking-[-0.05em] font-bold text-white whitespace-nowrap mix-blend-difference drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {displayProgressStr}
            </motion.h1>
          </div>

          {/* Bottom HUD & Progress Bar */}
          <div className="w-full flex flex-col gap-6 z-10">
            <div className="flex justify-between items-end font-sans text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-white/50 w-full">
              <span>{isReady ? "INITIATING CINEMATIC SEQUENCE..." : "AWAITING WEBGL..."}</span>
              <span className="text-[#67e8f9] drop-shadow-[0_0_5px_rgba(103,232,249,0.5)] animate-pulse">
                REC
              </span>
            </div>
            
            {/* Razor-thin horizontal loading line */}
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" 
                initial={{ width: 0 }}
                animate={{ width: `${displayValue}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
