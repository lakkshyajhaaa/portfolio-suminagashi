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
          <motion.div 
            initial={{ clipPath: "inset(-50% 100% -50% -50%)" }}
            animate={{ clipPath: "inset(-50% -50% -50% -50%)" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="w-max px-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] flex justify-center items-center"
          >
            <span className={`${signatureFont.className} text-6xl md:text-7xl lg:text-8xl text-white whitespace-nowrap`}>
              Lakkshya Jha
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
