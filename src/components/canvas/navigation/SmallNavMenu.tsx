"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./SmallNavMenu.css";

// Updated Data with External Link Logic
const MENU_LINKS = [
  { label: "Home", href: "/", isExternal: false },
  { label: "cards", href: "/cards", isExternal: false },
  { label: "Contact", href: "/contact", isExternal: false },
  // { label: "External link", href: "https://google.com", isExternal: true },
];

export default function SmallNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Icon Refs
  const lineTopRef = useRef<SVGLineElement>(null);
  const lineMiddleRef = useRef<SVGLineElement>(null);
  const lineBottomRef = useRef<SVGLineElement>(null);

  // GSAP Timelines
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // Create a master timeline
      tl.current = gsap.timeline({ paused: true });

      // --- 1. ICON ANIMATION (Hamburger -> X) ---
      tl.current
        .to(
          lineTopRef.current,
          {
            rotation: 45,
            y: 5,
            transformOrigin: "50% 50%",
            duration: 0.3,
            ease: "back.out(1.7)",
          },
          0,
        )
        .to(
          lineMiddleRef.current,
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.3,
            transformOrigin: "center",
          },
          0,
        )
        .to(
          lineBottomRef.current,
          {
            rotation: -45,
            y: -5,
            transformOrigin: "50% 50%",
            duration: 0.3,
            ease: "back.out(1.7)",
          },
          0,
        );

      // --- 2. CONTENT ANIMATIONS (Text Stagger) ---
      tl.current.from(
        ".nav-item-text",
        {
          y: "120%", // Slide up from hidden state
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.04,
          clearProps: "transform", // Vital: Remove GSAP transforms so CSS hover works later
        },
        0.2,
      );

      // --- 3. FOOTER FADE ---
      tl.current.from(
        ".nav-footer",
        {
          opacity: 0,
          y: 10,
          duration: 0.4,
        },
        0.4,
      );
    },
    { scope: containerRef },
  );

  // Control the GSAP timeline based on state
  useEffect(() => {
    if (isOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isOpen]);

  return (
    <div className={`small-nav-wrapper ${isOpen ? "open" : ""}`} ref={containerRef}>
      {/* MENU CONTENT */}
      <nav className="nav-content">
        <ul className="nav-links-list">
          {MENU_LINKS.map((link, idx) => (
            <li key={idx} className="nav-item-container">
              <Link
                href={link.href}
                className="nav-item"
                onClick={() => setIsOpen(false)}
                target={link.isExternal ? "_blank" : "_self"}
              >
                {/* Text Wrapper for Masking */}
                <div className="nav-text-mask">
                  <span className="nav-item-text">{link.label}</span>
                </div>

                {/* Arrow Logic */}
                <span className="nav-arrow">{link.isExternal ? "↗" : "→"}</span>

                {/* Active Line (CSS Hover) */}
                <div className="nav-line-active" />
              </Link>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <div className="nav-footer">
          <div className="social-group">
            <Link href="">
              <svg className="social-icon-svg" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link href="">
              <svg className="social-icon-svg" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </Link>
          </div>
          <div className="footer-links-group">
            <Link href="" className="footer-link"></Link>
            <Link href="" className="footer-link"></Link>
          </div>
        </div>
      </nav>

      {/* TRIGGER BUTTON */}
      <button
        className="nav-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line ref={lineTopRef} x1="4" y1="7" x2="20" y2="7" className="menu-icon-line" />
          <line ref={lineMiddleRef} x1="4" y1="12" x2="20" y2="12" className="menu-icon-line" />
          <line ref={lineBottomRef} x1="4" y1="17" x2="20" y2="17" className="menu-icon-line" />
        </svg>
      </button>
    </div>
  );
}
