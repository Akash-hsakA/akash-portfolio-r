'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import './HolographicBackground.css'; // Import the standard CSS file

// --- Configuration ---
const CONFIG = {
  stripes: 60.0,       // Ribbed glass amount
  speed: 0.15,         // Movement speed
  grain: 0.15,         // Texture amount
  color1: '#000000',   // Base
  color2: '#0033ff',   // Blue
  color3: '#00ff44',   // Green
  color4: '#ff0000',   // Red
};

// --- Shader Logic ---
const FlutedGlassMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uColor1: { value: new THREE.Color(CONFIG.color1) },
    uColor2: { value: new THREE.Color(CONFIG.color2) },
    uColor3: { value: new THREE.Color(CONFIG.color3) },
    uColor4: { value: new THREE.Color(CONFIG.color4) },
    uStripes: { value: CONFIG.stripes },
    uGrain: { value: CONFIG.grain },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uStripes;
    uniform float uGrain;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    varying vec2 vUv;

    // Noise function
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    float random(vec2 p) {
      return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // Fluted Glass Effect
      float stripeWidth = 1.0 / uStripes;
      float xRel = fract(vUv.x * uStripes); 
      float glassCurve = cos((xRel - 0.5) * 3.14159);
      
      // Distortion
      vec2 distortedUv = vUv;
      distortedUv.x += glassCurve * 0.01;
      distortedUv.y += glassCurve * 0.1;

      // Moving Noise
      float noise1 = snoise(distortedUv * 2.0 + uTime * 0.1);
      float noise2 = snoise(distortedUv * 3.5 - uTime * 0.15);
      
      // Color Mixing
      vec3 col = uColor1;
      float layer1 = smoothstep(-0.2, 0.6, noise1);
      col = mix(col, uColor2, layer1);
      float layer2 = smoothstep(-0.4, 0.5, noise2);
      col = mix(col, uColor3, layer2 * 0.8);
      float layer3 = smoothstep(0.6, 0.9, noise1 * noise2);
      col = mix(col, uColor4, layer3);

      // Vignette & Highlights
      float vignette = smoothstep(0.0, 0.4, xRel) * smoothstep(1.0, 0.6, xRel);
      col *= (0.5 + 0.5 * vignette);
      float specular = smoothstep(0.8, 0.95, glassCurve) * 0.3;
      col += specular;

      // Grain
      float grain = (random(vUv + uTime) - 0.5) * uGrain;
      col += grain;

      gl_FragColor = vec4(col, 1.0);
    }
  `
};

// --- Material Class & Registration ---
class FlutedGlassMaterialClass extends THREE.ShaderMaterial {
  constructor() {
    super(FlutedGlassMaterial);
  }
}
extend({ FlutedGlassMaterialClass });

// --- Type Declaration ---
declare module '@react-three/fiber' {
  interface ThreeElements {
    flutedGlassMaterialClass: any; 
  }
}

// --- Scene ---
const Hologram = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * CONFIG.speed;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[20, 10]} />
      <flutedGlassMaterialClass ref={materialRef} />
    </mesh>
  );
};

// --- Main Component ---
export default function HolographicBackground() {
  return (
    <div className="holo-container">
      <Canvas 
        className="holo-canvas"
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1]}
      >
        <Hologram />
      </Canvas>
    </div>
  );
}