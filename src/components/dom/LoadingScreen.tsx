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
  }, []);

  const [displayValue, setDisplayValue] = useState(0);

  // Smoothly animate displayValue from 0 to 100 over 3 seconds
  useEffect(() => {
    let animationFrameId: number;
    let start: number | null = null;
    const duration = 1200;
    
    const animate = (time: number) => {
      if (start === null) start = time;
      const elapsed = time - start;
      const t = Math.min(elapsed / duration, 1);
      
      setDisplayValue(t * 100);
      
      if (t < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        const timer = setTimeout(() => {
          setShow(false);
        }, 50);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const isReady = displayValue >= 99.9;

  if (!isMounted) return null;
  if (!show && displayValue === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black text-white flex justify-center items-center pointer-events-auto cursor-wait overflow-hidden"
        >
          <div className="w-full max-w-lg px-8 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
            <svg viewBox="0 0 400 100" className="w-full h-auto">
              <defs>
                <mask id="writeMask" maskUnits="userSpaceOnUse" x="-50" y="-50" width="500" height="200">
                  <motion.path
                    d="M 10,80 C 27,-10 17,110 35,80 C 53,-10 42,110 60,80 C 78,-10 68,110 86,80 C 104,-10 94,110 111,80 C 129,-10 119,110 137,80 C 154,-10 144,110 162,80 C 180,-10 170,110 187,80 C 205,-10 195,110 213,80 C 230,-10 220,110 238,80 C 256,-10 246,110 263,80 C 281,-10 271,110 289,80 C 306,-10 296,110 314,80 C 332,-10 322,110 339,80 C 357,-10 347,110 365,80 C 382,-10 372,110 390,80 C 400,-10 390,110 410,80"
                    fill="none"
                    stroke="white"
                    strokeWidth="45"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "linear" }}
                  />
                </mask>
              </defs>
              <text 
                x="50%" 
                y="55%" 
                dominantBaseline="middle" 
                textAnchor="middle" 
                fill="white" 
                mask="url(#writeMask)"
                className={`${signatureFont.className} text-[60px]`}
              >
                Lakkshya Jha
              </text>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
