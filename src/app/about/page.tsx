import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Lakkshya Jha",
  description: "System Architect and Simulation Engineer.",
};

export default function About() {
  return (
    <main className="flex min-h-[100dvh] flex-col justify-between px-6 py-24 md:p-24 md:px-32 bg-transparent overflow-x-hidden">
      
      {/* Top Section: Header & Paragraph */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pointer-events-auto">
        
        {/* Brutalist Directory Header */}
        <div className="flex flex-col md:col-span-2 mix-blend-difference z-10 animate-fade-in">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
            PROFILE // ABOUT
          </span>
          <h1 className="font-sans text-[3rem] md:text-[6rem] tracking-[-0.05em] font-bold text-white leading-[0.8] mt-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            ABOUT.
          </h1>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="mt-8 md:mt-12 inline-block font-sans text-[10px] tracking-[0.4em] font-bold text-[#67e8f9] uppercase border-[1px] border-[#67e8f9]/50 px-8 py-4 hover:bg-[#67e8f9] hover:text-black transition-all w-fit drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]">
            DOWNLOAD RESUME ↘
          </a>
        </div>

        {/* Main Architectural Statement */}
        <div className="flex flex-col md:col-span-1 md:mt-2 z-10 animate-fade-in">
          <div className="border-t-[1px] border-white/20 pt-4 md:pt-6 w-full">
            <p className="font-sans text-sm md:text-base leading-relaxed text-[#cffafe] font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
              I build data-driven, decision-oriented systems. From architecting risk-scoring frameworks for AI inference to shipping full-stack platforms for thousands of active users. I thrive in ambiguity—translating raw requirements into scalable logic, and bridging the gap between robust backend engineering and seamless product design.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Section: Technical Grids */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pointer-events-auto z-10 animate-fade-in mt-16 md:mt-32">
        
        {/* Core Stack */}
        <div className="flex flex-col border-t-[1px] border-[#ff5500]/50 pt-4">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-4 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
            SKILLS //
          </span>
          <ul className="space-y-2 font-sans text-xs md:text-sm font-bold tracking-widest text-[#cffafe] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            <li>Python / TS / C++</li>
            <li>Machine Learning</li>
            <li>Data Systems</li>
            <li>Product & Analysis</li>
          </ul>
        </div>

        {/* Affiliations */}
        <div className="flex flex-col border-t-[1px] border-[#ff5500]/50 pt-4">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-4 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
            EXPERIENCE //
          </span>
          <ul className="space-y-2 font-sans text-xs md:text-sm font-bold tracking-widest text-[#cffafe] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            <li><span className="text-[#ff5500]/80">SWE INTERN</span> @ COE-FS</li>
            <li><span className="text-[#ff5500]/80">SWE INTERN</span> @ CTD</li>
          </ul>
        </div>

        {/* Recognition */}
        <div className="flex flex-col border-t-[1px] border-[#ff5500]/50 pt-4 col-span-2 md:col-span-1">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-4 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
            LEADERSHIP //
          </span>
          <ul className="space-y-2 font-sans text-xs md:text-sm font-bold tracking-widest text-[#cffafe] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            <li><span className="text-[#ff5500]/80">INNOVATOR</span> @ COE-DS&AI</li>
            <li><span className="text-[#ff5500]/80">SR COORD</span> @ CTD</li>
          </ul>
        </div>

      </div>

      {/* Narrative Sections */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-24 md:gap-y-32 pointer-events-auto z-10 animate-fade-in mt-32 md:mt-48 pb-32">
        
        {/* Section 1 */}
        <div className="flex flex-col border-t-[1px] border-white/20 pt-6">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-8 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
            01 // HELLO, WORLD.
          </span>
          <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-[#cffafe] font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            <p>I'm Lakkshya, a Computer Engineering student based in India.</p>
            <p>I enjoy building things that begin as questions.</p>
            <p>Sometimes those questions lead to software. Sometimes they become design experiments, research projects, event experiences, or products that solve small everyday problems. More often than not, they start with curiosity and evolve into something unexpected.</p>
            <p>Currently, I'm pursuing my degree at Thapar Institute of Engineering & Technology, where I'm developing a strong foundation in computer science while exploring the spaces where technology intersects with design, creativity, and human behavior.</p>
            <p>My work spans software development, AI, UI/UX design, and product thinking. I primarily work with Python, C++, JavaScript, TypeScript, React, and modern web technologies, alongside tools such as Figma, Git, Blender, and Firebase. More recently, I've been exploring machine learning, intelligent systems, and interactive web experiences.</p>
            <p>Outside of academics and projects, I enjoy basketball, music, writing, visual design, and discovering ideas that challenge the way we think. I find inspiration in good products, thoughtful experiences, films, books, and people who aren't afraid to explore unconventional paths.</p>
            <p>This website is a collection of my work, experiments, and the ideas I'm currently exploring.</p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col border-t-[1px] border-white/20 pt-6">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-8 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
            02 // HOW I WORK
          </span>
          <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-[#cffafe] font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            <p>I like working closely with people who care about what they're building.</p>
            <p>Whether it's a technical project, a design challenge, or a community initiative, I believe the best outcomes come from open communication, curiosity, and a willingness to iterate.</p>
            <p>I enjoy understanding the reasoning behind decisions rather than simply executing instructions. Learning how something should work is often as important as building it.</p>
            <p>I'm comfortable exploring unfamiliar territory, asking questions, and refining ideas through experimentation.</p>
            <p>At the end of the day, I'm less interested in titles and roles, and more interested in creating meaningful work alongside thoughtful people.</p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col border-t-[1px] border-white/20 pt-6">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-8 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
            03 // WHAT I DO
          </span>
          <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-[#cffafe] font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            <p>I build digital experiences, software products, and experimental projects.</p>
            <p>My interests currently revolve around artificial intelligence, software engineering, product design, and interactive web technologies. I enjoy taking ideas from concept to implementation—whether that means designing interfaces, writing code, conducting research, or refining the details that make a product feel intuitive.</p>
            <p>I work across the stack when needed and enjoy learning new tools if they help solve the problem better.</p>
            <p>Some technologies and tools I frequently use include: Python • C++ • JavaScript • TypeScript • React • HTML • CSS • Git • GitHub • Firebase • Figma • Blender • Linux.</p>
            <p>More important than the tools, however, is the process of learning, experimenting, and continuously improving through building.</p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="flex flex-col border-t-[1px] border-white/20 pt-6">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-8 drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">
            04 // PHILOSOPHY
          </span>
          <div className="space-y-6 font-sans text-sm md:text-base leading-relaxed text-[#cffafe] font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            <p>I believe curiosity is a skill.</p>
            <p>The ability to ask better questions, explore unfamiliar territory, and remain excited by the unknown has shaped nearly everything I've built and learned.</p>
            <p>Technology changes. Tools evolve.</p>
            <p>Curiosity remains.</p>
            <p>Everything on this website is a result of following it.</p>
          </div>
        </div>

      </div>

    </main>
  );
}
