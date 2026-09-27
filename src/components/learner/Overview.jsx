"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Send } from "lucide-react";
import { WavyBackground } from "../WavyBg";
import { WobbleCard } from "../ui/wobble-card";
import { ImagesBadge } from "../ui/images-badge";
import { Compare } from "../ui/compare";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { Button } from "../ui/button";
import { CoolMode } from "../ui/cool-mode"
import { KineticText } from "../ui/kinetic-text"
import {
  IconChartHistogram,
  IconClipboardData,
  IconTargetArrow,
  IconTrendingUp,
  IconRoute,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import React from "react";
import { Cover } from "@/components/ui/cover";
import { RainbowButton } from "../ui/rainbow-button"

 
const primary = "#1475e5";
const card = {
  background: "#fff",
  border: "1px solid #e0e9f3",
  borderRadius: 14,
  boxShadow: "0 8px 25px rgba(49,94,137,.06)",
};

const BentoVisual = ({ type }) => {
  const bars =
    type === "progress" ? [42, 68, 54, 82, 64] : [76, 48, 88, 62, 94];
  return (
    <motion.div
      initial={{ opacity: 0.72 }}
      animate={{ opacity: [0.72, 1, 0.72] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{
        display: "flex",
        alignItems: "end",
        gap: 8,
        minHeight: 112,
        padding: 18,
        borderRadius: 12,
        background:
          "linear-gradient(135deg, var(--bg), color-mix(in srgb, var(--blue) 12%, var(--bg)))",
        border: "1px solid var(--line)",
      }}
    >
      {bars.map((height, index) => (
        <motion.span
          key={index}
          animate={{
            height: [
              `${height}%`,
              `${Math.max(28, height - 18)}%`,
              `${height}%`,
            ],
          }}
          transition={{
            duration: 2.4 + index * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            flex: 1,
            minHeight: 24,
            borderRadius: "6px 6px 2px 2px",
            background:
              index === bars.length - 1 ? "var(--blue)" : "var(--cyan)",
          }}
        />
      ))}
    </motion.div>
  );
};

const overviewBentoItems = [
  {
    title: "Competency",
    description: "Current role competency score.",
    header: <MetricSegment value="67%" color="var(--blue)" />,
    icon: <IconTrendingUp size={18} />,
    className: "md:col-span-1",
  },
  {
    title: "Courses completed",
    description: "Courses completed in your learning journey.",
    header: <MetricSegment value="12" color="var(--cyan)" />,
    icon: <IconClipboardData size={18} />,
    className: "md:col-span-1",
  },
  {
    title: "Average assessment",
    description: "Average score across recent assessments.",
    header: <MetricSegment value="81%" color="var(--blue)" />,
    icon: <IconChartHistogram size={18} />,
    className: "md:col-span-1",
  },
  {
    title: "Learning hours",
    description: "Time invested in guided learning.",
    header: <MetricSegment value="24h" color="var(--cyan)" />,
    icon: <IconRoute size={18} />,
    className: "md:col-span-1",
  },
  {
    title: "Assessment readiness",
    description:
      "Focus your next practice session on the highest-impact skill gaps.",
    header: <BentoVisual type="readiness" />,
    icon: <IconTargetArrow size={18} />,
    className: "md:col-span-1",
  },
  {
    title: "Learning route",
    description:
      "Follow the recommended sequence from foundations to advanced analytics.",
    header: <BentoVisual type="route" />,
    icon: <IconRoute size={18} />,
    className: "md:col-span-1",
  },
];

function MetricSegment({ value, color }) {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: 112,
        borderRadius: 12,
        border: "1px solid var(--line)",
        background: "var(--bg)",
      }}
    >
      <strong style={{ color, fontSize: 36, lineHeight: 1 }}>{value}</strong>
    </div>
  );
}

