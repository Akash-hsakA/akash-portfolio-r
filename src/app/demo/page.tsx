"use client";
import { useRef } from "react";
import HolographicBackground from "@/components/canvas/background/HolographicBackground";
import VariableProximity from "@/components/canvas/text-animation/VariableProximity";
import TextMarquee from "@/components/canvas/text-animation/TextMarquee";
import BeamsBG from "@/components/canvas/background/Beams";
import DarkVeil from "@/components/canvas/background/DarkVeil";

import "./page.css";

export default function DemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <main style={{ overflowX: "hidden" }}>
      <section style={{ height: "100dvh" }}>
        <div
          ref={containerRef}
          className="use-inter-local"
          style={{
            position: "relative",
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #ccc",
          }}
        >
          <VariableProximity
            label={"This is a demo of Variable Proximity with a local font."}
            className={"variable-proximity-demo"}
            fromFontVariationSettings="'wght' 400"
            toFontVariationSettings="'wght' 900"
            containerRef={containerRef}
            radius={100}
            falloff="gaussian"
          />
        </div>
        <div className="test-variable-proximity-container">
          <span className="test-variable-font">Hover To Test Local Font</span>
        </div>
        <TextMarquee
          text="Ctrl+C Ctrl+V Ctrl+Z Ctrl+Y"
          size="3rem"
          textweight={600}
          speed={40}
          TextTransform="capitalize"
          color="#FFFAF5"
          background="#070707"
          borderColor="#FFFAF500"
          borderTop={true}
          borderBottom={true}
          borderHeight={0}
          paddingtop="1dvw"
          paddingbottom="1dvw"
        />
      </section>
      <section style={{ height: "100dvh" }}>
        {/* <HolographicBackground/> */}
        {/* <BeamsBG /> */}
        {/* <DarkVeil /> */}
      </section>
      <section style={{ position: "relative", minHeight: "100dvh" }}>
      </section>
    </main>
  );
}
