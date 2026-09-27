import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { SparklesText } from "../ui/sparkles-text";
import { KineticText } from "../ui/kinetic-text";
import { IconCloudDemo } from "../IconCloudDemo";
const defaultCourseImage =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80";

export default function Courses({ state, sidebarOpen = true }) {
  const navigate = useNavigate();
  const leftMargin = sidebarOpen ? 250 : 0;
  const contentWidth = sidebarOpen ? "calc(100% - 250px)" : "100%";

  return (
    <div
      style={{
        marginLeft: leftMargin,
        padding: "28px 32px",
        width: contentWidth,
        boxSizing: "border-box",
        transition: "margin-left 0.25s ease, width 0.25s ease",
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
        <div className="flex flex-row gap-3 ">
          <div className="aspect-square p-4 object-cover"><IconCloudDemo/></div>
        <div className="mx-auto bg-blend-overlay rounded-2xl p-5 mt-8">
         <SparklesText>My Courses</SparklesText>
          <KineticText as="h1" text="Learning Influenced By Your Goal" className="text-xl font-bold tracking-tighter md:text-3xl lg:text-5xl" />
        </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
          width: "100%",
        }}
      >
        {state.courses.map((c) => {
          const isUnlocked = Boolean(c.unlocked);

          return (
            <CardContainer key={c.id} className="inter-var" style={{ width: "100%", height: "100%" }}>
              <CardBody
                className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  minHeight: 460,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  opacity: isUnlocked ? 1 : 0.78,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 0.8,
                      color: "#1475e5",
                    }}
                  >
                    {c.field || c.skill}
                  </span>

                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color: isUnlocked ? "#18a77d" : "#7d8ea4",
                      letterSpacing: 0.8,
                    }}
                  >
                    {isUnlocked ? "UNLOCKED" : "LOCKED"}
                  </span>
                </div>

                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {c.title}
                </CardItem>

                <CardItem
                  as="div"
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        margin: "10px 0 0",
                        fontSize: 14,
                        lineHeight: 1.35,
                        fontWeight: 800,
                        color: "#163d5b",
                      }}
                    >
                      {c.level}
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginTop: 4,
                      }}
                    >
                      <p style={{ fontSize: 10, color: "#73879e", margin: 0 }}>
                        {c.duration}
                      </p>
                      {!isUnlocked && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            color: "#7d8ea4",
                            fontSize: 9,
                            fontWeight: 700,
                          }}
                        >
                          <Lock size={12} /> Locked
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        height: 8,
                        width: "100%",
                        background: "#edf2f7",
                        borderRadius: 9,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${c.progress}%`,
                          background: "linear-gradient(90deg,#1780eb,#6b47df)",
                          borderRadius: 9,
                        }}
                      />
                    </div>
                  </div>
                </CardItem>

                <CardItem translateZ="100" className="w-full mt-4 relative block" style={{ flexShrink: 0 }}>
                  <img
                    src={c.image || defaultCourseImage}
                    height="1000"
                    width="1000"
                    className={`h-52 w-full object-cover rounded-xl group-hover/card:shadow-xl ${
                      !isUnlocked ? "grayscale-[0.2] saturate-50" : ""
                    }`}
                    alt={c.title}
                    style={{ minHeight: 208 }}
                  />

                  {!isUnlocked && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(8, 18, 32, 0.42)",
                        borderRadius: 12,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 12,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 12px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.12)",
                          backdropFilter: "blur(2px)",
                        }}
                      >
                        <Lock size={14} /> Locked
                      </span>
                    </div>
                  )}
                </CardItem>

                <div
                  className="flex justify-between items-center mt-5 gap-3"
                  style={{ marginTop: "auto" }}
                >
                 
                  <CardItem
                    translateZ={20}
                    as="button"
                    disabled={!isUnlocked}
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold my-2 mx-auto"
                    style={{
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      opacity: isUnlocked ? 1 : 0.45,
                    }}
                    onClick={() => isUnlocked && navigate(`/courses/${c.id}`)}
                  >
                    {isUnlocked ? "access course →" : "locked"}
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          );
        })}
      </div>
    </div>
  );
}
