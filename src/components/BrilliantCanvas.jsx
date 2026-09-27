import React, { useEffect, useRef } from "react";

const BrilliantCanvas = ({ className = "", style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.45,
      8,
      width * 0.5,
      height * 0.45,
      width * 0.7,
    );
    glow.addColorStop(0, "rgba(255,255,255,0.95)");
    glow.addColorStop(0.18, "rgba(130,180,255,0.9)");
    glow.addColorStop(0.4, "rgba(94,112,255,0.46)");
    glow.addColorStop(1, "rgba(20,30,60,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(164, 214, 255, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.52, 52, 0.9, 2.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.52, 66, 3.9, 5.4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(15, height * 0.58);
    ctx.bezierCurveTo(50, 26, 110, 18, 145, 88);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(12, 110);
    ctx.bezierCurveTo(54, 64, 98, 76, 148, 40);
    ctx.stroke();

    for (let i = 0; i < 16; i += 1) {
      const x = 18 + i * 8 + (i % 2) * 4;
      const y = 36 + ((i * 17) % 90);
      ctx.fillStyle =
        i % 3 === 0 ? "rgba(255,255,255,0.85)" : "rgba(140,190,255,0.8)";
      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 2.7 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={160}
      className={[
        "block",
        "w-32",
        "h-[134px]",
        "aspect-[auto_160/160]",
        "font-sans",
        "text-base",
        "leading-normal",
        "text-[#ffffff]",
        "overflow-hidden",
        "cursor-pointer",
        "rounded-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        verticalAlign: "top",
        fontFamily: '"CoFo Brilliant", sans-serif',
        color: "var(--shake-sdk-background-color-primary, #ffffff)",
        transition: "all",
        background: "transparent",
        ...style,
      }}
    />
  );
};

export default BrilliantCanvas;
