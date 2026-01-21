"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import "./DragClick.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, Draggable);
}

const CONFIG = {
  // Next.js serves "public/assets/..." as "/assets/..."
  thumbnailSrc: "/assets/cards/card-a-spade-05.png",
  fullSizeSrc: "/assets/cards/card-back-02.png" 
};

export default function DragClick() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // SAFETY CHECK: If the element doesn't exist, stop immediately.
    if (!dragRef.current) return;

    // Create Draggable on the specific element
    const tracker = Draggable.create(dragRef.current, {
      type: "x,y",
      bounds: "body", // Safer than using a ref for bounds
      inertia: true,
    });

    // Cleanup when component unmounts
    return () => {
      tracker[0]?.kill();
    };
  }, []); // Dependencies array is empty, runs once on mount

  const handleFlip = () => {
    const thumbnail = containerRef.current?.querySelector(".thumbnail");
    const fullSize = containerRef.current?.querySelector(".full-size");

    if (!thumbnail || !fullSize) return;

    const state = Flip.getState([thumbnail, fullSize]);

    thumbnail.classList.toggle("active");
    fullSize.classList.toggle("active");

    Flip.from(state, {
      duration: 0.6,
      fade: true,
      absolute: true,
      toggleClass: "flipping",
      ease: "power1.inOut",
      zIndex: 999,
    });
  };

  return (
    <div ref={containerRef}>
      
      {/* DRAGGABLE THUMBNAIL */}
      <div 
        ref={dragRef} 
        className="drag-container" 
        onClick={handleFlip}
      >
        <img 
          className="thumbnail" 
          data-flip-id="img" 
          src={CONFIG.thumbnailSrc} 
          alt="Thumbnail"
          draggable={false} 
        />
      </div>

      {/* FULL SIZE CONTAINER */}
      <div className="drag-area-container" onClick={handleFlip}>
        <img 
          className="full-size" 
          data-flip-id="img" 
          src={CONFIG.fullSizeSrc} 
          alt="Full Size" 
        />
      </div>

    </div>
  );
}