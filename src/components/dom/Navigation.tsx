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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex-row w-[92vw] max-w-sm justify-around bg-black/60 backdrop-blur-lg border border-white/15 px-3 py-1.5 rounded-full md:rounded-none md:bg-transparent md:backdrop-blur-none md:border-none md:p-0 md:left-8 md:top-1/2 md:-translate-y-1/2 md:-translate-x-0 md:bottom-auto md:w-auto md:gap-20 z-50 flex mix-blend-difference pointer-events-auto [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl] rotate-0 md:rotate-180"
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
                  ? "text-white underline underline-offset-[8px] decoration-white font-extrabold drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
                  : "text-[#ff5500] hover:text-white drop-shadow-[0_0_6px_rgba(255,85,0,0.6)]"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Desktop Brutalist HUD Controls */}
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
        } z-50 flex-col font-sans text-[10px] tracking-[0.2em] text-white/70 mix-blend-difference pointer-events-auto border border-white/20 uppercase bg-black/40 backdrop-blur-md transition-all duration-700 shadow-xl`}
      >
        <div className="flex border-b border-white/20 items-center justify-between px-3 py-2 text-white/50 text-[9px]">
          <span>CONTROLS</span>
          <button
            type="button"
            onClick={() => setShowControlsHelp(!showControlsHelp)}
            className="hover:text-white focus-visible:ring-1 focus-visible:ring-[#ff5500] rounded px-1 transition-colors"
            aria-label="Toggle Controls Help"
            title="What do these controls do?"
          >
            [ {showControlsHelp ? "CLOSE" : "INFO"} ]
          </button>
        </div>

        {showControlsHelp && (
          <div className="p-3 border-b border-white/20 max-w-xs text-[9px] lowercase tracking-normal text-white/90 normal-case bg-black/80 leading-relaxed font-sans">
            <p className="mb-1.5">
              <strong className="text-[#67e8f9] uppercase tracking-wider">Gesture Mode:</strong> Webcam-driven interaction. Point with your index finger to glide cursor, pinch to click, and hover near edges to scroll.
            </p>
            <p>
              <strong className="text-[#67e8f9] uppercase tracking-wider">Soundscape:</strong> Calming ambient vinyl soundscape with generative texture. OFF by default.
            </p>
          </div>
        )}

        <div className="flex">
          <button
            type="button"
            onClick={toggleCamera}
            role="switch"
            aria-checked={isCameraActive}
            aria-label="Toggle Webcam Gesture Control"
            className={`p-3 md:p-3.5 w-36 border-r border-white/20 text-left transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5500] ${
              isCameraActive ? "bg-white text-black font-bold" : "hover:bg-white/10 text-white"
            }`}
          >
            <span>GESTURE</span>
            <span className="font-mono text-[9px]">
              {isCameraLoading ? "..." : isCameraActive ? "ON" : "OFF"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            role="switch"
            aria-checked={!isMuted}
            aria-label="Toggle Ambient Soundscape Audio"
            className={`p-3 md:p-3.5 w-36 text-left transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5500] ${
              !isMuted ? "bg-white text-black font-bold" : "hover:bg-white/10 text-white"
            }`}
          >
            <span>AUDIO</span>
            <span className="font-mono text-[9px]">{isMuted ? "OFF" : "ON"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Audio Quick Toggle */}
      <div className="md:hidden fixed top-6 right-6 z-50 pointer-events-auto mix-blend-difference">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          role="switch"
          aria-checked={!isMuted}
          aria-label="Toggle Ambient Audio"
          className={`flex items-center gap-1.5 px-3 py-1.5 border border-white/25 rounded-full text-[9px] tracking-widest uppercase font-mono bg-black/50 backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] ${
            !isMuted ? "bg-white text-black font-bold border-white" : "text-white"
          }`}
        >
          <span>AUDIO:</span>
          <span>{isMuted ? "OFF" : "ON"}</span>
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

      {/* Top/Bottom Copyright Brand Badge */}
      <div className="fixed bottom-20 right-6 md:bottom-8 md:right-16 z-40 mix-blend-difference pointer-events-none font-sans text-[8px] md:text-[10px] tracking-widest text-white/40 text-right uppercase">
        © LAKKSHYA JHA
      </div>
    </>
  );
}
