
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Play,
  Sparkles,
  ChevronRight,
  Brain,
  BarChart3,
  BookOpen,
  Target,
  CheckCircle2,
  Users,
  ShieldCheck,
} from "lucide-react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CursorFX from "./components/CursorFX";
import SideRail from "./components/SideRail";
import Reveal from "./components/Reveal";
import { AdminLoginPage, LoginPage, SignupPage } from "./components/AuthPages";
import LearnerApp from "./components/learner/LearnerApp";
import AdminDashboard from "./components/admin/AdminDashboard";
import { courses, roadmap, skillGaps } from "./data/learningData";
import AIComponent from "./components/AIComponent";
import Hero from "./components/Hero";
import Handshape from "./components/handshape";
import { GlowingEffectDemoSecond } from "./components/HeroMain";
import { HeroParallaxDemo } from "./components/heroMain2";
 

 

const featureData = [
  [
    "Competency Assessment",
    "Evaluate your skills across multiple domains.",
    "clipboard",
  ],
  [
    "AI Skill Gap Analysis",
    "Get data-driven insights on what you need to improve.",
    "chart",
  ],
  [
    "Personalized Recommendations",
    "Receive AI-curated courses, resources and learning paths.",
    "target",
  ],
  [
    "Adaptive Learning Paths",
    "Learn at your own pace with role-based journeys.",
    "book",
  ],
  [
    "AI Quiz Generation",
    "Generate contextual quizzes from learning material.",
    "brain",
  ],
  [
    "Learning Analytics",
    "Track progress and measure growth with real-time insights.",
    "analytics",
  ],
];

const journey = [
  ["01", "Assess", "Current competency evaluation", "clipboard"],
  ["02", "Analyze", "AI analyzes your performance", "analytics"],
  ["03", "Identify Gaps", "Role-specific skill gaps", "search"],
  ["04", "Recommend", "Personalized resources", "star"],
  ["05", "Learn", "Follow learning path", "book"],
  ["06", "Test", "AI-generated quizzes", "brain"],
  ["07", "Reassess", "Measure improvement & update path", "refresh"],
];

function iconFor(name, size = 22) {
  const props = { size, strokeWidth: 2 };
  const map = {
    clipboard: <CheckCircle2 {...props} />,
    chart: <BarChart3 {...props} />,
    target: <Target {...props} />,
    book: <BookOpen {...props} />,
    brain: <Brain {...props} />,
    analytics: <BarChart3 {...props} />,
    search: <Target {...props} />,
    star: <Sparkles {...props} />,
    refresh: <ArrowRight {...props} />,
  };
  return map[name] || <Sparkles {...props} />;
}

