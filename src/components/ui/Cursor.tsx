"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Check for mobile/touch capability
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    if (isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e: PointerEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "back.out(1.7)", // Your signature movement lag
        overwrite: "auto",
      });
    };

    // --- Elastic Hover (Shrink with Wobble) ---
    const handleHover = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, .clickable");

      if (isInteractive) {
        gsap.to(cursor, {
          width: 25,
          height: 25,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)", // High frequency spring
        });
      } else {
        gsap.to(cursor, {
          width: 40,
          height: 40,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)", // Slower settle back to original
        });
      }
    };

    // --- Elastic Click Pulse ---
    const handleDown = () => {
      const tl = gsap.timeline();

      // Phase 1: Quick "Press" shrink
      tl.to(cursor, {
        scale: 0.8,
        duration: 0.15,
        ease: "power2.inOut",
      })
        // Phase 2: The "Elastic Release"
        .to(cursor, {
          scale: 1,
          duration: 0.8,
          // (amplitude, period) - 1.2 makes it pop more, 0.3 makes it wobble smoothly
          ease: "elastic.out(1.2, 0.3)",
        });
    };

    window.addEventListener("pointermove", moveCursor);
    window.addEventListener("pointerover", handleHover);
    window.addEventListener("pointerdown", handleDown);

    return () => {
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerover", handleHover);
      window.removeEventListener("pointerdown", handleDown);
    };
  }, [isMobile]);

  // Don't render on mobile to keep things clean
  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "40px",
        height: "40px",
        backgroundColor: "white",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 2147483647,
        mixBlendMode: "difference",
      }}
    />
  );
};

export default CustomCursor;
