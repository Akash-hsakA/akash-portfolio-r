"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FullScreenMenu from "@/components/canvas/navigation/FullScreenMenu";

import "./HeaderNavH.css";

export default function HeaderNavH() {
  // 1. Add Type for TypeScript safety
  const container = useRef<HTMLDivElement>(null);
  // 1. State to control the Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useEffect(() => {
  //   // Find the main container in the DOM
  //   const mainContainer = document.querySelector(".main-container") as HTMLElement;

  //   if (mainContainer) {
  //     if (isMenuOpen) {
  //       // When menu is OPEN: Allow scrolling
  //       mainContainer.style.overflowY = "scroll";
  //     } else {
  //       // When menu is CLOSED: Lock scrolling (Hidden)
  //       mainContainer.style.overflowY = "hidden";
  //     }
  //   }
  // }, [isMenuOpen]); // Re-run this whenever isMenuOpen changes

  useGSAP(
    () => {
      // Safety check: ensure container exists
      if (!container.current) return;

      const flipper = ".nav-flipper";

      // 1. INTRO ANIMATION: Wait 3s, then Spin 360
      gsap.to(flipper, {
        rotationY: 360,
        duration: 1,
        delay: 4,
        ease: "power2.inOut",
        onComplete: () => {
          // Optional: Reset to 0 instantly so the math stays simple for hovers (0 -> 180)
          // Visually 360 is the same as 0, so this jump is invisible.
          gsap.set(flipper, { rotationY: 0 });
        },
      });

      // 2. Hover Interactions
      const onEnter = () => {
        // We use overwrite: true to ensure we cancel the intro if the user hovers EARLY
        gsap.to(flipper, { rotationY: 180, duration: 1, ease: "power2.out", overwrite: true });
      };

      const onLeave = () => {
        gsap.to(flipper, { rotationY: 0, duration: 1, ease: "power2.out", overwrite: true });
      };

      // Add Listeners
      container.current.addEventListener("mouseenter", onEnter);
      container.current.addEventListener("mouseleave", onLeave);

      // Cleanup
      return () => {
        container.current?.removeEventListener("mouseenter", onEnter);
        container.current?.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: container }
  );

  return (
    <>
      <header className="header-nav">
        {/* 2. Added onClick to trigger the menu */}
        <div className="nav-scene" ref={container} onClick={() => setIsMenuOpen(true)}>
          <div className="nav-flipper">
            {/* FRONT SIDE */}
            <div className="nav-face">
              <svg
                // width="200"
                // height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="200" height="200" rx="25" fill="#222222" />
                <path
                  d="M103.441 64.8899C103.999 62.8101 106.137 61.5763 108.217 62.134L111.983 63.1438C114.063 63.7015 115.297 65.8401 114.74 67.9202L96.5618 135.712C96.0041 137.792 93.8655 139.026 91.7855 138.468L88.0198 137.458C85.9399 136.901 84.7055 134.763 85.263 132.683L103.441 64.8899ZM68.3441 69.3157C71.6575 67.1075 75.7605 70.7011 74.0081 74.2766L62.097 98.5784C61.5668 99.6604 61.5671 100.927 62.097 102.009L73.9984 126.315C75.7495 129.891 71.646 133.483 68.3333 131.274L26.7357 103.531C24.421 101.988 24.4215 98.5863 26.7366 97.0432L68.3441 69.3157ZM126.001 74.0998C124.25 70.5239 128.354 66.9321 131.666 69.1409L173.264 96.883C175.579 98.4269 175.578 101.829 173.263 103.372L131.656 131.1C128.342 133.308 124.239 129.714 125.992 126.139L137.903 101.837C138.433 100.755 138.433 99.4887 137.904 98.4065L126.001 74.0998Z"
                  fill="#FFFAF5"
                />
              </svg>
            </div>

            {/* BACK SIDE */}
            <div className="nav-face nav-back">
              <svg
                // width="200"
                // height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 25C0 11.1929 11.1929 0 25 0H175C188.807 0 200 11.1929 200 25V175C200 188.807 188.807 200 175 200H25C11.1929 200 0 188.807 0 175V25Z"
                  fill="#222222"
                />
                <path
                  d="M140.001 43.7971C141.018 41.7201 142.358 39.8507 143.999 38.3449C151.65 31.3609 162.744 35.8784 164.732 46.8866C165.125 48.8598 165.079 50.9109 164.64 52.884C163.715 56.6746 160.618 60.5171 157.313 64.048C155.741 65.7356 154.215 67.2934 152.713 68.8771C148.067 73.7841 143.468 78.9247 140.024 85C136.58 78.9247 131.981 73.7841 127.312 68.8771C125.809 67.3194 124.284 65.7356 122.712 64.048C119.407 60.5431 116.31 56.7006 115.385 52.884C114.923 50.9368 114.877 48.8858 115.247 46.8866C117.234 35.8784 128.329 31.3609 135.979 38.3189C137.643 39.8507 139.007 41.7201 140.001 43.7971Z"
                  fill="#FFFAF5"
                />
                <path
                  d="M165 139.988C155.153 146.675 146.65 155.143 140 165C133.327 155.143 124.847 146.652 115 139.988C125.032 133.556 133.559 125.019 140.023 115C146.441 125.019 154.968 133.533 165 139.988Z"
                  fill="#FFFAF5"
                />
                <path
                  d="M84.7396 67.1951C82.7429 76.5041 71.6384 80.3354 63.9934 74.4309C63.0751 73.7195 62.2529 72.9167 61.5269 72.0224C63.8439 77.1545 67.0791 80.6809 71.6918 82.3069V85H48.2976V82.3069C52.9102 80.6809 56.1561 77.1646 58.4625 72.0224C57.7364 72.9167 56.9142 73.7195 55.996 74.4309C48.3616 80.3354 37.2571 76.5041 35.2604 67.1951C34.8761 65.5285 34.9188 63.7907 35.3779 62.1341C36.2855 58.9228 39.3926 55.6707 42.7133 52.6829C44.2935 51.2703 45.8204 49.9492 47.3152 48.6179C51.7784 44.6545 56.7541 39.9289 60 35C63.2459 39.9289 68.2216 44.6545 72.6848 48.6179C74.1796 49.9492 75.7065 51.2703 77.2867 52.6829C80.5967 55.6707 83.7039 58.9228 84.6221 62.1341C85.0812 63.7907 85.1239 65.5285 84.7396 67.1951Z"
                  fill="#FFFAF5"
                />
                <path
                  d="M81.0183 153.229C75.9554 157.877 67.9688 157.623 63.1911 152.697C65.6393 157.068 68.4204 160.999 71.9145 162.202V165H48.0736V162.202C51.5677 160.976 54.3488 157.068 56.797 152.697C52.0431 157.623 44.0565 157.877 38.9698 153.229C33.9069 148.58 33.6454 140.833 38.4231 135.883C40.8001 133.409 44.1278 132.021 47.5982 132.021C47.8597 132.021 48.1211 132.021 48.4064 132.044C45.6966 125.8 48.6916 118.608 55.1094 115.971C56.702 115.301 58.3658 115 60.0059 115C61.646 115 63.3099 115.301 64.9025 115.971C71.3203 118.608 74.3153 125.8 71.6055 132.044C71.867 132.021 72.1285 132.021 72.4137 132.021C75.8841 132.021 79.2118 133.409 81.5888 135.883C86.3427 140.833 86.105 148.58 81.0183 153.229Z"
                  fill="#FFFAF5"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>
      {/* 3. Render the Menu here, controlled by state */}
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
