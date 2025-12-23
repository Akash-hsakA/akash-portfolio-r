import Scene from "@/components/canvas/Scene";
import Overlay from "@/components/ui/Overlay";


import'./globals.css'

export default function Home() {
  return (
    // The main container holds both absolute layers relative to itself
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Layer 1: The 3D Background */}
      <Scene/>

    </main>
  );
}
