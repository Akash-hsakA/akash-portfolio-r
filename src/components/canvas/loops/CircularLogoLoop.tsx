"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image"; // Works perfectly with .svg files in public/ folder
import { motion } from "motion/react";
import "./CircularLogoLoop.css";

interface LogoItem {
  src: string;      // Can be "/logos/icon.svg"
  href: string;
  alt: string;
}

interface CircularLogoLoopProps {
  logos: LogoItem[];
  radius?: number;          
  speed?: number;           
  backgroundColor?: string; 
  logoSize?: number;        // This sets the 1:1 Dimension (e.g., 50px by 50px)
  className?: string;       
}

export default function CircularLogoLoop({
  logos,
  radius = 150,
  speed = 20,
  backgroundColor = "#070707",
  logoSize = 50, // Default size (Width = 50, Height = 50)
  className = "",
}: CircularLogoLoopProps) {
  
  return (
    <div 
      className={`orbit-wrapper relative flex items-center justify-center ${className}`}
      style={{
        width: radius * 2 + logoSize * 2,
        height: radius * 2 + logoSize * 2,
      }}
    >
      {/* Central Background */}
      <div 
        className="absolute rounded-full border border-white/10"
        style={{
          width: radius * 2,
          height: radius * 2,
          backgroundColor: backgroundColor,
        }}
      />

      {/* Rotating Ring */}
      <div 
        className="orbit-container absolute w-full h-full"
        style={{ "--duration": `${speed}s` } as React.CSSProperties}
      >
        {logos.map((logo, index) => {
          const angle = (index / logos.length) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 flex items-center justify-center"
              style={{
                // 1. STRICT 1:1 RATIO ENFORCED HERE
                width: logoSize,
                height: logoSize, 
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div className="orbit-item w-full h-full">
                <Link href={logo.href} target="_blank" className="block w-full h-full">
                  
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-full h-full bg-black/80 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center overflow-hidden"
                  >
                    {/* 2. LOGO CONTAINER */}
                    <div className="relative w-full h-full p-3"> {/* p-3 gives breathing room */}
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        // 3. 'contain' ensures the logo isn't cropped, keeping it neat
                        className="object-contain" 
                      />
                    </div>

                  </motion.div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}