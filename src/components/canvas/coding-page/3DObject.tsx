"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Center, Text } from "@react-three/drei";
import * as THREE from "three";
import "./3DObject.css";

// ... (CONFIG object remains the same) ...
const CONFIG = {
  position: { x_intensity: 0.01, y_intensity: 0.01, speed: 0.009 },
  tilt: { x_intensity: 2, y_intensity: 2, speed: 0.009 },
  idleSpin: 0,
};

function CustomRoundedBox() {
  // ... (MeshRef, Viewport, Radii, Geometry definition remains the same) ...
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Check if it is mobile (width less than 7 units)
  const isMobile = viewport.width < 5;

  // Set the font size based on the check
  // If mobile, use 1.5. If desktop, use 3.
  const responsiveFontSize = isMobile ? 0.8 : 3;
  const CubeWidth = isMobile ? 3 : 5;
  const CubeHeight = isMobile ? 3 : 5;
  const Cuberadii = isMobile ? 1 : 2;

  const radii = [Cuberadii, Cuberadii, Cuberadii, Cuberadii];
  const width = CubeWidth;
  const height = CubeHeight;
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const [tl, tr, br, bl] = radii;
    shape.moveTo(-width / 2 + bl, -height / 2);
    shape.lineTo(width / 2 - br, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + br);
    shape.lineTo(width / 2, height / 2 - tr);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - tr, height / 2);
    shape.lineTo(-width / 2 + tl, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - tl);
    shape.lineTo(-width / 2, -height / 2 + bl);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + bl, -height / 2);
    const extrudeSettings = {
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 0.3,
      bevelSize: 0.4,
      bevelOffset: 0,
      bevelSegments: 12,
      curveSegments: 32,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [radii]);

  // 1. Setup a reference to store Gyro data
  const gyro = useRef({ x: 0, y: 0 });

  // 2. Add Listener for Device Orientation (Mobile)
  React.useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta) return;

      // Normalize values roughly to -1 to 1 range (like mouse)
      // Gamma (Left/Right) is usually -90 to 90. Dividing by 45 gives a good range.
      // Beta (Up/Down) is -180 to 180.
      gyro.current.x = THREE.MathUtils.clamp(e.gamma / 45, -1, 1);
      gyro.current.y = THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1); // Subtract 45 assuming user holds phone at angle
    };

    // Only add listener if mobile
    if (isMobile && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [isMobile]);

  // 3. Updated Animation Loop
  useFrame((state) => {
    if (!meshRef.current) return;

    let inputX, inputY;

    // CHECK: Are we on Mobile?
    if (isMobile) {
      // Use Gyro Data
      inputX = gyro.current.x;
      inputY = gyro.current.y;
    } else {
      // Use Mouse Data (Desktop)
      inputX = state.pointer.x;
      inputY = state.pointer.y;
    }

    // --- The rest of your physics logic remains exactly the same ---

    // A. Movement (Follow input)
    const targetX = (inputX * viewport.width) / 1.5;
    const targetY = (inputY * viewport.height) / 1.5;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      CONFIG.position.speed,
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      CONFIG.position.speed,
    );

    // B. Tilt (Rotate based on input)
    const targetTiltX = -inputY * CONFIG.tilt.x_intensity;
    const targetTiltY = inputX * CONFIG.tilt.y_intensity;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetTiltX,
      CONFIG.tilt.speed,
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetTiltY + state.clock.elapsedTime * CONFIG.idleSpin, // Adding idle spin on Y axis
      CONFIG.tilt.speed,
    );
  });
  return (
    <group>
      {/* UPDATED TEXT */}
      <Text
        position={[0, 0, -3]}
        fontSize={responsiveFontSize}
        // 1. Updated Color
        color="#070707"
        //#FFFAF5 is a soft off-white color
        anchorX="center"
        anchorY="middle"
        // 2. Point to the local font file in /public/fonts/
        font="/assets/fonts/Arcon-Regular.otf"
      >
        _scroll down
      </Text>

      <Center>
        <mesh ref={meshRef} geometry={geometry}>
          <MeshTransmissionMaterial
            backside={true}
            samples={4}
            resolution={1024}
            transmission={1}
            roughness={0.0}
            thickness={4}
            ior={2}
            chromaticAberration={0.1}
            anisotropy={0.0}
            distortion={0.01}
            distortionScale={1}
            temporalDistortion={0.5}
            clearcoat={0.0}
            attenuationDistance={0.5}
            attenuationColor="#ffffff"
            color="#ffffff"
            wireframe={false}
          />
        </mesh>
      </Center>
    </group>
  );
}

export default function Object3D() {
  return (
    <div className="object3D-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        eventSource={typeof document === "undefined" ? undefined : document.body}
        eventPrefix="client"
        // Removed gl={{ alpha: true }} because we are adding a solid background color now
      >
        {/* NEW: Add solid background color here */}
        <color attach="background" args={["#ffffff"]} />

        {/* Alternatively, for an IMAGE background use Environment: */}
        {/* <Environment files="/path/to/your/image.hdr" background /> */}

        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={10} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={5} />

        <CustomRoundedBox />
      </Canvas>
    </div>
  );
}
