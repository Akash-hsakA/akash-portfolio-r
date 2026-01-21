"use client";

import { useRef, useState, useEffect, useMemo, ReactNode } from "react";
import { Canvas, createPortal, useFrame, useThree, ThreeElements } from "@react-three/fiber";
import { useFBO, useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";

import "./FluidGlass.css";

/* -------------------------------------------------------------------------- */
/* TYPES                                   */
/* -------------------------------------------------------------------------- */

type Mode = "lens" | "cube";

interface FluidGlassProps {
  mode?: Mode;
  children?: ReactNode; // The content you want BEHIND the glass
  glassProps?: Record<string, any>; // Tweak material (ior, thickness, etc.)
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                              */
/* -------------------------------------------------------------------------- */

export default function FluidGlass({ 
  mode = "lens", 
  children, 
  glassProps = {} 
}: FluidGlassProps) {
  
  // Select the correct shape based on mode
  const ShapeComponent = mode === "cube" ? CubeShape : LensShape;

  return (
    <div className="pointer-tracker-layer">
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <ShapeComponent modeProps={glassProps}>
          {children}
        </ShapeComponent>
      </Canvas>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CORE LOGIC (WRAPPER)                           */
/* -------------------------------------------------------------------------- */

type ModeWrapperProps = ThreeElements['mesh'] & {
  children?: ReactNode;
  glb?: string;        // Path to 3D model
  geometryKey?: string; // Name of the mesh inside the GLTF
  modeProps?: Record<string, any>;
};

function ModeWrapper({
  children,
  glb,
  geometryKey,
  modeProps = {},
  ...props
}: ModeWrapperProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();
  
  // 1. Create a separate scene to render the background content
  const [backgroundScene] = useState(() => new THREE.Scene());
  
  // 2. Create the FBO (Frame Buffer Object) - essentially a texture in memory
  const buffer = useFBO();

  // 3. Load the 3D Model (Only if GLB is provided)
  const { nodes } = useGLTF(glb || "/assets/3d/lens.glb");
  
  // Logic to determine geometry scale relative to screen
  const geoWidthRef = useRef<number>(1);
  useEffect(() => {
    if (!glb || !geometryKey) return;
    const geo = (nodes[geometryKey] as THREE.Mesh)?.geometry;
    if (geo) {
      geo.computeBoundingBox();
      geoWidthRef.current = geo.boundingBox!.max.x - geo.boundingBox!.min.x || 1;
    }
  }, [nodes, geometryKey, glb]);

  // 4. The Loop: Follow Pointer & Render Scene to Buffer
  useFrame((state, delta) => {
    const { gl, camera, pointer } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    // A. Pointer Following Math
    // We convert normalized pointer (-1 to 1) to world units
    const x = (pointer.x * v.width) / 2;
    const y = (pointer.y * v.height) / 2;
    
    // Smooth movement using 'maath'
    easing.damp3(meshRef.current.position, [x, y, 15], 0.15, delta);

    // B. Auto-scaling (optional, ensures glass isn't too huge/small)
    if (!modeProps.scale) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      meshRef.current.scale.setScalar(Math.min(0.15, desired));
    }

    // C. Render the background content into the FBO (Buffer)
    gl.setRenderTarget(buffer);
    gl.render(backgroundScene, camera);
    gl.setRenderTarget(null); // Return to normal screen rendering
  });

  // Extract material props with defaults
  const { 
    scale, ior = 1.15, thickness = 5, anisotropy = 0.01, 
    chromaticAberration = 0.1, ...extraMat 
  } = modeProps;

  // Use the loaded geometry OR fallback if you don't have the GLB
  const geometry = glb && geometryKey 
    ? (nodes[geometryKey] as THREE.Mesh)?.geometry 
    : undefined;

  return (
    <>
      {/* 1. Portal: Renders children into the separate background scene */}
      {createPortal(children, backgroundScene)}

      {/* 2. Background Plane: Displays the content normally behind the glass */}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>

      {/* 3. The Glass Object: Follows mouse, distorts the background buffer */}
      <mesh
        ref={meshRef}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={geometry}
        {...props}
      >
        {/* If no GLB is found, use these standard geometries as fallback */}
        {!geometry && geometryKey === "Cylinder" && <cylinderGeometry args={[10, 10, 2, 64]} />}
        {!geometry && geometryKey === "Cube" && <boxGeometry args={[15, 15, 15]} />}

        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior}
          thickness={thickness}
          anisotropy={anisotropy}
          chromaticAberration={chromaticAberration}
          {...extraMat}
        />
      </mesh>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* SHAPE WRAPPERS                             */
/* -------------------------------------------------------------------------- */

function LensShape({ modeProps, children }: { modeProps?: any, children?: ReactNode }) {
  return (
    <ModeWrapper 
      glb="/assets/3d/lens.glb" // Ensure this file exists in /public/assets/3d/
      geometryKey="Cylinder" 
      modeProps={modeProps}
    >
      {children}
    </ModeWrapper>
  );
}

function CubeShape({ modeProps, children }: { modeProps?: any, children?: ReactNode }) {
  return (
    <ModeWrapper 
      glb="/assets/3d/cube.glb" // Ensure this file exists in /public/assets/3d/
      geometryKey="Cube" 
      modeProps={modeProps}
    >
      {children}
    </ModeWrapper>
  );
}