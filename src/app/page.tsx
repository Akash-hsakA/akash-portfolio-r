import Scene from "@/components/canvas/Scene";
import Overlay from "@/components/ui/Overlay";
import Beams from "@/components/canvas/Beams-f";

export default function Home() {
  return (
    // The main container holds both absolute layers relative to itself
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Layer 1: The 3D Background */}
      <Scene />

      {/* Layer 2: The HTML Foreground */}
      <Overlay />
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>
    </main>
  );
}
