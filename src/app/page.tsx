"use client";
import { useLoader } from "@/context/LoaderContext";
// import CustomCursor from "@/components/ui/Cursor";
import DragClick from "@/components/ui/DragClick";

import { MeshGradient } from "@paper-design/shaders-react";

import "./globals.css";
import "./page.css";

export default function Home() {
  // 2. Get the global loading state
  const { isLoading } = useLoader();

  // If loading, wait 6.5s. If not (already visited), wait 0.2s.
  const textDelay = isLoading ? 6500 : 200;

  return (
    <main className="main-container">
      {/* <CustomCursor /> */}
      {/* <MeshGradientBG/> */}
      <MeshGradient
        speed={0.35}
        scale={0.85}
        distortion={0.7}
        swirl={0.4}
        frame={306616.82300010807}
        grainMixer={0.75}
        grainOverlay={0.35}
        colors={["#0D5976", "#296790", "#63848D", "#090A07", "#4C4726", "#4A3602", "#2A1301"]}
        className="mesh-gradient-bg"
        style={{
          filter: "saturate(120%)",
          height: "100dvh",
          width: "100dvw",
        }}
      />
      <div className="home-text-container">
        <div className="fixed-w-h-textbox">
          <span className="heading-1">Advik</span>
        </div>

        <div className="fixed-w-h-textbox">
          <span className="heading-2">Ezra</span>
        </div>

        <div className="fixed-w-h-textbox">
          <span className="heading-3">Developer & Creator</span>
        </div>

        <div className="fixed-w-h-textbox small-text-container" style={{ animationDelay: `${textDelay}ms` }}>
          <span className="small-text">aka 'Akash'</span>
        </div>
      </div>
      <DragClick
        frontSrc="/assets/cards/PNG/card-joker-01.png"
        backSrc="/assets/cards/PNG/card-back-05.png"
        heading="Joker’s Curiosity"
        description="He didn't grow up chasing a role... He grew up chasing questions! That young boy was endlessly curious about the world!
        How things worked beneath the surface. He observed patterns. He broke things down. He wondered why before asking how. While most 
        people move toward labels, he moved toward learning. His interests were never forced. If something sparked curiosity, he followed 
        it...deeply! Over time, this instinct shaped him into a developer. But even now, he doesn't want to lock himself in a single title. 
        Curiosity never fits neatly into boxes, right?! He blends logic with creativity, structure with imagination. He learns across 
        domains & each new skill becomes a lens! A mind trained to explore, to understand and to build. And everything truly shifted the 
        day he discovered..."
      />
    </main>
  );
}
