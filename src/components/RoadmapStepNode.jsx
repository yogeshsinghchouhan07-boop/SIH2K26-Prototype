import { Check, Lock, Target } from "lucide-react";

export default function RoadmapStepNode() {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        zIndex: 2,
        background: "#eaf3ff",
        border: "2px solid #1475e5",
        color: "#1475e5",
        boxShadow: "0 10px 20px rgba(20,117,229,0.14)",
      }}
    >
      <Target size={20} />
    </div>
  );
}
