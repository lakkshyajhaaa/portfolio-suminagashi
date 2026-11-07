"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Suminagashi from "./Suminagashi";
import RefractionLens from "./RefractionLens";
import { Environment } from "@react-three/drei";

import CameraRig from "./CameraRig";
import PointerOverride from "./PointerOverride";
import { useTransitionMachine } from "@/lib/TransitionContext";
import { usePathname } from "next/navigation";

export default function Scene() {
  const { state } = useTransitionMachine();
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas 
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={isMobile ? [1, 1] : [1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ touchAction: 'auto', pointerEvents: 'none' }}
        eventSource={typeof window !== 'undefined' ? document.getElementById('root') || undefined : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <PointerOverride />
          <CameraRig transitionState={state.value} />
          
          {/* The Suminagashi physics engine runs continuously across all routes */}
          <Suminagashi isWebGPU={false} pathname={pathname} transitionState={state.value} />
          
          {/* Cinematic lighting to illuminate the glass */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#67e8f9" />
          
          {/* HDRI Environment map gives the dark side of the glass beautiful, smooth reflections and specs of color */}
          {!isMobile && <Environment preset="city" />}
          
          {/* The new Invisible Cinematic 3D Element */}
          {!isMobile && <RefractionLens />}
        </Suspense>
      </Canvas>
    </div>
  );
}
