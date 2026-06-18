"use client";

import { useHandTracking } from "@/lib/HandTrackingContext";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame, AnimatePresence } from "framer-motion";

export default function HandCursor() {
  const { isCameraActive, handPosition, getHandPosition, rawPosition, getRawPosition, isLoading, videoElement, isPinching } = useHandTracking();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [wasPinching, setWasPinching] = useState(false);
  const pinchLockRef = useRef(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Trigger cinematic opening when camera finishes loading
  useEffect(() => {
    if (isCameraActive && !isLoading) {
      setShowGuide(true);
      const timer = setTimeout(() => setShowGuide(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setShowGuide(false);
    }
  }, [isCameraActive, isLoading]);

  // High-performance motion values that bypass React re-renders
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const videoX = useMotionValue(-100);
  const videoY = useMotionValue(-100);

  useAnimationFrame(() => {
    if (!isCameraActive) return;
    
    const hand = getHandPosition();
    if (hand && windowSize.width > 0) {
      cursorX.set(((hand.x + 1) / 2) * windowSize.width);
      cursorY.set(((-hand.y + 1) / 2) * windowSize.height);
      
      // Handle Virtual Hover Effects (60fps DOM Probing)
      const pX = ((hand.x + 1) / 2) * windowSize.width;
      const pY = ((-hand.y + 1) / 2) * windowSize.height;
      
      // MASSIVE MAGNETIC HITBOXES: 
      // Instead of requiring the user to point at the exact pixel (elementFromPoint),
      // we scan the entire screen for buttons and lock onto the closest one if they are within a 15% radius!
      const clickables = Array.from(document.querySelectorAll('a, button, [role="button"]'));
      let closestElement: HTMLElement | null = null;
      let minDistance = Infinity;
      const magnetRadius = windowSize.width * 0.15; // 15% of screen width!
      
      for (const el of clickables) {
         const rect = el.getBoundingClientRect();
         // We only care about elements actually visible on screen
         if (rect.width === 0 || rect.height === 0 || rect.opacity === '0') continue;
         
         const centerX = rect.left + rect.width / 2;
         const centerY = rect.top + rect.height / 2;
         const dist = Math.hypot(centerX - pX, centerY - pY);
         
         if (dist < minDistance && dist < magnetRadius) {
            minDistance = dist;
            closestElement = el as HTMLElement;
         }
      }
      
      const clickable = closestElement;
      
      if (clickable !== hoveredElementRef.current) {
        // Release previous
        if (hoveredElementRef.current) {
          hoveredElementRef.current.style.transform = '';
          hoveredElementRef.current.style.color = '';
          hoveredElementRef.current.style.textShadow = '';
        }
        
        // Latch new
        if (clickable) {
          clickable.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          clickable.style.transform = 'scale(1.1) translateY(-2px)';
          clickable.style.color = '#ff5500';
          clickable.style.textShadow = '0 0 15px rgba(255,85,0,0.8)';
        }
        hoveredElementRef.current = clickable;
      }
    }

    if (getRawPosition) {
      const raw = getRawPosition();
      if (raw) {
        videoX.set(((raw.x + 1) / 2) * 240);
        videoY.set(((-raw.y + 1) / 2) * 180);
      }
    }
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Edge Scrolling (Allows the user to scroll long pages like /about without a mouse wheel)
  useEffect(() => {
    if (!isCameraActive) return;
    
    let animationFrameId: number;
    
    const scrollLoop = () => {
      const currentPos = getHandPosition();
      // Only scroll if there is a hand detected and we aren't pinching (don't want to scroll accidentally while clicking)
      if (currentPos && window.innerHeight > 0 && !isPinching) {
        // currentPos.y maps to WebGL space: 1 is top of screen, -1 is bottom of screen
        const threshold = 0.65; // Scroll zone starts at 82.5% from center
        const maxScrollSpeed = 25; // Pixels per frame

        if (currentPos.y < -threshold) {
          // Hand is near the bottom edge -> scroll down
          const intensity = (Math.abs(currentPos.y) - threshold) / (1 - threshold);
          window.scrollBy({ top: maxScrollSpeed * Math.pow(intensity, 1.5) });
        } else if (currentPos.y > threshold) {
          // Hand is near the top edge -> scroll up
          const intensity = (currentPos.y - threshold) / (1 - threshold);
          window.scrollBy({ top: -maxScrollSpeed * Math.pow(intensity, 1.5) });
        }
      }
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCameraActive, getHandPosition, isPinching]);

  // Handle Pinch-to-Click for both DOM and WebGL
  useEffect(() => {
    if (isPinching && !pinchLockRef.current && windowSize.width > 0 && handPosition) {
       pinchLockRef.current = true; 
       
       // MAGNETIC TARGETING:
       // When humans physically pinch, their hand naturally shakes/drifts by a few pixels.
       // This causes the exact X/Y coordinate to slip off the button right as the click fires (hit or miss).
       // By checking if an element is currently "glowing" (hovered), we guarantee the click lands on it!
       if (hoveredElementRef.current) {
          // Send an aggressive click animation feedback
          hoveredElementRef.current.style.transform = 'scale(0.9) translateY(2px)';
          hoveredElementRef.current.click();
       } else {
         // Fallback: Dispatch raw WebGL pointer events if we aren't hovering a DOM button (e.g. interacting with the fluid)
         const pX = ((handPosition.x + 1) / 2) * windowSize.width;
         const pY = ((-handPosition.y + 1) / 2) * windowSize.height;
         const targetElement = document.elementFromPoint(pX, pY);
         
         if (targetElement) {
            const pointerDown = new PointerEvent("pointerdown", { clientX: pX, clientY: pY, bubbles: true });
            const pointerUp = new PointerEvent("pointerup", { clientX: pX, clientY: pY, bubbles: true });
            targetElement.dispatchEvent(pointerDown);
            setTimeout(() => targetElement.dispatchEvent(pointerUp), 50);
         }
       }
    } else if (!isPinching) {
       pinchLockRef.current = false;
    }
  }, [isPinching, handPosition, windowSize]);



  // Removed the physical video DOM insertion to keep it purely magical and invisible

  if (!isCameraActive) return null;

  if (isLoading) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center border border-white/20 p-4 rounded-none bg-black/50 backdrop-blur-md">
        <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase animate-pulse">
          SYS.CTL // CALIBRATING_OPTICS
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Cinematic Brutalist Guide (Movie Opening Sequence) */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center text-center mix-blend-difference pointer-events-none bg-black/20 backdrop-blur-md"
          >
            <span className="font-sans text-[20px] md:text-[40px] tracking-[0.5em] font-bold text-[#ff5500] uppercase mb-8 drop-shadow-[0_0_15px_rgba(255,85,0,0.5)]">
              KINETIC_TRACKING_ACTIVE //
            </span>
            <div className="flex gap-4 md:gap-8 font-sans text-[10px] md:text-sm tracking-[0.3em] font-bold text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              <span>[ Point to hover ]</span>
              <span className="text-[#67e8f9]">✦</span>
              <span>[ Pinch to interact ]</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Brutalist Hand Cursor */}
      {handPosition && windowSize.width > 0 && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
          style={{ x: cursorX, y: cursorY }}
          animate={{ scale: isPinching ? 0.7 : 1 }}
          transition={{ scale: { type: "spring", stiffness: 800, damping: 30 } }}
        >
          {/* Beautiful SVG Golden Snitch */}
          <svg width="160" height="80" viewBox="0 0 160 80" style={{ overflow: "visible" }}>
            <defs>
              <radialGradient id="goldSphere" cx="35%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#ffed4a" />
                <stop offset="70%" stopColor="#e0b046" />
                <stop offset="100%" stopColor="#966d1b" />
              </radialGradient>
              
              <linearGradient id="wingGradLeft" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffed4a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="wingGradRight" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffed4a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>

              <filter id="snitchGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={isPinching ? "6" : "4"} result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Left Wing */}
            <motion.g
              style={{ originX: "80px", originY: "40px" }}
              animate={{ 
                rotateZ: isPinching ? 40 : [15, -25, 15],
                scaleY: isPinching ? 0.3 : [1, 0.4, 1]
              }}
              transition={{ repeat: Infinity, duration: 0.06, ease: "linear" }}
            >
              {/* Main wing feather */}
              <path d="M 68 40 C 40 15, 10 5, -10 20 C 15 35, 40 42, 68 40 Z" fill="url(#wingGradLeft)" filter="url(#snitchGlow)" />
              {/* Secondary feathers */}
              <path d="M 65 42 C 35 30, 5 25, -5 35 C 20 45, 45 45, 65 42 Z" fill="url(#wingGradLeft)" opacity="0.6" />
            </motion.g>

            {/* Right Wing */}
            <motion.g
              style={{ originX: "80px", originY: "40px" }}
              animate={{ 
                rotateZ: isPinching ? -40 : [-15, 25, -15],
                scaleY: isPinching ? 0.3 : [1, 0.4, 1]
              }}
              transition={{ repeat: Infinity, duration: 0.06, ease: "linear" }}
            >
              <path d="M 92 40 C 120 15, 150 5, 170 20 C 145 35, 120 42, 92 40 Z" fill="url(#wingGradRight)" filter="url(#snitchGlow)" />
              <path d="M 95 42 C 125 30, 155 25, 165 35 C 140 45, 115 45, 95 42 Z" fill="url(#wingGradRight)" opacity="0.6" />
            </motion.g>

            {/* Golden Body */}
            <circle cx="80" cy="40" r={isPinching ? "10" : "14"} fill="url(#goldSphere)" filter="url(#snitchGlow)" />
            
            {/* Intricate Body Swirls */}
            <path d="M 70 35 Q 80 44 90 35" stroke="#7a550f" strokeWidth="1" fill="none" opacity="0.7" />
            <path d="M 68 40 Q 80 48 92 40" stroke="#7a550f" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M 72 45 Q 80 38 88 45" stroke="#7a550f" strokeWidth="0.8" fill="none" opacity="0.5" />
          </svg>
        </motion.div>
      )}
    </>
  );
}
