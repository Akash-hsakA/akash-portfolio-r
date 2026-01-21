"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import TerminalOverlay from "@/components/canvas/coding-page/TerminalOverlay";
import "./Template.css"; // 1. Import the CSS file

// ... (Keep your VARIANTS constant here) ...

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCodingPage = pathname === "/coding";

  // ... (Keep your getVariant function here) ...

  return (
    <>
      {/* CASE A: WE ARE ON /CODING (Enter Animation) */}
      {isCodingPage && <TerminalOverlay type="enter" />}

      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        // variants={getVariant()} // Uncomment this when you add your getVariant function back
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="template-wrapper" // 2. Use CSS class
      >
        {/* CASE B: WE ARE LEAVING /CODING (Exit Animation) */}
        {isCodingPage && (
          <motion.div
            className="exit-overlay" // 3. Use CSS class
            initial={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
             <TerminalOverlay type="exit" />
          </motion.div>
        )}

        {children}
      </motion.div>
    </>
  );
}