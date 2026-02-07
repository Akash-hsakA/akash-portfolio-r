"use client";
import { useLoader } from "@/context/LoaderContext"; // 1. Use Context

// import { useState, useEffect } from "react";
// import Preloader from "@/components/ui/Preloader";
import BlurText from "@/components/canvas/text-animation/BlurText";

import CursorTilt from "@/components/ui/CursorTilt";
import ParallaxHero from "@/components/canvas/home-page/ParallaxHero";

import DragClick from "@/components/ui/DragClick";

import Image from "next/image";
// import bgImageDesktop from "../../public/image/home-page-image/portfolio-home-page-desktop-image.png";
import bgImageMobile from "../../public/image/home-page-image/portfolio-home-page-mobile-image.png";

import "./globals.css";
import "./page.css";

export default function Home() {
  // 2. Get the global loading state
  const { isLoading } = useLoader();

  // If loading, wait 6.5s. If not (already visited), wait 0.2s.
  const textDelay = isLoading ? 6500 : 200;

  return (
    <main className="main-container">
      <CursorTilt className="img-container" id="hero-image">
        <Image
          alt="Background Mobile"
          src={bgImageMobile}
          quality={75}
          fill
          priority
          className="bg-img-home mobile-bg" // Added 'mobile-bg' class
        />
        {/* <Image
          alt="Background Desktop"
          src={bgImageDesktop}
          quality={100}
          fill
          priority
          className="bg-img-home desktop-bg" // Added 'desktop-bg' class
        /> */}
      </CursorTilt>

      <ParallaxHero />

      <div className="text-container">
        <div className="text-left">
          <div className="blur-container-heading">
            <BlurText
              text="Akash"
              delay={150}
              startDelay={textDelay}
              animateBy="letters"
              direction="top"
              className="blur-text-heading"
            />
          </div>
          <div className="blur-container-small">
            <BlurText
              text="Jack of all trades, master of none, though oftentimes better than a master of one"
              delay={200}
              startDelay={textDelay}
              animateBy="words"
              direction="top"
              className="blur-text-small"
            />
          </div>
        </div>
      </div>
      <DragClick
        thumbnailSrc="/assets/cards/PNG/card-joker-01.png"
        fullSizeSrc="/assets/cards/PNG/card-back-09.png"
      />
    </main>
  );
}
