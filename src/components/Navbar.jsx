import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";
import { ThemeToggler } from "./toggler";

const links = [
  ["Home", "/", "home"],
  ["About", "/about"],
  ["How It Works", "/how-it-works", "how-it-works"],
  ["Features", "/features", "features"],
  ["iGOT", "/igot", "igot"],
  ["Resources", "/resources", "resources"],
];

export default function Navbar({ dashboard = false }) {
  const navigate = useNavigate();
  const { scrollTo } = useApp();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("statskill-theme");
    return stored || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("statskill-theme", theme);
  }, [theme]);

  const handle = (path, section) => {
    setOpen(false);
    if (section && location.pathname === "/") scrollTo(section);
    else navigate(path);
  };

  return (
    <header className="navbar">
      <div className="container nav-shell">
        <div className="nav-inner">
          <button className="brand magnetic" onClick={() => navigate("/")}>
            <img src="/assets/logo.svg" alt="StatSkill AI" />
          </button>
          {!dashboard && (
            <nav className={open ? "mobile-open" : ""}>
              {links.map(([label, path, section]) => (
                <button
                  key={label}
                  className={location.pathname === path ? "nav-active" : ""}
                  onClick={() => handle(path, section)}
                >
                  {label}
                </button>
              ))}
            </nav>
          )}
          <div className="nav-actions">
            <ThemeToggler
              className="theme-toggle"
              theme={theme}
              onThemeChange={setTheme}
              label={theme === "light" ? "Dark" : "Light"}
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            />
            <button
              className="login-btn magnetic"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button className="menu-btn" onClick={() => setOpen((v) => !v)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
