"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

// A simple rotating box component for testing
function SpinningBox() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
    //   meshRef.current.rotation.y += delta;
    //   meshRef.current.rotation.z += delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 3]} />
      <meshStandardMaterial color="#9e0000" /> {/* A purple that pops against your BG */}
    </mesh>
  );
}

export default function Scene() {
  return (
    // Tailwind: absolute position, full screen, z-index 0 (background layer)
    <div className="absolute inset-0 z-0 h-screen w-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={5} />
        <SpinningBox />
      </Canvas>
    </div>
  );
}