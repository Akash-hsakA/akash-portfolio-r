"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import "./CursorTilt.css";

interface CursorTiltProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function CursorTilt({ children, className, id }: CursorTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // --- 1. MOUSE LOGIC (Desktop) ---
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      
      // Percentage (-1 to +1)
      const xPct = (e.clientX / innerWidth - 0.5) * 2;
      const yPct = (e.clientY / innerHeight - 0.5) * 2;

      gsap.to(containerRef.current, {
        rotationY: xPct * 2,  // Multiplier determines tilt strength
        rotationX: -yPct * 2,
        duration: 1.5,
        ease: "power2.out",
        transformPerspective: 1000,
        transformOrigin: "center center",
      });
    };

    // --- 2. GYRO LOGIC (Mobile) ---
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta) return;

      // Gamma: Left/Right tilt (-90 to 90)
      // Beta: Front/Back tilt (-180 to 180)
      
      // We clamp the values so the tilt doesn't go too crazy
      const maxTilt = 15; // Max degrees to rotate
      const gamma = gsap.utils.clamp(-maxTilt, maxTilt, e.gamma);
      const beta = gsap.utils.clamp(-maxTilt, maxTilt, e.beta);

      gsap.to(containerRef.current, {
        rotationY: gamma,       // Rotate based on phone tilt
        rotationX: -beta + 30,  // Subtract 30 to compensate for holding phone at angle
        duration: 2,            // Slower duration for smoother mobile feel
        ease: "power2.out",
        transformPerspective: 1000,
        transformOrigin: "center center",
      });
    };

    // --- 3. ATTACH LISTENERS ---
    
    // Check if it's a touch device to prioritize Gyro
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouch && window.DeviceOrientationEvent) {
       // Mobile: Listen for tilt
       window.addEventListener("deviceorientation", handleOrientation);
    } else {
       // Desktop: Listen for mouse
       window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      id={id}
      // We scale it up slightly (1.1) so edges don't show when tilting
    >
      {children}
    </div>
  );
}