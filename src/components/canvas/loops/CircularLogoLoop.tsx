"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import useIsMobile from "@/hooks/useIsMobile";
import "./CircularLogoLoop.css";

interface LogoItem {
  src: string;
  href: string;
  alt: string;
}

interface CircularLogoLoopProps {
  logos: LogoItem[];
  radius?: number;
  speed?: number;
  backgroundColor?: string;
  logoSize?: number;
  className?: string;
}

export default function CircularLogoLoop({
  logos,
  radius = 150,
  speed = 20,
  backgroundColor = "#070707",
  logoSize = 50,
  className = "",
}: CircularLogoLoopProps) {
  
  const isMobile = useIsMobile();
  const mobilelogoSize = logoSize / 1.2;

  return (
    <div
      // 1. Replaced 'orbit-wrapper relative flex...' with just 'orbit-wrapper'
      className={`orbit-wrapper ${className}`}
      style={{
        // width: radius * 2 + logoSize * 2,
        width: "0dvw",
        // height: radius * 2 + logoSize * 2,
        // height: "10dvh",
        height:(isMobile ? '80dvh' : '10dvh'),
      }}
    >
      {/* Central Background */}
      <div
        // 2. Replaced 'absolute rounded-full border...' with 'orbit-background'
        className="orbit-background"
        style={{
          borderColor: backgroundColor,
          // width: radius * 1.5,
          width: radius * (isMobile ? 1.5 : 1.5),
          // height: radius * 1.5,
          height: radius * (isMobile ? 1.5 : 1.5),
          // borderWidth: radius * 0.5,
          borderWidth: radius * (isMobile ? 0.48 : 0.5),
        }}
      />

      {/* Rotating Ring */}
      <div
        // 3. Replaced 'orbit-container absolute w-full...' with just 'orbit-container'
        className="orbit-container"
        style={{ "--duration": `${speed}s` } as React.CSSProperties}
      >
        {logos.map((logo, index) => {
          const angle = (index / logos.length) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={index}
              // 4. Replaced 'absolute top-1/2 left-1/2...' with 'orbit-item-wrapper'
              className="orbit-item-wrapper"
              style={{
                // width: logoSize,
                width: (isMobile ? mobilelogoSize : logoSize),
                // height: logoSize,
                height: (isMobile ? mobilelogoSize : logoSize),
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              {/* Counter-rotate Item */}
              <div className="orbit-item">
                <Link href={logo.href} target="_blank" className="orbit-link">
                  {/* Visual Bubble */}
                  <div className="orbit-logo-target">
                    {/* Padding/Inner Wrapper */}
                    <div className="orbit-logo-inner">
                      <Image src={logo.src} alt={logo.alt} fill className="orbit-image" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
