"use client";

import { useLoader } from "@/context/LoaderContext";
import Preloader from "@/components/page-loader-ui/Preloader";
import { AnimatePresence } from "motion/react";

export default function GlobalLoader() {
  const { isLoading, setIsLoading } = useLoader();

  return (
    // AnimatePresence ensures the "Exit" animation plays before unmounting
    <AnimatePresence mode="wait">
      {isLoading && (
        <Preloader onComplete={() => setIsLoading(false)} />
      )}
    </AnimatePresence>
  );
}