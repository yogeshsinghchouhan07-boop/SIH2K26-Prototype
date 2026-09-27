import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const primary = "#1475e5";
const card = {
  background: "#fff",
  border: "1px solid #e0e9f3",
  borderRadius: 14,
  boxShadow: "0 8px 25px rgba(49,94,137,.06)",
};

export default function CourseDetail({
  state,
  setState,
  courseId,
  sidebarOpen = true,
}) {
  const course =
    state.courses.find((c) => c.id === courseId) || state.courses[1];
  const navigate = useNavigate();
  const [done, setDone] = useState(course.progress >= 100);

  const finish = () => {
    setDone(true);
    setState((s) => ({
      ...s,
      courses: s.courses.map((c) =>
        c.id === course.id ? { ...c, progress: 100 } : c,
      ),
    }));
  };

  const leftMargin = sidebarOpen ? 250 : 0;
  const contentWidth = sidebarOpen ? "calc(100% - 250px)" : "100%";

  const modules = useMemo(
    () => [
      "Core concepts",
      "Worked examples",
      "Applied exercises",
      "Assessment checkpoint",
    ],
    [],
  );

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
          alignItems: "center",
          gap: 18,
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: primary,
              letterSpacing: 1,
            }}
          >
            COURSE
          </div>
          <h1 style={{ fontSize: 28, margin: "7px 0 5px", color: "#16395f" }}>
            {course.title}
          </h1>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft size={14} /> Courses
        </button>
      </div>

      <div style={{ ...card, padding: 22 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: primary, fontWeight: 800 }}>
              {course.field} • {course.level}
            </div>
            <h2 style={{ margin: "5px 0", fontSize: 23 }}>{course.title}</h2>
            <div style={{ fontSize: 10, color: "#71869c" }}>
              Role-aligned learning module • {course.duration}
            </div>
          </div>
          <div
            style={{
              minWidth: 160,
              padding: 10,
              borderRadius: 12,
              border: "1px solid #eaf0f8",
              background: "#f8fbff",
            }}
          >
            <div style={{ fontSize: 9, color: "#6b8398" }}>Progress</div>
            <div
              style={{
                fontSize: 25,
                fontWeight: 900,
                color: primary,
                marginTop: 4,
              }}
            >
              {course.progress}%
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#16395f" }}>
            Module progress
          </div>
          <div
            style={{
              marginTop: 10,
              height: 8,
              borderRadius: 999,
              background: "#edf3f9",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${course.progress}%`,
                height: "100%",
                background: "linear-gradient(90deg,#1780eb,#6b47df)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 18,
          }}
        >
          <div style={{ ...card, padding: 18, background: "#f9fbff" }}>
            <h3 style={{ fontSize: 15, margin: "0 0 12px" }}>
              Included modules
            </h3>
            <div style={{ display: "grid", gap: 10 }}>
              {modules.map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #e1ebf6",
                    borderRadius: 10,
                    background: "#fff",
                    padding: "10px 12px",
                  }}
                >
                  <span style={{ fontSize: 10, color: "#5f7790" }}>
                    {index + 1}. {item}
                  </span>
                  <Check size={15} color="#18a77d" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 18 }}>
            <h3 style={{ fontSize: 15, margin: "0 0 12px" }}>Next action</h3>
            <div style={{ fontSize: 10, color: "#758aa1", lineHeight: 1.6 }}>
              {course.unlocked
                ? "This course is available and ready to continue."
                : "This course is currently locked. Complete the prerequisite assessment to unlock it."}
            </div>
            <button
              className="btn btn-primary"
              disabled={!course.unlocked}
              onClick={finish}
              style={{ marginTop: 14, width: "100%" }}
            >
              {done ? "Completed" : "Mark as complete"} <ArrowRight size={14} />
            </button>
            {!course.unlocked && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#7d8ea4",
                  fontSize: 10,
                }}
              >
                <Lock size={14} /> Locked until assessment passes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
