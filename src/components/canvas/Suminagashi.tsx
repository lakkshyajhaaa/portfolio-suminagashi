"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { useHandTracking } from "@/lib/HandTrackingContext";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Render as a pure fullscreen quad in clip space (-1 to 1), ignoring the camera.
  // This guarantees 100% coverage of the viewport at all times.
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uLineColor;
uniform float uBehavior; // 0: calm, 1: converge, 2: repel, 3: expand
uniform vec2 uMouse;
uniform vec2 uMouseDelta;
uniform float uAbsorption; // 0.0 to 1.0
uniform float uRebirth; // 0.0 to 1.0

varying vec2 vUv;

// Simplex 3D Noise 
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

vec3 curlNoise( vec3 p ){
  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = vec3( snoise( p - dx ), snoise( p - dx + vec3(12.3) ), snoise( p - dx + vec3(23.4) ) );
  vec3 p_x1 = vec3( snoise( p + dx ), snoise( p + dx + vec3(12.3) ), snoise( p + dx + vec3(23.4) ) );
  vec3 p_y0 = vec3( snoise( p - dy ), snoise( p - dy + vec3(12.3) ), snoise( p - dy + vec3(23.4) ) );
  vec3 p_y1 = vec3( snoise( p + dy ), snoise( p + dy + vec3(12.3) ), snoise( p + dy + vec3(23.4) ) );
  vec3 p_z0 = vec3( snoise( p - dz ), snoise( p - dz + vec3(12.3) ), snoise( p - dz + vec3(23.4) ) );
  vec3 p_z1 = vec3( snoise( p + dz ), snoise( p + dz + vec3(12.3) ), snoise( p + dz + vec3(23.4) ) );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}

