import { useEffect, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CircleHelp,
  Flame,
  Gauge,
  LogOut,
  MessageSquareText,
  PanelLeftClose,
  Settings,
  Sparkles,
  Target,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggler } from "../toggler";
import { useApp } from "../../context/AppContext";

export const primary = "#1475e5";

export function useThemePalette() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.getAttribute("data-theme") || "light";
  });

  useEffect(() => {
    const syncTheme = () => {
      const next =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(next);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme === "dark"
    ? {
        shellBg: "#071521",
        topbar: "rgba(12, 20, 31, 0.9)",
        panel: "rgba(15, 25, 35, 0.88)",
        card: "rgba(11, 20, 30, 0.9)",
        line: "rgba(160, 183, 219, 0.18)",
        text: "#edf7ff",
        muted: "#bfd3ee",
        soft: "rgba(22, 36, 48, 0.9)",
        softPanel: "rgba(24, 38, 51, 0.9)",
        hover: "rgba(34, 52, 67, 0.9)",
        brand: "#f1f9ff",
      }
    : {
        shellBg: "#f4f8fd",
        topbar: "rgba(255,255,255,0.92)",
        panel: "rgba(255,255,255,0.96)",
        card: "#fff",
        line: "#e0e9f3",
        text: "#16395f",
        muted: "#627b96",
        soft: "#f4f9ff",
        softPanel: "#f8f2ff",
        hover: "#f4f9ff",
        brand: "#103d7d",
      };
}

export function AppShell({ children }) {
  const palette = useThemePalette();

  return (
    <div
      style={{
        background: palette.shellBg,
        minHeight: "100vh",
        color: palette.text,
      }}
    >
      {children}
    </div>
  );
}

export function CardShell({ children }) {
  const palette = useThemePalette();

  return (
    <div
      style={{
        background: palette.card,
        border: `1px solid ${palette.line}`,
        borderRadius: 14,
        boxShadow:
          palette.text === "#edf7ff"
            ? "0 8px 25px rgba(2, 6, 12, 0.25)"
            : "0 8px 25px rgba(49,94,137,.06)",
      }}
    >
      {children}
    </div>
  );
}

export function AppHeader({ onLogout, onSidebarToggle, sidebarOpen }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const palette = useThemePalette();
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.getAttribute("data-theme") || "light";
  });

  useEffect(() => {
    const syncTheme = () => {
      const next =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(next);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Profile", icon: User },
    { label: "Settings", icon: Settings },
    { label: "Notifications", icon: () => <Flame size={15} color="#f28b30" /> },
    { label: "Help and support", icon: CircleHelp },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "14px 0 0",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: "min(1200px, calc(100% - 32px))",
          margin: "0 auto",
          height: 74,
          background: palette.topbar,
          border: `1px solid ${palette.line}`,
          boxShadow:
            palette.text === "#edf7ff"
              ? "0 12px 28px rgba(2, 8, 14, 0.2)"
              : "0 12px 28px rgba(20, 64, 123, 0.08)",
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          padding: "0 18px 0 22px",
          backdropFilter: "blur(14px)",
        }}
      >
        <button
          onClick={onSidebarToggle}
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          style={{
            border: `1px solid ${palette.line}`,
            background: palette.soft,
            borderRadius: 12,
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            color: palette.text,
            marginRight: 12,
            cursor: "pointer",
          }}
        >
          {sidebarOpen ? (
            <PanelLeftClose size={18} />
          ) : (
            <img
              src="/assets/moreInfo.png"
              alt="More info"
              className="h-5 w-5"
            />
          )}
        </button>

        <button
          onClick={() => navigate(isAuthenticated ? "/overview" : "/")}
          style={{
            border: 0,
            background: "none",
            fontWeight: 900,
            fontSize: 20,
            color: palette.brand,
            cursor: "pointer",
            letterSpacing: "-0.04em",
          }}
        >
          StatSkill <span style={{ color: primary }}>AI</span>
        </button>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              color: palette.muted,
              padding: "8px 12px",
              borderRadius: 999,
              background: palette.soft,
              border: `1px solid ${palette.line}`,
            }}
          >
            <img src="/assets/fire.png" alt="Streak" className="h-6 w-6" /> 7
            day streak
          </div>

          <ThemeToggler
            theme={theme}
            onThemeChange={setTheme}
            className="learner-theme-toggle"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            style={{
              border: `1px solid ${palette.line}`,
              background: palette.soft,
              color: palette.text,
              borderRadius: 999,
              width: 38,
              height: 38,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              fontSize: 14,
            }}
          />

          <button
            aria-label="Notifications"
            style={{
              border: 0,
              background: palette.soft,
              color: primary,
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <img
              src="/assets/bell.png"
              alt="Notifications"
              className="h-5 w-5"
            />
          </button>

          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              aria-label="Open account menu"
              onClick={() => setProfileOpen((open) => !open)}
              style={{
                border: `1px solid ${palette.line}`,
                background:
                  palette.text === "#edf7ff"
                    ? "linear-gradient(135deg, rgba(22, 35, 49, 0.94), rgba(13, 25, 36, 0.92))"
                    : "linear-gradient(135deg, #f4f9ff, #edf5ff)",
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: palette.text,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow:
                  palette.text === "#edf7ff"
                    ? "0 8px 18px rgba(0,0,0,0.18)"
                    : "0 8px 18px rgba(19, 72, 136, 0.08)",
              }}
            >
              <img src="/assets/prof.png" alt="Profile" className="h-8 w-8" />
            </button>

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 12px)",
                  width: 220,
                  background: palette.panel,
                  border: `1px solid ${palette.line}`,
                  borderRadius: 14,
                  boxShadow:
                    palette.text === "#edf7ff"
                      ? "0 18px 40px rgba(0, 0, 0, 0.28)"
                      : "0 18px 40px rgba(15, 42, 74, 0.12)",
                  overflow: "hidden",
                  zIndex: 60,
                }}
              >
                <div
                  style={{
                    padding: "14px 14px 10px",
                    borderBottom: `1px solid ${palette.line}`,
                    background:
                      palette.text === "#edf7ff"
                        ? "linear-gradient(135deg, rgba(20, 31, 42, 0.94), rgba(22, 30, 52, 0.9))"
                        : "linear-gradient(135deg, #f6faff, #f9f4ff)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #e6f2ff, #dfe8ff)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        color: primary,
                      }}
                    >
                      GL
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: palette.text,
                        }}
                      >
                        Government Learner
                      </div>
                      <div style={{ fontSize: 10, color: palette.muted }}>
                        learner@statskill.ai
                      </div>
                    </div>
                  </div>
                </div>

                {menuItems.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setProfileOpen(false)}
                    style={{
                      width: "100%",
                      border: 0,
                      background: "transparent",
                      color: palette.text,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 14px",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = palette.hover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onFocus={(e) =>
                      (e.currentTarget.style.background = palette.hover)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}

                <button
                  onClick={onLogout}
                  style={{
                    width: "100%",
                    border: 0,
                    borderTop: `1px solid ${palette.line}`,
                    background: palette.panel,
                    color: "#d14c4c",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    fontSize: 12,
                    fontWeight: 700,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const palette = useThemePalette();
  const items = [
    ["/overview", "Overview", Gauge],
    ["/courses", "My Courses", BookOpen],
    ["/roadmap", "Learning Roadmap", Target],
    ["/assessment-generator", "Assessment Generator", Brain],
    ["/ai-chatbot", "AI Chatbot", MessageSquareText],
    ["/skill-gap", "Skill Gap Analyzer", BarChart3],
    ["/progress", "Progress & Analytics", Award],
  ];

  return (
    <aside
      style={{
        width: 230,
        borderRadius: 0,
        borderTop: 0,
        borderBottom: 0,
        borderLeft: 0,
        minHeight: "calc(100vh - 72px)",
        padding: "18px 12px",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 72,
        bottom: 0,
        zIndex: 40,
        transform: open ? "translateX(0)" : "translateX(-120%)",
        transition: "transform 0.25s ease",
        overflow: "hidden",
        background: palette.card,
        borderColor: palette.line,
      }}
      className="learner-sidebar"
    >
      {items.map(([path, label, I]) => (
        <button
          key={path}
          onClick={() => {
            navigate(path);
            onClose();
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 10px",
            border: 0,
            borderRadius: 9,
            background:
              location.pathname === path
                ? palette.text === "#edf7ff"
                  ? "rgba(88, 118, 180, 0.18)"
                  : "#eaf3ff"
                : "transparent",
            color:
              location.pathname === path
                ? primary
                : palette.text === "#edf7ff"
                  ? "#dfeeff"
                  : "#61768f",
            fontSize: 11,
            fontWeight: location.pathname === path ? 800 : 600,
            textAlign: "left",
            cursor: "pointer",
            margin: "2px 0",
          }}
        >
          <I size={17} />
          {label}
        </button>
      ))}
      <div
        style={{
          marginTop: 22,
          padding: 12,
          borderRadius: 10,
          background:
            palette.text === "#edf7ff"
              ? "linear-gradient(135deg, rgba(17, 31, 45, 0.95), rgba(23, 31, 56, 0.9))"
              : "linear-gradient(135deg,#eef7ff,#f8f4ff)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10,
            fontWeight: 800,
            color: palette.text,
          }}
        >
          <Sparkles size={14} color={primary} /> AI Learning Coach
        </div>
        <p
          style={{
            fontSize: 9,
            color: palette.muted,
            lineHeight: 1.5,
            margin: "7px 0 0",
          }}
        >
          Your recommendations update after every assessment.
        </p>
      </div>
    </aside>
  );
}

export function Page({
  children,
  title,
  subtitle,
  action,
  sidebarOpen = true,
}) {
  const leftMargin = sidebarOpen ? 250 : 0;
  const contentWidth = sidebarOpen ? "calc(100% - 250px)" : "100%";
  const maxWidth = sidebarOpen ? 1180 : 1400;
  const palette = useThemePalette();

  return (
    <div
      style={{
        marginLeft: leftMargin,
        padding: "28px 32px",
        maxWidth,
        width: contentWidth,
        boxSizing: "border-box",
        transition:
          "margin-left 0.25s ease, width 0.25s ease, max-width 0.25s ease",
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
            {title.toUpperCase()}
          </div>
          <h1
            style={{ fontSize: 28, margin: "7px 0 5px", color: palette.text }}
          >
            {subtitle}
          </h1>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
