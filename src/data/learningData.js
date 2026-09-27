// BACKEND NOTE (Django developer): Keep these objects only as mock data for frontend development.
// Replace them later with Django REST Framework responses such as GET /api/courses/,
// GET /api/learner/profile/, GET /api/learner/skill-gaps/ and GET /api/learner/recommendations/.

export const courses = [
  { id: "statistics-foundation", title: "Statistics Foundation", field: "Statistics", skill: "Statistics", level: "Foundation", duration: "4h 20m", progress: 100, unlocked: true },
  { id: "data-visualization", title: "Data Visualization for Official Statistics", field: "Data Visualization", skill: "Data Visualization", level: "Intermediate", duration: "6h 10m", progress: 72, unlocked: true },
  { id: "sql-analysis", title: "SQL for Data Analysis", field: "Data Analytics", skill: "SQL", level: "Intermediate", duration: "5h 30m", progress: 0, unlocked: false },
  { id: "python-data", title: "Python for Data Analysis", field: "Data Analytics", skill: "Python", level: "Intermediate", duration: "7h 15m", progress: 0, unlocked: false },
  { id: "advanced-analytics", title: "Advanced Statistical Analytics", field: "Advanced Analytics", skill: "Statistics", level: "Advanced", duration: "8h 40m", progress: 0, unlocked: false },
  { id: "ai-statistics", title: "AI & Machine Learning for Statistics", field: "AI & ML", skill: "Machine Learning", level: "Advanced", duration: "9h 05m", progress: 0, unlocked: false }
];

export const roadmap = [
  { id: "r1", title: "Foundation", subtitle: "Core statistical concepts", courseId: "statistics-foundation", status: "completed", skills: ["Statistics basics", "Probability"] },
  { id: "r2", title: "Visualization", subtitle: "Communicate insights clearly", courseId: "data-visualization", status: "current", skills: ["Charts", "Dashboards", "Storytelling"] },
  { id: "r3", title: "SQL", subtitle: "Query and prepare datasets", courseId: "sql-analysis", status: "locked", skills: ["SQL", "Joins", "Aggregation"] },
  { id: "r4", title: "Python", subtitle: "Automate data analysis", courseId: "python-data", status: "locked", skills: ["Python", "Pandas", "Data cleaning"] },
  { id: "r5", title: "Advanced Analytics", subtitle: "Move toward mastery", courseId: "advanced-analytics", status: "locked", skills: ["Statistical modeling", "Inference"] },
  { id: "r6", title: "AI for Statistics", subtitle: "Future-ready capabilities", courseId: "ai-statistics", status: "locked", skills: ["ML", "AI-assisted analysis"] }
];

export const skillGaps = [
  { skill: "SQL", current: 40, required: 70, gap: 30, courseId: "sql-analysis", reason: "Largest role-specific gap" },
  { skill: "Python", current: 60, required: 80, gap: 20, courseId: "python-data", reason: "Useful for automation and analysis" },
  { skill: "Data Visualization", current: 55, required: 75, gap: 20, courseId: "data-visualization", reason: "Improve reporting and dissemination" },
  { skill: "Statistics", current: 75, required: 80, gap: 5, courseId: "advanced-analytics", reason: "Near target competency" }
];

export const assessmentQuestions = [
  { type: "MCQ", question: "Which measure is most appropriate for the centre of a highly skewed dataset?", options: ["Mean", "Median", "Range", "Variance"], answer: "Median" },
  { type: "True / False", question: "A primary key can contain duplicate values.", options: ["True", "False"], answer: "False" },
  { type: "Fill in the Blank", question: "The process of combining rows from two tables using a related column is called a ______.", options: [], answer: "join" },
  { type: "MCQ", question: "Which chart is generally useful for showing a trend over time?", options: ["Line chart", "Pie chart", "Scatter only", "Histogram only"], answer: "Line chart" },
  { type: "True / False", question: "A skill gap can be represented as the difference between required and demonstrated competency.", options: ["True", "False"], answer: "True" }
];
