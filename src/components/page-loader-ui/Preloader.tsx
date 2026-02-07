"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import RotatingCube from "@/components/canvas/RotatingCube"
import "./Preloader.css";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const container = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete(); // Tell page.tsx we are done
      }
    });

    // 1. Initial Reveal of Text
    tl.to(".loader-text-row", {
      opacity: 1,
      duration: 0.5,
    });

    // 2. Animate Counter & Bar Width together
    // We use a proxy object to animate the number 'value'
    const counterProxy = { value: 0 };

    tl.to(counterProxy, {
      value: 100,
      duration: 5, // Total load time in seconds
      ease: "power2.inOut",
      onUpdate: () => {
        // Update the Number State
        setProgress(Math.round(counterProxy.value));
        // Update the Bar Width directly via ref for performance
        if (barRef.current) {
          barRef.current.style.width = `${counterProxy.value}%`;
        }
      }
    });

    // 3. The "Exit" Animation (Slide Up / Fade Out)
    tl.to(container.current, {
      yPercent: -100, // Slides the whole white screen UP
      duration: 1,
      ease: "expo.inOut",
      delay: 0.2
    });

  }, { scope: container });

  return (
    <div ref={container} className="preloader-container">
      
      <div className="loader-wrapper">
        {/* TEXT ROW */}
        <div className="loader-text-row">
          <span>Loading - {progress}%</span>
          {/* You can customize this URL text */}
          <span>...</span>
        </div>

        {/* LINE ROW */}
        <div className="progress-line-bg">
          <div ref={barRef} className="progress-bar"></div>
        </div>
      </div>

      <RotatingCube/>
      {/* OPTIONAL DECORATION */}
      <div className="bottom-text">
        INITIALIZING SYSTEM...
      </div>
    </div>
  );
}