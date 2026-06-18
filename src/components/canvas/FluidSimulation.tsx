"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useHandTracking } from "@/lib/HandTrackingContext";

// Configuration
const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 0.98,
    VELOCITY_DISSIPATION: 0.99,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.25,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
};

const baseVertexShader = `
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = position.xy * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

const displayShaderSource = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
`;

const splatShader = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`;

const advectionShader = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
    }
`;

const divergenceShader = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`;

const curlShader = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
`;

const vorticityShader = `
    precision highp float;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;

        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`;

const pressureShader = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`;

const gradientSubtractShader = `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`;

const clearShader = `
    precision mediump float;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`;

const routeConfigs: Record<string, { c1: string, c2: string, c3: string, c4: string }> = {
    "/": { c1: "#00f0ff", c2: "#8a2be2", c3: "#ff00ff", c4: "#ffffff" }, 
    "/work": { c1: "#ff0055", c2: "#ff4500", c3: "#ff1493", c4: "#ffb6c1" }, 
    "/about": { c1: "#ffcc00", c2: "#ff6600", c3: "#ffff00", c4: "#ffeecc" }, 
    "/contact": { c1: "#00ff00", c2: "#00ffcc", c3: "#7fff00", c4: "#aaffcc" }, 
};

class FBO {
    read: THREE.WebGLRenderTarget;
    write: THREE.WebGLRenderTarget;
    texelSizeX: number;
    texelSizeY: number;

    constructor(w: number, h: number, type: THREE.TextureDataType) {
        this.texelSizeX = 1.0 / w;
        this.texelSizeY = 1.0 / h;
        
        const options: THREE.RenderTargetOptions = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            type: type,
            format: THREE.RGBAFormat,
            depthBuffer: false,
            stencilBuffer: false,
            generateMipmaps: false
        };

        this.read = new THREE.WebGLRenderTarget(w, h, options);
        this.write = new THREE.WebGLRenderTarget(w, h, options);
    }

    swap() {
        const temp = this.read;
        this.read = this.write;
        this.write = temp;
    }
}

export default function FluidSimulation({ pathname }: { pathname: string }) {
    const { gl, size } = useThree();
    const { isCameraActive, getHandPosition } = useHandTracking();
    
    // Physics Buffers
    const fbos = useRef<{
        dye: FBO;
        velocity: FBO;
        pressure: FBO;
        divergence: THREE.WebGLRenderTarget;
        curl: THREE.WebGLRenderTarget;
    } | null>(null);

    // Shaders
    const materials = useRef<{
        advection: THREE.ShaderMaterial;
        divergence: THREE.ShaderMaterial;
        curl: THREE.ShaderMaterial;
        vorticity: THREE.ShaderMaterial;
        pressure: THREE.ShaderMaterial;
        gradientSubtract: THREE.ShaderMaterial;
        splat: THREE.ShaderMaterial;
        clear: THREE.ShaderMaterial;
        display: THREE.ShaderMaterial;
    } | null>(null);

    const quad = useRef<THREE.Mesh>(null);
    const orthoCamera = useRef(new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1));
    const renderScene = useRef(new THREE.Scene());

    // Mouse tracking
    const pointer = useRef({ x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false });
    const lastPointer = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const type = /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
        
        fbos.current = {
            dye: new FBO(config.DYE_RESOLUTION, config.DYE_RESOLUTION, type),
            velocity: new FBO(config.SIM_RESOLUTION, config.SIM_RESOLUTION, type),
            pressure: new FBO(config.SIM_RESOLUTION, config.SIM_RESOLUTION, type),
            divergence: new THREE.WebGLRenderTarget(config.SIM_RESOLUTION, config.SIM_RESOLUTION, { type, format: THREE.RGBAFormat, depthBuffer: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter }),
            curl: new THREE.WebGLRenderTarget(config.SIM_RESOLUTION, config.SIM_RESOLUTION, { type, format: THREE.RGBAFormat, depthBuffer: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter })
        };

        const createMaterial = (fragment: string, uniforms: any) => new THREE.ShaderMaterial({
            vertexShader: baseVertexShader,
            fragmentShader: fragment,
            uniforms,
            depthWrite: false,
            depthTest: false
        });

        materials.current = {
            advection: createMaterial(advectionShader, { uVelocity: { value: null }, uSource: { value: null }, texelSize: { value: new THREE.Vector2() }, dyeTexelSize: { value: new THREE.Vector2() }, dt: { value: 0 }, dissipation: { value: 0 } }),
            divergence: createMaterial(divergenceShader, { uVelocity: { value: null }, texelSize: { value: new THREE.Vector2() } }),
            curl: createMaterial(curlShader, { uVelocity: { value: null }, texelSize: { value: new THREE.Vector2() } }),
            vorticity: createMaterial(vorticityShader, { uVelocity: { value: null }, uCurl: { value: null }, curl: { value: 0 }, dt: { value: 0 }, texelSize: { value: new THREE.Vector2() } }),
            pressure: createMaterial(pressureShader, { uPressure: { value: null }, uDivergence: { value: null }, texelSize: { value: new THREE.Vector2() } }),
            gradientSubtract: createMaterial(gradientSubtractShader, { uPressure: { value: null }, uVelocity: { value: null }, texelSize: { value: new THREE.Vector2() } }),
            splat: createMaterial(splatShader, { uTarget: { value: null }, aspectRatio: { value: 1 }, color: { value: new THREE.Vector3() }, point: { value: new THREE.Vector2() }, radius: { value: 0 } }),
            clear: createMaterial(clearShader, { uTexture: { value: null }, value: { value: config.PRESSURE } }),
            display: createMaterial(displayShaderSource, { uTexture: { value: null } })
        };

        const geo = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geo, materials.current.display);
        quad.current = mesh as any;
        renderScene.current.add(mesh);

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = 1.0 - (e.clientY / window.innerHeight);
            pointer.current.dx = (x - lastPointer.current.x) * config.SPLAT_FORCE;
            pointer.current.dy = (y - lastPointer.current.y) * config.SPLAT_FORCE;
            pointer.current.x = x;
            pointer.current.y = y;
            pointer.current.moved = true;
            lastPointer.current.x = x;
            lastPointer.current.y = y;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const splat = (x: number, y: number, dx: number, dy: number, colorHex: string) => {
        if (!fbos.current || !materials.current || !quad.current) return;
        const { velocity, dye } = fbos.current;
        const { splat: mat } = materials.current;

        const col = new THREE.Color(colorHex);

        gl.setRenderTarget(velocity.write);
        mat.uniforms.uTarget.value = velocity.read.texture;
        mat.uniforms.aspectRatio.value = size.width / size.height;
        mat.uniforms.point.value.set(x, y);
        mat.uniforms.color.value.set(dx, dy, 0);
        mat.uniforms.radius.value = config.SPLAT_RADIUS / 100.0;
        quad.current.material = mat;
        gl.render(renderScene.current, orthoCamera.current);
        velocity.swap();

        gl.setRenderTarget(dye.write);
        mat.uniforms.uTarget.value = dye.read.texture;
        mat.uniforms.color.value.set(col.r * 10, col.g * 10, col.b * 10);
        quad.current.material = mat;
        gl.render(renderScene.current, orthoCamera.current);
        dye.swap();
    };

    useFrame((state, delta) => {
        if (!fbos.current || !materials.current || !quad.current) return;
        
        const dt = Math.min(delta, 0.016);
        const { velocity, dye, pressure, divergence, curl } = fbos.current;
        const mats = materials.current;

        // 1. Hand Tracking or Mouse Inputs
        if (isCameraActive && getHandPosition) {
            const hand = getHandPosition();
            if (hand) {
                const x = (hand.x + 1) / 2;
                const y = (-hand.y + 1) / 2;
                pointer.current.dx = (x - lastPointer.current.x) * config.SPLAT_FORCE;
                pointer.current.dy = (y - lastPointer.current.y) * config.SPLAT_FORCE;
                pointer.current.x = x;
                pointer.current.y = y;
                pointer.current.moved = true;
                lastPointer.current.x = x;
                lastPointer.current.y = y;
            }
        }

        if (pointer.current.moved) {
            const colors = routeConfigs[pathname] || routeConfigs["/"];
            const colorKeys = [colors.c1, colors.c2, colors.c3, colors.c4];
            const randColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
            splat(pointer.current.x, pointer.current.y, pointer.current.dx, pointer.current.dy, randColor);
            pointer.current.moved = false;
        }

        // 2. Compute Curl
        gl.setRenderTarget(curl);
        mats.curl.uniforms.uVelocity.value = velocity.read.texture;
        mats.curl.uniforms.texelSize.value.set(velocity.texelSizeX, velocity.texelSizeY);
        quad.current.material = mats.curl;
        gl.render(renderScene.current, orthoCamera.current);

        // 3. Apply Vorticity
        gl.setRenderTarget(velocity.write);
        mats.vorticity.uniforms.uVelocity.value = velocity.read.texture;
        mats.vorticity.uniforms.uCurl.value = curl.texture;
        mats.vorticity.uniforms.curl.value = config.CURL;
        mats.vorticity.uniforms.dt.value = dt;
        mats.vorticity.uniforms.texelSize.value.set(velocity.texelSizeX, velocity.texelSizeY);
        quad.current.material = mats.vorticity;
        gl.render(renderScene.current, orthoCamera.current);
        velocity.swap();

        // 4. Compute Divergence
        gl.setRenderTarget(divergence);
        mats.divergence.uniforms.uVelocity.value = velocity.read.texture;
        mats.divergence.uniforms.texelSize.value.set(velocity.texelSizeX, velocity.texelSizeY);
        quad.current.material = mats.divergence;
        gl.render(renderScene.current, orthoCamera.current);

        // 5. Clear Pressure
        gl.setRenderTarget(pressure.write);
        mats.clear.uniforms.uTexture.value = pressure.read.texture;
        mats.clear.uniforms.value.value = config.PRESSURE;
        quad.current.material = mats.clear;
        gl.render(renderScene.current, orthoCamera.current);
        pressure.swap();

        // 6. Compute Pressure (Jacobi Iteration)
        mats.pressure.uniforms.uDivergence.value = divergence.texture;
        mats.pressure.uniforms.texelSize.value.set(velocity.texelSizeX, velocity.texelSizeY);
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
            gl.setRenderTarget(pressure.write);
            mats.pressure.uniforms.uPressure.value = pressure.read.texture;
            quad.current.material = mats.pressure;
            gl.render(renderScene.current, orthoCamera.current);
            pressure.swap();
        }

        // 7. Gradient Subtraction (Project velocity)
        gl.setRenderTarget(velocity.write);
        mats.gradientSubtract.uniforms.uPressure.value = pressure.read.texture;
        mats.gradientSubtract.uniforms.uVelocity.value = velocity.read.texture;
        mats.gradientSubtract.uniforms.texelSize.value.set(velocity.texelSizeX, velocity.texelSizeY);
        quad.current.material = mats.gradientSubtract;
        gl.render(renderScene.current, orthoCamera.current);
        velocity.swap();

        // 8. Advect Velocity
        gl.setRenderTarget(velocity.write);
        mats.advection.uniforms.uVelocity.value = velocity.read.texture;
        mats.advection.uniforms.uSource.value = velocity.read.texture;
        mats.advection.uniforms.dt.value = dt;
        mats.advection.uniforms.dissipation.value = config.VELOCITY_DISSIPATION;
        mats.advection.uniforms.texelSize.value.set(velocity.texelSizeX, velocity.texelSizeY);
        quad.current.material = mats.advection;
        gl.render(renderScene.current, orthoCamera.current);
        velocity.swap();

        // 9. Advect Dye (Color)
        gl.setRenderTarget(dye.write);
        mats.advection.uniforms.uVelocity.value = velocity.read.texture;
        mats.advection.uniforms.uSource.value = dye.read.texture;
        mats.advection.uniforms.dissipation.value = config.DENSITY_DISSIPATION;
        mats.advection.uniforms.texelSize.value.set(velocity.texelSizeX, velocity.texelSizeY);
        quad.current.material = mats.advection;
        gl.render(renderScene.current, orthoCamera.current);
        dye.swap();

        // 10. Display to Screen
        gl.setRenderTarget(null);
        mats.display.uniforms.uTexture.value = dye.read.texture;
        quad.current.material = mats.display;
        gl.render(renderScene.current, orthoCamera.current);
    }, 1); // priority 1 ensures it renders properly

    return null; // Entirely FBO based! No standard meshes
}
