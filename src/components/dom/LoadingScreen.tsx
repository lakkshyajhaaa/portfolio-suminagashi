"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meddon } from "next/font/google";
import { usePathname } from "next/navigation";

const signatureFont = Meddon({ weight: '400', subsets: ['latin'] });

export default function LoadingScreen() {
  const { active, progress, total, loaded } = useProgress();
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(0);
  
  // Set to false to revert to the signature loading screen
  const useTerminalMode = true;

  // Unmount loading screen after animation completes and assets are loaded
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    let stepsTimer: NodeJS.Timeout;
    
    if (useTerminalMode) {
      stepsTimer = setInterval(() => {
        setStep((s) => s + 1);
      }, 400);
    }
    
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, useTerminalMode ? 4500 : 3200);

    return () => {
      clearTimeout(timer);
      if (stepsTimer) clearInterval(stepsTimer);
    };
  }, [useTerminalMode]);

  useEffect(() => {
    // Hide the loading screen only when the minimum time has passed AND assets are fully loaded
    if (minTimePassed && !active) {
      setShow(false);
    }
  }, [minTimePassed, active]);

  if (!useTerminalMode) {
    return (
      <AnimatePresence>
        {show && isHomepage && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#050505] text-white flex flex-col justify-center items-center pointer-events-auto cursor-wait overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 3.5, ease: "easeOut" }}
              className="w-full max-w-4xl px-8 flex justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <svg viewBox="0 0 800 200" className="w-full h-auto" style={{ overflow: 'visible' }}>
                <defs>
                  <mask id="writeMask" maskUnits="userSpaceOnUse" x="-1000" y="-1000" width="3000" height="3000">
                    <motion.g
                      initial={{ x: -550 }}
                      animate={{ x: 900 }}
                      transition={{ duration: 3.0, ease: "easeInOut" }}
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
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // TERMINAL MODE
  return (
    <AnimatePresence>
      {show && isHomepage && (
        <motion.div
          key="terminal-loading"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#050505] text-[#f0f0f0] font-mono text-[10px] sm:text-xs flex flex-col justify-start pointer-events-auto cursor-wait overflow-hidden p-8 sm:p-12 md:p-20"
        >
          <div className="flex flex-col gap-6 w-full max-w-3xl">
            {/* LOADING SECTION */}
            <div className="flex flex-col gap-2">
              <div className="text-gray-300">LOADING</div>
              <div className="text-gray-500">----------------------------------</div>
              
              <div className="flex flex-col gap-1 text-gray-400">
                {step > 0 && <div>Loading environment...</div>}
                {step > 1 && <div>Setting up WebGL environment...</div>}
                {step > 2 && <div>Optimizing render pipeline...</div>}
                {step > 3 && <div>Initializing hand input system...</div>}
                {step > 4 && <div className="text-white mt-1"> {">"} Just a moment...</div>}
              </div>

              {step > 2 && (
                <div className="mt-4 flex flex-col gap-2">
                  <div className="text-gray-300">Assets : {total > 0 ? loaded : Math.min((step - 2) * 5, 20)} / {total || 20}</div>
                  <div className="w-48 sm:w-64 h-[10px] border border-gray-500 p-[2px]">
                    <div 
                      className="h-full bg-gray-300" 
                      style={{ width: `${total > 0 ? (loaded / total) * 100 : Math.min((step - 2) * 20, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* WELCOME SECTION */}
            {step > 5 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-2 mt-4"
              >
                <div className="text-gray-300">WELCOME</div>
                <div className="text-gray-500">----------------------------------</div>
                <div className="flex flex-col gap-1 text-gray-400 font-bold">
                  <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] gap-2">
                    <span className="text-gray-400 font-normal">NAME</span>
                    <span>: Lakkshya Jha</span>
                  </div>
                  <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] gap-2">
                    <span className="text-gray-400 font-normal">ROLE</span>
                    <span>: Developer</span>
                  </div>
                  <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] gap-2">
                    <span className="text-gray-400 font-normal">FIELD</span>
                    <span>: Interactive / Website / CG</span>
                  </div>
                  <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] gap-2">
                    <span className="text-gray-400 font-normal">LIKE</span>
                    <span>: Design</span>
                  </div>
                  <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] gap-2">
                    <span className="text-gray-400 font-normal">FROM</span>
                    <span>: India</span>
                  </div>
                </div>
              </motion.div>
            )}

            {step > 7 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 text-gray-300"
              >
                Transitioning to scene...
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  _
                </motion.span>
              </motion.div>
            )}
          </div>
          
          {/* Functional barcode reading '120906' */}
          {step > 5 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.4, 0.7] }}
              transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
              className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 flex flex-col items-end gap-1 text-gray-300"
            >
              <svg viewBox="0 0 136 58" className="h-5 sm:h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path stroke="currentColor" strokeWidth="4" d="M2 58L2 0M28 58L28 0M46 58L46 0M74 58L74 0M90 58L90 0M112 58L112 0M134 58L134 0" />
                <path stroke="currentColor" strokeWidth="2" d="M7 58L7 0M23 58L23 0M53 58L53 0M59 58L59 0M67 58L67 0M81 58L81 0M99 58L99 0M129 58L129 0" />
                <path stroke="currentColor" strokeWidth="6" d="M15 58L15 0M37 58L37 0M105 58L105 0M123 58L123 0" />
              </svg>
              <div className="font-mono text-[8px] text-gray-500 tracking-[0.2em]">120906</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
