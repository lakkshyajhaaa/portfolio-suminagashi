import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import Scene from "@/components/canvas/Scene";
import { TransitionProvider } from "@/lib/TransitionContext";
import { HandTrackingProvider } from "@/lib/HandTrackingContext";
import Navigation from "@/components/dom/Navigation";
import HandCursor from "@/components/dom/HandCursor";
import LoadingScreen from "@/components/dom/LoadingScreen";

export const metadata: Metadata = {
  title: "Lakkshya Jha | Computer Engineer • AI Systems & Developer Tools",
  description:
    "Computer Engineer building intelligent software, AI systems, and developer tools. Explore selected systems, architectural case studies, and engineering research.",
  openGraph: {
    title: "Lakkshya Jha | Computer Engineer • AI Systems & Developer Tools",
    description:
      "Computer Engineer building intelligent software, AI systems, and developer tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lakkshya Jha | Computer Engineer • AI Systems & Developer Tools",
    description:
      "Computer Engineer building intelligent software, AI systems, and developer tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} h-full antialiased`}
    >
      <body id="root" className="min-h-full flex flex-col bg-[#050505] text-white font-sans selection:bg-[#ff5500]/30 selection:text-white">
        <HandTrackingProvider>
          <TransitionProvider>
            <Scene />
            <Navigation />
            <HandCursor />
            {children}
            <LoadingScreen />
          </TransitionProvider>
        </HandTrackingProvider>
      </body>
    </html>
  );
}
