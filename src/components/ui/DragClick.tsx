"use client";

import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import "./DragClick.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip, Draggable);
}

interface DragClickProps {
  frontSrc: string;
  backSrc: string;
  heading: string;
  description: string;
}

export default function DragClick({ frontSrc, backSrc, heading, description }: DragClickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const sourceWrapperRef = useRef<HTMLDivElement>(null);
  const targetWrapperRef = useRef<HTMLDivElement>(null);

  const sourceCardRef = useRef<HTMLDivElement>(null);
  const targetCardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [flipState, setFlipState] = useState<Flip.FlipState | null>(null);
  
  const [isInteractable, setIsInteractable] = useState(false);

  const handleFlip = () => {
    if (!isOpen) {
      if (sourceWrapperRef.current) {
        setFlipState(Flip.getState(sourceWrapperRef.current));
        setIsOpen(true);
      }
    } else {
      // 1. Lock interactions immediately
      setIsInteractable(false); 
      
      // 2. Force hide indicator AND restore brightness (overwrite: true forces it to kill hover tweens)
      gsap.to(".desktop-close-indicator", { opacity: 0, scale: 0.9, duration: 0.2, overwrite: true });
      if (targetCardRef.current) {
         gsap.to(targetCardRef.current.querySelectorAll("img"), { filter: "brightness(1)", duration: 0.2, overwrite: true });
      }

      gsap.to(textRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.3,
        onComplete: () => {
          if (targetWrapperRef.current) {
            setFlipState(Flip.getState(targetWrapperRef.current));
            setIsOpen(false);
          }
        },
      });
    }
  };

  const handleMouseEnter = () => {
    if (!isInteractable) return;

    // 1. Rotate safely (overwrite: "auto" stops animation fighting)
    gsap.to(targetCardRef.current, {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 5,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto" 
    });

    // 2. Dim the IMAGES, not the 3D wrapper, to prevent the 3D-flattening bug
    if (targetCardRef.current) {
      gsap.to(targetCardRef.current.querySelectorAll("img"), {
        filter: "brightness(0.7)",
        duration: 0.6,
        overwrite: "auto"
      });
    }

    // 3. Show indicator
    gsap.to(".desktop-close-indicator", {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(2)",
      overwrite: "auto"
    });
  };

  const handleMouseLeave = () => {
    if (!isInteractable) return;

    // 1. Return to the open 3D state
    gsap.to(targetCardRef.current, {
      rotateX: 180,
      rotateY: 5,
      rotateZ: 185,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto"
    });

    // 2. Restore Image Brightness
    if (targetCardRef.current) {
      gsap.to(targetCardRef.current.querySelectorAll("img"), {
        filter: "brightness(1)",
        duration: 0.6,
        overwrite: "auto"
      });
    }

    // 3. Hide the indicator
    gsap.to(".desktop-close-indicator", {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
      overwrite: "auto"
    });
  };

useLayoutEffect(() => {
    if (!flipState) return;
    const isMobile = window.innerWidth <= 768;
    const targetW = isMobile ? "240px" : "400px";
    const targetH = isMobile ? "336px" : "560px";

    if (isOpen && targetWrapperRef.current && sourceWrapperRef.current) {
      gsap.set(sourceWrapperRef.current, { opacity: 0 });

      Flip.from(flipState, {
        targets: targetWrapperRef.current,
        duration: 1,
        ease: "power2.inOut",
        absolute: true,
        onStart: () => {
          gsap.fromTo(
            targetCardRef.current,
            { rotateX: 0, rotateY: 0, rotateZ: 0, width: "150px", height: "210px" },
            // USING DYNAMIC SIZES HERE
            { rotateX: 180, rotateY: 5, rotateZ: 185, width: targetW, height: targetH, duration: 1, ease: "power2.inOut" }
          );
        },
        onComplete: () => {
          gsap.set(targetWrapperRef.current, { x: 0, y: 0 });

          // Animate text sliding in (uses Y axis for mobile, X for desktop)
          gsap.to(textRef.current, {
            opacity: 1,
            x: 0,
            y: 0, // Ensure Y resets for mobile
            duration: 0.6,
            ease: "back.out(1.7)",
            onComplete: () => setIsInteractable(true) 
          });
        },
      });
    } else if (!isOpen && sourceWrapperRef.current && sourceCardRef.current) {
      gsap.set(sourceWrapperRef.current, { opacity: 1 });

      Flip.from(flipState, {
        targets: sourceWrapperRef.current,
        duration: 1,
        ease: "power2.inOut",
        absolute: true,
        onStart: () => {
          const currentRotX = gsap.getProperty(targetCardRef.current, "rotateX") as number || 180;
          const currentRotY = gsap.getProperty(targetCardRef.current, "rotateY") as number || 5;
          const currentRotZ = gsap.getProperty(targetCardRef.current, "rotateZ") as number || 185;

          gsap.fromTo(
            sourceCardRef.current,
            // USING DYNAMIC SIZES HERE
            { rotateX: currentRotX, rotateY: currentRotY, rotateZ: currentRotZ, width: targetW, height: targetH },
            { rotateX: 0, rotateY: 0, rotateZ: 0, width: "150px", height: "210px", duration: 1, ease: "power2.inOut" }
          );
        },
        onComplete: () => {
          gsap.set(sourceWrapperRef.current, { x: 0, y: 0 });
        },
      });
    }

    setFlipState(null);
  }, [isOpen, flipState]);

  useGSAP(() => {
    Draggable.create(dragRef.current, {
      type: "x,y",
      bounds: "body",
      inertia: true,
      onClick: handleFlip,
    });
  }, []);

  return (
    <div ref={containerRef}>
      <div
        ref={dragRef}
        className={`drag-container card-holder clickable ${isOpen ? "active" : ""}`}
      >
        <div ref={sourceWrapperRef} className="card-wrapper" data-flip-id="joker-card">
          <div ref={sourceCardRef} className="card-3d">
            <div className="card-face card-front">
              <img src={backSrc} alt="Front" draggable={false} />
            </div>
            <div className="card-face card-back">
              <img src={frontSrc} alt="Back" draggable={false} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`drag-area-container ${isOpen ? "active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleFlip();
        }}
      >
        {isOpen && (
          <button className="mobile-close-btn" onClick={handleFlip} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        <div className={`content-wrapper ${isOpen ? "active" : ""}`}>
          <div ref={textRef} className="text-section">
            <span className="font-style heading-span">{heading}</span>
            <span className="font-style description-span">{description}</span>
          </div>

          <div className="card-section">
            {isOpen && (
              <div
                ref={targetWrapperRef}
                className="card-wrapper target-card-clickable"
                data-flip-id="joker-card"
                onClick={handleFlip} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave} 
              >
                <div className="desktop-close-indicator">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Click to close
                </div>

                <div ref={targetCardRef} className="card-3d">
                  <div className="card-face card-front">
                    <img src={backSrc} alt="Front" draggable={false} />
                  </div>
                  <div className="card-face card-back">
                    <img src={frontSrc} alt="Back" draggable={false} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}