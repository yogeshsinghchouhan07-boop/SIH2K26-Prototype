import { useMemo, useState } from "react";
import { ArrowUpRight, MessageSquareText, Sparkles } from "lucide-react";

const primary = "#1475e5";
const card = {
  background: "var(--panel-strong)",
  border: "1px solid var(--line)",
  borderRadius: 14,
  boxShadow: "var(--shadow)",
};

const starterMessages = [
  {
    sender: "bot",
    text: "I can help you choose the next learning step based on your competency score and skill gaps.",
  },
  {
    sender: "user",
    text: "What should I work on next?",
  },
  {
    sender: "bot",
    text: "Your current strength is statistics, but SQL and Python are the biggest gaps. I’d prioritize SQL first, then Python practice.",
  },
];

const knowledgeBase = [
  {
    match: ["project", "statskill", "platform", "app", "what can you do", "about"],
    answer: "StatSkill AI is a competency-based learning platform for statistics and data skills. It brings together a learner overview, skill-gap summaries, recommended courses, a learning roadmap, and assessments. The intended flow is to review your competency profile, choose a learning resource for a priority gap, practise, then take an assessment and use the result to guide your next step. The current screens use sample frontend data, so the scores and recommendations are demonstrations rather than live learner records.",
  },
  {
    match: ["gap", "gaps", "priority", "priorities", "improve", "next skill", "next course", "recommend"],
    answer: "In the sample learner profile, SQL is the first priority: demonstrated competency is 40 against a target of 70, a 30-point gap. Python is 60 against 80 (20 points), Data Visualization is 55 against 75 (20 points), and Statistics is 75 against 80 (5 points). A practical order is to strengthen SQL first, continue the current visualization course, then work on Python; keep Statistics fresh with short review sessions. These are demo values—your real priority should come from your own assessment results and role requirements.",
  },
  {
    match: ["sql", "query", "database", "join"],
    answer: "For SQL, start with SELECT, WHERE, sorting, and limiting results. Then practise aggregation with GROUP BY and HAVING, and learn joins so you can combine related tables without duplicating or losing records. Use realistic datasets and write a question before each query, such as ‘Which region had the largest change this year?’ Check row counts after joins and verify totals against the source. The project includes an intermediate ‘SQL for Data Analysis’ course listed at about 5 hours 30 minutes; it is currently shown as locked in the sample roadmap, so follow the app’s course or assessment flow to unlock it.",
  },
  {
    match: ["visual", "visualization", "visualisation", "chart", "dashboard", "graph"],
    answer: "For data visualization, match the chart to the question: use a line chart for change over time, bars for category comparisons, and a histogram for a numeric distribution. Label units and time periods, show the source, and avoid decoration that obscures comparisons. For a dashboard, put the main finding first and keep filters and definitions clear. The sample roadmap marks Visualization as the current step, and ‘Data Visualization for Official Statistics’ is shown as 72% complete (about 6 hours 10 minutes total). Finish the remaining lessons, then practise explaining one chart in a short written takeaway.",
  },
  {
    match: ["python", "pandas", "automation", "coding", "programming"],
    answer: "Build Python skills in small steps: become comfortable with variables, lists, dictionaries, conditions, loops, and functions; then use pandas to load a dataset, inspect columns and missing values, clean records, group and summarise data, and export results. Recreate one analysis you already understand in a notebook so you can compare the code output with your existing result. Keep each notebook reproducible by recording the data source and steps. The sample project lists ‘Python for Data Analysis’ as an intermediate course of roughly 7 hours 15 minutes and places it after SQL in the roadmap.",
  },
  {
    match: ["assessment", "assess", "test", "exam", "score", "prepare", "revision"],
    answer: "To prepare for an assessment, first review the competency or skill-gap areas it covers. Practise retrieval: answer questions without notes, explain why the answer is correct, and write down the concept behind each mistake. Revisit the matching course section, then try a fresh set of questions under the same time limit. After submitting, use the result to choose the next course or remediation step rather than repeating only questions you already know. In this demo app, assessment outcomes can update the recommended course and roadmap state; treat the displayed scores as sample data.",
  },
];

