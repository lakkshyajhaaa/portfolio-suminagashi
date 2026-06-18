"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { usePathname } from "next/navigation";
import { useHandTracking } from "@/lib/HandTrackingContext";

export default function RefractionLens() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pathname = usePathname();
  const { getHandPosition } = useHandTracking();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Base rotation (slow, cinematic drift)
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;

    // Lock the massive glass prism to the right side of the screen continuously across all pages
    const targetX = 4;

    // Smoothly glide to the target position
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);

    // Physics Interaction: If the hand tracking cursor touches the lens, violently spin it!
    const hand = getHandPosition();
    if (hand) {
       const hX = hand.x * (state.viewport.width / 2);
       const hY = hand.y * (state.viewport.height / 2);
       const lX = meshRef.current.position.x;
       const lY = meshRef.current.position.y;
       
       const dist = Math.hypot(hX - lX, hY - lY);
       if (dist < 3.0) { // If hand is near the massive prism
          // Inject rotational momentum
          meshRef.current.rotation.x -= (hand.y * delta * 5);
          meshRef.current.rotation.y += (hand.x * delta * 5);
       }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      {/* 
        Z-index is explicitly set to 1 so it physically floats *above* the Suminagashi background canvas 
        which sits at Z=0. This allows it to capture and refract the background perfectly.
      */}
      <mesh ref={meshRef} position={[0, 0, 1]}>
        {/* A massive 20-sided geometric prism. Strict, mathematical, brutalist. */}
        <icosahedronGeometry args={[3, 0]} />
        <MeshTransmissionMaterial
          transmission={1} // Full glass transmission
          thickness={1.5} // Physical thickness of the glass
          roughness={0.1} // Increased roughness slightly to catch the specs of color
          ior={1.2} // Index of Refraction
          chromaticAberration={0.3} // CRANKED UP: This splits the light into gorgeous rainbow specs!
          anisotropy={0.5} // Stretches the light reflections to look like cinematic anamorphic flares
          backside={true} // Renders the inside of the glass for double-refraction
          transparent={true}
          opacity={1}
          color="#ffffff"
          resolution={1024} // High-res refraction buffer
        />
      </mesh>
    </Float>
  );
}
