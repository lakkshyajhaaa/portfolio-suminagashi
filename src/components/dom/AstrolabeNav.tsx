"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PageRoute } from "@/lib/machine";

interface NavItem {
  label: string;
  route: PageRoute;
  href: string;
}

const navItems: NavItem[] = [
  { label: "TOME I: HOME", route: "home", href: "/" },
  { label: "TOME II: WORK", route: "work", href: "/work" },
  { label: "TOME III: ABOUT", route: "about", href: "/about" },
  { label: "TOME IV: CONTACT", route: "contact", href: "/contact" },
];

export default function AstrolabeNav({
  isTransitioning,
  targetRoute,
  onNavigate
}: {
  isTransitioning: boolean;
  targetRoute: string | null;
  onNavigate: (e: React.MouseEvent, route: PageRoute, href: string) => void;
}) {
  const pathname = usePathname();
  
  const activeIndex = navItems.findIndex(i => pathname === i.href);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const displayIndex = hoverIndex !== null ? hoverIndex : (activeIndex === -1 ? 0 : activeIndex);
  
  // We want the active item to always point at 45 degrees (up-right).
  // The items are spaced by 30 degrees.
  const wheelRotation = 45 - (displayIndex * 30);

  return (
    <div className="fixed -bottom-48 -left-48 w-[500px] h-[500px] z-50 pointer-events-none">
      {/* The target lens (Static indicator at 45 deg) */}
      <div 
        className="absolute top-0 left-1/2 w-[1px] h-[50%] origin-bottom bg-gradient-to-b from-transparent via-[#ffd700]/50 to-transparent mix-blend-screen"
        style={{ transform: `translateX(-50%) rotate(45deg)` }}
      >
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-3 h-3 border-[1px] border-[#ffd700] rounded-full" />
      </div>

      {/* The Rotating Astrolabe Rings */}
      <motion.div 
        className="absolute inset-0 rounded-full border-[1px] border-white/10 border-dashed pointer-events-auto"
        animate={{ rotate: wheelRotation }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {/* Decorative concentric rings */}
        <div className="absolute inset-[10%] rounded-full border-[1px] border-white/5" />
        <div className="absolute inset-[25%] rounded-full border-[1px] border-[#ffd700]/10 border-dashed" />
        <div className="absolute inset-[40%] rounded-full border-[1px] border-white/5" />
        
        {/* Navigation Nodes */}
        {navItems.map((item, i) => {
          const angle = i * 30;
          
          return (
            <div 
              key={item.route}
              className="absolute top-0 left-1/2 w-10 h-[50%] origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
            >
              <a
                href={item.href}
                onClick={(e) => onNavigate(e, item.route, item.href)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                // We rotate the text the opposite way so it remains perfectly horizontal
                className="absolute top-[10%] left-1/2 flex items-center justify-start group cursor-pointer w-48"
                style={{ transform: `translate(-50%, -50%) rotate(${-angle - wheelRotation}deg)` }}
              >
                <div className={`flex items-center gap-6 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                  {/* Node point */}
                  <div className="relative flex items-center justify-center w-6 h-6">
                    <div className={`absolute w-full h-full rounded-full transition-all duration-700 ${pathname === item.href || hoverIndex === i ? 'border-[1px] border-[#ffd700] scale-100 opacity-100' : 'border-[1px] border-white/30 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${pathname === item.href ? 'bg-[#ffd700] shadow-[0_0_15px_#ffd700]' : 'bg-white/40 group-hover:bg-white'}`} />
                  </div>
                  
                  {/* Label */}
                  <span className={`font-serif text-[10px] md:text-xs tracking-[0.4em] transition-all duration-300 ${pathname === item.href ? 'text-[#ffd700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'text-white/40 group-hover:text-white group-hover:translate-x-2'}`}>
                    {item.label}
                  </span>
                </div>
              </a>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
