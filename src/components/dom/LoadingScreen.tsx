"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meddon } from "next/font/google";

const signatureFont = Meddon({ weight: '400', subsets: ['latin'] });

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
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col justify-center items-center pointer-events-auto cursor-wait overflow-hidden"
        >
          <motion.div 
            initial={{ scale: 0.95, filter: 'drop-shadow(0px 0px 0px rgba(255,255,255,0))' }}
            animate={{ scale: 1, filter: 'drop-shadow(0px 0px 25px rgba(255,255,255,0.4))' }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="w-full max-w-4xl px-8 flex justify-center"
          >
            <svg viewBox="0 0 800 200" className="w-full h-auto" style={{ overflow: 'visible' }}>
              <defs>
                <mask id="writeMask" maskUnits="userSpaceOnUse" x="-1000" y="-1000" width="3000" height="3000">
                  <motion.g
                    initial={{ x: -800 }}
                    animate={{ x: 900 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  >
                    <polygon points="-5000,-100 300,-100 200,300 -5000,300" fill="white" />
                  </motion.g>
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
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
            className="text-neutral-500 tracking-[0.4em] text-sm mt-4 font-light"
          >
            CREATIVE DEVELOPER
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
