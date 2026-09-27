import React, { useEffect, useRef, useState } from "react";
import "./handshape.css";

const roadmapItems = [
  {
    number: "01",
    title: "Foundations",
    description: "Build strong fundamentals and think like an engineer.",
  },
  {
    number: "02",
    title: "Full Stack",
    description: "Connect frontend, backend and real-world systems.",
  },
  {
    number: "03",
    title: "AI Engineering",
    description: "Build intelligent systems with modern AI technologies.",
  },
  {
    number: "04",
    title: "Career Ready",
    description: "Turn your skills into projects and opportunities.",
  },
];

export default function Handshape() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame;

    const updateProgress = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      /*
        0   = section just entering viewport
        1   = section has almost completely passed through viewport
      */

      const start = viewportHeight * 0.9;
      const end = -rect.height * 0.55;

      const rawProgress = (start - rect.top) / (start - end);

      const clamped = Math.max(0, Math.min(1, rawProgress));

      setProgress(clamped);
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(updateProgress);
    };

    updateProgress();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /*
    Main animation values
  */

  const handProgress = Math.min(progress, 0.9);
  const startOffset = 200;
  const endOffset = 58;
  const humanX = -(startOffset - handProgress * (startOffset - endOffset));
  const robotX = startOffset - handProgress * (startOffset - endOffset);

  const humanRotate = -handProgress * 2.5;
  const robotRotate = handProgress * 2.5;

  const humanScale = 1 - handProgress * 0.04;
  const robotScale = 1 - handProgress * 0.04;

  const meetingProgress = 0;
  const glowOpacity = 0;

  const roadmapScale = 1 - progress * 0.16;

  const roadmapOpacity = progress < 0.05 ? 0.7 : 1;

  return (
    <section ref={sectionRef} className="handshape-section">
      <div className="handshape-sticky">
        {/* --------------------------------
            BACKGROUND
        -------------------------------- */}

        <div className="handshape-background">
          <div className="ambient-glow glow-one" />
          <div className="ambient-glow glow-two" />
        </div>

        {/* --------------------------------
            HEADING
        -------------------------------- */}

        <div className="handshape-heading  mb-8">
          <span className="heading-eyebrow">YOUR LEARNING JOURNEY</span>

          <h2>
            One Journey.
            <br />
            <span>Every Skill That Matters.</span>
          </h2>
        </div>

        {/* --------------------------------
            HANDS
        -------------------------------- */}

        <div className="hands-stage">
          <div
            className="meeting-bg"
            style={{
              opacity: meetingProgress * 0.9,
              transform: `translateX(-50%) translateY(${18 - meetingProgress * 18}px) scale(${0.86 + meetingProgress * 0.2})`,
            }}
          >
            <img src="/assets/Circlebg.png" alt="Connection background" />
          </div>

          {/* Human Hand */}

          <div
            className="hand human-hand"
            style={{
              transform: `
                translateX(${humanX}px)
                rotate(${humanRotate}deg)
                scale(${humanScale})
              `,
            }}
          >
            <div className="human-hand-image">
              <img src="/assets/humanhand.png" alt="Human hand" />
            </div>
          </div>

          {/* Robot Hand */}

          <div
            className="hand robot-hand"
            style={{
              transform: `
                translateX(${robotX}px)
                rotate(${robotRotate}deg)
                scale(${robotScale})
              `,
            }}
          >
            <div className="robot-hand-image">
              <img src="/assets/robotichand.png" alt="Robotic hand" />
            </div>
          </div>

          {/* --------------------------------
              CONNECTION EFFECT
          -------------------------------- */}

          <div
            className="connection-point"
            style={{
              opacity: glowOpacity,
              transform: `
                translate(-50%, -50%)
                scale(${0.6 + glowOpacity * 0.8})
              `,
            }}
          >
            <div className="connection-core" />
            <div className="connection-ring ring-one" />
            <div className="connection-ring ring-two" />
            <div className="connection-ring ring-three" />

            <span className="connection-particle particle-one" />
            <span className="connection-particle particle-two" />
            <span className="connection-particle particle-three" />
            <span className="connection-particle particle-four" />
          </div>
        </div>

        {/* --------------------------------
            ROADMAP
        -------------------------------- */}

        <div
          className="roadmap"
          style={{
            transform: `translateX(-50%) scaleX(${roadmapScale})`,
            opacity: roadmapOpacity,
          }}
        >
          <div className="roadmap-line">
            <div
              className="roadmap-progress"
              style={{
                width: `${progress * 100}%`,
              }}
            />
          </div>

          <div className="roadmap-items">
            {roadmapItems.map((item, index) => (
              <div
                className={`roadmap-item ${
                  progress > (index + 1) / 5 ? "active" : ""
                }`}
                key={item.number}
              >
                <div className="roadmap-node">
                  <div className="node-inner">{item.number}</div>
                </div>

                <div className="roadmap-content">
                  <span className="roadmap-number">{item.number}</span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --------------------------------
            SCROLL INDICATOR
        -------------------------------- */}

        <div
          className="scroll-indicator"
          style={{
            opacity: 1 - progress * 2,
          }}
        >
          <span>Scroll to explore</span>

          <div className="scroll-arrow">↓</div>
        </div>
      </div>
    </section>
  );
}
