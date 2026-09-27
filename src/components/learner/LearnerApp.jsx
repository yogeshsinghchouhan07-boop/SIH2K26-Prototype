import { useState } from "react";
import AIChatbot from "./AIChatbot";
import LearnerAssessments from "./Assessments";
import AssessmentGenerator from "./AssessmentGenerator";
import CourseDetailView from "./CourseDetail";
import CoursesView from "./Courses";
import OverviewView from "./Overview";
import ProgressView from "./Progress";
import LearnerRoadmap from "./Roadmap";
import SkillGapAnalyzer from "./SkillGapAnalyzer";
import { AppHeader, AppShell, Sidebar } from "./Layout";
import { assessmentQuestions } from "../../data/learningData";
import { CometCard } from "../ui/comet-card";

export default function LearnerApp({ page, state, setState, onLogout }) {
  const [sidebar, setSidebar] = useState(true);

  const content =
    page === "overview" ? (
      <OverviewView state={state} setState={setState} sidebarOpen={sidebar} />
    ) : page === "courses" ? (
      <CoursesView state={state} sidebarOpen={sidebar} />
    ) : page === "roadmap" ? (
      <LearnerRoadmap state={state} sidebarOpen={sidebar} />
    ) : page === "assessment-generator" ? (
      <AssessmentGenerator
        state={state}
        setState={setState}
        sidebarOpen={sidebar}
      />
    ) : page === "ai-chatbot" ? (
      <AIChatbot sidebarOpen={sidebar} />
    ) : page === "skill-gap" ? (
      <SkillGapAnalyzer state={state} sidebarOpen={sidebar} />
    ) : page === "progress" ? (
      <ProgressView state={state} sidebarOpen={sidebar} />
    ) : page === "assessments" ? (
      <LearnerAssessments
        state={state}
        setState={setState}
        sidebarOpen={sidebar}
        assessmentQuestions={assessmentQuestions}
      />
    ) : page.startsWith("course/") ? (
      <CourseDetailView
        state={state}
        setState={setState}
        courseId={page.split("/")[1]}
        sidebarOpen={sidebar}
      />
    ) : (
      <OverviewView state={state} setState={setState} sidebarOpen={sidebar} />
    );

  return (
    <AppShell>
      <style>{`@keyframes unlockPop{0%{opacity:0;transform:translateY(24px) scale(.88)}70%{transform:translateY(-5px) scale(1.02)}100%{opacity:1;transform:none}}`}</style>
      <AppHeader
        onLogout={onLogout}
        onSidebarToggle={() => setSidebar((v) => !v)}
        sidebarOpen={sidebar}
      />
      <Sidebar open={sidebar} onClose={() => setSidebar(false)} />
      {content}
      
    </AppShell>
  );
}
