"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import "./scene.css";

const CONFIG = {
  // MOVEMENT: How far and fast the object follows the mouse
  position: {
    x_intensity: 0.01, // Range of movement Left/Right
    y_intensity: 0.01, // Range of movement Up/Down
    speed: 0.009, // 0.05 = heavy/slow, 0.2 = fast/snappy
  },
  // TILT: How much the object rotates when you move the mouse
  tilt: {
    x_intensity: 2, // Tilt Up/Down strength
    y_intensity: 2, // Tilt Left/Right strength
    speed: 0.009, // Smoothness of the tilt
  },
  // BASE ROTATION: Constant background spin (optional)
  idleSpin: 0,
};

function CustomRoundedBox() {
  const meshRef = useRef<THREE.Mesh>(null);

  // 1. Get Viewport: Needed to map mouse (-1 to 1) to actual screen units
  const { viewport } = useThree();

  // Define your individual radii here: [Top-Left, Top-Right, Bottom-Right, Bottom-Left]
  const radii = [0.8, 0.2, 0.8, 0.2];
  const width = 5;
  const height = 5;
  // const depth = 1;

  // We use useMemo to create the custom shape only once (for performance)
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const [tl, tr, br, bl] = radii;

    // Drawing the path with custom corners
    shape.moveTo(-width / 2 + bl, -height / 2);
    shape.lineTo(width / 2 - br, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + br);
    shape.lineTo(width / 2, height / 2 - tr);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - tr, height / 2);
    shape.lineTo(-width / 2 + tl, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - tl);
    shape.lineTo(-width / 2, -height / 2 + bl);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + bl, -height / 2);

    // Turn the 2D shape into 3D
    const extrudeSettings = {
      depth: 1,
      bevelEnabled: true, // Turn on the bevel
      bevelThickness: 0.2, // How deep the bevel goes into the shape
      bevelSize: 0.2, // How far the bevel extends from the outline
      bevelOffset: 0, // Distance from the shape outline where bevel starts
      bevelSegments: 8, // Higher = smoother/rounder bevel; 1 = flat/chamfered
      curveSegments: 32, // Keeps your custom corners smooth
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [radii]); // Dependency array ensures efficiency

  useFrame((state) => {
    if (!meshRef.current) return;

    // A. POSITION TRACKING (Follow the Mouse)
    // Convert mouse (-1 to 1) to World Units (Viewport size)
    // We divide by 2 because 0 is the center
    const targetX = (state.pointer.x * viewport.width) / 1.5;
    const targetY = (state.pointer.y * viewport.height) / 1.5;

    // Smoothly move current position to target position (Lerp)
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      CONFIG.position.speed
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      CONFIG.position.speed
    );

    // B. AXIS TILT (Rotate based on Mouse)
    // When mouse goes UP (positive Y), we tilt object UP (negative X rotation)
    const targetTiltX = -state.pointer.y * CONFIG.tilt.x_intensity;
    const targetTiltY = state.pointer.x * CONFIG.tilt.y_intensity;

    // Smoothly apply the tilt
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetTiltX,
      CONFIG.tilt.speed
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetTiltY + state.clock.elapsedTime * CONFIG.idleSpin, // Adds your idle spin
      CONFIG.tilt.speed
    );
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#9555ff"
        transparent={true}
        opacity={0.5}
        roughness={0.1}
        metalness={0.1}
        // wireframe={true}
        // emissive={"#7300ff"}
        // emissiveIntensity={0.2}
        // flatShading={true}
      />
    </mesh>
  );
}

export default function Scene() {
  // We use a ref to point to the parent container usually,
  // but pointing to 'document.body' is a solid trick for full-screen backgrounds.
  return (
      <div className="scene-background-1">
        <div className="scene-overlay" />
        <Canvas
          camera={{ position: [0, 0, 10] }}
          // ADD THIS LINE:
          eventSource={typeof document === "undefined" ? undefined : document.body}
          eventPrefix="client"
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[5, 5, 5]} intensity={10} />
          <CustomRoundedBox />
        </Canvas>
      </div>
  );
}
