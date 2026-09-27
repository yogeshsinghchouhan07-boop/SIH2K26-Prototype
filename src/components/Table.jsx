import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

function priorityFor(gap, isDark) {
  if (gap >= 20) return { label: "High", color: isDark ? "#fdba74" : "#b45309", background: isDark ? "rgba(194,65,12,.2)" : "#fff7ed" };
  if (gap >= 10) return { label: "Medium", color: isDark ? "#93c5fd" : "#1d4ed8", background: isDark ? "rgba(29,78,216,.22)" : "#eff6ff" };
  return { label: "On track", color: isDark ? "#6ee7b7" : "#047857", background: isDark ? "rgba(5,150,105,.2)" : "#ecfdf5" };
}

export default function SkillGapTable({ data = [], onSelectCourse }) {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark",
  );

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setIsDark(root.getAttribute("data-theme") === "dark");
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    updateTheme();
    return () => observer.disconnect();
  }, []);

  const headingStyle = {
    color: isDark ? "#b9c9dc" : "#526b86",
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
    background: isDark ? "#17283c" : "#f7faff",
  };
  const cellStyle = {
    color: isDark ? "#d2dfed" : "#294766",
    fontSize: 12,
    verticalAlign: "middle",
  };

  return (
    <div style={{ overflowX: "auto", color: isDark ? "#d2dfed" : "#294766" }}>
      <Table className="mt-2" style={{ minWidth: 700, color: isDark ? "#d2dfed" : "#294766" }}>
        <TableHead>
          <TableRow style={{ borderBottom: `1px solid ${isDark ? "#30445d" : "#dce8f7"}` }}>
            <TableHeaderCell style={headingStyle}>Skill</TableHeaderCell>
            <TableHeaderCell style={headingStyle}>Current</TableHeaderCell>
            <TableHeaderCell style={headingStyle}>Required</TableHeaderCell>
            <TableHeaderCell style={headingStyle}>Gap</TableHeaderCell>
            <TableHeaderCell style={headingStyle}>Priority</TableHeaderCell>
            <TableHeaderCell style={headingStyle}>Recommended learning</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => {
            const priority = priorityFor(item.gap ?? item.required - item.current, isDark);
            const gap = item.gap ?? item.required - item.current;
            return (
              <TableRow key={item.skill} style={{ borderBottom: `1px solid ${isDark ? "#263a52" : "#edf2f7"}` }}>
                <TableCell style={{ ...cellStyle, fontWeight: 650, color: isDark ? "#f0f6ff" : "#16395f" }}>
                  {item.skill}
                </TableCell>
                <TableCell style={cellStyle}>{item.current}%</TableCell>
                <TableCell style={cellStyle}>{item.required}%</TableCell>
                <TableCell style={{ ...cellStyle, fontWeight: 700, color: priority.color }}>
                  {gap} pts
                </TableCell>
                <TableCell style={cellStyle}>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "3px 8px",
                      borderRadius: 999,
                      color: priority.color,
                      background: priority.background,
                      fontSize: 10,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {priority.label}
                  </span>
                </TableCell>
                <TableCell style={cellStyle}>
                  <button
                    type="button"
                    onClick={() => onSelectCourse?.(item.courseId)}
                    style={{
                      border: 0,
                      background: "transparent",
                      padding: 0,
                      color: isDark ? "#70b7ff" : "#1475e5",
                      fontSize: 11,
                      fontWeight: 700,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {item.courseTitle || item.reason || "View recommended course"} →
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {data.length === 0 && (
        <p style={{ margin: "20px 0 8px", color: isDark ? "#b9c9dc" : "#71869c", fontSize: 12 }}>
          No skill gap data is available yet. Complete an assessment to see recommendations.
        </p>
      )}
    </div>
  );
}
