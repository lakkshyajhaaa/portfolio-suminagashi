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
      <div className="w-full flex-grow flex flex-col justify-center items-center pointer-events-auto z-10 mix-blend-difference animate-fade-in">
        <a 
          href="mailto:3127.lakkshyajha@gmail.com" 
          className="group relative flex flex-col items-center mt-12 md:mt-32"
        >
          {/* Subtle top indicator */}
          <span className="font-sans text-[10px] tracking-widest text-[#ffe4e6] font-bold uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-[0_0_5px_rgba(255,228,230,0.5)] absolute -top-8">
            SEND EMAIL ↘
          </span>
          
          <h2 className="font-sans text-[9vw] md:text-[8vw] tracking-tighter font-bold text-white whitespace-nowrap drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:text-[#ffe4e6] group-hover:drop-shadow-[0_0_30px_rgba(255,228,230,0.6)] transition-all duration-500 scale-y-110 group-hover:scale-y-100 group-hover:scale-x-105">
            CONNECT ON MAIL
          </h2>
          
          {/* Expanding underline */}
          <div className="w-0 h-[2px] bg-[#ffe4e6] group-hover:w-full transition-all duration-700 ease-out mt-4 md:mt-6"></div>
        </a>

        {/* Secondary Social Links integrated below the primary action */}
        <div className="flex flex-row gap-16 md:gap-32 mt-16 md:mt-24">
          <a 
            href="https://github.com/lakkshyajhaaa" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex flex-col items-center"
          >
            <span className="font-sans text-[8px] md:text-[10px] tracking-widest text-[#ffe4e6]/50 font-bold uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute -top-6">
              VIEW REPOS ↘
            </span>
            <h3 className="font-sans text-[6vw] md:text-[4vw] tracking-tighter font-bold text-white/70 whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:text-[#ffe4e6] group-hover:drop-shadow-[0_0_20px_rgba(255,228,230,0.5)] transition-all duration-500 scale-y-110 group-hover:scale-y-100 group-hover:scale-x-105">
              GITHUB
            </h3>
            <div className="w-0 h-[1px] bg-[#ffe4e6]/70 group-hover:w-full transition-all duration-700 ease-out mt-1"></div>
          </a>

          <a 
            href="https://linkedin.com/in/lakkshyajha" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex flex-col items-center"
          >
            <span className="font-sans text-[8px] md:text-[10px] tracking-widest text-[#ffe4e6]/50 font-bold uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute -top-6">
              PROFESSIONAL ↘
            </span>
            <h3 className="font-sans text-[6vw] md:text-[4vw] tracking-tighter font-bold text-white/70 whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:text-[#ffe4e6] group-hover:drop-shadow-[0_0_20px_rgba(255,228,230,0.5)] transition-all duration-500 scale-y-110 group-hover:scale-y-100 group-hover:scale-x-105">
              LINKEDIN
            </h3>
            <div className="w-0 h-[1px] bg-[#ffe4e6]/70 group-hover:w-full transition-all duration-700 ease-out mt-1"></div>
          </a>
        </div>
      </div>

    </main>
  );
}
