"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dawning_of_a_New_Day } from "next/font/google";

const signatureFont = Dawning_of_a_New_Day({ weight: '400', subsets: ['latin'] });

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
          <div className="w-full max-w-4xl px-8 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
            <svg viewBox="0 0 800 200" className="w-full h-auto" style={{ overflow: 'visible' }}>
              <defs>
                <mask id="writeMask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1200" height="600">
                  <motion.path
                    d="M -50,220 C -18.5,-70 -36.5,270 -5.0,220 C 26.5,-70 8.5,270 40.0,220 C 71.5,-70 53.5,270 85.0,220 C 116.5,-70 98.5,270 130.0,220 C 161.5,-70 143.5,270 175.0,220 C 206.5,-70 188.5,270 220.0,220 C 251.5,-70 233.5,270 265.0,220 C 296.5,-70 278.5,270 310.0,220 C 341.5,-70 323.5,270 355.0,220 C 386.5,-70 368.5,270 400.0,220 C 431.5,-70 413.5,270 445.0,220 C 476.5,-70 458.5,270 490.0,220 C 521.5,-70 503.5,270 535.0,220 C 566.5,-70 548.5,270 580.0,220 C 611.5,-70 593.5,270 625.0,220 C 656.5,-70 638.5,270 670.0,220 C 701.5,-70 683.5,270 715.0,220 C 746.5,-70 728.5,270 760.0,220 C 791.5,-70 773.5,270 805.0,220 C 836.5,-70 818.5,270 850.0,220"
                    fill="none"
                    stroke="white"
                    strokeWidth="80"
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
                className={`${signatureFont.className}`}
                fontSize="130"
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
