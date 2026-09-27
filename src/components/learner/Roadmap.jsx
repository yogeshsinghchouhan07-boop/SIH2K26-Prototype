import { useNavigate } from "react-router-dom";
import RoadmapCanvas from "../RoadmapCanvas";

const primary = "#1475e5";

const defaultRoadmap = [
  {
    id: "excel-cleaning",
    title: "Excel & Data Cleaning",
    subtitle:
      "Organize raw government data, clean inconsistencies, and prepare reliable datasets.",
    status: "done",
    progress: 100,
    locked: false,
    dueDate: "Apr 12, 2026",
    courseId: "statistics-foundation",
    assignee: { name: "AI", color: "#3ec5f7" },
    x: 40,
    y: 24,
    dependsOn: [],
  },
  {
    id: "sql-analytics",
    title: "SQL for Data Analysis",
    subtitle:
      "Query, join, and summarize administrative datasets for policy and reporting use cases.",
    status: "active",
    progress: 68,
    locked: false,
    dueDate: "May 18, 2026",
    courseId: "sql-analysis",
    assignee: { name: "Gov", color: "#3ddc84" },
    x: 600,
    y: 164,
    dependsOn: ["excel-cleaning"],
  },
  {
    id: "powerbi-dashboard",
    title: "Power BI Dashboarding",
    subtitle:
      "Design impactful dashboards and public-facing insights for government performance tracking.",
    status: "pending",
    progress: 18,
    locked: false,
    dueDate: "Jun 23, 2026",
    courseId: "data-visualization",
    assignee: { name: "AI", color: "#ffc857" },
    x: 40,
    y: 304,
    dependsOn: ["sql-analytics"],
  },
  {
    id: "python-analysis",
    title: "Python for Data Analysis",
    subtitle:
      "Automate analysis workflows, manipulate datasets, and create repeatable reporting pipelines.",
    status: "pending",
    progress: 0,
    locked: false,
    dueDate: "Jul 15, 2026",
    courseId: "python-data",
    assignee: { name: "AI", color: "#ff8fa3" },
    x: 600,
    y: 444,
    dependsOn: ["powerbi-dashboard"],
  },
  {
    id: "statistics-core",
    title: "Statistics & Hypothesis Testing",
    subtitle:
      "Strengthen evidence-based decision making with inferential methods and evaluation metrics.",
    status: "pending",
    progress: 0,
    locked: true,
    dueDate: "Aug 04, 2026",
    courseId: "advanced-analytics",
    assignee: { name: "AI", color: "#9d8cff" },
    x: 40,
    y: 584,
    dependsOn: ["python-analysis"],
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics & ML",
    subtitle:
      "Move toward predictive analytics, forecasting, and advanced modeling for strategic planning.",
    status: "pending",
    progress: 0,
    locked: true,
    dueDate: "Sep 01, 2026",
    courseId: "ai-statistics",
    assignee: { name: "AI", color: "#3ec5f7" },
    x: 600,
    y: 724,
    dependsOn: ["statistics-core"],
  },
];

export default function Roadmap({ state, sidebarOpen = true }) {
  const navigate = useNavigate();
  const leftMargin = sidebarOpen ? 250 : 0;
  const contentWidth = sidebarOpen ? "calc(100% - 250px)" : "100%";
  const boardHeight = 760;

  return (
    <div
      style={{
        marginLeft: leftMargin,
        padding: "28px 32px",
        width: contentWidth,
        boxSizing: "border-box",
        transition: "margin-left 0.25s ease, width 0.25s ease",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 18,
          maxWidth: 980,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: primary,
            letterSpacing: 1.3,
            textTransform: "uppercase",
          }}
        >
          AI-generated learning roadmap
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#7f8ea8",
            lineHeight: 1.5,
            maxWidth: 860,
          }}
        >
          Personalized for the employee’s current role and aligned to the
          required order for a data analyst in government and public-sector
          work.
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          height: boardHeight,
          overflow: "hidden",
          borderRadius: 16,
          border: "1px solid var(--line)",
          background: "var(--bg)",
          boxShadow: "var(--shadow)",
        }}
      >
        <RoadmapCanvas
          nodes={defaultRoadmap}
          editable={false}
          height={boardHeight}
          onNodeCourseClick={(courseId) => navigate(`/courses/${courseId}`)}
        />
      </div>
    </div>
  );
}
