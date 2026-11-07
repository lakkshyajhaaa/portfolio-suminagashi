"use client";

import { useState } from "react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "3127.lakkshyajha@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col justify-between px-6 py-24 sm:px-10 md:p-24 md:px-32 bg-transparent overflow-x-hidden">
      {/* Top Section: Header */}
      <header className="flex flex-col w-full pointer-events-auto">
        <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] font-bold text-[#ff5500] uppercase drop-shadow-[0_0_8px_rgba(255,85,0,0.6)] z-10 animate-fade-in">
          COMMUNICATION // DIRECT DISPATCH
        </span>
        <h1 className="font-sans text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] tracking-[-0.05em] font-bold text-white leading-[0.8] mt-3 drop-shadow-[0_2px_20px_rgba(0,0,0,0.95)] mix-blend-difference z-10 animate-fade-in">
          CONTACT.
        </h1>
        <p className="font-sans text-xs sm:text-sm text-white/70 max-w-sm mt-3 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Available for software engineering roles, technical collaboration, and systems research.
        </p>
      </header>

      {/* Center Section: Primary Action Node */}
      <section aria-label="Direct Email" className="w-full flex-grow flex flex-col justify-center items-center pointer-events-auto z-10 mix-blend-difference animate-fade-in py-16">
        <div className="flex flex-col items-center">
          <a
            href={`mailto:${email}`}
            className="group relative flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded p-2"
          >
            {/* Top Indicator */}
            <span className="font-sans text-[10px] tracking-[0.3em] text-[#67e8f9] font-bold uppercase mb-2 drop-shadow-[0_0_8px_rgba(103,232,249,0.6)]">
              PRIMARY DISPATCH ↘
            </span>

            {/* Massive Email Trigger Title */}
            <h2 className="font-sans text-[8.5vw] sm:text-[7vw] md:text-[6.5vw] tracking-tight font-bold text-white whitespace-nowrap drop-shadow-[0_2px_25px_rgba(0,0,0,0.9)] group-hover:text-[#ff5500] group-hover:drop-shadow-[0_0_30px_rgba(255,85,0,0.6)] transition-all duration-300">
              CONNECT ON MAIL
            </h2>

            {/* Visible Raw Email Address */}
            <span className="font-mono text-xs sm:text-sm md:text-base text-white/80 group-hover:text-white mt-1 transition-colors">
              {email}
            </span>

            {/* Expanding Underline */}
            <div className="w-12 h-[2px] bg-white/40 group-hover:w-full group-hover:bg-[#ff5500] transition-all duration-500 ease-out mt-3" />
          </a>

          {/* Quick Copy Email Action */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="mt-4 font-mono text-[10px] tracking-widest uppercase text-white/60 hover:text-white border border-white/20 hover:border-white/50 px-4 py-1.5 rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500]"
          >
            {copied ? "✓ COPIED TO CLIPBOARD" : "COPY EMAIL ADDRESS"}
          </button>
        </div>

        {/* Secondary Verified Channels */}
        <div className="flex flex-wrap justify-center gap-10 sm:gap-16 md:gap-24 mt-16 sm:mt-20">
          <a
            href="https://github.com/lakkshyajhaaa"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded p-2"
          >
            <span className="font-sans text-[9px] md:text-[10px] tracking-widest text-white/50 font-bold uppercase mb-1 group-hover:text-[#67e8f9] transition-colors">
              REPOSITORIES ↗
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight font-bold text-white/80 group-hover:text-white transition-colors">
              GITHUB
            </h3>
            <div className="w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300 mt-1" />
          </a>

          <a
            href="https://www.linkedin.com/in/lakkshyajha"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded p-2"
          >
            <span className="font-sans text-[9px] md:text-[10px] tracking-widest text-white/50 font-bold uppercase mb-1 group-hover:text-[#67e8f9] transition-colors">
              NETWORK ↗
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight font-bold text-white/80 group-hover:text-white transition-colors">
              LINKEDIN
            </h3>
            <div className="w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300 mt-1" />
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded p-2"
          >
            <span className="font-sans text-[9px] md:text-[10px] tracking-widest text-white/50 font-bold uppercase mb-1 group-hover:text-[#67e8f9] transition-colors">
              DOCUMENT ↘
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight font-bold text-white/80 group-hover:text-white transition-colors">
              RESUME
            </h3>
            <div className="w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300 mt-1" />
          </a>
        </div>
      </section>

      {/* Bottom Dispatch Availability */}
      <footer className="w-full flex justify-between items-center text-[10px] tracking-widest text-white/40 uppercase font-mono border-t border-white/10 pt-4">
        <span>LOCATION: PUNJAB, INDIA</span>
        <span>TIMEZONE: UTC+05:30</span>
      </footer>
    </main>
  );
}
