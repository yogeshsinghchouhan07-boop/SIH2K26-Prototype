import { useEffect, useState } from "react";

export default function CursorFX() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) =>
      setActive(
        !!e.target.closest(
          "button,a,.feature-card,.step-card,.audience-card,.recommend-card",
        ),
      );
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <div
      className={`cursor-fx ${active ? "cursor-active" : ""}`}
      style={{ "--x": `${pos.x}px`, "--y": `${pos.y}px` }}
    >
      <i></i>
      <b></b>
    </div>
  );
}
