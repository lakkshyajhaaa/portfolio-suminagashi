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
      <div className="absolute top-16 left-6 md:top-8 md:left-32 flex flex-col pointer-events-auto z-10 mix-blend-difference animate-fade-in">
        {/* Massive title with metallic drop shadow */}
        <h1 className="font-sans text-[11vw] md:text-[8rem] lg:text-[10rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] whitespace-nowrap">
          LAKKSHYA
        </h1>

        {/* Supporting Tagline: Vibrant blue-orange gradient with high readability */}
        <span className="font-sans text-xs md:text-sm tracking-[0.25em] md:tracking-[0.3em] font-black text-[#ff6600] uppercase ml-2 mt-4 drop-shadow-[0_0_1px_rgba(255,255,255,0.9)] drop-shadow-[0_0_8px_rgba(255,102,0,0.6)]">
          building with clarity, intent &amp; love
        </span>

        {/* The Two Action Buttons */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 ml-2 mt-6">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-sans text-xs tracking-[0.25em] font-bold uppercase text-white hover:text-[#ff6600] border-b-2 border-white hover:border-[#ff6600] pb-1 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600]"
          >
            <span>View Selected Work</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.25em] font-bold uppercase text-white/70 hover:text-white border-b border-white/40 hover:border-white pb-1 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6600]"
          >
            <span>Contact Me</span>
          </Link>
        </div>
      </div>

      {/* Brutalist Monolithic Typography (Bottom Right) */}
      <div className="absolute bottom-[100px] right-6 md:bottom-24 md:right-16 flex flex-col items-end pointer-events-auto z-10 mix-blend-difference animate-fade-in">
        <span className="font-sans text-xs md:text-sm tracking-[0.25em] md:tracking-[0.3em] font-black text-[#ff6600] uppercase mr-2 mb-4 drop-shadow-[0_0_1px_rgba(255,255,255,0.9)] drop-shadow-[0_0_8px_rgba(255,102,0,0.6)]">
          Status // Active
        </span>
        <h1 className="font-sans text-[14vw] md:text-[8rem] lg:text-[10rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] whitespace-nowrap">
          JHA.
        </h1>
      </div>
    </main>
  );
}
