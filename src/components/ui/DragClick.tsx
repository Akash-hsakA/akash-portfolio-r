"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import "./DragClick.css";

// Register plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, Draggable);
}

// 1. Rename CONFIG to DEFAULTS (Best practice)
const DEFAULTS = {
  thumbnailSrc: "",
  fullSizeSrc: "",
};

// 2. Define the Interface (Type Safety)
// We make them 'optional' (?) so you don't HAVE to pass them if you want defaults.
interface DragClickProps {
  thumbnailSrc?: string;
  fullSizeSrc?: string;
}

// 3. Destructure props in the function arguments
// We assign default values right here using '='
export default function DragClick({
  thumbnailSrc = DEFAULTS.thumbnailSrc,
  fullSizeSrc = DEFAULTS.fullSizeSrc,
}: DragClickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // 1. Define handleFlip using useCallback so it is stable
  const handleFlip = useCallback(() => {
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
  }, []);

  useGSAP(() => {
    if (!dragRef.current) return;

    const tracker = Draggable.create(dragRef.current, {
      type: "x,y",
      bounds: "body",
      inertia: true,
      // 2. KEY FIX: Use GSAP's native onClick for the draggable element
      // This ensures it works on Mobile (Tap) and Desktop (Click)
      onClick: function () {
        handleFlip();
      },
      // Optional: Allow a tiny bit of movement and still count as a click (good for mobile)
      maxPress: 5,
    });

    return () => {
      tracker[0]?.kill();
    };
  }, [handleFlip]); // Add handleFlip to dependencies

  return (
    <div ref={containerRef}>
      {/* DRAGGABLE THUMBNAIL */}
      <div
        ref={dragRef}
        className="drag-container"
        // 3. REMOVED React 'onClick' here.
        // We let Draggable handle the click internally.
      >
        <img
          className="thumbnail"
          data-flip-id="img"
          src={thumbnailSrc}
          alt="Thumbnail"
          draggable={false}
        />
      </div>

      {/* FULL SIZE CONTAINER */}
      {/* We keep standard onClick here because this element is NOT draggable */}
      <div className="drag-area-container" onClick={handleFlip}>
        <img className="full-size" data-flip-id="img" src={fullSizeSrc} alt="Full Size" />
      </div>
    </div>
  );
}
