"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.6,
  height = 220,
  ...props
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.getAttribute("data-theme") || "light";
  });

  let w, h, nt, i, x, ctx, canvas, animationId;

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  useEffect(() => {
    const syncTheme = () => {
      const nextTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(nextTheme);
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  const waveColors =
    colors ??
    (isDark
      ? ["#7dd3fc", "#c084fc", "#22d3ee", "#f9a8d4", "#60a5fa"]
      : ["#38bdf8", "#a78bfa", "#22c55e", "#f472b6", "#60a5fa"]);

  const backgroundColor = backgroundFill ?? (isDark ? "#020817" : "#f8fbff");

  const init = () => {
    canvas = canvasRef.current;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parentWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    w = canvas.width = parentWidth;
    h = canvas.height = height;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;

    const handleResize = () => {
      const nextWidth = canvas.parentElement?.clientWidth || window.innerWidth;
      w = canvas.width = nextWidth;
      h = canvas.height = height;
      ctx.filter = `blur(${blur}px)`;
    };

    window.addEventListener("resize", handleResize);
    render();

    return () => window.removeEventListener("resize", handleResize);
  };

  const drawWave = (n) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 28;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        const y = noise(x / 900, 0.34 * i, nt) * 60;
        ctx.lineTo(x, y + h * 0.56);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = backgroundColor;
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    const cleanup = init();
    return () => {
      cancelAnimationFrame(animationId);
      cleanup?.();
    };
  }, [height, blur, waveOpacity, theme]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome"),
    );
  }, []);

  return (
    <div
      className={cn(
        "relative flex h-[220px] w-full items-center justify-center overflow-hidden",
        containerClassName,
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          background: backgroundColor,
          pointerEvents: "none",
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
