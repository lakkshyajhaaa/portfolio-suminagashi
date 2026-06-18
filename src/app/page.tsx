import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lakkshya Jha",
  description: "Creative engineering and physical simulations.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-transparent">
      {/* Brutalist Monolithic Typography (Top Left) */}
      <div className="absolute top-[80px] left-6 md:top-24 md:left-32 flex flex-col pointer-events-auto z-10 mix-blend-difference animate-fade-in">
        <h1 className="font-sans text-[11vw] md:text-[8rem] lg:text-[10rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
          LAKKSHYA
        </h1>
        <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase ml-2 mt-4 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
          Architect // System Design
        </span>
      </div>

      {/* Brutalist Monolithic Typography (Bottom Right) */}
      <div className="absolute bottom-[100px] right-6 md:bottom-24 md:right-16 flex flex-col items-end pointer-events-auto z-10 mix-blend-difference animate-fade-in">
        <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mr-2 mb-4 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
          Status // Active
        </span>
        <h1 className="font-sans text-[14vw] md:text-[8rem] lg:text-[10rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
          JHA.
        </h1>
      </div>
    </main>
  );
}
