"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Sphere, Float } from "@react-three/drei";
import * as THREE from "three";

interface PortalData {
  id: string;
  name: string;
  color: string;
  radius: number;
  speed: number;
  angleOffset: number;
}

const portalsData: PortalData[] = [
  { id: "prajna", name: "Prajñā", color: "#FFD700", radius: 3, speed: 0.2, angleOffset: 0 },
  { id: "triluno", name: "Triluno", color: "#8B4513", radius: 4, speed: 0.15, angleOffset: Math.PI / 2 },
  { id: "quant", name: "Quant Project", color: "#00008B", radius: 3.5, speed: 0.25, angleOffset: Math.PI },
  { id: "energy", name: "Energy Tile", color: "#00FFFF", radius: 4.5, speed: 0.1, angleOffset: (Math.PI * 3) / 2 },
];

export default function ProjectWorld({ isActive, transitionState }: { isActive: boolean, transitionState: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const brainRef = useRef<THREE.Mesh>(null);
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);

  useFrame((state, delta) => {
    if (!isActive) return;

    // Brain pulse and rotation
    if (brainRef.current) {
      brainRef.current.rotation.y += delta * 0.1;
      brainRef.current.rotation.z += delta * 0.05;
      
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      const targetScale = hoveredPortal ? 1.2 + pulse : 1.0 + pulse;
      brainRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {/* Center Brain */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={brainRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.5}
            anisotropy={0.3}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#ffffff"
            transmission={1}
            roughness={0.2}
          />
          {/* Inner glowing core */}
          <mesh>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshBasicMaterial color={hoveredPortal ? "#ffffff" : "#444444"} />
          </mesh>
        </mesh>
      </Float>

      {/* Orbiting Portals */}
      {portalsData.map((portal) => (
        <Portal 
          key={portal.id} 
          data={portal} 
          isHovered={hoveredPortal === portal.id}
          setHovered={(val) => setHoveredPortal(val ? portal.id : null)}
        />
      ))}
      
      {/* Volumetric Fog/Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </group>
  );
}

function Portal({ data, isHovered, setHovered }: { data: PortalData, isHovered: boolean, setHovered: (val: boolean) => void }) {
  const ref = useRef<THREE.Group>(null);
  const portalMesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      // Orbit mechanics
      const time = state.clock.elapsedTime;
      const angle = time * data.speed + data.angleOffset;
      
      // Calculate target position based on orbit
      const targetX = Math.cos(angle) * data.radius;
      const targetZ = Math.sin(angle) * data.radius;
      // Add some subtle Y floating
      const targetY = Math.sin(time + data.angleOffset) * 0.5;

      ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, targetX, 2, delta);
      ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 2, delta);
      ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, targetZ, 2, delta);
      
      // Always look at center
      ref.current.lookAt(0, 0, 0);
    }
    
    if (portalMesh.current) {
      const targetScale = isHovered ? 1.5 : 1.0;
      portalMesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={ref}>
      <mesh 
        ref={portalMesh}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <circleGeometry args={[0.5, 32]} />
        <MeshTransmissionMaterial 
          samples={3}
          thickness={0.5}
          chromaticAberration={1}
          anisotropy={0.5}
          color={data.color}
          transmission={1}
          roughness={0.1}
          distortion={isHovered ? 1.0 : 0.2}
          distortionScale={0.5}
          temporalDistortion={0.5}
        />
        {/* Core color emission */}
        <mesh position={[0, 0, -0.1]}>
          <circleGeometry args={[0.4, 32]} />
          <meshBasicMaterial color={data.color} toneMapped={false} />
        </mesh>
      </mesh>
      
      {/* Emitted Light from portal affecting the world */}
      <pointLight color={data.color} intensity={isHovered ? 5 : 2} distance={10} />
      
      {/* Energy beam connecting to brain (simplified with a line) */}
      {isHovered && (
        <line>
          <bufferGeometry attach="geometry">
            <float32BufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0, -(ref.current?.position.x ?? 0), -(ref.current?.position.y ?? 0), -(ref.current?.position.z ?? 0)]), 3]} />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color={data.color} transparent opacity={0.5} />
        </line>
      )}
    </group>
  );
}
