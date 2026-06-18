import * as THREE from "three";

export const baseVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const clearShader = {
  uniforms: {
    uTexture: { value: null },
    value: { value: 0.0 }
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main() {
      gl_FragColor = value * texture2D(uTexture, vUv);
    }
  `
};

export const splatShader = {
  uniforms: {
    uTarget: { value: null },
    aspectRatio: { value: 1.0 },
    color: { value: new THREE.Vector3() },
    point: { value: new THREE.Vector2() },
    radius: { value: 0.25 }
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main() {
      vec2 p = vUv - point.xy;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      vec3 base = texture2D(uTarget, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.0);
    }
  `
};

export const advectionShader = {
  uniforms: {
    uVelocity: { value: null },
    uSource: { value: null },
    dt: { value: 0.016 },
    dissipation: { value: 1.0 },
    texelSize: { value: new THREE.Vector2() }
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;

    void main() {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = dissipation * texture2D(uSource, coord);
      gl_FragColor.a = 1.0;
    }
  `
};

export const divergenceShader = {
  uniforms: {
    uVelocity: { value: null },
    texelSize: { value: new THREE.Vector2() }
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;

    void main() {
      float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
      float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
      float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vUv.x - texelSize.x < 0.0) { L = -C.x; }
      if (vUv.x + texelSize.x > 1.0) { R = -C.x; }
      if (vUv.y - texelSize.y < 0.0) { B = -C.y; }
      if (vUv.y + texelSize.y > 1.0) { T = -C.y; }
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `
};

export const pressureShader = {
  uniforms: {
    uPressure: { value: null },
    uDivergence: { value: null },
    texelSize: { value: new THREE.Vector2() }
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    uniform vec2 texelSize;

    void main() {
      float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
      float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
      float C = texture2D(uPressure, vUv).x;
      float divergence = texture2D(uDivergence, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
  `
};

export const gradientSubtractShader = {
  uniforms: {
    uPressure: { value: null },
    uVelocity: { value: null },
    texelSize: { value: new THREE.Vector2() }
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;

    void main() {
      float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
      float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
      float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `
};

export const displayShader = {
  uniforms: {
    tex: { value: null },
    uColor1: { value: new THREE.Color() },
    uColor2: { value: new THREE.Color() },
    uColor3: { value: new THREE.Color() },
    uAbsorption: { value: 0.0 }
  },
  vertexShader: baseVertexShader,
  fragmentShader: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D tex;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uAbsorption;

    void main() {
      vec3 dye = texture2D(tex, vUv).rgb;
      
      // Calculate a density/intensity value from the dye
      float intensity = length(dye);
      
      // Map dye colors using the 3 colors
      vec3 finalColor = mix(uColor1, uColor2, smoothstep(0.0, 0.5, intensity));
      finalColor = mix(finalColor, uColor3, smoothstep(0.5, 1.5, intensity));
      
      // Add absorption void
      if (uAbsorption > 0.0) {
        finalColor = mix(finalColor, vec3(0.0), uAbsorption);
      }
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};
