import { useEffect, useMemo, useRef, useState } from "react";
import { Flame } from "lucide-react";
import ProgressCard from "@/components/ProgressCard.jsx";
import { SparklesText } from "../ui/sparkles-text";
import { KineticText } from "../ui/kinetic-text";
const primary = "#1475e5";
const card = {
  background: "#fff",
  border: "1px solid #e0e9f3",
  borderRadius: 14,
  boxShadow: "0 8px 25px rgba(49,94,137,.06)",
};

const competencyStages = [
  {
    stage: "Stage 1",
    date: "2026-01-08",
    score: 58,
    status: "needs attention",
    note: "Core concepts were emerging; regular practice was still needed.",
  },
  {
    stage: "Stage 2",
    date: "2026-02-05",
    score: 61,
    status: "stable",
    note: "Routine established and foundational exercises became more consistent.",
  },
  {
    stage: "Stage 3",
    date: "2026-03-03",
    score: 63,
    status: "stable",
    note: "The learner maintained steady progress across the baseline skills.",
  },
  {
    stage: "Stage 4",
    date: "2026-04-02",
    score: 67,
    status: "improving",
    note: "Applied analysis tasks showed clearer reasoning and stronger accuracy.",
  },
  {
    stage: "Stage 5",
    date: "2026-05-01",
    score: 70,
    status: "improving",
    note: "Dashboard and reporting work became more confident and structured.",
  },
  {
    stage: "Stage 6",
    date: "2026-06-04",
    score: 74,
    status: "improving",
    note: "The learner connected technical skills to practical role scenarios.",
  },
  {
    stage: "Stage 7",
    date: "2026-07-01",
    score: 81,
    status: "improving",
    note: "Current performance is ready for the next advanced learning step.",
  },
];

const statusColors = {
  "needs attention": "#ed8c27",
  stable: "#64748b",
  improving: "#18a77d",
};

