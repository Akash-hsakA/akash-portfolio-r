"use client";
import { useRef } from "react";
import HeaderNavH from "@/components/canvas/navigation/HeaderNavH";
import Object3D from "@/components/canvas/coding-page/3DObject";
import VariableProximity from "@/components/canvas/text-animation/VariableProximity";

import "./page.css";

export default function CodingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="coding-page-main-container">
      <HeaderNavH />
      <div className="scrollable-container">
        <section className="scroll-container-1">
          <Object3D />
        </section>
        <section className="scroll-container-2">
          <div ref={containerRef} className="use-inter-local">
            <VariableProximity
              label={"Hi! Welcome to my digital playground."}
              className={"variable-proximity"}
              fromFontVariationSettings="'wght' 300, 'opsz' 9"
              toFontVariationSettings="'wght' 900, 'opsz' 40"
              containerRef={containerRef}
              radius={150}
              falloff="gaussian"
            />
          </div>
        </section>
        <section className="scroll-container-3">
        </section>
      </div>
    </main>
  );
}
