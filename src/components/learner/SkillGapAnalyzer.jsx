import { useNavigate } from "react-router-dom";
import SkillGapTable from "../Table.jsx";
import { SparklesText } from "../ui/sparkles-text";
import { KineticText } from "../ui/kinetic-text";
const primary = "#1475e5";
const card = {
  background: "var(--panel-strong)",
  border: "1px solid var(--line)",
  borderRadius: 14,
  boxShadow: "0 8px 25px rgba(49,94,137,.06)",
};

export default function SkillGapAnalyzer({ state, sidebarOpen = true }) {
  const navigate = useNavigate();
  const leftMargin = sidebarOpen ? 250 : 0;
  const contentWidth = sidebarOpen ? "calc(100% - 250px)" : "100%";
  const skillGapRows = (state?.skillGaps ?? []).map((gap) => ({
    ...gap,
    courseTitle: state?.courses?.find((course) => course.id === gap.courseId)?.title,
  }));

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
        <div className="mx-1 bg-blend-overlay rounded-2xl p-5 mt-8">
         <SparklesText>Skill Gap Analysis</SparklesText>
          <KineticText as="h1" text="Build your skills with focused learning" className="text-xl font-bold tracking-tighter md:text-3xl lg:text-5xl" />
        </div>
      </div>

      <div style={{ ...card, padding: 18 }}>
        <SkillGapTable
          data={skillGapRows}
          onSelectCourse={(courseId) => {
            if (courseId) navigate(`/courses/${courseId}`);
          }}
        />
      </div>

      <div style={{ ...card, padding: 18, marginTop: 14 }}>
        <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>
          How recommendations are selected
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
          }}
        >
          {["Current competency", "Required competency", "Skill gap", "Role / field"].map((label, index) => (
            <div
              key={label}
              style={{
                padding: 13,
                borderRadius: 9,
                background: "var(--panel)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "color-mix(in srgb, var(--blue) 12%, transparent)",
                  color: primary,
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 7px",
                  fontWeight: 900,
                }}
              >
                {index + 1}
              </div>
              <b style={{ fontSize: 9, color: "var(--heading)" }}>{label}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
