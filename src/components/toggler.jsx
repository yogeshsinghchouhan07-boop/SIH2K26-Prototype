import { useEffect } from "react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

export function ThemeToggler({ theme, onThemeChange, ...props }) {
  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const syncTheme = (nextTheme) => {
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.body.setAttribute("data-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("statskill-theme", nextTheme);
    onThemeChange?.(nextTheme);
  };

  return (
    <AnimatedThemeToggler
      theme={theme}
      onThemeChange={syncTheme}
      {...props}
    />
  );
}
