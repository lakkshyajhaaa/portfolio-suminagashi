"use client";

import Link from "next/link";
import { useTransitionMachine } from "@/lib/TransitionContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageRoute } from "@/lib/machine";
import { useSoundSystem } from "@/lib/useSoundSystem";
import { useHandTracking } from "@/lib/HandTrackingContext";

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
  const { isCameraActive, toggleCamera, isLoading: isCameraLoading } = useHandTracking();

  const [showControlsHelp, setShowControlsHelp] = useState(false);

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

  return (
    <>
      {/* Primary Navigation Spine (Vertical on Desktop, Bottom Dock on Mobile) */}
      <nav
        aria-label="Main Navigation"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex-row w-[92vw] max-w-sm justify-around bg-black/60 backdrop-blur-lg border border-white/15 px-3 py-1.5 rounded-full md:rounded-none md:bg-transparent md:backdrop-blur-none md:border-none md:p-0 md:left-8 md:top-1/2 md:-translate-y-1/2 md:-translate-x-0 md:bottom-auto md:w-auto md:gap-20 z-50 flex pointer-events-auto [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl] rotate-0 md:rotate-180"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/work" && pathname.startsWith("/work/"));
          const isTarget = state.context.targetRoute === item.route;

          let opacityClass = "opacity-100";
          if (isTransitioning && !isTarget && !isActive) {
            opacityClass = "opacity-0 pointer-events-none";
          }

          return (
            <a
              key={item.route}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={(e) => handleNav(e, item.route as PageRoute, item.href)}
              className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center font-sans text-[11px] md:text-xs tracking-[0.35em] font-bold uppercase transition-all duration-500 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] ${opacityClass} ${
                isActive
                  ? "text-white underline underline-offset-[8px] decoration-[#ff5500] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                  : "text-white/80 hover:text-white transition-colors font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Desktop Brutalist Controls HUD - High Contrast & Crystal Clear Visibility */}
      <aside
        aria-label="Experience Controls"
        className={`hidden md:flex fixed ${
          pathname === "/"
            ? "top-8 right-8"
            : pathname.startsWith("/work")
            ? "top-8 left-1/2 -translate-x-1/2"
            : pathname === "/about"
            ? "top-8 left-[40%] -translate-x-1/2"
            : "top-8 right-8"
        } z-50 flex-col font-sans text-[10px] tracking-[0.2em] pointer-events-auto border border-white/30 uppercase bg-[#09090b]/95 backdrop-blur-2xl transition-all duration-700 shadow-2xl`}
      >
        <div className="flex border-b border-white/20 items-center justify-between px-3.5 py-2 text-white/70 text-[9px] bg-white/5">
          <span className="font-mono tracking-widest text-white/80">CONTROLS</span>
          <button
            type="button"
            onClick={() => setShowControlsHelp(!showControlsHelp)}
            className="text-[#67e8f9] hover:text-white focus-visible:ring-1 focus-visible:ring-[#ff5500] rounded px-1 transition-colors font-mono font-bold"
            aria-label="Toggle Controls Help"
            title="What do these controls do?"
          >
            [ {showControlsHelp ? "CLOSE" : "INFO"} ]
          </button>
        </div>

        {showControlsHelp && (
          <div className="p-4 border-b border-white/20 max-w-xs text-xs text-white/95 normal-case bg-[#111116] leading-relaxed font-sans shadow-inner">
            <p className="mb-2">
              <strong className="text-[#ff5500] uppercase tracking-wider font-bold">Gesture Mode:</strong> Webcam-driven interaction. Point your index finger to glide cursor, pinch to click, and hover near edges to scroll.
            </p>
            <p>
              <strong className="text-[#67e8f9] uppercase tracking-wider font-bold">Soundscape:</strong> Calming ambient vinyl soundscape with generative texture. OFF by default.
            </p>
          </div>
        )}

        <div className="flex">
          {/* GESTURE TOGGLE BUTTON */}
          <button
            type="button"
            onClick={toggleCamera}
            role="switch"
            aria-checked={isCameraActive}
            aria-label="Toggle Webcam Gesture Control"
            className={`p-3.5 w-36 border-r border-white/20 text-left transition-all flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] ${
              isCameraActive
                ? "bg-[#ff5500] text-black font-extrabold shadow-[0_0_15px_rgba(255,85,0,0.6)]"
                : "bg-transparent hover:bg-white/10 text-white"
            }`}
          >
            <span className="font-bold text-xs tracking-wider">GESTURE</span>
            <span
              className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                isCameraLoading
                  ? "text-[#67e8f9] animate-pulse"
                  : isCameraActive
                  ? "bg-black text-[#ff5500] font-black"
                  : "text-[#ff5500] border border-[#ff5500]/40 bg-[#ff5500]/10"
              }`}
            >
              {isCameraLoading ? "INIT..." : isCameraActive ? "ON" : "OFF"}
            </span>
          </button>

          {/* AUDIO TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            role="switch"
            aria-checked={!isMuted}
            aria-label="Toggle Ambient Soundscape Audio"
            className={`p-3.5 w-36 text-left transition-all flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] ${
              !isMuted
                ? "bg-white text-black font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                : "bg-transparent hover:bg-white/10 text-white"
            }`}
          >
            <span className="font-bold text-xs tracking-wider">AUDIO</span>
            <span
              className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                !isMuted
                  ? "bg-black text-white font-black"
                  : "text-white/60 border border-white/20 bg-white/5"
              }`}
            >
              {isMuted ? "OFF" : "ON"}
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Audio Quick Toggle */}
      <div className="md:hidden fixed top-6 right-6 z-50 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          role="switch"
          aria-checked={!isMuted}
          aria-label="Toggle Ambient Audio"
          className={`flex items-center gap-1.5 px-3 py-1.5 border border-white/30 rounded-full text-[9px] tracking-widest uppercase font-mono bg-[#09090b]/95 backdrop-blur-xl text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] shadow-xl ${
            !isMuted ? "bg-white text-black font-bold border-white" : ""
          }`}
        >
          <span>AUDIO:</span>
          <span className={!isMuted ? "text-black font-bold" : "text-[#ff5500] font-bold"}>
            {isMuted ? "OFF" : "ON"}
          </span>
        </button>
      </div>

      {/* Top Left Logo Mark (LJ Monogram with home link) */}
      <div className="fixed top-6 left-6 md:top-8 md:left-10 z-50 mix-blend-difference pointer-events-auto">
        <Link
          href="/"
          aria-label="Lakkshya Jha Homepage"
          className="group block p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          >
            {/* L */}
            <path d="M2 2 H6 V14 H14 V18 H2 Z" />
            {/* J */}
            <path d="M22 22 H18 V10 H10 V6 H22 Z" />
          </svg>
        </Link>
      </div>

      {/* Bottom Copyright Brand Badge */}
      <div className="fixed bottom-20 right-6 md:bottom-8 md:right-16 z-40 pointer-events-none font-mono text-[8px] md:text-[10px] tracking-widest text-white/60 text-right uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
        © LAKKSHYA JHA
      </div>
    </>
  );
}