function CompetencyChart() {
  const chartRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pinnedIndex, setPinnedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [range, setRange] = useState("all");
  const visibleStages = useMemo(
    () => (range === "recent" ? competencyStages.slice(-4) : competencyStages),
    [range],
  );
  const points = visibleStages.map((point, index) => ({
    ...point,
    x:
      visibleStages.length === 1
        ? 50
        : 5 + (index / (visibleStages.length - 1)) * 90,
    y: 92 - ((point.score - 50) / 40) * 72,
  }));
  const linePath = points
    .map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;
  const activeIndex = pinnedIndex ?? hoveredIndex;

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={chartRef}
      role="img"
      aria-label="Competency score improved from 58 percent to 81 percent across seven learning stages."
    >
      <style>{`
        .competency-chart-line { stroke-dasharray: 160; stroke-dashoffset: ${visible ? 0 : 160}; transition: stroke-dashoffset 1.4s ease-out; }
        .competency-chart-area { opacity: ${visible ? 1 : 0}; transition: opacity .8s ease-out .35s; }
        .competency-chart-latest { animation: competency-point-pulse 1.8s ease-in-out infinite; transform-origin: center; }
        @keyframes competency-point-pulse { 0%, 100% { r: 3.2px; opacity: 1; } 50% { r: 5px; opacity: .72; } }
      `}</style>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}
      >
        <button
          type="button"
          onClick={() => setRange(range === "all" ? "recent" : "all")}
          style={{
            border: "1px solid #dce8f7",
            background: "transparent",
            color: "#627b96",
            borderRadius: 7,
            padding: "4px 8px",
            fontSize: 9,
          }}
        >
          {range === "all" ? "Last 4 stages" : "All stages"}
        </button>
      </div>
      <div
        style={{
          position: "relative",
          height: 220,
          borderRadius: 10,
          background:
            "repeating-linear-gradient(to bottom,#fff,#fff 43px,#eef3f8 44px)",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <path
            d={areaPath}
            fill="url(#competency-area)"
            className="competency-chart-area"
          />
          <path
            d={linePath}
            fill="none"
            stroke="#64748b"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
            className="competency-chart-line"
          />
          <defs>
            <linearGradient id="competency-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#1780eb" stopOpacity=".18" />
              <stop offset="1" stopColor="#1780eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          {points.map((point, index) => (
            <g
              key={point.stage}
              onPointerEnter={() => setHoveredIndex(index)}
              onPointerLeave={() => setHoveredIndex(null)}
              onClick={() =>
                setPinnedIndex(pinnedIndex === index ? null : index)
              }
              style={{ cursor: "pointer" }}
            >
              <circle cx={point.x} cy={point.y} r="6" fill="transparent" />
              <circle
                className={
                  index === points.length - 1 ? "competency-chart-latest" : ""
                }
                cx={point.x}
                cy={point.y}
                r="3.2"
                fill={statusColors[point.status]}
                stroke="#fff"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>
        {activeIndex !== null && points[activeIndex] ? (
          <div
            style={{
              position: "absolute",
              left: `${points[activeIndex].x}%`,
              top: `${points[activeIndex].y}%`,
              transform: "translate(-50%, -112%)",
              minWidth: 170,
              padding: "9px 10px",
              borderRadius: 9,
              background: "#16395f",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(22,57,95,.2)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <strong style={{ display: "block", fontSize: 10 }}>
              {points[activeIndex].stage} · {points[activeIndex].score}%
            </strong>
            <span
              style={{
                display: "block",
                marginTop: 3,
                fontSize: 9,
                color: "#b9d4ef",
              }}
            >
              {points[activeIndex].status}
            </span>
            <span
              style={{
                display: "block",
                marginTop: 4,
                fontSize: 9,
                lineHeight: 1.35,
              }}
            >
              {points[activeIndex].note}
            </span>
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 8,
          color: "#8194aa",
          marginTop: 7,
        }}
      >
        {points.map((point) => (
          <span key={point.stage}>{point.stage.replace("Stage ", "S")}</span>
        ))}
      </div>
    </div>
  );
}

export default function ProgressView({ state, sidebarOpen = true }) {
  const points = [58, 61, 63, 67, 70, 74, 81];
  const leftMargin = sidebarOpen ? 250 : 0;
  const contentWidth = sidebarOpen ? "calc(100% - 250px)" : "100%";

  return (
    <div
      style={{
        marginLeft: leftMargin,
        padding: "28px 32px",
        width: contentWidth,
        boxSizing: "border-box",
        transition: "margin-left 0.25s ease, width 0.25s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: 18,
          marginBottom: 22,
        }}
      >
        <div className=" bg-blend-overlay rounded-2xl p-5 mt-8">
              <SparklesText>Progress Analysis</SparklesText>
              <KineticText as="h1" text="See how far you have come" className="text-xl font-bold tracking-tighter md:text-3xl lg:text-5xl" />
             </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}
      >
        <div style={{ ...card, padding: 18, border: "none" }}>
          <ProgressCard/>
        </div>

        <div style={{ ...card, padding: 18 }}>
          <h2 style={{ fontSize: 15, margin: "0 0 15px" }}>Learning Streak</h2>
          <div style={{ display: "grid", placeItems: "center", padding: 20 }}>
            <div
              style={{
                width: 105,
                height: 105,
                borderRadius: "50%",
                background: "#fff5e8",
                display: "grid",
                placeItems: "center",
                border: "8px solid #ffe2bd",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Flame size={28} color="#ed8c27" />
                <b style={{ display: "block", fontSize: 24 }}>7</b>
                <span style={{ fontSize: 8, color: "#7c90a6" }}>days</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 10, color: "#71869c", textAlign: "center" }}>
            Keep learning daily to extend your streak.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginTop: 14,
        }}
      >
        {[
          [state.competency + "%", "Competency"],
          ["12", "Courses"],
          ["81%", "Assessment avg."],
          ["24h", "Learning"],
        ].map(([a, b]) => (
          <div key={b} style={{ ...card, padding: 16 }}>
            <b style={{ fontSize: 23, color: primary }}>{a}</b>
            <span
              style={{
                display: "block",
                fontSize: 9,
                color: "#71869c",
                marginTop: 3,
              }}
            >
              {b}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
