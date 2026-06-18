"use client";

import Link from "next/link";
import { useTransitionMachine } from "@/lib/TransitionContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageRoute } from "@/lib/machine";
import { useSoundSystem } from "@/lib/useSoundSystem";
import { useHandTracking } from "@/lib/HandTrackingContext";
import { motion } from "framer-motion";

const navItems = [
  { label: "HOME", route: "home", href: "/" },
  { label: "ABOUT", route: "about", href: "/about" },
  { label: "WORK", route: "work", href: "/work" },
  { label: "CONTACT", route: "contact", href: "/contact" },
];

export default function Navigation() {
  const { state, navigate, send } = useTransitionMachine();
  const pathname = usePathname();
  const router = useRouter();
  const { isMuted, setIsMuted } = useSoundSystem(state.value);

  useEffect(() => {
    if (state.value === "void" && state.context.targetRoute) {
      const targetItem = navItems.find((i) => i.route === state.context.targetRoute);
      if (targetItem) {
        router.push(targetItem.href);
        setTimeout(() => {
          send({ type: "ANIMATION_END" });
          setTimeout(() => {
            send({ type: "ANIMATION_END" });
            setTimeout(() => {
              send({ type: "ANIMATION_END" });
              setTimeout(() => {
                 send({ type: "ANIMATION_END" });
              }, 800);
            }, 800);
          }, 800);
        }, 500);
      }
    }
  }, [state.value, state.context.targetRoute, router, send]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, route: PageRoute, href: string) => {
    e.preventDefault();
    if (pathname === href) return;
    
    navigate(route);
    setTimeout(() => {
      send({ type: "ANIMATION_END" });
      setTimeout(() => {
        send({ type: "ANIMATION_END" });
        setTimeout(() => {
          send({ type: "ANIMATION_END" });
        }, 800);
      }, 600);
    }, 400);
  };

  const isTransitioning = state.value !== "idle";
  const { isCameraActive, toggleCamera } = useHandTracking();

  return (
    <>
      {/* Brutalist Vertical Spine (Navigation) */}
      <nav 
        className="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 z-50 flex gap-12 md:gap-24 mix-blend-difference pointer-events-auto"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isTarget = state.context.targetRoute === item.route;
          
          let opacityClass = "opacity-100";
          if (isTransitioning && !isTarget && !isActive) {
            opacityClass = "opacity-0 pointer-events-none";
          }

          return (
            <a
              key={item.route}
              href={item.href}
              onClick={(e) => handleNav(e, item.route as PageRoute, item.href)}
              className={`font-sans text-[10px] md:text-xs tracking-[0.4em] font-bold uppercase transition-all duration-700 ${opacityClass} ${isActive ? "text-white underline underline-offset-[8px] decoration-white/50 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-[#ff5500] hover:text-white drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]"}`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Brutalist Grid HUD (Controls) */}
      <div className={`fixed ${
        pathname === "/" ? "top-8 right-8" :
        pathname === "/work" ? "top-8 left-1/2 -translate-x-1/2" :
        pathname === "/about" ? "top-8 left-[40%] -translate-x-1/2" :
        "top-8 right-8" // contact or others
      } z-50 flex flex-col font-sans text-[9px] md:text-[10px] tracking-[0.2em] text-white/50 mix-blend-difference pointer-events-auto border-[1px] border-white/20 uppercase bg-black/20 backdrop-blur-md transition-all duration-700`}>
        <div className="flex border-b-[1px] border-white/20">
          <div className="p-3 md:p-4 border-r-[1px] border-white/20 w-24 md:w-32">controls</div>
          <div className="p-3 md:p-4 w-24 md:w-32 flex justify-end">opt</div>
        </div>
        <div className="flex">
          <button 
            onClick={toggleCamera} 
            className={`p-3 md:p-4 w-24 md:w-32 border-r-[1px] border-white/20 text-left transition-colors ${isCameraActive ? 'bg-white text-black' : 'hover:bg-white/10 text-white'}`}
          >
            Hand: {isCameraActive ? "ON" : "OFF"}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className={`p-3 md:p-4 w-24 md:w-32 text-left transition-colors ${!isMuted ? 'bg-white text-black' : 'hover:bg-white/10 text-white'}`}
          >
            Audio: {isMuted ? "OFF" : "ON"}
          </button>
        </div>
      </div>

      {/* Top Left Logo Mark (LJ Monogram) */}
      <div className="fixed top-8 left-6 md:left-10 z-50 mix-blend-difference pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
          {/* L */}
          <path d="M2 2 H6 V14 H14 V18 H2 Z" />
          {/* J */}
          <path d="M22 22 H18 V10 H10 V6 H22 Z" />
        </svg>
      </div>
      
      {/* Copyright */}
      <div className="fixed bottom-8 right-8 md:right-16 z-50 mix-blend-difference pointer-events-none font-sans text-[10px] tracking-widest text-white/30">
        ©LAKKSHYA JHA
      </div>
    </>
  );
}