function Home() {
  const navigate = useNavigate();
  const { scrollTo } = useApp();
  return (
    <div className="page">
      <Navbar />
      <SideRail />
      <CursorFX />
      <main>
        <section className="home-parallax-stage" aria-label="Personalized learning introduction">
          <HeroParallaxDemo />
        </section>
        <section className="home-handshape-stage" aria-label="Learning journey">
          <Handshape />
        </section>
       

        {/* <section className="platform section-anchor">
          <div className="container">
            <Reveal className="section-heading centered">
              <h2>One Platform for Smarter Skill Development</h2>
              <p>
                Karmayogi AI assesses competencies, identifies role-specific
                skill gaps, recommends relevant learning resources, and
                continuously adapts the learning journey based on performance.
              </p>
            </Reveal>
            <div className="three-step">
              {[
                [
                  "Assess",
                  "Measure your current competencies through AI-driven assessments.",
                  "clipboard",
                ],
                [
                  "Diagnose",
                  "Identify skill gaps based on your role and performance.",
                  "search",
                ],
                [
                  "Improve",
                  "Follow personalized learning paths and track your progress.",
                  "chart",
                ],
              ].map((item, i) => (
                <Reveal key={item[0]} delay={i * 80} className="step-card">
                  <div className={`step-icon step-${i}`}>
                    {iconFor(item[2], 23)}
                  </div>
                  <div>
                    <h3>{item[0]}</h3>
                    <p>{item[1]}</p>
                  </div>
                  {i < 2 && <ChevronRight className="step-arrow" size={20} />}
                </Reveal>
              ))}
            </div>
          </div>
        </section> */}

        <section id="how-it-works" className="how section-anchor blue-section">
          <div className="container">
            <div className="how-intro">
              <Reveal className="how-video-panel">
                <video
                  src="/assets/edTech.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                />
              </Reveal>

              <Reveal className="how-copy">
                <span className="kicker">HOW IT WORKS</span>
                <h2>
                  A simple, personalized learning journey built to help you grow
                  faster and smarter.
                </h2>
                <p>
                  Karmayogi AI evaluates your current skills, identifies gaps,
                  and creates a focused roadmap tailored to your role and goals.
                  From assessment and analysis to recommendation, learning,
                  testing, and reassessment, every step is designed to make
                  progress measurable and motivating.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/login")}
                >
                  Get Started <ArrowRight size={17} />
                </button>
              </Reveal>
            </div>

            <Reveal delay={100} className="journey-track">
              {journey.map(([num, title, desc, icon], i) => (
                <div className="journey-item" key={num}>
                  <div className={`journey-icon ji-${i}`}>
                    {iconFor(icon, 21)}
                  </div>
                  <b>{num}</b>
                  <strong>{title}</strong>
                  <small>{desc}</small>
                  {i < journey.length - 1 && (
                    <span className="journey-arrow">→</span>
                  )}
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section id="features" className="features section-anchor">
          <div className="container">
            <Reveal className="section-heading centered">
              <span className="kicker">KEY FEATURES</span>
              <h2>Everything You Need for Continuous Learning</h2>
              <p>
                Powerful features designed to help you learn, grow and achieve
                your career goals.
              </p>
            </Reveal>
            <div className="feature-grid">
              {featureData.map(([title, text, icon], i) => (
                <Reveal delay={i * 50} className="feature-card" key={title}>
                  <div className={`feature-icon fi-${i}`}>
                    {iconFor(icon, 22)}
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="adaptive">
          <div className="container">
            <div className="adaptive-grid">
              <Reveal className="dark-panel">
                <span className="kicker light">PERSONALIZED LEARNING</span>
                <h2>Learning That Adapts to You</h2>
                <p>
                  Instead of giving every learner the same path, our AI adapts
                  recommendations according to individual competency and
                  performance.
                </p>
                <div className="flow-row">
                  {[
                    "Your Profile",
                    "Assessment",
                    "AI Analysis",
                    "Skill Gap",
                    "Personalized Path",
                    "Learning",
                    "Performance",
                    "AI adapts",
                  ].map((x, i) => (
                    <div className="flow-node" key={x}>
                      <span>{i + 1}</span>
                      {x}
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal className="gap-panel" delay={100}>
                <span className="kicker">SKILL INTELLIGENCE</span>
                <h2>Know Where You Stand. Know What to Improve.</h2>
                <p>
                  Get a clear view of your current competency and required level
                  with AI-powered skill gap analysis.
                </p>
                <div className="skill-table">
                  {[
                    ["Python", "60%", "80%", "20%"],
                    ["SQL", "40%", "70%", "30%"],
                    ["Statistics", "75%", "80%", "5%"],
                    ["Data Visualization", "55%", "75%", "20%"],
                  ].map((r) => (
                    <div className="skill-row" key={r[0]}>
                      <span>{r[0]}</span>
                      <b>{r[1]}</b>
                      <b>{r[2]}</b>
                      <mark>{r[3]}</mark>
                    </div>
                  ))}
                </div>
                <button className="text-btn" onClick={() => navigate("/login")}>
                  Explore Skill Analysis <ArrowRight size={16} />
                </button>
              </Reveal>
            </div>
            {/* <div className="adaptive-grid lower">
              <Reveal className="soft-panel mint">
                <span className="kicker">CONNECTED ECOSYSTEM</span>
                <h3>Connected with the iGOT Learning Ecosystem</h3>
                <p>
                  Access relevant learning resources based on your competency
                  needs.
                </p>
                <div className="ecosystem">
                  {[
                    "Your Skill Gap",
                    "AI Engine",
                    "iGOT",
                    "Personalized Recommendation",
                  ].map((x, i) => (
                    <div key={x}>
                      <span className="eco-icon">{i === 2 ? "iGOT" : "✦"}</span>
                      <small>{x}</small>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal className="soft-panel lavender" delay={80}>
                <span className="kicker">ASSESSMENT GENERATOR</span>
                <h3>Turn Learning Content into Assessments</h3>
                <p>
                  Upload learning material and generate contextual assessments
                  to test your understanding.
                </p>
                <div className="ecosystem">
                  {["Learning Material", "AI", "Quiz Generator", "MCQs"].map(
                    (x, i) => (
                      <div key={x}>
                        <span className="eco-icon">
                          {i === 0 ? "▤" : i === 1 ? "✦" : i === 2 ? "⚙" : "☷"}
                        </span>
                        <small>{x}</small>
                      </div>
                    ),
                  )}
                </div>
              </Reveal>
            </div> */}
          </div>
        </section>

       
        <section>
          <Hero />
        </section>

        <section id="igot" className="audience section-anchor">
          <div className="container">
            <Reveal className="section-heading centered">
              <h2>Designed for Smarter Workforce Development</h2>
              <p>
                Creating value for every stakeholder in the learning ecosystem.
              </p>
            </Reveal>
            <div className="audience-grid">
              {[
                [
                  "For Learners",
                  "Personalized learning and clear skill-gap visibility.",
                  Users,
                ],
                [
                  "For Organizations",
                  "Organization-level competency insights.",
                  ShieldCheck,
                ],
                [
                  "For Training",
                  "Data-driven recommendations and adaptive assessments.",
                  BookOpen,
                ],
                [
                  "For Administrators",
                  "Learning progress and competency analytics.",
                  BarChart3,
                ],
              ].map(([t, d, I]) => (
                <Reveal className="audience-card" key={t}>
                  <I size={24} />
                  <h3>{t}</h3>
                  <p>{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <AIComponent />
        <section id="resources" className="cta section-anchor">
          <div className="container cta-box">
            <div>
              <span className="kicker light">START YOUR JOURNEY</span>
              <h2>Start Your Personalized Learning Journey</h2>
              <p>
                Assess your skills. Discover your gaps. Build the competencies
                you need.
              </p>
            </div>
            <button
              className="btn btn-white"
              onClick={() => navigate("/login")}
            >
              Get Started <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SimplePage({ title, text }) {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <CursorFX />
      <div className="simple-page">
        <div className="container">
          <span className="kicker">KARMAYOGI AI</span>
          <h1>{title}</h1>
          <p>{text}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Access Learner Platform <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function LearnerRoutes() {
  const { logout } = useApp();
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem("statskill-learning-state");
      return saved
        ? JSON.parse(saved)
        : {
            competency: 67,
            courses,
            roadmap,
            skillGaps,
            lastAssessment: null,
            attempts: 0,
            recommended: {
              courseId: "sql-analysis",
              title: "SQL for Data Analysis",
              reason: "Largest current role-specific skill gap",
            },
          };
    } catch {
      return {
        competency: 67,
        courses,
        roadmap,
        skillGaps,
        lastAssessment: null,
        attempts: 0,
        recommended: {
          courseId: "sql-analysis",
          title: "SQL for Data Analysis",
          reason: "Largest current role-specific skill gap",
        },
      };
    }
  });
  useEffect(
    () =>
      localStorage.setItem("statskill-learning-state", JSON.stringify(state)),
    [state],
  );
  const pageFor = (pathname) =>
    pathname === "/overview"
      ? "overview"
      : pathname === "/courses"
        ? "courses"
        : pathname === "/roadmap"
          ? "roadmap"
          : pathname === "/assessment-generator"
            ? "assessment-generator"
            : pathname === "/ai-chatbot"
              ? "ai-chatbot"
              : pathname === "/skill-gap"
                ? "skill-gap"
                : pathname === "/progress"
                  ? "progress"
                  : pathname === "/assessments"
                    ? "assessments"
                    : pathname.startsWith("/courses/")
                      ? `course/${pathname.split("/")[2]}`
                      : "overview";
  const location = useLocation();
  return (
    <ProtectedRoute>
      <LearnerApp
        page={pageFor(location.pathname)}
        state={state}
        setState={setState}
        onLogout={logout}
      />
    </ProtectedRoute>
  );
}

function AdminRouteGate() {
  const { auth, logout } = useApp();
  if (auth?.role !== "Admin" && auth?.role !== "DepartmentAdmin") return <Navigate to="/admin/login" replace />;
  return <AdminDashboard account={auth} onLogout={logout} />;
}

export default function App() {
  const location = useLocation();
  const { login } = useApp();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage onLogin={login} />} />
      <Route path="/admin/*" element={<AdminRouteGate />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/about"
        element={
          <SimplePage
            title="About Karmayogi AI"
            text="A competency-first learning experience designed around assessment, skill-gap intelligence and adaptive learning."
          />
        }
      />
      <Route
        path="/how-it-works"
        element={
          <SimplePage
            title="How Karmayogi AI Works"
            text="Assess → analyze → identify gaps → recommend → learn → test → reassess. The journey continuously adapts to learner performance."
          />
        }
      />
      <Route
        path="/features"
        element={
          <SimplePage
            title="Features"
            text="Competency assessment, AI skill-gap analysis, personalized recommendations, adaptive paths, assessment generation and learning analytics."
          />
        }
      />
      <Route
        path="/igot"
        element={
          <SimplePage
            title="iGOT Integration"
            text="Connect relevant learning resources and competency needs through an iGOT-aligned learning experience."
          />
        }
      />
      <Route
        path="/resources"
        element={
          <SimplePage
            title="Resources"
            text="Learning resources, assessments and AI-assisted content designed to support continuous professional development."
          />
        }
      />
      <Route path="/login" element={<LoginPage onLogin={login} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
      <Route path="/overview/*" element={<LearnerRoutes />} />
      <Route path="/courses" element={<LearnerRoutes />} />
      <Route path="/courses/:id" element={<LearnerRoutes />} />
      <Route path="/roadmap" element={<LearnerRoutes />} />
      <Route path="/assessment-generator" element={<LearnerRoutes />} />
      <Route path="/ai-chatbot" element={<LearnerRoutes />} />
      <Route path="/assessments" element={<LearnerRoutes />} />
      <Route path="/skill-gap" element={<LearnerRoutes />} />
      <Route path="/progress" element={<LearnerRoutes />} />
    </Routes>
  );
}
