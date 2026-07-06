"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Work() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Failed to load projects", err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-transparent">
      
      {/* Brutalist Directory Header */}
      <div className="absolute top-[80px] left-6 md:top-24 md:left-32 flex flex-col pointer-events-auto z-10 mix-blend-difference animate-fade-in">
        <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
          WORK // SELECTED PROJECTS
        </span>
        <h1 className="font-sans text-[3.5rem] md:text-[6rem] tracking-[-0.05em] font-bold text-white leading-[0.8] mt-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          INDEX.
        </h1>
      </div>

      {/* Massive Project List (Right Aligned) */}
      <div className="absolute top-[200px] md:top-[120px] right-6 md:right-16 flex flex-col items-end gap-4 md:gap-8 pointer-events-auto z-10 mix-blend-difference animate-fade-in w-full max-w-[90vw] md:max-w-[80vw] pb-32">
        {projects.map((project) => (
          <Link key={project.id} href={`/work/${project.slug}`} className="flex flex-col items-end group cursor-pointer transition-transform duration-500 hover:-translate-x-2 md:hover:-translate-x-8">
            <div className="flex flex-col md:flex-row items-end md:items-baseline gap-1 md:gap-8">
              <span className="font-sans text-[8px] md:text-[10px] tracking-widest text-[#ff5500] font-bold mb-1 md:mb-6 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
                {project.id} // {project.type} // {project.status}
              </span>
              <h2 className="font-sans text-[8vw] sm:text-[10vw] md:text-[6rem] lg:text-[7.5rem] tracking-[-0.05em] font-bold text-white/90 leading-[0.85] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:text-[#f3e8ff] group-hover:drop-shadow-[0_0_25px_rgba(243,232,255,0.6)] transition-all duration-300 whitespace-nowrap">
                {project.name}
              </h2>
            </div>
            {/* Subtle underline that expands on hover */}
            <div className="w-0 h-[2px] bg-[#f3e8ff] group-hover:w-[105%] transition-all duration-700 ease-out mt-1 md:mt-2"></div>
          </Link>
        ))}
      </div>
      
    </main>
  );
}
