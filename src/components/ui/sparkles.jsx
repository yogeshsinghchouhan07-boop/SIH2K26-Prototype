"use client";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "motion/react";

export const SparklesCore = ({
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleColor = "#FFFFFF",
  particleDensity = 1200,
}) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      opacity: 1,
      transition: { duration: 1 },
    });
  }, [controls]);

  const particles = useMemo(() => {
    const count = Math.max(10, Math.min(80, Math.round(particleDensity / 20)));

    return Array.from({ length: count }, (_, index) => {
      const size =
        Number(minSize) +
        (((index * 13) % 10) / 10) * (Number(maxSize) - Number(minSize));

      return {
        id: index,
        left: `${(index * 17) % 100}%`,
        top: `${(index * 29) % 100}%`,
        size,
        delay: (index % 9) * 0.12,
        duration: 2 + (index % 6) * 0.35,
        opacity: 0.25 + (index % 5) * 0.15,
      };
    });
  }, [maxSize, minSize, particleDensity]);

  return (
    <motion.div
      animate={controls}
      className={cn(
        "relative h-full w-full overflow-hidden opacity-0",
        className,
      )}
      style={{ background }}
    >
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            position: "absolute",
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            background: particleColor,
            opacity: particle.opacity,
            filter: "blur(0.5px)",
            boxShadow: `0 0 10px ${particleColor}`,
            animation: `sparkle ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
          }}
        />
      ))}
    </motion.div>
  );
};
