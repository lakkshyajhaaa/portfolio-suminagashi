"use client";

import { motion } from "framer-motion";

interface VinylPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function VinylPlayer({ isPlaying, onToggle }: VinylPlayerProps) {
  return (
    <div 
      className="relative w-16 h-16 md:w-20 md:h-20 cursor-pointer group flex items-center justify-center transition-transform hover:scale-105"
      onClick={onToggle}
      title={isPlaying ? "Mute Ambient Magic" : "Awaken Ambient Magic"}
    >
      {/* Wooden / Brass Base Plate (Visible on hover) */}
      <div className="absolute inset-1 rounded-lg border border-[#fef3c7]/20 bg-[#0f0f0f]/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* The Vinyl Record */}
      <motion.div 
        className="absolute w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0a0a0a] shadow-[0_0_15px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden border-[0.5px] border-[#fef3c7]/10"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "linear",
        }}
      >
        {/* Grooves (Radial rings) */}
        <div className="absolute inset-0 rounded-full border border-white/5 m-[2px]"></div>
        <div className="absolute inset-0 rounded-full border border-white/5 m-[5px]"></div>
        <div className="absolute inset-0 rounded-full border border-white/5 m-[8px]"></div>
        <div className="absolute inset-0 rounded-full border border-white/5 m-[11px]"></div>
        
        {/* Magic Arcane Label */}
        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#92400e] border border-[#fef3c7]/40 flex items-center justify-center shadow-inner">
          <div className="w-1 h-1 rounded-full bg-[#0a0a0a] shadow-inner"></div>
        </div>
        
        {/* Subtle light reflection on the vinyl */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay"></div>
      </motion.div>

      {/* The Tonearm */}
      <motion.div
        className="absolute top-2 right-2 md:right-3 w-1.5 h-8 md:h-10 origin-top z-10"
        initial={false}
        animate={{ rotate: isPlaying ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
      >
        {/* Pivot Base */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-[#d97706] to-[#78350f] border border-[#fef3c7]/30 shadow-md"></div>
        {/* Arm Shaft */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-r from-[#d97706] to-[#b45309] shadow-sm"></div>
        {/* Needle/Head */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-3.5 bg-[#1a1a1a] border border-[#fef3c7]/20 rounded-sm shadow-[0_2px_5px_rgba(0,0,0,0.5)] flex items-end justify-center pb-[1px] origin-top rotate-[-15deg]">
          <div className="w-[1px] h-1.5 bg-[#d97706]"></div>
        </div>
      </motion.div>

      {/* Subtle Magical Aura when playing */}
      <motion.div 
        className="absolute inset-2 rounded-full bg-[#f59e0b]/20 blur-md -z-10 pointer-events-none"
        animate={{ opacity: isPlaying ? 1 : 0, scale: isPlaying ? [1, 1.2, 1] : 1 }}
        transition={{ opacity: { duration: 1 }, scale: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
      />
    </div>
  );
}
