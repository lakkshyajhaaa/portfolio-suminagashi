import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lakkshya Jha | Computer Engineer • AI Systems & Developer Tools",
  description:
    "Computer Engineer building intelligent software, AI systems, and developer tools. Explore selected work, technical case studies, and engineering projects by Lakkshya Jha.",
  openGraph: {
    title: "Lakkshya Jha | Computer Engineer • AI Systems & Developer Tools",
    description:
      "Computer Engineer building intelligent software, AI systems, and developer tools.",
  },
  twitter: {
    title: "Lakkshya Jha | Computer Engineer • AI Systems & Developer Tools",
    description:
      "Computer Engineer building intelligent software, AI systems, and developer tools.",
  },
};

export default function Home() {
  return (
    <main className="relative min-h-[100dvh] w-full bg-transparent overflow-hidden flex flex-col justify-between p-6 md:p-24">
      {/* Brutalist Monolithic Hero Header (Top Left) */}
      <section
        aria-label="Introduction"
        className="absolute top-[80px] left-6 sm:top-24 sm:left-12 md:left-32 flex flex-col pointer-events-auto z-10 mix-blend-difference animate-fade-in max-w-[90vw] md:max-w-2xl"
      >
        <h1 className="font-sans text-[13vw] sm:text-[11vw] md:text-[7.5rem] lg:text-[9.5rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_2px_25px_rgba(0,0,0,0.9)] whitespace-nowrap">
          LAKKSHYA
        </h1>

        {/* Primary Professional Positioning Statement */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-white/90 font-normal leading-relaxed mt-4 sm:mt-5 max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
          Computer Engineer building intelligent software, AI systems, and developer tools.
        </p>

        {/* Supporting Tagline */}
        <span className="font-sans text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.35em] font-bold text-[#ff5500] uppercase mt-2 drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]">
          Building with clarity, intent &amp; love.
        </span>

        {/* Primary and Secondary Call-To-Action (Discoverable in < 5 seconds) */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2.5 font-sans text-xs tracking-[0.2em] font-bold uppercase text-black bg-white px-5 sm:px-6 py-3 border border-white hover:bg-[#ff5500] hover:text-white hover:border-[#ff5500] transition-all duration-300 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500]"
          >
            <span>View Selected Work</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] font-bold uppercase text-white/85 bg-black/30 border border-white/25 hover:border-white hover:text-white px-5 sm:px-6 py-3 backdrop-blur-sm transition-all duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500]"
          >
            <span>Contact Me</span>
          </Link>
        </div>
      </section>

      {/* Brutalist Monolithic Typography (Bottom Right) */}
      <section
        aria-label="Status & Identity"
        className="absolute bottom-[105px] right-6 sm:bottom-20 sm:right-12 md:bottom-24 md:right-16 flex flex-col items-end pointer-events-auto z-10 mix-blend-difference animate-fade-in"
      >
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5500] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5500]" />
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.35em] font-bold text-[#ff5500] uppercase drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]">
            Status // Active
          </span>
        </div>

        <h1 className="font-sans text-[15vw] sm:text-[12vw] md:text-[8rem] lg:text-[10rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_2px_25px_rgba(0,0,0,0.9)] whitespace-nowrap">
          JHA.
        </h1>
      </section>
    </main>
  );
}
