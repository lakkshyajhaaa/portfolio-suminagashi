import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About // Engineering Profile | Lakkshya Jha",
  description:
    "Computer Engineer building intelligent software, AI systems, and developer tools. Learn about Lakkshya Jha's engineering philosophy, experience, and current research interests.",
};

export default function About() {
  return (
    <main className="flex min-h-[100dvh] flex-col justify-between px-6 py-24 sm:px-10 md:p-24 md:px-32 bg-transparent overflow-x-hidden">
      {/* Top Section: Header & Core Architectural Statement */}
      <section aria-label="About Header" className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pointer-events-auto">
        {/* Brutalist Header & Resume CTA */}
        <div className="flex flex-col md:col-span-2">
          <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] font-bold text-[#ff5500] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] z-10 animate-fade-in">
            PROFILE // ABOUT
          </span>
          <h1 className="font-sans text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] tracking-[-0.05em] font-bold text-white leading-[0.8] mt-3 drop-shadow-[0_2px_20px_rgba(0,0,0,0.95)] mix-blend-difference z-10 animate-fade-in">
            ABOUT.
          </h1>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 md:mt-10 inline-flex items-center gap-2 font-sans text-xs tracking-[0.3em] font-bold text-[#ff5500] uppercase border border-[#ff5500]/60 px-6 py-3 hover:bg-[#ff5500] hover:text-black transition-all w-fit drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] z-10 animate-fade-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>DOWNLOAD RESUME</span>
            <span>↘</span>
          </a>
        </div>

        {/* Primary Architectural Statement */}
        <div className="flex flex-col md:col-span-1 md:mt-2 z-10 animate-fade-in">
          <div className="border-t border-white/20 pt-4 md:pt-6 w-full">
            <p className="font-sans text-base md:text-lg tracking-wide text-white leading-relaxed font-normal drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
              I build reliable, decision-oriented systems. From formulating uncertainty-routing frameworks for AI inference to deploying high-concurrency platforms serving thousands of active university users, I thrive in ambiguity—translating raw requirements into scalable architectures that bridge backend engineering with thoughtful interaction design.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Summary Grids */}
      <section aria-label="Technical Core Summary" className="w-full grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pointer-events-auto z-10 animate-fade-in mt-16 md:mt-24">
        {/* Core Stack */}
        <div className="flex flex-col border-t border-[#ff5500]/50 pt-4">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            SKILLS //
          </span>
          <ul className="space-y-2 font-sans text-xs md:text-sm font-semibold tracking-wider text-white uppercase drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
            <li>Python • C++ • TypeScript</li>
            <li>FastAPI • Next.js • React</li>
            <li>PostgreSQL • Prisma • Docker</li>
            <li>Machine Learning &amp; Computer Vision</li>
          </ul>
        </div>

        {/* Selected Experience */}
        <div className="flex flex-col border-t border-[#ff5500]/50 pt-4">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            EXPERIENCE //
          </span>
          <ul className="space-y-2 font-sans text-xs md:text-sm font-semibold tracking-wider text-white uppercase drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
            <li><span className="text-[#ff5500]">SWE INTERN</span> @ CTD (3K+ USERS)</li>
            <li><span className="text-[#ff5500]">SWE INTERN</span> @ COE-FS</li>
            <li><span className="text-[#ff5500]">OS CONTRIB</span> @ LIBRECUBE</li>
            <li><span className="text-[#ff5500]">STUDENT</span> @ THAPAR INSTITUTE</li>
          </ul>
        </div>

        {/* Areas of Exploration */}
        <div className="flex flex-col border-t border-[#ff5500]/50 pt-4 col-span-2 md:col-span-1">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            EXPLORATION //
          </span>
          <ul className="space-y-2 font-sans text-xs md:text-sm font-semibold tracking-wider text-white uppercase drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
            <li>Uncertainty-Aware AI Routing</li>
            <li>Stateless Biometric Architectures</li>
            <li>Real-Time WebGL &amp; Fluid Physics</li>
            <li>High-Concurrency Backends</li>
          </ul>
        </div>
      </section>

      {/* Narrative Sections */}
      <section aria-label="Detailed Narrative" className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 md:gap-y-20 pointer-events-auto z-10 animate-fade-in mt-20 md:mt-32 pb-48 md:pb-32">
        {/* Section 01 */}
        <article className="flex flex-col border-t border-white/20 pt-6">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            01 // BACKGROUND &amp; INTERESTS
          </span>
          <div className="space-y-4 font-sans text-base md:text-lg tracking-normal text-white/90 leading-relaxed font-normal drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
            <p>
              I am a Computer Engineering student at Thapar Institute of Engineering &amp; Technology, India.
            </p>
            <p>
              My work focuses on the intersection of intelligent systems, systems programming, and high-craft digital products. I enjoy taking ideas that begin with foundational questions—such as how to calibrate confidence in neural networks or how to prevent attendance fraud under peak network congestion—and turning them into tested software that operates dependably under real constraints.
            </p>
            <p>
              I primarily write Python, TypeScript, and C++, building across both the backend infrastructure and client-facing interfaces.
            </p>
          </div>
        </article>

        {/* Section 02 */}
        <article className="flex flex-col border-t border-white/20 pt-6">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            02 // HOW I BUILD
          </span>
          <div className="space-y-4 font-sans text-base md:text-lg tracking-normal text-white/90 leading-relaxed font-normal drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
            <p>
              I build from first principles. Before choosing a library or adopting a framework, I look at the constraints: data lifecycles, user latency tolerance, concurrency limits, and security trade-offs.
            </p>
            <p>
              I value working with engineers and researchers who care deeply about what they are creating. In collaborative environments, clear communication, rapid iteration, and honesty about technical limitations consistently produce the most resilient systems.
            </p>
            <p>
              Learning why something works is as important to me as making it work.
            </p>
          </div>
        </article>

        {/* Section 03 */}
        <article className="flex flex-col border-t border-white/20 pt-6">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            03 // TECHNICAL FOCUS
          </span>
          <div className="space-y-4 font-sans text-base md:text-lg tracking-normal text-white/90 leading-relaxed font-normal drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
            <p>
              My technical work spans three key domains:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2">
              <li>
                <strong>Intelligent Systems:</strong> Designing inference pipelines that model uncertainty, prediction margin, and data quality rather than forcing black-box outputs.
              </li>
              <li>
                <strong>Full-Stack Architecture:</strong> Engineering relational schemas, JWT authentication, and RESTful APIs capable of serving high-volume concurrent sessions.
              </li>
              <li>
                <strong>Systems &amp; Open Source:</strong> Contributing telemetry conversion engines and developer tooling to open-source initiatives like LibreCube.
              </li>
            </ul>
          </div>
        </article>

        {/* Section 04 */}
        <article className="flex flex-col border-t border-white/20 pt-6">
          <span className="font-sans text-[10px] tracking-[0.4em] font-bold text-[#ff5500] uppercase mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            04 // PERSPECTIVE
          </span>
          <div className="space-y-4 font-sans text-base md:text-lg tracking-normal text-white/90 leading-relaxed font-normal drop-shadow-[0_4px_15px_rgba(0,0,0,1)]">
            <p>
              I believe curiosity is an engineering discipline. Tools and frameworks will evolve constantly, but the ability to ask precise questions, decompose complex problems, and craft software with clarity and intent remains enduring.
            </p>
            <p>
              Every project on this site reflects that ongoing pursuit.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
