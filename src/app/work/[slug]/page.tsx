import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";

// Define our custom components mapping
const components = {
  h1: (props: any) => <h1 className="font-sans text-[3rem] md:text-[5rem] tracking-[-0.05em] font-bold text-white leading-[0.9] mt-12 mb-6" {...props} />,
  h2: (props: any) => <h2 className="font-sans text-[2rem] md:text-[3rem] tracking-[-0.03em] font-bold text-white mt-10 mb-4" {...props} />,
  p: (props: any) => <p className="font-sans text-lg md:text-xl tracking-wide text-white/80 leading-relaxed font-light mb-6" {...props} />,
  a: (props: any) => <a className="text-[#ff5500] hover:text-white transition-colors border-b border-[#ff5500]/30 hover:border-white" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-6 space-y-2 text-white/80" {...props} />,
  // You can add more components here!
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), "src", "projects", `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return notFound();
  }
  
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content, data: project } = matter(fileContents);
  
  return (
    <main className="flex min-h-screen flex-col p-8 md:p-24 bg-transparent overflow-x-hidden">
      
      {/* Back Button */}
      <Link href="/work" className="absolute top-[120px] left-6 md:top-24 md:left-32 z-50 pointer-events-auto mix-blend-difference group flex items-center gap-4">
        <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-white uppercase opacity-50 group-hover:opacity-100 group-hover:-translate-x-2 transition-all">
          ← BACK
        </span>
      </Link>

      {/* Massive Project Title */}
      <div className="absolute top-[180px] left-6 md:top-[200px] md:left-32 flex flex-col pointer-events-auto z-10 mix-blend-difference animate-fade-in max-w-full">
        <span className="font-sans text-[8px] md:text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase drop-shadow-[0_0_5px_rgba(255,85,0,0.5)] mb-4">
          {project.type} // {project.id}
        </span>
        <h1 className="font-sans text-[15vw] md:text-[8rem] lg:text-[10rem] tracking-[-0.05em] font-bold text-white leading-[0.8] drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] break-words">
          {project.name}.
        </h1>
      </div>

      {/* Project Details (Scrollable below fold) */}
      <div className="mt-[45vh] md:mt-[60vh] w-full max-w-4xl mx-auto flex flex-col gap-16 pointer-events-auto z-10 mix-blend-difference pb-32 px-6">
        
        {/* Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/20 pt-8">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[8px] tracking-[0.3em] font-bold text-white/50 uppercase">ROLE</span>
            <span className="font-sans text-xs tracking-wider text-white uppercase">{project.role || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[8px] tracking-[0.3em] font-bold text-white/50 uppercase">TYPE</span>
            <span className="font-sans text-xs tracking-wider text-white uppercase">{project.type}</span>
          </div>
          <div className="flex flex-col gap-2 col-span-2 md:col-span-2">
            <span className="font-sans text-[8px] tracking-[0.3em] font-bold text-white/50 uppercase">STACK</span>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech: string) => (
                <span key={tech} className="font-sans text-[10px] tracking-widest text-[#67e8f9] uppercase border border-[#67e8f9]/30 px-2 py-1">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Overview (MDX Content) */}
        <div className="flex flex-col gap-6 border-l-2 border-[#ff5500] pl-6 md:pl-12">
          <MDXRemote source={content} components={components} />
        </div>

        {/* Next Project Hint */}
        <div className="w-full flex justify-end mt-16 border-b border-white/20 pb-4">
          <Link href="/work" className="font-sans text-[10px] tracking-[0.4em] font-bold text-white uppercase hover:text-[#ff5500] transition-colors">
            BACK TO WORK //
          </Link>
        </div>

      </div>
    </main>
  );
}
