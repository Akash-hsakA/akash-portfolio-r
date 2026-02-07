/* src/app/layout.tsx */
import type { Metadata } from "next";
import "./globals.css";
import { LoaderProvider } from "@/context/LoaderContext"; // Import Context
import GlobalLoader from "@/components/layout/GlobalLoader"; // We create this next
import SmallNavMenu from "@/components/canvas/navigation/SmallNavMenu";

export const metadata: Metadata = {
  title: "Akash | Portfolio",
  description: "Cyber-System Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LoaderProvider>
          {/* This component handles showing the Preloader based on context */}
          <GlobalLoader />
          
          {/* The rest of your app */}
          {children}
          <SmallNavMenu />
        </LoaderProvider>
      </body>
    </html>
  );
}