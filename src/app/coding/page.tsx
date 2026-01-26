"use client";
import { useRef } from "react";
import HeaderNavH from "@/components/canvas/navigation/HeaderNavH";
import MagnetLines from "@/components/ui-animations/MagnetLines";
import VariableProximity from "@/components/canvas/text-animation/VariableProximity";
import TextMarquee from "@/components/canvas/text-animation/TextMarquee";
import ScrollReveal from "@/components/canvas/text-animation/ScrollReveal";
import CircularLogoLoop from "@/components/canvas/loops/CircularLogoLoop";

import "./page.css";

const LOGO_DATA = [
  {
    src: "/assets/other-logos/svg/vscode-icon.svg",
    href: "https://code.visualstudio.com",
    alt: "VSCode",
  },
  { src: "/assets/other-logos/svg/git-icon.svg", href: "https://git-scm.com", alt: "Git" },
  { src: "/assets/other-logos/svg/github-icon.svg", href: "https://github.com", alt: "GitHub" },
  {
    src: "/assets/other-logos/svg/netlify-icon.svg",
    href: "https://www.netlify.com",
    alt: "Netlify",
  },
  { src: "/assets/other-logos/svg/react-icon.svg", href: "https://react.dev", alt: "React" },
  { src: "/assets/other-logos/svg/next-js-icon.svg", href: "https://nextjs.org", alt: "Next" },
  { src: "/assets/other-logos/svg/gsap-icon.svg", href: "https://gsap.com", alt: "GSAP" },
  {
    src: "/assets/other-logos/svg/vscode-icon.svg",
    href: "https://code.visualstudio.com",
    alt: "VSCode",
  },
  { src: "/assets/other-logos/svg/git-icon.svg", href: "https://git-scm.com", alt: "Git" },
  { src: "/assets/other-logos/svg/github-icon.svg", href: "https://github.com", alt: "GitHub" },
  {
    src: "/assets/other-logos/svg/netlify-icon.svg",
    href: "https://www.netlify.com",
    alt: "Netlify",
  },
  { src: "/assets/other-logos/svg/react-icon.svg", href: "https://react.dev", alt: "React" },
  { src: "/assets/other-logos/svg/next-js-icon.svg", href: "https://nextjs.org", alt: "Next" },
  { src: "/assets/other-logos/svg/gsap-icon.svg", href: "https://gsap.com", alt: "GSAP" },
];

export default function CodingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="coding-page-main-container">
      <HeaderNavH />
      <div className="scrollable-container">
        <section className="scroll-container-1">
          <div className="bg-magnet-line">
            <MagnetLines
              rows={10}
              columns={12}
              containerSize="50vmin"
              lineColor="#070707"
              lineWidth="3px"
              lineHeight="30px"
              baseAngle={0}
            />
          </div>
          <div className="bg-magnet-line">
            <MagnetLines
              rows={10}
              columns={12}
              containerSize="50vmin"
              lineColor="#070707"
              lineWidth="3px"
              lineHeight="30px"
              baseAngle={0}
            />
          </div>
        </section>
        <section className="scroll-container-2">
          <div ref={containerRef} className="use-inter-local">
            <VariableProximity
              label={"Hi! Welcome to my digital playground."}
              className={"variable-proximity"}
              fromFontVariationSettings="'wght' 200, 'opsz' 9"
              toFontVariationSettings="'wght' 900, 'opsz' 40"
              containerRef={containerRef}
              radius={150}
              falloff="gaussian"
            />
          </div>
        </section>
        <TextMarquee
          text="Ctrl+C Ctrl+V Ctrl+Z Ctrl+Y"
          size="3rem"
          textweight={800}
          speed={40}
          TextTransform="capitalize"
          color="#070707"
          background="#ff6347"
          borderColor="#FFFAF5"
          borderTop={true}
          borderBottom={true}
          borderHeight={0}
          paddingtop="1dvw"
          paddingbottom="1.2dvw"
        />
        <section className="scroll-container-3" style={{ overflow: "hidden" }}>
          <div className="text-container">
            <ScrollReveal
              enableBlur
              blurStrength={12}
              baseOpacity={0.1}
              baseRotation={0}
              textClassName="highlighted-text"
            >
              I built this site using Next.js 16 and TypeScript. For the visuals, I combined React
              Bits, GSAP, and Three.js. Fun fact: I skipped Tailwind and stuck to vanilla CSS for
              this project. I honestly just love the creative freedom it gives me!
            </ScrollReveal>
          </div>
          <CircularLogoLoop
            logos={LOGO_DATA}
            logoSize={40}
            radius={150}
            backgroundColor="#070707"
          />
        </section>
      </div>
    </main>
  );
}
