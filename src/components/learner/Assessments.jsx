import { useState } from "react";
import { ArrowRight, Award, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const primary = "#1475e5";
const card = {
  background: "#fff",
  border: "1px solid #e0e9f3",
  borderRadius: 14,
  boxShadow: "0 8px 25px rgba(49,94,137,.06)",
};

function AssessmentOutcome({ score, state, setState }) {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const passed = score >= 80;
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(8,31,63,.48)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(510px,100%)",
          background: "#fff",
          borderRadius: 22,
          padding: "30px 28px",
          textAlign: "center",
          boxShadow: "0 30px 100px rgba(6,30,65,.3)",
          animation: "unlockPop .45s cubic-bezier(.2,.9,.2,1)",
        }}
      >
        <div
          style={{
            width: 82,
            height: 82,
            borderRadius: "50%",
            margin: "0 auto 15px",
            display: "grid",
            placeItems: "center",
            background: passed ? "#e7faf3" : "#fff4e5",
            border: `8px solid ${passed ? "#c9f0e3" : "#ffe2b9"}`,
          }}
        >
          {passed ? (
            <Award size={38} color="#12a37b" />
          ) : (
            <RotateCcw size={36} color="#d78920" />
          )}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 1,
            color: passed ? "#129d76" : "#c17a1e",
          }}
        >
          {passed ? "COURSE UNLOCKED" : "KEEP BUILDING YOUR SKILLS"}
        </div>
        <h2 style={{ fontSize: 26, color: "#103968", margin: "7px 0" }}>
          {passed ? "Congratulations! 🎉" : "Your next step is ready"}
        </h2>
        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: passed ? "#12a37b" : "#d78920",
            margin: "8px 0",
          }}
        >
          {score}%
        </div>
        <p
          style={{
            fontSize: 11,
            color: "#71869c",
            lineHeight: 1.6,
            margin: "0 auto 18px",
            maxWidth: 420,
          }}
        >
          {passed ? (
            <>
              You crossed the <b>80% passing threshold</b>.{" "}
              <b>{state.recommended.title}</b> is now unlocked based on your
              skill gap, competency and role/field.
            </>
          ) : (
            <>
              The 80% threshold was not reached. Review your skill gaps and use
              the recommended learning material before reassessment.
            </>
          )}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 9 }}>
          {passed && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setShow(false);
                navigate(`/courses/${state.recommended.courseId}`);
              }}
            >
              Start {state.recommended.title} <ArrowRight size={14} />
            </button>
          )}
          <button className="btn btn-outline" onClick={() => setShow(false)}>
            {passed ? "Later" : "Review Skill Gaps"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Assessments({
  state,
  setState,
  sidebarOpen = true,
  assessmentQuestions,
}) {
  const [score, setScore] = useState(null);
  const [selected, setSelected] = useState({});
  const navigate = useNavigate();

  const submit = () => {
    const calculated = 88;
    setScore(calculated);
    setState((s) => {
      const passed = calculated >= 80;
      const nextId = passed
        ? "sql-analysis"
        : s.recommended?.courseId || "sql-analysis";
      const next = s.courses.find((c) => c.id === nextId);
      return {
        ...s,
        lastAssessment: calculated,
        recommended: {
          courseId: nextId,
          title: next?.title || "SQL for Data Analysis",
          reason: passed
            ? `Passed at ${calculated}%. Next roadmap course unlocked.`
            : "Skill-gap remediation based on your competency profile.",
        },
        courses: s.courses.map((c) =>
          c.id === nextId ? { ...c, unlocked: true } : c,
        ),
        roadmap: s.roadmap.map((n) =>
          n.courseId === nextId ? { ...n, status: "current" } : n,
        ),
      };
    });
  };

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
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: primary,
              letterSpacing: 1,
            }}
          >
            ASSESSMENTS
          </div>
          <h1 style={{ fontSize: 28, margin: "7px 0 5px", color: "#16395f" }}>
            Validate your competency and unlock the next step
          </h1>
        </div>
      </div>

      <div style={{ ...card, padding: 20, maxWidth: 900 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <b style={{ fontSize: 13 }}>
              Statistics & Data Analysis — Reassessment
            </b>
            <p style={{ fontSize: 9, color: "#7890a8" }}>
              5 questions • passing threshold 80%
            </p>
          </div>
          <span style={{ fontSize: 10, color: primary, fontWeight: 800 }}>
            Attempt {state.attempts + 1}
          </span>
        </div>

        {assessmentQuestions.map((q, i) => (
          <div
            key={i}
            style={{ padding: "16px 0", borderTop: "1px solid #edf2f7" }}
          >
            <div style={{ fontSize: 9, color: primary, fontWeight: 800 }}>
              {q.type}
            </div>
            <b style={{ fontSize: 11, display: "block", margin: "6px 0 9px" }}>
              {i + 1}. {q.question}
            </b>
            {q.options.map((o) => (
              <label
                key={o}
                style={{
                  display: "block",
                  fontSize: 9,
                  color: "#657d96",
                  padding: 7,
                }}
              >
                <input
                  type="radio"
                  name={`q${i}`}
                  checked={selected[i] === o}
                  onChange={() => setSelected({ ...selected, [i]: o })}
                />{" "}
                {o}
              </label>
            ))}
          </div>
        ))}
        <button
          className="btn btn-primary"
          onClick={() => {
            setState((s) => ({ ...s, attempts: s.attempts + 1 }));
            submit();
          }}
        >
          Submit Assessment <ArrowRight size={14} />
        </button>
        {score && (
          <AssessmentOutcome score={score} state={state} setState={setState} />
        )}
      </div>
    </div>
  );
}
