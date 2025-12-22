// src/app/layout.tsx
import type { Metadata } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Akash | Creative Developer",
  description: "3D Portfolio built with Next.js 16, GSAP, and R3F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* All your pages (page.tsx) will be injected here */}
        {children}
      </body>
    </html>
  );
}