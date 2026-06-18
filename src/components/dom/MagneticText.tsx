"use client";

import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "framer-motion";
import { useHandTracking } from "@/lib/HandTrackingContext";
import { useEffect, useRef, useState } from "react";

interface MagneticLetterProps {
  children: string;
}

function MagneticLetter({ children }: MagneticLetterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { getHandPosition } = useHandTracking();
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for snapping back - gives it that bouncy, quirky, fun feel
  const springX = useSpring(x, { stiffness: 200, damping: 8, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 200, damping: 8, mass: 0.8 });
  
  // Add a playful rotation when pushed
  const rotate = useTransform(springX, [-100, 100], [-35, 35]);
  const scale = useTransform(springY, [-100, 0, 100], [1.2, 1, 1.2]);

  useAnimationFrame(() => {
    if (!ref.current || windowSize.w === 0) return;
    
    const rect = ref.current.getBoundingClientRect();
    // Use the original base position, otherwise it calculates based on current animated position
    // which causes it to run away forever!
    const baseCenterX = rect.left - springX.get() + rect.width / 2;
    const baseCenterY = rect.top - springY.get() + rect.height / 2;
    
    let targetX = mousePos.current.x;
    let targetY = mousePos.current.y;

    // If hand tracking is active, prioritize the hand
    const hand = getHandPosition();
    if (hand) {
      targetX = ((hand.x + 1) / 2) * windowSize.w;
      targetY = ((-hand.y + 1) / 2) * windowSize.h;
    }
    
    const distX = baseCenterX - targetX;
    const distY = baseCenterY - targetY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    const radius = 180; // Repel radius
    
    if (distance < radius) {
      // Repel! The closer the cursor, the stronger the push
      const force = Math.pow((radius - distance) / radius, 1.5);
      x.set((distX / distance) * force * 150);
      y.set((distY / distance) * force * 150);
    } else {
      // Snap back
      x.set(0);
      y.set(0);
    }
  });

  return (
    <motion.span
      ref={ref}
      style={{ x: springX, y: springY, rotate, scale, display: "inline-block" }}
      className="cursor-pointer hover:text-[#fef08a] transition-colors drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)]"
    >
      {children === " " ? "\u00A0" : children}
    </motion.span>
  );
}

export default function MagneticText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center ${className}`}>
      {text.split("").map((char, i) => (
        <MagneticLetter key={i}>{char}</MagneticLetter>
      ))}
    </div>
  );
}
