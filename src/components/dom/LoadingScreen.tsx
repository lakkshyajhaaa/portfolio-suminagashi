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
                <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="20" />
                </filter>
                <mask id="writeMask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1200" height="600">
                  <motion.path
                    d="M -40,100 L 40.0,100.0 L 39.4,136.6 L 32.4,166.9 L 20.9,185.6 L 7.2,189.5 L -5.8,177.9 L -15.4,152.9 L -19.3,118.7 L -16.5,81.3 L -6.9,47.1 L 8.3,22.1 L 27.0,10.5 L 46.4,14.4 L 63.6,33.1 L 76.2,63.4 L 82.5,100.0 L 81.9,136.6 L 74.9,166.9 L 63.4,185.6 L 49.7,189.5 L 36.7,177.9 L 27.1,152.9 L 23.2,118.7 L 26.0,81.3 L 35.6,47.1 L 50.8,22.1 L 69.5,10.5 L 88.9,14.4 L 106.1,33.1 L 118.7,63.4 L 125.0,100.0 L 124.4,136.6 L 117.4,166.9 L 105.9,185.6 L 92.2,189.5 L 79.2,177.9 L 69.6,152.9 L 65.7,118.7 L 68.5,81.3 L 78.1,47.1 L 93.3,22.1 L 112.0,10.5 L 131.4,14.4 L 148.6,33.1 L 161.2,63.4 L 167.5,100.0 L 166.9,136.6 L 159.9,166.9 L 148.4,185.6 L 134.7,189.5 L 121.7,177.9 L 112.1,152.9 L 108.2,118.7 L 111.0,81.3 L 120.6,47.1 L 135.8,22.1 L 154.5,10.5 L 173.9,14.4 L 191.1,33.1 L 203.7,63.4 L 210.0,100.0 L 209.4,136.6 L 202.4,166.9 L 190.9,185.6 L 177.2,189.5 L 164.2,177.9 L 154.6,152.9 L 150.7,118.7 L 153.5,81.3 L 163.1,47.1 L 178.3,22.1 L 197.0,10.5 L 216.4,14.4 L 233.6,33.1 L 246.2,63.4 L 252.5,100.0 L 251.9,136.6 L 244.9,166.9 L 233.4,185.6 L 219.7,189.5 L 206.7,177.9 L 197.1,152.9 L 193.2,118.7 L 196.0,81.3 L 205.6,47.1 L 220.8,22.1 L 239.5,10.5 L 258.9,14.4 L 276.1,33.1 L 288.7,63.4 L 295.0,100.0 L 294.4,136.6 L 287.4,166.9 L 275.9,185.6 L 262.2,189.5 L 249.2,177.9 L 239.6,152.9 L 235.7,118.7 L 238.5,81.3 L 248.1,47.1 L 263.3,22.1 L 282.0,10.5 L 301.4,14.4 L 318.6,33.1 L 331.2,63.4 L 337.5,100.0 L 336.9,136.6 L 329.9,166.9 L 318.4,185.6 L 304.7,189.5 L 291.7,177.9 L 282.1,152.9 L 278.2,118.7 L 281.0,81.3 L 290.6,47.1 L 305.8,22.1 L 324.5,10.5 L 343.9,14.4 L 361.1,33.1 L 373.7,63.4 L 380.0,100.0 L 379.4,136.6 L 372.4,166.9 L 360.9,185.6 L 347.2,189.5 L 334.2,177.9 L 324.6,152.9 L 320.7,118.7 L 323.5,81.3 L 333.1,47.1 L 348.3,22.1 L 367.0,10.5 L 386.4,14.4 L 403.6,33.1 L 416.2,63.4 L 422.5,100.0 L 421.9,136.6 L 414.9,166.9 L 403.4,185.6 L 389.7,189.5 L 376.7,177.9 L 367.1,152.9 L 363.2,118.7 L 366.0,81.3 L 375.6,47.1 L 390.8,22.1 L 409.5,10.5 L 428.9,14.4 L 446.1,33.1 L 458.7,63.4 L 465.0,100.0 L 464.4,136.6 L 457.4,166.9 L 445.9,185.6 L 432.2,189.5 L 419.2,177.9 L 409.6,152.9 L 405.7,118.7 L 408.5,81.3 L 418.1,47.1 L 433.3,22.1 L 452.0,10.5 L 471.4,14.4 L 488.6,33.1 L 501.2,63.4 L 507.5,100.0 L 506.9,136.6 L 499.9,166.9 L 488.4,185.6 L 474.7,189.5 L 461.7,177.9 L 452.1,152.9 L 448.2,118.7 L 451.0,81.3 L 460.6,47.1 L 475.8,22.1 L 494.5,10.5 L 513.9,14.4 L 531.1,33.1 L 543.7,63.4 L 550.0,100.0 L 549.4,136.6 L 542.4,166.9 L 530.9,185.6 L 517.2,189.5 L 504.2,177.9 L 494.6,152.9 L 490.7,118.7 L 493.5,81.3 L 503.1,47.1 L 518.3,22.1 L 537.0,10.5 L 556.4,14.4 L 573.6,33.1 L 586.2,63.4 L 592.5,100.0 L 591.9,136.6 L 584.9,166.9 L 573.4,185.6 L 559.7,189.5 L 546.7,177.9 L 537.1,152.9 L 533.2,118.7 L 536.0,81.3 L 545.6,47.1 L 560.8,22.1 L 579.5,10.5 L 598.9,14.4 L 616.1,33.1 L 628.7,63.4 L 635.0,100.0 L 634.4,136.6 L 627.4,166.9 L 615.9,185.6 L 602.2,189.5 L 589.2,177.9 L 579.6,152.9 L 575.7,118.7 L 578.5,81.3 L 588.1,47.1 L 603.3,22.1 L 622.0,10.5 L 641.4,14.4 L 658.6,33.1 L 671.2,63.4 L 677.5,100.0 L 676.9,136.6 L 669.9,166.9 L 658.4,185.6 L 644.7,189.5 L 631.7,177.9 L 622.1,152.9 L 618.2,118.7 L 621.0,81.3 L 630.6,47.1 L 645.8,22.1 L 664.5,10.5 L 683.9,14.4 L 701.1,33.1 L 713.7,63.4 L 720.0,100.0 L 719.4,136.6 L 712.4,166.9 L 700.9,185.6 L 687.2,189.5 L 674.2,177.9 L 664.6,152.9 L 660.7,118.7 L 663.5,81.3 L 673.1,47.1 L 688.3,22.1 L 707.0,10.5 L 726.4,14.4 L 743.6,33.1 L 756.2,63.4 L 762.5,100.0 L 761.9,136.6 L 754.9,166.9 L 743.4,185.6 L 729.7,189.5 L 716.7,177.9 L 707.1,152.9 L 703.2,118.7 L 706.0,81.3 L 715.6,47.1 L 730.8,22.1 L 749.5,10.5 L 768.9,14.4 L 786.1,33.1 L 798.7,63.4 L 805.0,100.0 L 804.4,136.6 L 797.4,166.9 L 785.9,185.6 L 772.2,189.5 L 759.2,177.9 L 749.6,152.9 L 745.7,118.7 L 748.5,81.3 L 758.1,47.1 L 773.3,22.1 L 792.0,10.5 L 811.4,14.4 L 828.6,33.1 L 841.2,63.4 L 847.5,100.0 L 846.9,136.6 L 839.9,166.9 L 828.4,185.6 L 814.7,189.5 L 801.7,177.9 L 792.1,152.9 L 788.2,118.7 L 791.0,81.3 L 800.6,47.1 L 815.8,22.1 L 834.5,10.5 L 853.9,14.4 L 871.1,33.1 L 883.7,63.4"
                    fill="none"
                    stroke="white"
                    strokeWidth="80"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#blur)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
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
