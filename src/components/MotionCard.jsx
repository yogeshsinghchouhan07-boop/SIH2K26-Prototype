// import React, { useMemo, useState } from "react";
// import { ArrowRight, Lock } from "lucide-react";

// const defaultImage =
//   "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";

// const MotionCard = ({ course, onOpen }) => {
//   const [tilt, setTilt] = useState({ x: 0, y: 0 });

//   const glowStyle = useMemo(
//     () => ({
//       background:
//         "radial-gradient(circle at top left, rgba(20,117,229,.18), transparent 50%)",
//       transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`,
//       transition: "transform 180ms ease, box-shadow 180ms ease",
//     }),
//     [tilt],
//   );

//   const handleMouseMove = (event) => {
//     const rect = event.currentTarget.getBoundingClientRect();
//     const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
//     const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
//     setTilt({ x: y, y: x });
//   };

//   const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

//   return (
//     <div
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       style={{
//         width: "100%",
//         borderRadius: 18,
//         background: "#fff",
//         border: "1px solid rgba(18, 62, 112, 0.1)",
//         boxShadow: course.unlocked
//           ? "0 16px 30px rgba(20,117,229,0.10)"
//           : "0 10px 20px rgba(115,135,158,0.12)",
//         overflow: "hidden",
//         opacity: course.unlocked ? 1 : 0.78,
//         transform: glowStyle.transform,
//         transition: glowStyle.transition,
//       }}
//     >
//       <div
//         style={{
//           position: "relative",
//           background:
//             "linear-gradient(135deg, rgba(20,117,229,0.08), rgba(107,71,223,0.08))",
//         }}
//       >
//         <img
//           src={course.image || defaultImage}
//           alt={course.title}
//           style={{
//             width: "100%",
//             height: 168,
//             objectFit: "cover",
//             display: "block",
//           }}
//         />
//       </div>

//       <div style={{ padding: 16 }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: 8,
//           }}
//         >
//           <span
//             style={{
//               fontSize: 9,
//               fontWeight: 800,
//               letterSpacing: 0.6,
//               color: "#1475e5",
//             }}
//           >
//             {course.field}
//           </span>
//           {course.unlocked ? (
//             <span style={{ fontSize: 9, color: "#18a77d", fontWeight: 800 }}>
//               UNLOCKED
//             </span>
//           ) : (
//             <Lock size={15} color="#91a3b5" />
//           )}
//         </div>

//         <h2
//           style={{
//             margin: "10px 0 0",
//             fontSize: 14,
//             lineHeight: 1.35,
//             fontWeight: 800,
//             color: "#163d5b",
//           }}
//         >
//           {course.title}
//         </h2>

//         <p style={{ fontSize: 10, color: "#73879e", margin: "4px 0 12px" }}>
//           {course.level} • {course.duration}
//         </p>

//         <div
//           style={{
//             height: 6,
//             background: "#edf2f7",
//             borderRadius: 9,
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               height: "100%",
//               width: `${course.progress}%`,
//               background: "linear-gradient(90deg,#1780eb,#6b47df)",
//               borderRadius: 9,
//             }}
//           />
//         </div>

//         <div
//           style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
//         >
//           <button
//             disabled={!course.unlocked}
//             onClick={onOpen}
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 6,
//               fontSize: 9,
//               padding: "7px 10px",
//               borderRadius: 8,
//               border: "none",
//               cursor: course.unlocked ? "pointer" : "not-allowed",
//               background: "linear-gradient(135deg, #1780eb, #6b47df)",
//               color: "#fff",
//               opacity: course.unlocked ? 1 : 0.55,
//               boxShadow: "0 8px 18px rgba(31,95,199,0.2)",
//             }}
//           >
//             {course.progress > 0 && course.progress < 100 ? "Continue" : "Open"}
//             <ArrowRight size={13} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MotionCard;
import React, { useMemo, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";

const defaultImage =
  "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";

const MotionCard = ({ course, onOpen }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const glowStyle = useMemo(
    () => ({
      transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`,
      transition: "transform 180ms ease, box-shadow 180ms ease",
    }),
    [tilt],
  );

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "100%",
        borderRadius: 18,
        background: "#fff",
        border: "1px solid rgba(18, 62, 112, 0.1)",
        boxShadow: course.unlocked
          ? "0 16px 30px rgba(20,117,229,0.10)"
          : "0 10px 20px rgba(115,135,158,0.12)",
        overflow: "hidden",
        opacity: course.unlocked ? 1 : 0.78,
        transform: glowStyle.transform,
        transition: glowStyle.transition,
      }}
    >
      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(20,117,229,0.08), rgba(107,71,223,0.08))",
        }}
      >
        <img
          src={course.image || defaultImage}
          alt={course.title}
          style={{
            width: "100%",
            height: 168,
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: 0.6,
              color: "#1475e5",
            }}
          >
            {course.field}
          </span>
          {course.unlocked ? (
            <span style={{ fontSize: 9, color: "#18a77d", fontWeight: 800 }}>
              UNLOCKED
            </span>
          ) : (
            <Lock size={15} color="#91a3b5" />
          )}
        </div>

        <h2
          style={{
            margin: "10px 0 0",
            fontSize: 14,
            lineHeight: 1.35,
            fontWeight: 800,
            color: "#163d5b",
          }}
        >
          {course.title}
        </h2>

        <p style={{ fontSize: 10, color: "#73879e", margin: "4px 0 12px" }}>
          {course.level} • {course.duration}
        </p>

        <div
          style={{
            height: 6,
            background: "#edf2f7",
            borderRadius: 9,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${course.progress}%`,
              background: "linear-gradient(90deg,#1780eb,#6b47df)",
              borderRadius: 9,
            }}
          />
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
        >
          <button
            disabled={!course.unlocked}
            onClick={onOpen}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 9,
              padding: "7px 10px",
              borderRadius: 8,
              border: "none",
              cursor: course.unlocked ? "pointer" : "not-allowed",
              background: "linear-gradient(135deg, #1780eb, #6b47df)",
              color: "#fff",
              opacity: course.unlocked ? 1 : 0.55,
              boxShadow: "0 8px 18px rgba(31,95,199,0.2)",
            }}
          >
            {course.progress > 0 && course.progress < 100 ? "Continue" : "Open"}
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotionCard;
