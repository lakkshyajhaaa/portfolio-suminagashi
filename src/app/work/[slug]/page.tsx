/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import type { Metadata } from "next";

// Custom MDX component mappings with high legibility and brutalist styling
const components = {
  h1: (props: any) => (
    <h1
      className="font-sans text-[2.5rem] md:text-[4rem] tracking-[-0.04em] font-bold text-white leading-[0.95] mt-12 mb-6 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]"
      {...props}
    />
  ),
  h2: (props: any) => (
    <div className="mt-14 mb-6 border-t border-white/20 pt-6">
      <h2
        className="font-sans text-xl md:text-2xl tracking-[-0.02em] font-bold text-white flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        {...props}
      />
    </div>
  ),
  h3: (props: any) => (
    <h3
      className="font-sans text-base md:text-lg tracking-wide font-semibold text-[#67e8f9] mt-8 mb-3 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="font-sans text-base md:text-lg tracking-normal text-white/90 leading-relaxed font-normal mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="text-[#ff5500] hover:text-white transition-colors underline underline-offset-4 decoration-[#ff5500]/60 hover:decoration-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      className="list-disc list-outside ml-6 mb-6 space-y-2 text-white/90 font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal list-outside ml-6 mb-6 space-y-2 text-white/90 font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
      {...props}
    />
  ),
  li: (props: any) => <li className="pl-1" {...props} />,
  strong: (props: any) => <strong className="font-semibold text-white" {...props} />,
  code: (props: any) => {
    // If it's inline code (doesn't contain newline)
    const isInline = typeof props.children === "string" && !props.children.includes("\n");
    if (isInline) {
      return (
        <code
          className="font-mono text-xs md:text-sm bg-black/60 text-[#ff5500] px-1.5 py-0.5 border border-white/15 rounded"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  pre: (props: any) => (
    <div className="my-6 overflow-x-auto rounded border border-white/20 bg-black/70 p-4 md:p-6 backdrop-blur-md shadow-2xl">
      <pre className="font-mono text-xs md:text-sm text-[#e2e8f0] leading-relaxed" {...props} />
    </div>
  ),
  blockquote: (props: any) => (
    <blockquote
      className="my-6 border-l-2 border-[#ff5500] pl-6 py-2 italic font-sans text-lg md:text-xl text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-black/25"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-white/15" />,
};

function getAllProjects() {
  const dir = path.join(process.cwd(), "src", "projects");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files
    .filter((f) => !f.startsWith("_") && (f.endsWith(".mdx") || f.endsWith(".md")))
    .map((file) => {
      const fullPath = path.join(dir, file);
      const { data } = matter(fs.readFileSync(fullPath, "utf8"));
      return data;
    })
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src", "projects", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return {};
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  return {
    title: `${data.name} — ${data.subtitle || "Case Study"} | Lakkshya Jha`,
    description: data.description || `Technical case study on ${data.name}.`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src", "projects", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return notFound();
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content, data: project } = matter(fileContents);

  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <main className="flex min-h-screen flex-col p-6 sm:p-10 md:p-24 bg-transparent overflow-x-hidden">
      {/* Top Breadcrumb & Back Action */}
      <nav aria-label="Project Navigation" className="absolute top-[80px] left-6 md:top-24 md:left-32 z-40 pointer-events-auto mix-blend-difference">
        <Link
          href="/work"
          className="group flex items-center gap-3 font-sans text-xs tracking-[0.3em] font-bold text-white/70 hover:text-white uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] rounded py-1 px-2"
        >
          <span className="text-[#ff5500] group-hover:-translate-x-1 transition-transform">←</span>
          <span>ALL PROJECTS</span>
          <span className="text-white/30">//</span>
          <span className="text-[#ff5500] font-mono">{project.id}</span>
        </Link>
      </nav>

      {/* Massive Project Title Header */}
      <header className="absolute top-[140px] left-6 md:top-[180px] md:left-32 flex flex-col pointer-events-auto z-10 mix-blend-difference animate-fade-in max-w-[90vw]">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
          <span className="font-mono text-xs md:text-sm tracking-widest text-[#ff5500] font-bold drop-shadow-[0_0_6px_rgba(255,85,0,0.6)]">
            {project.id}
          </span>
          <span className="text-white/30 text-xs">{"//"}</span>
          <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] font-bold text-[#67e8f9] uppercase drop-shadow-[0_0_5px_rgba(103,232,249,0.5)]">
            {project.category || project.type}
          </span>
          <span className="text-white/30 text-xs">{"//"}</span>
          <span className="font-sans text-[9px] md:text-[10px] tracking-widest text-white/60 uppercase">
            STATUS: {project.status}
          </span>
        </div>

        <h1 className="font-sans text-[12vw] md:text-[6.5rem] lg:text-[8rem] tracking-[-0.05em] font-bold text-white leading-[0.85] drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] whitespace-nowrap">
          {project.name}
        </h1>

        {project.subtitle && (
          <p className="mt-3 font-sans text-sm md:text-lg text-white/85 font-normal tracking-wide max-w-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {project.subtitle}
          </p>
        )}
      </header>

      {/* Project Details (Scrollable below fold) */}
      <div className="mt-[42vh] md:mt-[48vh] w-full max-w-4xl mx-auto flex flex-col gap-12 pointer-events-auto z-10 pb-32">
        {/* Project Header Specifications Grid */}
        <section aria-label="Project Metadata" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 border-y border-white/20 py-8 bg-black/40 backdrop-blur-md px-6 md:px-8 rounded">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[9px] tracking-[0.3em] font-bold text-white/50 uppercase">
              ROLE
            </span>
            <span className="font-sans text-xs md:text-sm font-semibold tracking-wider text-white">
              {project.role || "Developer"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-sans text-[9px] tracking-[0.3em] font-bold text-white/50 uppercase">
              TIMELINE
            </span>
            <span className="font-sans text-xs md:text-sm font-semibold tracking-wider text-white">
              {project.timeline || "2024"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-sans text-[9px] tracking-[0.3em] font-bold text-white/50 uppercase">
              TEAM / SCOPE
            </span>
            <span className="font-sans text-xs md:text-sm font-semibold tracking-wider text-white">
              {project.teamSize || "Individual"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-sans text-[9px] tracking-[0.3em] font-bold text-white/50 uppercase">
              STATUS
            </span>
            <span className="font-sans text-xs md:text-sm font-semibold tracking-wider text-[#67e8f9]">
              {project.status}
            </span>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-col gap-2 col-span-2 sm:col-span-3 md:col-span-4 border-t border-white/10 pt-4 mt-2">
            <span className="font-sans text-[9px] tracking-[0.3em] font-bold text-white/50 uppercase">
              TECHNOLOGIES & TOOLS
            </span>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech: string) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] tracking-wider text-[#67e8f9] uppercase bg-cyan-950/40 border border-[#67e8f9]/40 px-2.5 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links (Live Demo & Source Code) */}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap gap-4 col-span-2 sm:col-span-3 md:col-span-4 border-t border-white/10 pt-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] font-bold uppercase text-black bg-white px-5 py-2.5 hover:bg-[#ff5500] hover:text-white transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500]"
                >
                  <span>LIVE DEMO</span>
                  <span>↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] font-bold uppercase text-white/90 bg-transparent border border-white/30 hover:border-white px-5 py-2.5 hover:text-white transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500]"
                >
                  <span>SOURCE REPOSITORY</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          )}
        </section>

        {/* Detailed Case Study (MDX Content) */}
        <article className="flex flex-col bg-black/45 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded border border-white/15">
          <MDXRemote source={content} components={components} />
        </article>

        {/* Bottom Navigation Between Projects */}
        <footer className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/20 pt-8">
          {prevProject ? (
            <Link
              href={`/work/${prevProject.slug}`}
              className="group flex flex-col items-start gap-1 font-sans text-xs tracking-[0.25em] font-bold text-white/70 hover:text-white uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] p-2 rounded"
            >
              <span className="text-[10px] text-white/40">← PREVIOUS PROJECT</span>
              <span className="text-[#ff5500] group-hover:underline">{prevProject.name}</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/work"
            className="font-sans text-xs tracking-[0.3em] font-bold text-white/80 uppercase hover:text-[#ff5500] transition-colors border border-white/20 px-6 py-3 hover:border-[#ff5500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500]"
          >
            INDEX // VIEW ALL
          </Link>

          {nextProject ? (
            <Link
              href={`/work/${nextProject.slug}`}
              className="group flex flex-col items-end gap-1 font-sans text-xs tracking-[0.25em] font-bold text-white/70 hover:text-white uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5500] p-2 rounded"
            >
              <span className="text-[10px] text-white/40">NEXT PROJECT →</span>
              <span className="text-[#ff5500] group-hover:underline">{nextProject.name}</span>
            </Link>
          ) : (
            <div />
          )}
        </footer>
      </div>
    </main>
  );
}