function getAnswer(question) {
  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const stopWords = new Set(["a", "about", "after", "and", "are", "can", "do", "for", "from", "give", "help", "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "please", "should", "the", "to", "what", "with", "you"]);
  const questionText = normalize(question);
  const questionWords = new Set(questionText.split(/\s+/).filter((word) => word.length > 2 && !stopWords.has(word)));
  const matches = knowledgeBase
    .map((entry) => {
      const terms = entry.match.map(normalize);
      const phraseScore = terms.reduce((score, term) => score + (term.length > 3 && questionText.includes(term) ? 3 : 0), 0);
      const keywordWords = new Set(terms.flatMap((term) => term.split(" ")).filter((word) => word.length > 2 && !stopWords.has(word)));
      const overlapScore = [...questionWords].filter((word) => keywordWords.has(word)).length;
      return { entry, score: phraseScore + overlapScore };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  const topScore = matches[0]?.score ?? 0;
  const entry = matches.length
    ? { answer: matches.filter(({ score }) => score >= Math.max(1, topScore * 0.45)).map(({ entry: match }) => match.answer).join("\n\n") }
    : undefined;
  return entry?.answer ?? "I can help with the StatSkill AI project, interpreting the sample skill gaps, SQL, Python, data visualization, or assessment preparation. Try asking about one of those topics. These replies use project sample data and aren’t connected to a live AI service yet.";
}

export default function AIChatbot({ sidebarOpen = true }) {
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");

  const leftMargin = sidebarOpen ? 250 : 0;
  const contentWidth = sidebarOpen ? "calc(100% - 250px)" : "100%";

  const quickPrompts = useMemo(
    () => [
      "What is StatSkill AI?",
      "Explain my skill gaps",
      "How should I learn SQL?",
      "Help me prepare for an assessment",
    ],
    [],
  );

  const sendMessage = () => {
    if (!input.trim()) return;

    const question = input.trim();
    setMessages((currentMessages) => [
      ...currentMessages,
      { sender: "user", text: question },
      { sender: "bot", text: getAnswer(question) },
    ]);
    setInput("");
  };

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
            AI CHATBOT
          </div>
          <h1 style={{ fontSize: 28, margin: "7px 0 5px", color: "var(--heading)" }}>
            Learning Coach
          </h1>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 14,
        }}
      >
        <div style={{ ...card, padding: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: primary,
              fontWeight: 800,
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            <MessageSquareText size={18} /> AI learning assistant
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 390,
              maxHeight: 390,
              overflow: "auto",
              paddingRight: 4,
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={`${m.sender}-${idx}`}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background: m.sender === "user" ? "var(--blue)" : "var(--panel)",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: "10px 12px",
                  fontSize: 11,
                  color: m.sender === "user" ? "#fff" : "var(--ink)",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                style={{
                  border: "1px solid var(--line)",
                  background: "var(--panel)",
                  color: "var(--blue)",
                  borderColor: "var(--line)",
                  borderRadius: 999,
                  padding: "8px 10px",
                  fontSize: 9,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 14,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask your learning coach..."
              aria-label="Ask your learning coach"
              className="ai-chatbot-input"
              style={{
                flex: 1,
                border: "1px solid var(--line)",
                borderRadius: 10,
                padding: "11px 12px",
                fontSize: 11,
                outline: "none",
                color: "var(--ink)",
                background: "var(--panel-strong)",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                border: 0,
                background: "linear-gradient(135deg, #1780eb, #6b47df)",
                color: "#fff",
                borderRadius: 10,
                padding: "0 14px",
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>

        <div style={{ ...card, padding: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: primary,
              fontWeight: 800,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            <Sparkles size={16} /> Suggested focus
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {[
              [
                "SQL for Data Analysis",
                "Your biggest technical gap and best next unlock.",
              ],
              [
                "Data Visualization",
                "Improve communication of findings and reporting.",
              ],
              [
                "Python for Data Analysis",
                "Strengthen automation and analysis skills.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                style={{
                  border: "1px solid var(--line)",
                  background: "var(--panel)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontSize: 11, fontWeight: 800, color: "var(--heading)" }}
                >
                  {title}
                </div>
                <p
                  style={{
                    fontSize: 9,
                    color: "var(--subtle)",
                    lineHeight: 1.5,
                    margin: "6px 0 0",
                  }}
                >
                  {text}
                </p>
                <div
                  style={{
                    marginTop: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: primary,
                    fontWeight: 800,
                    fontSize: 9,
                  }}
                >
                  Open path <ArrowUpRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
