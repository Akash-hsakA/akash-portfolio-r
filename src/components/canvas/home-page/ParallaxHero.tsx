"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./ParallaxHero.css"; // Import the CSS


const LAYERS = [
  {
    src: "/image/home-page-image/desktop-parallax-image-layers/desktop-parallax-image-layer-1.png",
    speed: 20,
  },
  {
    src: "/image/home-page-image/desktop-parallax-image-layers/desktop-parallax-image-layer-2.png",
    speed: 40,
  },
  {
    src: "/image/home-page-image/desktop-parallax-image-layers/desktop-parallax-image-layer-3.png",
    speed: 60,
  },
  {
    src: "/image/home-page-image/desktop-parallax-image-layers/desktop-parallax-image-layer-4.png",
    speed: 80,
  },
  {
    src: "/image/home-page-image/desktop-parallax-image-layers/desktop-parallax-image-layer-5.png",
    speed: 100,
  },
];

// interface ParallaxHeroProps {
//   className?: string;
// }

export default function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { innerWidth, innerHeight } = window;

      // Calculate mouse position (-1 to +1) from the center of the screen
      const xPct = e.clientX / innerWidth - 0.5;
      const yPct = e.clientY / innerHeight - 0.5;

      // Loop through each layer and animate it
      LAYERS.forEach((layer, i) => {
        // Select the specific image layer by index
        const selector = `.parallax-layer-${i}`;

        gsap.to(selector, {
          x: xPct * layer.speed, // Move Horizontally
          y: yPct * layer.speed, // Move Vertically
          duration: 1, // Smooth lag
          ease: "power2.out",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="parallax-hero-container">
      {LAYERS.map((layer, i) => (
        <div key={i} className={`parallax-layer parallax-layer-${i}`}>
          <Image src={layer.src} alt={`Layer ${i + 1}`} fill quality={75} priority />
        </div>
      ))}
      {/* <div className="mask-layer" /> */}
    </div>
  );
}
