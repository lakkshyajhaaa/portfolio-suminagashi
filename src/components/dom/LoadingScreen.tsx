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
          <div className="w-full max-w-3xl px-8 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
            <svg viewBox="-5 -25 195 40" className="w-full h-auto" style={{ overflow: 'visible' }}>
              <g transform="scale(1, -1)">
                <motion.path
                  d="M 4.00,18.00 L 3.00,16.00 L 3.00,14.00 L 4.00,12.00 L 6.00,11.00 L 9.00,11.00 L 12.00,12.00 L 14.00,13.00 L 17.00,16.00 L 18.00,19.00 L 18.00,20.00 L 17.00,21.00 L 16.00,21.00 L 14.00,20.00 L 13.00,19.00 L 11.00,16.00 L 7.00,6.00 L 6.00,4.00 L 4.00,1.00 L 2.00,0.00 M 13.00,19.00 L 11.00,15.00 L 9.00,8.00 L 8.00,5.00 L 7.00,3.00 L 5.00,1.00 L 2.00,0.00 L 0.00,0.00 L -1.00,1.00 L -1.00,3.00 L 0.00,4.00 L 2.00,4.00 L 4.00,3.00 L 7.00,1.00 L 9.00,0.00 L 12.00,0.00 L 14.00,1.00 L 16.00,3.00 M 28.00,6.00 L 27.00,8.00 L 25.00,9.00 L 23.00,9.00 L 21.00,8.00 L 20.00,7.00 L 19.00,5.00 L 19.00,3.00 L 20.00,1.00 L 22.00,0.00 L 24.00,0.00 L 26.00,1.00 L 27.00,3.00 M 23.00,9.00 L 21.00,7.00 L 20.00,5.00 L 20.00,2.00 L 22.00,0.00 M 29.00,9.00 L 27.00,3.00 L 27.00,1.00 L 29.00,0.00 L 31.00,1.00 L 32.00,2.00 L 34.00,5.00 M 30.00,9.00 L 28.00,3.00 L 28.00,1.00 L 29.00,0.00 M 34.00,5.00 L 36.00,8.00 L 38.00,12.00 M 41.00,21.00 L 34.00,0.00 M 42.00,21.00 L 35.00,0.00 M 43.00,9.00 L 43.00,8.00 L 44.00,8.00 L 43.00,9.00 L 42.00,9.00 L 40.00,7.00 L 37.00,6.00 M 37.00,6.00 L 40.00,5.00 L 41.00,1.00 L 42.00,0.00 M 37.00,6.00 L 39.00,5.00 L 40.00,1.00 L 42.00,0.00 L 43.00,0.00 L 46.00,2.00 L 48.00,5.00 M 48.00,5.00 L 50.00,8.00 L 52.00,12.00 M 55.00,21.00 L 48.00,0.00 M 56.00,21.00 L 49.00,0.00 M 57.00,9.00 L 57.00,8.00 L 58.00,8.00 L 57.00,9.00 L 56.00,9.00 L 54.00,7.00 L 51.00,6.00 M 51.00,6.00 L 54.00,5.00 L 55.00,1.00 L 56.00,0.00 M 51.00,6.00 L 53.00,5.00 L 54.00,1.00 L 56.00,0.00 L 57.00,0.00 L 60.00,2.00 L 62.00,5.00 M 62.00,5.00 L 64.00,8.00 L 65.00,10.00 L 65.00,8.00 L 68.00,6.00 L 69.00,4.00 L 69.00,2.00 L 68.00,1.00 L 66.00,0.00 M 65.00,8.00 L 67.00,6.00 L 68.00,4.00 L 68.00,2.00 L 66.00,0.00 M 62.00,1.00 L 64.00,0.00 L 69.00,0.00 L 72.00,2.00 L 74.00,5.00 M 74.00,5.00 L 76.00,8.00 L 78.00,12.00 M 81.00,21.00 L 74.00,0.00 M 82.00,21.00 L 75.00,0.00 M 77.00,6.00 L 79.00,8.00 L 81.00,9.00 L 82.00,9.00 L 84.00,8.00 L 84.00,6.00 L 83.00,3.00 L 83.00,1.00 L 84.00,0.00 M 82.00,9.00 L 83.00,8.00 L 83.00,6.00 L 82.00,3.00 L 82.00,1.00 L 84.00,0.00 L 86.00,1.00 L 87.00,2.00 L 89.00,5.00 M 92.00,9.00 L 90.00,3.00 L 90.00,1.00 L 92.00,0.00 L 93.00,0.00 L 95.00,1.00 L 97.00,3.00 L 99.00,6.00 M 93.00,9.00 L 91.00,3.00 L 91.00,1.00 L 92.00,0.00 M 100.00,9.00 L 94.00,-9.00 M 101.00,9.00 L 98.00,0.00 L 96.00,-5.00 L 94.00,-9.00 L 93.00,-11.00 L 91.00,-12.00 L 90.00,-11.00 L 90.00,-9.00 L 91.00,-6.00 L 93.00,-4.00 L 96.00,-2.00 L 100.00,0.00 L 103.00,2.00 L 105.00,5.00 M 115.00,6.00 L 114.00,8.00 L 112.00,9.00 L 110.00,9.00 L 108.00,8.00 L 107.00,7.00 L 106.00,5.00 L 106.00,3.00 L 107.00,1.00 L 109.00,0.00 L 111.00,0.00 L 113.00,1.00 L 114.00,3.00 M 110.00,9.00 L 108.00,7.00 L 107.00,5.00 L 107.00,2.00 L 109.00,0.00 M 116.00,9.00 L 114.00,3.00 L 114.00,1.00 L 116.00,0.00 L 118.00,1.00 L 119.00,2.00 L 121.00,5.00 M 117.00,9.00 L 115.00,3.00 L 115.00,1.00 L 116.00,0.00 M 153.00,21.00 L 151.00,19.00 L 149.00,16.00 L 147.00,11.00 L 144.00,2.00 L 142.00,-2.00 M 153.00,14.00 L 151.00,12.00 L 148.00,11.00 L 145.00,11.00 L 143.00,12.00 L 142.00,14.00 L 142.00,16.00 L 143.00,18.00 L 145.00,20.00 L 149.00,21.00 L 153.00,21.00 L 151.00,18.00 L 150.00,16.00 L 147.00,7.00 L 145.00,3.00 L 144.00,1.00 L 142.00,-2.00 L 141.00,-3.00 L 139.00,-4.00 L 138.00,-3.00 L 138.00,-1.00 L 139.00,1.00 L 141.00,3.00 L 143.00,4.00 L 146.00,5.00 L 150.00,6.00 M 154.00,5.00 L 156.00,8.00 L 158.00,12.00 M 161.00,21.00 L 154.00,0.00 M 162.00,21.00 L 155.00,0.00 M 157.00,6.00 L 159.00,8.00 L 161.00,9.00 L 162.00,9.00 L 164.00,8.00 L 164.00,6.00 L 163.00,3.00 L 163.00,1.00 L 164.00,0.00 M 162.00,9.00 L 163.00,8.00 L 163.00,6.00 L 162.00,3.00 L 162.00,1.00 L 164.00,0.00 L 166.00,1.00 L 167.00,2.00 L 169.00,5.00 M 179.00,6.00 L 178.00,8.00 L 176.00,9.00 L 174.00,9.00 L 172.00,8.00 L 171.00,7.00 L 170.00,5.00 L 170.00,3.00 L 171.00,1.00 L 173.00,0.00 L 175.00,0.00 L 177.00,1.00 L 178.00,3.00 M 174.00,9.00 L 172.00,7.00 L 171.00,5.00 L 171.00,2.00 L 173.00,0.00 M 180.00,9.00 L 178.00,3.00 L 178.00,1.00 L 180.00,0.00 L 182.00,1.00 L 183.00,2.00 L 185.00,5.00 M 181.00,9.00 L 179.00,3.00 L 179.00,1.00 L 180.00,0.00"
+                  fill="none"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "linear" }}
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
