"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // 1. Import this hook
import "./FullScreenMenu.css";

// Configuration for your cards
const MENU_ITEMS = [
  { label: "/", image: "/assets/cards/card-a-spade-05.png", href: "/" },
  { label: "/coding", image: "/assets/cards/card-back-05.png", href: "/coding" },
  { label: "/system32", image: "/assets/cards/card-back-05.png", href: "" },
  { label: "/h4ck3r", image: "/assets/cards/card-back-05.png", href: "" },
  { label: "/contact", image: "/assets/cards/card-back-05.png", href: "" },
  { label: "/blog", image: "/assets/cards/card-back-05.png", href: "" },
  { label: "/gallery", image: "/assets/cards/card-back-05.png", href: "" },
  { label: "/resume", image: "/assets/cards/card-back-05.png", href: "" },
];

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullScreenMenu({ isOpen, onClose }: MenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // 2. Get current URL path

  useGSAP(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline();

    if (isOpen) {
      // 1. Open Animation (Expand Circle)
      // We animate the clip-path of the main container
      tl.to(containerRef.current, {
        clipPath: "circle(150% at calc(100% - 7dvw) 7dvw)",
        duration: 1,
        ease: "power3.inOut",
        pointerEvents: "auto",
      });

      // 2. Stagger in the Cards
      tl.from(
        ".card-text-box",
        {
          y: 100, // Move up from 100px down
          opacity: 0,
          duration: 0.6,
          stagger: 0.05, // Rapid stagger
          ease: "power2.out",
        },
        "-=0.5",
      ); // Start overlap
    } else {
      // Close Animation (Shrink Circle)
      tl.to(containerRef.current, {
        clipPath: "circle(0% at calc(100% - 7dvw) 7dvw)",
        duration: 0.8,
        ease: "power3.inOut",
        pointerEvents: "none",
      });
    }
  }, [isOpen]);

  return (
    <div
      className="full-screen-menu-continer"
      ref={containerRef}
      style={{ clipPath: "circle(0% at calc(100% - 5rem) 7rem)", pointerEvents: "none" }}
    >
      {/* CLOSE BUTTON */}
      <div className="close-continer">
        <button className="close-bts" onClick={onClose}>
          <svg
            width="62"
            height="70"
            viewBox="0 0 62 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.07805e-08 70L27.1 31.6L49.2 -4.76837e-06H61L34.4 36.7L12 70H7.07805e-08ZM49.2 70L26.8 36.7L0.2 -4.76837e-06H12L34.2 31.6L61.2 70H49.2Z"
              fill="#FFFAF5"
            />
          </svg>
        </button>
      </div>

      <div className="grid-menu-continer">
        {MENU_ITEMS.map((item, index) => {
          // 1. Logic Checks
          const isCurrentPage = item.href === pathname;
          const hasLink = item.href && item.href !== "";

          // 2. Determine Class Name
          let statusClass = "disabled-link";
          if (isCurrentPage) {
            statusClass = "same-page-link";
          } else if (hasLink) {
            statusClass = "active-link";
          }

          // 3. Define content to avoid repetition
          const cardContent = (
            <>
              <div className="image-wrapper">
                <Image src={item.image} alt={item.label} fill className="card-img" />
              </div>
              <span className="text-menu">{item.label}</span>
            </>
          );

          // 4. FIX: Conditionally return Link OR Div
          // This avoids passing 'undefined' to Link's href
          if (hasLink) {
            return (
              <Link
                key={index}
                href={item.href} // Guaranteed to be a string here
                className={`card-text-box ${statusClass}`}
                onClick={onClose}
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div key={index} className={`card-text-box ${statusClass}`} onClick={onClose}>
              {cardContent}
            </div>
          );
        })}
      </div>

      <div className="space-filler" />
    </div>
  );
}
