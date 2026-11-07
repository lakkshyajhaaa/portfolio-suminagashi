import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work // Selected Projects | Lakkshya Jha",
  description:
    "Explore selected projects in AI systems, high-concurrency platforms, research portals, and open-source contributions by Lakkshya Jha.",
};

interface ProjectMeta {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category?: string;
  type?: string;
  status: string;
  role?: string;
  timeline?: string;
  techStack?: string[];
  description?: string;
}

function getProjects(): ProjectMeta[] {
  const projectsDir = path.join(process.cwd(), "src", "projects");
  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir);
  return files
    .filter((f) => !f.startsWith("_") && (f.endsWith(".mdx") || f.endsWith(".md")))
    .map((file) => {
      const fullPath = path.join(projectsDir, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return data as ProjectMeta;
    })
    .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
}

export default function Work() {
  const projects = getProjects();

  return (
    <main className="flex min-h-screen flex-col justify-start p-6 sm:p-10 md:p-24 bg-transparent overflow-x-hidden">
      {/* Brutalist Directory Header */}
      <header className="absolute top-[80px] left-6 md:top-24 md:left-32 flex flex-col pointer-events-auto z-10 mix-blend-difference">
        <span className="font-sans text-xs md:text-sm tracking-[0.25em] md:tracking-[0.3em] font-black text-[#ff6600] uppercase drop-shadow-[0_0_1px_rgba(255,255,255,0.9)] drop-shadow-[0_0_8px_rgba(255,102,0,0.6)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] animate-fade-in">
          WORK // SELECTED SYSTEMS
        </span>
        <h1 className="font-sans text-[3rem] sm:text-[4.5rem] md:text-[6rem] tracking-[-0.05em] font-bold text-white leading-[0.85] mt-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-fade-in">
          INDEX.
        </h1>
        <p className="font-sans text-xs sm:text-sm text-white/70 max-w-xs md:max-w-sm mt-3 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Architectural systems, uncertainty-aware AI, full-stack platforms, and open-source contributions.
        </p>
      </header>

      {/* Structured Vertical Project Listing */}
      <section
        aria-label="Selected Projects List"
        className="mt-[280px] md:mt-[140px] ml-auto w-full max-w-full md:max-w-[70vw] lg:max-w-[65vw] flex flex-col gap-10 md:gap-14 pointer-events-auto z-10 pb-36"
      >
        {projects.map((project) => (
          <article
            key={project.id}
            className="group relative border-b border-white/15 pb-8 md:pb-10 transition-transform duration-500 hover:-translate-x-1 md:hover:-translate-x-3"
          >
            <Link
              href={`/work/${project.slug}`}
              className="flex flex-col items-end text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded p-2"
            >
              {/* Top Meta Line: Number, Category, Status */}
              <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 mb-2">
                <span className="font-mono text-xs md:text-sm tracking-widest text-[#ff5500] font-bold drop-shadow-[0_0_6px_rgba(255,85,0,0.6)]">
                  {project.id}
                </span>
                <span className="text-white/30 text-xs">{"//"}</span>
                <span className="font-sans text-[10px] md:text-xs tracking-[0.25em] text-[#67e8f9] font-semibold uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                  {project.category || project.type}
                </span>
                <span className="text-white/30 text-xs">{"//"}</span>
                <span className="font-sans text-[9px] md:text-[10px] tracking-widest text-white/50 uppercase">
                  {project.status}
                </span>
              </div>

              {/* Massive Monolithic Title - Strictly whitespace-nowrap */}
              <h2 className="font-sans text-[10vw] sm:text-[7vw] md:text-[4.8rem] lg:text-[6rem] tracking-[-0.05em] font-bold text-white/95 leading-[0.85] drop-shadow-[0_2px_20px_rgba(0,0,0,0.95)] group-hover:text-[#ff5500] group-hover:drop-shadow-[0_0_25px_rgba(255,85,0,0.4)] transition-all duration-300 whitespace-nowrap">
                {project.name}
              </h2>

              {/* Short Description (Visible by default for scannability) */}
              <p className="max-w-xl font-sans text-xs sm:text-sm text-white/75 leading-relaxed mt-3 text-right drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] group-hover:text-white transition-colors">
                {project.description || project.subtitle}
              </p>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap justify-end gap-1.5 md:gap-2 mt-4">
                {project.techStack?.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[9px] md:text-[10px] tracking-wider text-white/60 bg-black/40 border border-white/15 px-2 py-0.5 rounded transition-colors group-hover:border-white/30 group-hover:text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Subtle expanding accent line on hover & keyboard focus */}
              <div className="w-0 h-[2px] bg-[#ff5500] group-hover:w-full group-focus-within:w-full transition-all duration-500 ease-out mt-5" />
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
