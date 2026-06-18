import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Lakkshya Jha",
  description: "Initiate communication.",
};

export default function Contact() {
  return (
    <main className="flex min-h-[100dvh] flex-col justify-between px-6 py-24 md:p-24 md:px-32 bg-transparent">
      
      {/* Top Section: Header */}
      <div className="flex flex-col w-full pointer-events-auto z-10 mix-blend-difference animate-fade-in">
        <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ffe4e6] uppercase drop-shadow-[0_0_5px_rgba(255,228,230,0.5)]">
          SAY HELLO //
        </span>
        <h1 className="font-sans text-[3rem] md:text-[6rem] tracking-[-0.05em] font-bold text-white leading-[0.8] mt-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          CONTACT.
        </h1>
      </div>

      {/* Center Section: Massive Interaction Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6 flex justify-center items-center pointer-events-auto z-10 mix-blend-difference animate-fade-in">
        <a 
          href="mailto:3127.lakkshyajha@gmail.com" 
          className="group relative flex flex-col items-center"
        >
          {/* Subtle top indicator */}
          <span className="font-sans text-[10px] tracking-widest text-[#ffe4e6] font-bold uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-[0_0_5px_rgba(255,228,230,0.5)]">
            SEND EMAIL ↘
          </span>
          
          <h2 className="font-sans text-[9vw] md:text-[8vw] tracking-tighter font-bold text-white whitespace-nowrap drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:text-[#ffe4e6] group-hover:drop-shadow-[0_0_30px_rgba(255,228,230,0.6)] transition-all duration-500 scale-y-110 group-hover:scale-y-100 group-hover:scale-x-105">
            CONNECT ON MAIL
          </h2>
          
          {/* Expanding underline */}
          <div className="w-0 h-[2px] bg-[#ffe4e6] group-hover:w-full transition-all duration-700 ease-out mt-2"></div>
        </a>
      </div>

      {/* Bottom Section: Technical Relays */}
      <div className="flex flex-col md:flex-row gap-8 pointer-events-auto z-10 mix-blend-difference animate-fade-in mt-auto">
        <div className="flex gap-8 border-t-[1px] border-white/20 pt-4">
          <a href="https://github.com/lakkshyajhaaa" target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] md:text-xs tracking-[0.2em] font-bold text-[#ffe4e6]/70 uppercase hover:text-[#ffe4e6] hover:drop-shadow-[0_0_8px_rgba(255,228,230,0.5)] transition-all">
            GITHUB //
          </a>
          <a href="https://linkedin.com/in/lakkshyajha" target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] md:text-xs tracking-[0.2em] font-bold text-[#ffe4e6]/70 uppercase hover:text-[#ffe4e6] hover:drop-shadow-[0_0_8px_rgba(255,228,230,0.5)] transition-all">
            LINKEDIN //
          </a>

        </div>
      </div>

    </main>
  );
}