export default function Overview({ state, setState, sidebarOpen = true }) {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState("dark");
  const placeholders = [
    "Ask about your learning plan",
    "How can I improve my assessment score?",
    "Explain a statistics concept",
    "What should I study next?",
  ];
  const handleChange = () => {};
  const onSubmit = (event) => {
    event.preventDefault();
    navigate("/ai-chatbot");
  };

  useEffect(() => {
    const syncTheme = () => {
      setThemeMode(
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light",
      );
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const leftMargin = sidebarOpen ? 250 : 0;
  const contentWidth = sidebarOpen ? "calc(100% - 250px)" : "100%";
  const heroTextColor = themeMode === "dark" ? "#F6FBFF" : "#0B1324";
  const heroSubtleColor =
    themeMode === "dark"
      ? "rgba(226, 232, 240, 0.8)"
      : "rgba(15, 23, 42, 0.72)";
  const heroGlow =
    themeMode === "dark"
      ? "0 10px 30px rgba(23, 37, 84, 0.35)"
      : "0 14px 30px rgba(59, 130, 246, 0.14)";

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
      <div className="mx-auto w-full max-w-7xl"
        style={{
          position: "relative",
          width: "100%",
          minHeight: 220,
          marginBottom: 22,
          overflow: "hidden",
          borderRadius: 18,
          border:
            themeMode === "dark"
              ? "1px solid rgba(148, 163, 184, 0.2)"
              : "1px solid rgba(96, 165, 250, 0.18)",
          background: themeMode === "dark" ? "#020817" : "#edf6ff",
          boxShadow:
            themeMode === "dark"
              ? "0 24px 50px rgba(6, 10, 20, 0.35)"
              : "0 20px 44px rgba(59, 130, 246, 0.08)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }} className="">
          <WavyBackground
            containerClassName="absolute inset-0 h-full w-full m-x-0"
            className="h-full w-full"
            backgroundFill={themeMode === "dark" ? "#020817" : "#edf6ff"}
            colors={
              themeMode === "dark"
                ? ["#7dd3fc", "#c084fc", "#34d399", "#f9a8d4", "#60a5fa"]
                : ["#60a5fa", "#38bdf8", "#4f46e5", "#22c55e", "#0ea5e9"]
            }
            waveOpacity={themeMode === "dark" ? 0.6 : 0.85}
            blur={themeMode === "dark" ? 12 : 10}
            waveWidth={themeMode === "dark" ? 28 : 22}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 18,
            width: "100%",
            minHeight: 220,
            padding: "26px 28px",
          }}
        >
          <div style={{ maxWidth: "62%", color: heroTextColor }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: heroSubtleColor,
                fontFamily: "Poppins, Inter, sans-serif",
                marginBottom: 12,
              }}
            >
              Welcome back
            </div>
           
            <h1
              style={{
                margin: 0,
                fontFamily: "Poppins, Inter, sans-serif",
                fontSize: "clamp(2.2rem, 4vw, 4rem)",
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: "-0.06em",
                textShadow: heroGlow,
              }}
            >
              Go through the best way of
               <div className="relative justify-center">
      <KineticText
        text="Being Succeed"
        className="text-[5rem] tracking-[-5%] [font-optical-sizing:auto]"
      />
    </div>
              
            </h1>
            <p
              style={{
                margin: "14px 0 0",
                fontFamily: "Inter, sans-serif",
                fontSize: 18,
                lineHeight: 1.6,
                fontWeight: 500,
                color: heroSubtleColor,
                maxWidth: 560,
              }}
            >
              Track your learning momentum, sharpen your strengths, and turn
              every assessment into measurable growth.
            </p>
          </div>
             <CoolMode>
        
          <button
            className="btn btn-primary"
            style={{
              position: "relative",
              zIndex: 1,
              alignSelf: "center",
              boxShadow:
                themeMode === "dark"
                  ? "0 18px 35px rgba(59,130,246,0.35)"
                  : "0 18px 35px rgba(37,99,235,0.18)",
            }}
            onClick={() => navigate("/assessment-generator")}
          >
            <div className="flex h-[10rem] w-full items-center justify-center">
              <ImagesBadge
                text="Create Assessment"
                images={[
                  "https://assets.aceternity.com/pro/agenforce-1.webp",
                  "https://assets.aceternity.com/pro/agenforce-2.webp",
                  "https://assets.aceternity.com/pro/agenforce-3.webp",
                ]}
              />
            </div>
            <ArrowRight size={16} />
          </button>
      </CoolMode>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full items-stretch">
        <div
          className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-center overflow-hidden w-full min-h-[250px]"
          style={{
            alignSelf: "stretch",
            maxWidth: "100%",
          }}
        >
          <Compare
            firstImage="/assets/Before.png"
            secondImage="/assets/After.png"
            firstImageClassName="object-contain object-center bg-neutral-100 dark:bg-neutral-900"
            secondImageClassname="object-contain object-center bg-neutral-100 dark:bg-neutral-900"
            className="h-[250px] w-full max-w-[420px] rounded-3xl transition-shadow duration-300 hover:shadow-xl md:h-[420px] md:w-[420px]"
            slideMode="hover"
          />
        </div>
        <div
          style={{
            gridColumn: "2 / -1",
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 18,
            padding: 22,
            minHeight: 250,
            borderRadius: 18,
            border: "1px solid var(--line)",
            background: "var(--panel-strong)",
            boxShadow: "0 8px 24px rgba(24,72,130,.06)",
          }}
        >
          <div className="h-[18rem] flex flex-col justify-center  items-center px-1">
     <div>
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-400 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Ask Anything <br /> to <Cover>Karmayogi AI</Cover>
      </h1>
    </div>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
    <CoolMode className="flex justify-center items-center ">
    <RainbowButton onClick={() => navigate("/ai-chatbot")} className="ml-50">Get Your Doubt Be Solved</RainbowButton>
          </CoolMode>
        </div>
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-0">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 14,
              marginTop: 14,
            }}
          >
            <div style={{ ...card, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#16395f" }}>
                Recommended Next Step
              </div>
              <h3 style={{ fontSize: 22,  margin: "10px 0 8px",color:"blue" }}>
                {state.recommended?.title || "SQL for Data Analysis"}
              </h3>
              <p style={{ fontSize: 10, color: "#71869c", margin: "0 0 12px" }}>
                {state.recommended?.reason ||
                  "Largest current role-specific skill gap"}
              </p>
              <button
                className="btn btn-primary mr-2 mt-1.5"
                onClick={() =>
                  navigate(
                    `/courses/${state.recommended?.courseId || "sql-analysis"}`,
                  )
                }
              >
                Open Recommendation <ArrowRight size={14} />
              </button>
              <button
                className="btn btn-outline"
                style={{ marginTop: 10, fontSize: 10 }}
                onClick={() => navigate("/assessment-generator")}
              >
                Generate course assessment <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ ...card, padding: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 800, color: "#16395f" }}
                >
                  Active Focus
                </div>
                <button
                  className="btn btn-outline"
                  style={{ padding: "5px 8px", fontSize: 9 }}
                  onClick={() => navigate("/skill-gap")}
                >
                  View skill gaps
                </button>
              </div>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                {state.skillGaps.slice(0, 3).map((gap) => (
                  <div
                    key={gap.skill}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      border: "1px solid #eaf0f7",
                      borderRadius: 10,
                      background: "#f9fbff",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: "#596f8d",
                        fontWeight: 700,
                      }}
                    >
                      {gap.skill}
                    </span>
                    <span
                      style={{ fontSize: 10, color: primary, fontWeight: 800 }}
                    >
                      {gap.gap}% gap
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </WobbleCard>
        <section
          style={{
            gridColumn: "1 / -1",
            marginTop: 8,
            padding: 20,
            borderRadius: 18,
            border: "1px solid var(--line)",
            background: "var(--panel-strong)",
            boxShadow: "0 8px 24px rgba(24,72,130,.06)",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                color: primary,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Learning intelligence
            </div>
            <h2
              style={{
                margin: "6px 0 0",
                color: "var(--heading)",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              A clearer view of your growth
            </h2>
          </div>
          <BentoGrid className="max-w-none md:auto-rows-[18rem]">
            {overviewBentoItems.map((item) => (
              <BentoGridItem
                key={item.title}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={item.className}
              />
            ))}
          </BentoGrid>
        </section>
        
      </div>
    </div>
  );
}