// Fractional Brownian Motion (2D to 1D)
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 3; i++) {
        value += amplitude * snoise(vec3(p * frequency, uTime * 0.008));
        p += vec2(12.34, 56.78); 
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 st = uv * aspect;
  
  float time = uTime * 0.015;
  vec2 center = vec2(0.5, 0.5) * aspect;
  
  // Transition Behaviors
  vec2 distortedUv = st;
  if (uBehavior == 1.0) {
    vec2 toCenter = normalize(center - st);
    distortedUv += toCenter * 0.02 * (sin(time * 2.0) * 0.5 + 0.5);
  } else if (uBehavior == 3.0) {
    vec2 fromCenter = normalize(st - center);
    distortedUv += fromCenter * 0.02 * (cos(time * 2.0) * 0.5 + 0.5);
  }

  // Absorption logic (SDF circle attraction)
  if (uAbsorption > 0.0) {
    float distToCenter = distance(st, center);
    distortedUv = mix(distortedUv, vec2(0.5), smoothstep(0.8, 0.0, distToCenter) * uAbsorption);
  }

  // Rebirth logic (Bloom from center)
  if (uRebirth > 0.0) {
    float distToCenter = distance(st, center);
    distortedUv = mix(vec2(0.5), distortedUv, min(1.0, uRebirth + distToCenter));
  }

  // ==========================================
  // REAL FLUID DYNAMICS (Iterative Advection)
  // ==========================================
  
  vec2 p = distortedUv * 0.8; // Scale for the size of the ink droplets
  vec2 mouseAspect = uMouse * aspect;
  
  // We scale the mouse velocity for the fish's glide speed
  vec2 mouseVelocity = uMouseDelta * aspect * 8.0;
  float mouseSpeed = length(mouseVelocity);
  
  int ADVECTION_STEPS = 6;
  float dt = 0.04; // Time step per integration
  
  // Backwards advection loop (Optimized for 60fps on laptops)
  for(int i = 0; i < 3; i++) {
     // 1. Natural Ocean Flow Velocity (Optimized Pseudo-Flow Field)
     // We bypass the extremely expensive curlNoise (6 noise calls) for a cheaper 2D flow (2 noise calls)
     vec2 vel = vec2(
        snoise(vec3(p * 0.8, time * 0.25)),
        snoise(vec3(p * 0.8 + vec2(12.34, 56.78), time * 0.25))
     ) * 0.8;
     
     // 2. Fish Gliding Model
     vec2 toMouse = p - mouseAspect;
     float dist = length(toMouse);
     
     // The fish affects a localized area around it
     // The fish affects a larger, more playful area
     float inf = smoothstep(0.25, 0.0, dist);
     
     // Propulsion: Push water
     vec2 propVel = mouseVelocity * 0.8;
     
     // Lateral push: Displace water outward
     vec2 outward = dist > 0.001 ? toMouse / dist : vec2(0.0);
     vec2 lateralVel = outward * mouseSpeed * 0.8;
     
     // Wake: Massive playful whirlpools
     vec2 swirlVel = vec2(-toMouse.y, toMouse.x) * mouseSpeed * 3.0;
     
     // Apply the fun disturbance
     vel += (propVel + lateralVel + swirlVel) * inf;
     
     // 3. Move the fluid purely along the velocity vector
     p += vel * dt;
  }
  
  // --- CINEMATIC METALLIC SUMINAGASHI (PREMIUM + FUN) ---
  vec2 m = p * 1.5; 
  
  // 1. Natural Suminagashi Marbling Comb Patterns
  float noiseVal = fbm(m * 2.0 + time * 0.2);
  m += vec2(fbm(m * 2.0), fbm(m * 2.0 + vec2(10.0))) * 0.15;
  m.x += sin(m.y * 15.0) * 0.08; // Horizontal comb
  float arch = abs(sin(m.x * 12.0)); // Peacock comb
  m.y -= arch * 0.2;
  
  // 2. The Suminagashi Distance Rings
  float d = length(m - vec2(0.5, 0.5));
  float t = d * 15.0 - time * 0.65; // The continuous expanding field
  
  // Create smooth undulating bands of ink
  float inkBands = sin(t + noiseVal * 4.0);
  
  // Map colors smoothly to the Suminagashi bands (no harsh zebra lines!)
  vec3 colorA = mix(uColor1, uColor2, smoothstep(-1.0, 1.0, inkBands));
  vec3 colorB = mix(uColor3, uColor4, smoothstep(-1.0, 1.0, inkBands));
  vec3 baseColor = mix(colorA, colorB, noiseVal);
  
  // Create deep, moody shadows to compensate for the lost bright specular zones
  // We calculate the slope of the physical waves to find the "valleys"
  float slope = cos(t + noiseVal * 4.0); 
  float shadow = pow(max(0.0, -slope * 0.8 + 0.2), 3.0);
  if (abs(uBehavior - 2.0) < 0.1) {
     shadow = 0.0; // Completely remove dark zones on the About page
  }
  
  // Apply the shadow by blending the base color towards pure black in the valleys (softened)
  vec3 finalColor = mix(baseColor, vec3(0.02), shadow * 0.35);
  
  // Fun Interaction: Tactile water displacement
  float mouseDist = length(p - mouseAspect);
  float mouseSplash = smoothstep(0.2, 0.0, mouseDist);
  
  // The mouse creates a deep depression (shadow) with a bright rim
  // This makes the cursor feel like a physical stylus dragging through thick paint!
  finalColor -= mouseSplash * 0.4; 
  float rim = smoothstep(0.15, 0.1, mouseDist) * smoothstep(0.0, 0.05, mouseDist);
  vec3 rimColor = mix(vec3(1.0), uColor4, 0.3);
  finalColor += rimColor * rim * 2.5;
  
  // Clean Cinematic Vignette: Smooth radial fade to black without the cloudy noise
  float distToCenter = distance(st, vec2(0.5) * aspect);
  float vignette = smoothstep(1.0, 0.3, distToCenter);
  finalColor = mix(finalColor, finalColor * vignette, 0.8);
  
  // Cinematic Film Grain
  float grain = fract(sin(dot(st, vec2(12.9898, 78.233)) + time) * 43758.5453);
  // Add and subtract noise to maintain overall luminosity instead of just darkening
  finalColor += (grain - 0.5) * 0.06;
  
  vec3 color = finalColor;
  
  // Void state fade out
  if (uAbsorption > 0.0) {
    color = mix(color, vec3(0.0), uAbsorption);
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

const routeConfigs: Record<string, { c1: string, c2: string, c3: string, c4: string, line: string, behavior: number }> = {
  // Home (Pensieve): Ethereal silver, midnight blue, deep violet, pure white
  "/": { c1: "#e2e8f0", c2: "#1e3a8a", c3: "#4c1d95", c4: "#ffffff", line: "#0f172a", behavior: 0.0 }, 
  // Work (Alchemy Forge): Ancient gold, dark crimson, charcoal, ember orange
  "/work": { c1: "#b45309", c2: "#7f1d1d", c3: "#1c1917", c4: "#f59e0b", line: "#450a0a", behavior: 1.0 }, 
  // About (Botanical Library): Rich sage, mid-emerald, muted olive, deep pine
  "/about": { c1: "#233d2e", c2: "#0d6b50", c3: "#355243", c4: "#0f2e21", line: "#14532d", behavior: 2.0 },
  // Contact (Astral Prophecy): Starry cyan, deep space black, pale moon yellow, amethyst
  "/contact": { c1: "#67e8f9", c2: "#020617", c3: "#fef08a", c4: "#86198f", line: "#000000", behavior: 3.0 }, 
  // Individual Project Pages (Cyber Matrix): Obsidian, bright cyan, neon pink, deep purple
  "/project": { c1: "#000000", c2: "#06b6d4", c3: "#ec4899", c4: "#7e22ce", line: "#171717", behavior: 4.0 },
};

const getRouteConfig = (path: string) => {
  if (path.startsWith("/work/") && path.length > 6) {
    return routeConfigs["/project"];
  }
  return routeConfigs[path] || routeConfigs["/"];
};

export default function Suminagashi({ isWebGPU, pathname, transitionState }: { isWebGPU: boolean, pathname: string, transitionState: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  
  // Store the initial config so we don't flash default colors
  const initialConfig = useMemo(() => getRouteConfig(pathname), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uColor1: { value: new THREE.Color(initialConfig.c1) }, 
      uColor2: { value: new THREE.Color(initialConfig.c2) }, 
      uColor3: { value: new THREE.Color(initialConfig.c3) }, 
      uColor4: { value: new THREE.Color(initialConfig.c4) }, 
      uLineColor: { value: new THREE.Color(initialConfig.line) }, 
      uBehavior: { value: initialConfig.behavior }, 
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseDelta: { value: new THREE.Vector2(0.0, 0.0) },
      uAbsorption: { value: 0.0 },
      uRebirth: { value: 0.0 },
    }),
    // Initialize exactly once to prevent resetting GSAP animations on re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { isCameraActive, getHandPosition } = useHandTracking();

  // Track global physical mouse position
  const globalMouse = useRef({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      globalMouse.current.x = e.clientX / window.innerWidth;
      // Invert Y to match WebGL coordinates
      globalMouse.current.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- ROUTE TRANSITIONS ---
  useEffect(() => {
    if (!materialRef.current) return;
    
    // Only trigger if we are in the "entering" state of a new page
    if (transitionState === "entering" || transitionState === "idle") {
      const config = getRouteConfig(pathname);
    
    // Animate colors over time for smooth transition (unless we are in void/rebirth)
    gsap.to(materialRef.current.uniforms.uColor1.value, { r: new THREE.Color(config.c1).r, g: new THREE.Color(config.c1).g, b: new THREE.Color(config.c1).b, duration: 2 });
    gsap.to(materialRef.current.uniforms.uColor2.value, { r: new THREE.Color(config.c2).r, g: new THREE.Color(config.c2).g, b: new THREE.Color(config.c2).b, duration: 2 });
    gsap.to(materialRef.current.uniforms.uColor3.value, { r: new THREE.Color(config.c3).r, g: new THREE.Color(config.c3).g, b: new THREE.Color(config.c3).b, duration: 2 });
    gsap.to(materialRef.current.uniforms.uColor4.value, { r: new THREE.Color(config.c4).r, g: new THREE.Color(config.c4).g, b: new THREE.Color(config.c4).b, duration: 2 });
    gsap.to(materialRef.current.uniforms.uLineColor.value, { r: new THREE.Color(config.line).r, g: new THREE.Color(config.line).g, b: new THREE.Color(config.line).b, duration: 2 });
    materialRef.current.uniforms.uBehavior.value = config.behavior;
    }
  }, [pathname, transitionState]);

  useEffect(() => {
    if (!materialRef.current) return;
    
    switch (transitionState) {
      case "convergence":
        gsap.to(materialRef.current.uniforms.uAbsorption, { value: 0.3, duration: 0.6, ease: "power1.in" });
        break;
      case "absorption":
        gsap.to(materialRef.current.uniforms.uAbsorption, { value: 1.0, duration: 0.8, ease: "power2.inOut" });
        materialRef.current.uniforms.uRebirth.value = 0.0;
        break;
      case "void":
        materialRef.current.uniforms.uAbsorption.value = 1.0;
        break;
      case "genesis":
        materialRef.current.uniforms.uAbsorption.value = 0.0;
        materialRef.current.uniforms.uRebirth.value = 0.0;
        gsap.to(materialRef.current.uniforms.uRebirth, { value: 0.3, duration: 0.8, ease: "power1.in" });
        break;
      case "reconstruction":
        gsap.to(materialRef.current.uniforms.uRebirth, { value: 1.0, duration: 0.8, ease: "power2.out" });
        break;
      case "settle":
        gsap.to(materialRef.current.uniforms.uRebirth, { value: 0.0, duration: 0.8, ease: "power1.out" });
        break;
      case "idle":
      default:
        materialRef.current.uniforms.uAbsorption.value = 0.0;
        materialRef.current.uniforms.uRebirth.value = 0.0;
        break;
    }
  }, [transitionState]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Continuously sync resolution to handle window resizes properly
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      
      const lerpSpeed = isCameraActive ? 0.2 : 0.05;

      let targetX = 0.5;
      let targetY = 0.5;

      if (isCameraActive && getHandPosition) {
        const hand = getHandPosition();
        if (hand) {
          targetX = (hand.x + 1) / 2;
          targetY = (-hand.y + 1) / 2;
        } else {
          // If hand is lost temporarily, stay in place
          targetX = materialRef.current.uniforms.uMouse.value.x;
          targetY = materialRef.current.uniforms.uMouse.value.y;
        }
      } else {
        // Use global physical mouse when camera is off
        targetX = globalMouse.current.x;
        targetY = globalMouse.current.y;
      }

      const currentMouse = materialRef.current.uniforms.uMouse.value.clone();

      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(targetX, targetY),
        lerpSpeed
      );

      const newMouse = materialRef.current.uniforms.uMouse.value;
      // Calculate smoothed mouse velocity for fluid advection
      materialRef.current.uniforms.uMouseDelta.value.set(
        (newMouse.x - currentMouse.x),
        (newMouse.y - currentMouse.y)
      );
    }
  });

  return (
    <mesh>
      {/* 2x2 PlaneGeometry combined with the clip-space vertex shader creates a perfect Fullscreen Quad */}
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
