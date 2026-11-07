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

        {/* Supporting Tagline: Vibrant high-contrast #ff5500 orange with deep shadows for crystal clear visibility */}
        <span className="font-sans text-[11px] md:text-xs tracking-[0.35em] font-extrabold text-[#ff5500] uppercase ml-2 mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_10px_rgba(0,0,0,0.95)]">
          building with clarity, intent &amp; love
        </span>

        {/* The Two Action Buttons: Clean underline style with high-contrast orange accent */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 ml-2 mt-6">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-sans text-xs md:text-sm tracking-[0.25em] font-bold uppercase text-white hover:text-[#ff5500] border-b-2 border-[#ff5500] pb-1 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_12px_rgba(0,0,0,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500]"
          >
            <span>View Selected Work</span>
            <span className="text-[#ff5500] group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-xs md:text-sm tracking-[0.25em] font-bold uppercase text-white/90 hover:text-[#ff5500] border-b border-white/60 hover:border-[#ff5500] pb-1 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_10px_rgba(0,0,0,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500]"
          >
            <span>Contact Me</span>
          </Link>
        </div>
      </div>

      {/* Brutalist Monolithic Typography (Bottom Right) */}
      <div className="absolute bottom-[100px] right-6 md:bottom-24 md:right-16 flex flex-col items-end pointer-events-auto z-10 animate-fade-in">
        {/* Status: Vibrant high-contrast #ff5500 orange with deep shadows */}
        <div className="flex items-center gap-2 mr-2 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_0_10px_rgba(0,0,0,0.95)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5500] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5500]" />
          </span>
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.35em] font-bold text-[#ff5500] uppercase">
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
