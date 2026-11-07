import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lakkshya Jha | AI Engineer • Full-Stack Developer • Computer Engineering Student",
  description: "Computer Engineering student at Thapar Institute of Engineering & Technology. Explore AI/ML projects, full-stack web development, UI/UX design, open-source contributions, research, and technical leadership by Lakkshya Jha.",
  openGraph: {
    title: "Lakkshya Jha | AI Engineer • Full-Stack Developer",
    description: "Computer Engineering student at Thapar Institute showcasing AI/ML, full-stack development, research, design, and open-source projects.",
  },
  twitter: {
    title: "Lakkshya Jha | AI Engineer • Full-Stack Developer",
    description: "Portfolio of Lakkshya Jha featuring AI, software engineering, full-stack development, research, and design.",
  }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-transparent">
      {/* Brutalist Monolithic Typography (Top Left) - In-line with top logo & controls */}
      <div className="absolute top-16 left-6 md:top-8 md:left-32 flex flex-col pointer-events-auto z-10 animate-fade-in">
        {/* Massive title maintains signature mix-blend-difference inversion */}
        <h1 className="font-sans text-[11vw] md:text-[8rem] lg:text-[10rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] mix-blend-difference whitespace-nowrap">
          LAKKSHYA
        </h1>

        {/* Supporting Tagline: Vibrant #ff5500, crystal clear visibility without color-inverting */}
        <div className="mt-3.5 ml-1 w-fit">
          <span className="inline-flex items-center font-mono text-[10px] md:text-[11px] tracking-[0.35em] font-bold text-[#ff5500] uppercase px-3 py-1 bg-[#09090b]/85 backdrop-blur-md border border-white/15 rounded shadow-xl">
            building with clarity, intent &amp; love
          </span>
        </div>

        {/* The Two Action Buttons: Clean underline style with dark frosted backdrop for 100% legibility */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 ml-1">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-sans text-xs tracking-[0.25em] font-bold uppercase text-white hover:text-[#ff5500] bg-[#09090b]/85 hover:bg-[#09090b] backdrop-blur-md px-4 py-2 border-b-2 border-white hover:border-[#ff5500] transition-all duration-300 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded-t-sm"
          >
            <span>View Selected Work</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.25em] font-bold uppercase text-white/80 hover:text-white bg-[#09090b]/75 hover:bg-[#09090b] backdrop-blur-md px-4 py-2 border-b border-white/40 hover:border-white transition-all duration-300 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded-t-sm"
          >
            <span>Contact Me</span>
          </Link>
        </div>
      </div>

      {/* Brutalist Monolithic Typography (Bottom Right) */}
      <div className="absolute bottom-[100px] right-6 md:bottom-24 md:right-16 flex flex-col items-end pointer-events-auto z-10 animate-fade-in">
        {/* Status Pill: Vibrant #ff5500, 100% legible without inverting */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#09090b]/85 backdrop-blur-md border border-white/15 rounded shadow-xl mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5500] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5500]" />
          </span>
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] font-bold text-[#ff5500] uppercase">
            Status // Active
          </span>
        </div>

        <h1 className="font-sans text-[14vw] md:text-[8rem] lg:text-[10rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] mix-blend-difference whitespace-nowrap">
          JHA.
        </h1>
      </div>
    </main>
  );
}
