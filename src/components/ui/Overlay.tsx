"use client";

export default function Overlay() {
  return (
    // Tailwind: absolute position, full screen, z-index 10 (foreground layer)
    // pointer-events-none allows clicks to pass through to the 3D canvas
    <div className="absolute inset-0 z-10 flex h-screen w-full flex-col items-center justify-center pointer-events-none">
      
      {/* Main Title Area - pointer-events-auto allows interaction with text */}
      <main className="text-center pointer-events-auto pointer-cursor-default">
        <h1 className="text-6xl font-bold tracking-tighter md:text-8xl">
          AKASH
        </h1>
        <p className="mt-4 text-xl font-light uppercase tracking-widest">
          Creative Developer
        </p>
      </main>

    </div>
  );
}