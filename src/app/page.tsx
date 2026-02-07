"use client";
import { useLoader } from "@/context/LoaderContext";
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
      <DragClick
        thumbnailSrc="/assets/cards/PNG/card-joker-01.png"
        fullSizeSrc="/assets/cards/PNG/card-back-09.png"
      />
    </main>
  );
}
