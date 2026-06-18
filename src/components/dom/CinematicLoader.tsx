"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only show on the very first load of the browser session
    const hasLoaded = sessionStorage.getItem("hasCinematicLoaded");
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    // Lock scrolling while loading
    document.body.style.overflow = "hidden";
    
    // Hold the loading screen for 3.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hasCinematicLoaded", "true");
      document.body.style.overflow = "";
    }, 3500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#091221] text-white pointer-events-auto"
        >
          <div className="flex flex-col items-center overflow-hidden">
             {/* Small Technical Subtitle */}
             <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="font-sans text-[10px] tracking-[0.5em] text-[#ff5500] font-bold uppercase mb-4"
             >
                SYS.INIT // SEQUENCE_START
             </motion.span>
             
             {/* Massive Monolithic Typography */}
             <motion.h1 
                initial={{ filter: "blur(20px)", scale: 0.8, opacity: 0 }}
                animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-[4rem] md:text-[8rem] tracking-[-0.05em] font-bold drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
             >
                LAKKSHYA.
             </motion.h1>
             
             {/* Expansion Line */}
             <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
                className="h-[1px] bg-white/30 mt-4"
             />
             
             {/* Final boot confirmation text */}
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.2 }}
                className="mt-6 flex flex-col items-center gap-2 font-sans text-[8px] md:text-[10px] tracking-widest text-[#67e8f9] uppercase"
             >
                <span>[ Suminagashi Engine Online ]</span>
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
