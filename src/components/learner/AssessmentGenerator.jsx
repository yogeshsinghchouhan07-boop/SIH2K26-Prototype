import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  RotateCcw,
  Sparkles,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { assessmentQuestions } from "../../data/learningData";
import { primary, Page } from "./Layout";
import { ImageGenerationLoader } from "@/components/ui/image-generation-loader";
import { FileUpload } from "../ui/file-upload";
import "./AssessmentGenerator.css";
const card = {
  background: "var(--assessment-panel)",
  border: "1px solid var(--assessment-border)",
  borderRadius: 14,
  boxShadow: "var(--assessment-shadow)",
};
export function handleAssessmentResult(score, setState) {
  setState((s) => {
    const passed = score >= 80;
    const nextId = passed
      ? "sql-analysis"
      : s.recommended?.courseId || "sql-analysis";
    const next = s.courses.find((c) => c.id === nextId);
    return {
      ...s,
      lastAssessment: score,
      recommended: {
        courseId: nextId,
        title: next?.title || "SQL for Data Analysis",
        reason: passed
          ? `Passed at ${score}%. Next roadmap course unlocked.`
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
}

export function AssessmentOutcome({ score, state, setState }) {
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

export default function AssessmentGenerator({
  state,
  setState,
  sidebarOpen = true,
}) {
  const questionTypes = ["MCQ", "True / False", "Fill in the Blank"];
  const [selectedTypes, setSelectedTypes] = useState(questionTypes);
  const [count, setCount] = useState(5);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const generationTimerRef = useRef(null);
  const [score, setScore] = useState(null);
  const [tab, setTab] = useState("learning");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [previousAssessments, setPreviousAssessments] = useState([]);

  useEffect(() => () => clearTimeout(generationTimerRef.current), []);

  const generate = () => {
    clearTimeout(generationTimerRef.current);
    setGenerated(false);
    setIsGenerating(true);
    generationTimerRef.current = setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 5000);
  };

  const questionPool = assessmentQuestions.filter((question) =>
    selectedTypes.includes(question.type),
  );
  const generatedQuestions = Array.from(
    { length: count },
    (_, index) =>
      (questionPool.length ? questionPool : assessmentQuestions)[
        index % (questionPool.length || assessmentQuestions.length)
      ],
  );

  const handleFileUpload = (files) => {
    const selectedFile = files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) setGenerated(false);
  };

  const submitAssessment = () => {
    const correct = generatedQuestions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0,
    );
    const wrong = Object.keys(answers).length - correct;
    const nextScore = Math.round(
      Math.max(0, (correct - wrong * 0.25) / generatedQuestions.length) * 100,
    );
    setScore(nextScore);
    setSubmitted(true);
    setPreviousAssessments((items) => [
      {
        id: Date.now(),
        score: nextScore,
        count,
        correct,
        wrong,
        date: new Date().toLocaleDateString(),
      },
      ...items,
    ]);
    handleAssessmentResult(nextScore, setState);
  };

  const downloadAssessment = () => {
    const questions = generatedQuestions
      .map(
        (question, index) =>
          `${index + 1}. ${question.question}\n${question.options.map((option) => `   - ${option}`).join("\n")}`,
      )
      .join("\n\n");
    const printable = window.open("", "_blank");
    if (!printable) return;
    printable.document.write(
      `<html><head><title>Learning Assessment</title></head><body><h1>Learning Assessment</h1><p>${count} questions</p><pre>${questions.replaceAll("<", "&lt;")}</pre></body></html>`,
    );
    printable.document.close();
    printable.focus();
    printable.print();
  };

  return (
    <Page
      title="Assessment Generator"
      subtitle="Create a role-aligned assessment from learning material"
      sidebarOpen={sidebarOpen}
    >
      <div className="assessment-theme-shell">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: ".8fr 1.2fr",
            gap: 15,
          }}
        >
          {tab === "learning" && (
            <div
              style={{ ...card, padding: 18, color: "var(--assessment-text)" }}
            >
              <h2 style={{ fontSize: 15, margin: "0 0 14px" }}>
                1. Add learning material
              </h2>
              <div className="assessment-upload-shell w-full max-w-4xl mx-auto min-h-96 border border-dashed rounded-lg">
                <FileUpload onChange={handleFileUpload} />
              </div>
              {/* <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              setFile(e.dataTransfer.files[0] || null);
            }}
            style={{
              border: `2px dashed ${dragging ? primary : "#cbd9e8"}`,
              borderRadius: 12,
              padding: 32,
              textAlign: "center",
              background: dragging ? "#f0f7ff" : "#fbfdff",
            }}
          >
            <Upload size={26} color={primary} />
            <p style={{ fontSize: 11, fontWeight: 800 }}>
              Drag & drop PDF / DOCX / PPTX / TXT
            </p>
            <small style={{ fontSize: 9, color: "#7b8da3" }}>
              {file ? file.name : "or choose a file from your computer"}
            </small>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={(e) => setFile(e.target.files[0] || null)}
              style={{
                display: "block",
                margin: "12px auto 0",
                fontSize: 9,
                maxWidth: "100%",
              }}
            />
          </div> */}
              <h2 style={{ fontSize: 15, margin: "22px 0 14px" }}>
                2. Assessment settings
              </h2>
              <label style={{ fontSize: 10, fontWeight: 800 }}>
                Number of questions
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                style={{ width: "100%", accentColor: "#3ec5f7" }}
              />
              <div style={{ fontSize: 9, color: "#91a4bb", marginBottom: 12 }}>
                {count} questions · +1 correct / -0.25 incorrect
              </div>
              <label style={{ fontSize: 10, fontWeight: 800 }}>
                Question types
              </label>
              <div style={{ display: "grid", gap: 7, margin: "10px 0 14px" }}>
                {questionTypes.map((questionType) => (
                  <label
                    key={questionType}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "8px 10px",
                      border: "1px solid #22334a",
                      borderRadius: 8,
                      color: "#b7c6d8",
                      fontSize: 10,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(questionType)}
                      onChange={() =>
                        setSelectedTypes((current) =>
                          current.includes(questionType)
                            ? current.filter((item) => item !== questionType)
                            : [...current, questionType],
                        )
                      }
                    />
                    {questionType}
                  </label>
                ))}
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={generate}
              >
                Generate Assessment <Sparkles size={15} />
              </button>
            </div>
          )}
          <div
            style={{ ...card, padding: 18, color: "var(--assessment-text)" }}
          >
            <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>
              3. Preview & test
            </h2>
            {generated ? (
              <>
                <div
                  style={{
                    padding: 12,
                    borderRadius: 9,
                    background: "#111f31",
                    border: "1px solid #22334a",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 10,
                    }}
                  >
                    <b>Generated from</b>
                    <span>{file?.name || "Demo learning content"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      selectedTypes.length
                        ? selectedTypes.join(", ")
                        : "No type selected",
                      `${count} questions`,
                      `Role: Statistics Professional`,
                    ].map((x) => (
                      <span
                        key={x}
                        style={{
                          fontSize: 8,
                          padding: "5px 7px",
                          borderRadius: 20,
                          background: "#eaf3ff",
                          color: primary,
                        }}
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
                {generatedQuestions.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #22334a",
                    }}
                  >
                    <div
                      style={{ fontSize: 9, color: primary, fontWeight: 800 }}
                    >
                      {q.type}
                    </div>
                    <b
                      style={{
                        fontSize: 11,
                        display: "block",
                        margin: "5px 0",
                      }}
                    >
                      {i + 1}. {q.question}
                    </b>
                    {q.options.length > 0 && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 5,
                        }}
                      >
                        {q.options.map((o) => (
                          <span
                            key={o}
                            style={{
                              fontSize: 9,
                              color: "#b7c6d8",
                              padding: 6,
                              border: `1px solid ${answers[i] === o ? "#3ec5f7" : "#2a4058"}`,
                              borderRadius: 6,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              !submitted &&
                              setAnswers((current) => ({ ...current, [i]: o }))
                            }
                          >
                            <input
                              type="radio"
                              checked={answers[i] === o}
                              onChange={() => {}}
                            />{" "}
                            {o}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 14 }}
                  onClick={submitAssessment}
                >
                  Submit assessment <CheckCircle2 size={14} />
                </button>
                <button
                  className="btn btn-outline"
                  style={{ marginTop: 14, marginLeft: 8 }}
                  onClick={downloadAssessment}
                >
                  Download PDF <Download size={14} />
                </button>
                {score && (
                  <AssessmentOutcome
                    score={score}
                    state={state}
                    setState={setState}
                  />
                )}
              </>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  color: "#8194aa",
                }}
              >
                <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:p-12">
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-900 outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
                    <img
                      src="https://assets.aceternity.com/components/vertical-sliding-loader-demo.webp"
                      alt="A project creation interface"
                      className="size-full object-cover dark:hidden"
                    />
                    <img
                      src="https://assets.aceternity.com/components/vertical-sliding-loader-demo-dark.webp"
                      alt="A project creation interface"
                      className="size-full object-cover not-dark:hidden"
                    />
                    <ImageGenerationLoader
                      effect="scale-wave"
                      easing="ease-in-out"
                      text="Analysing"
                      duration={5000}
                      cellSize={3}
                      gap={1}
                      bandHeight={48}
                      colors={[
                        "var(--color-blue-500)",
                        "var(--color-blue-800)",
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            ...card,
            padding: 18,
            marginTop: 15,
            color: "var(--assessment-text)",
          }}
        >
          <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>
            Previous assessments
          </h2>
          {previousAssessments.length ? (
            previousAssessments.map((assessment) => (
              <div
                key={assessment.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  border: "1px solid #22334a",
                  borderRadius: 9,
                  marginTop: 8,
                  background: "#111f31",
                }}
              >
                <span style={{ fontSize: 10 }}>
                  {assessment.date} · {assessment.count} questions
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: assessment.score >= 80 ? "#3ddc84" : "#ffc857",
                    fontWeight: 800,
                  }}
                >
                  {assessment.score}% · {assessment.correct} correct ·{" "}
                  {assessment.wrong} wrong
                </span>
              </div>
            ))
          ) : (
            <span style={{ color: "#91a4bb", fontSize: 10 }}>
              Your completed assessments will appear here.
            </span>
          )}
        </div>
      </div>
    </Page>
  );
}
