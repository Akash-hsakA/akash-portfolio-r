"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./RotatingCube.css";

export default function RotatingCube() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const cube = ".cube";

    // 1. Initial State: Completely Hidden
    gsap.set(cube, { autoAlpha: 0 });

    // 2. Rotation Animation (Runs forever, even when hidden)
    gsap.to(cube, {
      rotationX: 360,
      rotationY: 360,
      duration: 10,
      repeat: -1,
      ease: "none",
    });

    // 3. Reveal Animation (Starts after 20 seconds)
    gsap.to(cube, {
      autoAlpha: 1, // Changes opacity to 1 and visibility to visible
      duration: 0,
      delay: 0, // <--- Second Delay
      ease: "power2.inOut",
    });

  }, { scope: container });

  return (
    <div className="Rotating-Cube" ref={container}>
      {/* 3D Cube Structure */}
      <div className="cube">
        <div className="face front"></div>
        <div className="face back"></div>
        <div className="face right"></div>
        <div className="face left"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
      </div>
    </div>
  );
}