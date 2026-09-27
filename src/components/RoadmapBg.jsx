import React, { useEffect, useState } from "react";

export default function RoadmapBg() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.getAttribute("data-theme") || "light";
  });

  useEffect(() => {
    const syncTheme = () => {
      const next =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(next);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  const bg = isDark
    ? "radial-gradient(circle at top, rgba(59,130,246,0.18), rgba(15,23,42,0.0) 38%), linear-gradient(180deg, rgba(8,15,24,1) 0%, rgba(15,23,42,0.9) 100%)"
    : "radial-gradient(circle at top, rgba(59,130,246,0.16), rgba(248,251,255,0) 40%), linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(255,255,255,0.92) 100%)";

  const strokeA = isDark ? "#8bd3ff" : "#7c9cff";
  const strokeB = isDark ? "#57c7ff" : "#f6a9d7";
  const strokeC = isDark ? "#a78bfa" : "#9bd1ff";
  const glow = isDark ? "rgba(96,165,250,0.32)" : "rgba(99,102,241,0.2)";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: 20,
        background: bg,
      }}
    >
      <svg
        viewBox="0 0 1440 720"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.92,
        }}
      >
        <path
          d="M0,380 C180,305 270,320 370,300 C470,280 550,220 690,240 C810,258 930,194 1060,222 C1185,248 1300,268 1440,208"
          fill="none"
          stroke={strokeA}
          strokeWidth="2"
          filter="url(#roadmap-glow)"
        />
        <path
          d="M0,460 C150,492 250,420 370,442 C500,466 620,368 760,392 C890,416 990,328 1140,340 C1260,350 1360,310 1440,290"
          fill="none"
          stroke={strokeB}
          strokeWidth="2"
          filter="url(#roadmap-glow)"
        />
        <path
          d="M0,540 C160,520 240,580 360,564 C480,548 610,480 740,500 C890,522 1010,454 1160,460 C1285,466 1360,440 1440,420"
          fill="none"
          stroke={strokeC}
          strokeWidth="2"
          filter="url(#roadmap-glow)"
        />
        <defs>
          <filter
            id="roadmap-glow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: "18% 8% auto 8%",
          height: "200px",
          background: `radial-gradient(circle at center, ${glow} 0%, transparent 62%)`,
          filter: "blur(24px)",
        }}
      />
    </div>
  );
}
