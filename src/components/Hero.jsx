import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      {/* ---------- Tricolour video masked into "KARMAYOGI" ---------- */}
      <div className="hero-mask-wrap" aria-label="KARMAYOGI video title">
        <svg
          className="hero-mask-svg"
          viewBox="0 0 1900 380"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="KARMAYOGI"
        >
          <defs>
            <mask id="karmayogi-mask">
              <rect width="1900" height="380" fill="black" />
              <text
                x="950"
                y="300"
                textAnchor="middle"
                fontFamily="Arial, Helvetica, sans-serif"
                fontWeight="900"
                fontSize="320"
                letterSpacing="-14"
                fill="white"
              >
                KARMAYOGI
              </text>
            </mask>
          </defs>

          <foreignObject width="1900" height="380" mask="url(#karmayogi-mask)">
            <video
              className="hero-mask-video"
              src="/assets/India.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </foreignObject>
        </svg>
      </div>

      {/* ---------- Tagline + CTA + Search ---------- */}
      <div className="hero-bottom-row">
        <div className="hero-tagline">
          <p>Service with integrity and dedication to the nation.</p>
          <button className="hero-cta">Get to know</button>
        </div>

        <div className="hero-search">
          <input type="text" placeholder="Search..." aria-label="Search" />
          <button aria-label="Submit search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
    </section>
  );
}
