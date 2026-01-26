import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 768) {
  // 1. Initialize with 'false' or 'undefined' to avoid server mismatch
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 2. Define the checker function
    const checkMobile = () => {
      // Check if window width is less than the breakpoint (default 768px)
      setIsMobile(window.innerWidth < breakpoint);
    };

    // 3. Run immediately on mount
    checkMobile();

    // 4. Add event listener for resize
    window.addEventListener("resize", checkMobile);

    // 5. Cleanup listener when component unmounts
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}