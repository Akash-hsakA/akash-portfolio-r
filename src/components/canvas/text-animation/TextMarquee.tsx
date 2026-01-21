"use client";
import React from "react";
import { motion } from "motion/react"; // Import for Motion v12+
import "./TextMarquee.css";

interface TextMarqueeProps {
  text: string;
  size?: string;
  textweight?: number;
  speed?: number;
  TextTransform?: "uppercase" | "lowercase" | "capitalize" | "none"; // Typed strictly for TS
  color?: string;
  background?: string;
  borderColor?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderHeight?: number;
  paddingtop?: string;
  paddingbottom?: string;
}

export default function TextMarquee({
  text,
  size = "4rem",
  textweight = 800,
  speed = 20,
  TextTransform = "uppercase",
  color = "#FFFFFF",
  background = "transparent",
  borderColor = "rgba(255, 255, 255, 0.1)",
  borderTop = false,
  borderBottom = false,
  borderHeight = 1,
  paddingtop = "20px",
  paddingbottom = "20px",
}: TextMarqueeProps) {
  
  // Create separator (Adjust spacing as needed)
  const separator = "\u00A0"; //extra space needed use this for spaning '\u00A0'

  // Repeat text to ensure it fills wide screens
  const singleContent = (text + separator).repeat(4);

  // Dynamic Container Styles
  const containerStyle = {
    backgroundColor: background,
    borderTop: borderTop ? `${borderHeight}px solid ${borderColor}` : "none",
    borderBottom: borderBottom ? `${borderHeight}px solid ${borderColor}` : "none",
    paddingTop: paddingtop,
    paddingBottom: paddingbottom,
    overflow: "hidden",     // Ensure overflow is hidden here
    display: "flex",        // Flex ensures the track sits correctly
    width: "100%",
  };

  // Dynamic Text Styles
  const textStyle = {
    color: color,
    fontSize: size,
    fontWeight: textweight,
    textTransform: TextTransform,
    whiteSpace: "nowrap",   // Critical: keeps text on one line
    display: "flex",        // Flex keeps the two spans side-by-side
    width: "fit-content",   // Track takes only needed space
  } as React.CSSProperties;

  return (
    <div className="marquee-wrapper" style={containerStyle}>
      {/* MOTION TRACK
         1. We replace the standard div with motion.div
         2. We animate 'x' from 0% to -50%
         3. Why -50%? We have 2 copies of the content. When the first copy 
            slides completely out of view (which is 50% of the total width), 
            the loop resets instantly to 0.
      */}
      <motion.div
        className="marquee-track"
        style={textStyle}
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {/* Copy 1 */}
        <span className="marquee-text">{singleContent}</span>
        
        {/* Copy 2 (Identical Clone) */}
        <span className="marquee-text">{singleContent}</span>
      </motion.div>
    </div>
  );
}