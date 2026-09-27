import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import "./RoadmapCanvas.css";

/**
 * <RoadmapCanvas />
 * ------------------------------------------------------------------
 * A self-contained, animated roadmap / node-graph component for React.
 *
 * <RoadmapCanvas
 *   nodes={nodes}                 // array — see schema in README
 *   editable
 *   onNodeUpdate={(id, patch) => fetch(`/api/roadmap/${id}`, {...})}
 *   onNodeMove={(id, x, y) => fetch(`/api/roadmap/${id}`, {...})}
 *   onNodeAdd={(node) => fetch('/api/roadmap', {...})}
 *   onNodeDelete={(id) => fetch(`/api/roadmap/${id}`, {...})}
 * />
 *
 * Node shape:
 * {
 *   id, title, subtitle,
 *   status: 'pending' | 'active' | 'done',
 *   dependsOn: ['other-id'],
 *   x, y,                 // optional — auto-laid-out by dependency depth if omitted
 *   tag: 'Milestone',     // optional badge
 *   assignee: { name: 'Kate', color: '#3ec5f7' } // optional avatar chip
 * }
 * ------------------------------------------------------------------
 */

const STATUS_LABEL = {
  pending: "Pending",
  active: "In progress",
  done: "Completed",
};
const AVATAR_PALETTE = [
  "#3ec5f7",
  "#ffc857",
  "#ff8fa3",
  "#9d8cff",
  "#3ddc84",
  "#f2a65a",
];
const NODE_W = 236;
const STATUS_ORDER = ["pending", "active", "done"];

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

/** Fills in x/y for any node missing a position, laid out by dependency depth. */
function autoLayout(nodes) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const depthCache = new Map();
  const resolveDepth = (n, seen = new Set()) => {
    if (depthCache.has(n.id)) return depthCache.get(n.id);
    if (seen.has(n.id)) return 0;
    seen.add(n.id);
    const deps = (n.dependsOn || []).map((d) => byId.get(d)).filter(Boolean);
    const d = deps.length
      ? Math.max(...deps.map((dep) => resolveDepth(dep, seen))) + 1
      : 0;
    depthCache.set(n.id, d);
    return d;
  };
  const columnCounts = {};
  return nodes.map((n) => {
    if (n.x !== undefined && n.y !== undefined) return n;
    const d = resolveDepth(n);
    const row = columnCounts[d] || 0;
    columnCounts[d] = row + 1;
    return { ...n, x: d * 280 + 20, y: row * 168 + 20 };
  });
}

function EditableText({ className, value, placeholder, editable, onCommit }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = value || "";
    }
  }, [value]);
  return (
    <div
      ref={ref}
      className={className}
      contentEditable={editable}
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      onPointerDown={(e) => editable && e.stopPropagation()}
      onBlur={(e) => onCommit(e.currentTarget.textContent.trim())}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}

function Sparkles({ onDone }) {
  const specs = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
        const dist = 38 + Math.random() * 34;
        return {
          id: i,
          star: i % 3 === 0,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          delay: Math.random() * 120,
        };
      }),
    [],
  );
  useEffect(() => {
    const t = setTimeout(onDone, 950);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <>
      <div className="rmc-ring" />
      <div className="rmc-spark-layer">
        {specs.map((s) => (
          <div
            key={s.id}
            className={"rmc-spark" + (s.star ? " rmc-star" : "")}
            style={{
              "--dx": `${s.dx}px`,
              "--dy": `${s.dy}px`,
              animationDelay: `${s.delay}ms`,
            }}
          >
            {s.star ? "✦" : null}
          </div>
        ))}
      </div>
    </>
  );
}

function Node({
  node,
  editable,
  onDrag,
  onDragEnd,
  onUpdate,
  onDelete,
  onCycleStatus,
  sparkling,
  onSparkleDone,
  onNodeCourseClick,
}) {
  const dragRef = useRef(null);

  const handlePointerDown = (e) => {
    if (!editable) return;
    if (
      e.target.closest("[contenteditable]") ||
      e.target.closest(".rmc-dot") ||
      e.target.closest(".rmc-del")
    )
      return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: node.x,
      origY: node.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    onDrag(node.id, dragRef.current.origX + dx, dragRef.current.origY + dy);
  };
  const handlePointerUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    onDragEnd(node.id);
  };

  const courseAvailable =
    Boolean(node.courseId) &&
    !node.locked &&
    (node.status === "done" || node.status === "active");

  return (
    <div
      className="rmc-node"
      data-status={node.status || "pending"}
      style={{ left: node.x || 0, top: node.y || 0 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {editable && (
        <div className="rmc-del" onClick={() => onDelete(node.id)}>
          ✕
        </div>
      )}
      <div className="rmc-node-head">
        <div
          className="rmc-dot"
          onClick={() => editable && onCycleStatus(node.id)}
        />
        <EditableText
          className="rmc-title"
          value={node.title || "Untitled step"}
          editable={editable}
          onCommit={(text) => onUpdate(node.id, { title: text })}
        />
        {node.tag ? <span className="rmc-tag">{node.tag}</span> : null}
      </div>
      <EditableText
        className="rmc-sub"
        value={node.subtitle || ""}
        editable={editable}
        onCommit={(text) => onUpdate(node.id, { subtitle: text })}
      />
      <div className="rmc-foot">
        <span className="rmc-progress-label">
          {STATUS_LABEL[node.status] || "Pending"}
        </span>
        {node.assignee?.name ? (
          <div
            className="rmc-avatar"
            title={node.assignee.name}
            style={{
              background: node.assignee.color || hashColor(node.assignee.name),
            }}
          >
            {node.assignee.name.slice(0, 2).toUpperCase()}
          </div>
        ) : null}
      </div>
      {node.courseId && onNodeCourseClick ? (
        <button
          className={`rmc-course-btn${courseAvailable ? "" : " rmc-course-btn-locked"}`}
          type="button"
          disabled={!courseAvailable}
          onClick={() => {
            if (courseAvailable) onNodeCourseClick(node.courseId);
          }}
        >
          {courseAvailable ? "Go to course" : "Course locked"}
        </button>
      ) : null}
      {node.status === "active" ? (
        <div className="rmc-shimmer-progress" aria-label="Course in progress" />
      ) : null}
      {sparkling ? <Sparkles onDone={() => onSparkleDone(node.id)} /> : null}
    </div>
  );
}

export default function RoadmapCanvas({
  nodes: nodesProp,
  editable = true,
  height = 620,
  onNodeUpdate,
  onNodeMove,
  onNodeAdd,
  onNodeDelete,
  onNodeCourseClick,
  className,
}) {
  const [nodes, setNodes] = useState(() => autoLayout(nodesProp || []));
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [sparkIds, setSparkIds] = useState(() => new Set());
  const prevStatus = useRef(new Map());
  const panRef = useRef(null);
  const viewportRef = useRef(null);

  // Sync from the `nodes` prop (e.g. after a DB fetch), diffing statuses
  // so anything that just flipped to "done" gets the sparkle celebration.
  useEffect(() => {
    const incoming = nodesProp || [];
    const newlyDone = [];
    incoming.forEach((n) => {
      const prev = prevStatus.current.get(n.id);
      if (prev && prev !== "done" && n.status === "done") newlyDone.push(n.id);
      prevStatus.current.set(n.id, n.status);
    });
    setNodes(autoLayout(incoming));
    if (newlyDone.length) {
      setSparkIds((s) => new Set([...s, ...newlyDone]));
    }
  }, [nodesProp]);

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const edges = useMemo(() => {
    const list = [];
    nodes.forEach((n) => {
      (n.dependsOn || []).forEach((depId) => {
        const from = byId.get(depId);
        if (!from) return;
        const x1 = (from.x || 0) + NODE_W,
          y1 = (from.y || 0) + 34;
        const x2 = n.x || 0,
          y2 = (n.y || 0) + 34;
        const dx = Math.max(60, (x2 - x1) * 0.55);
        const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        let cls = "rmc-edge-path";
        if (from.status === "done" && n.status === "done") cls += " rmc-done";
        else if (from.status === "done" && n.status === "active")
          cls += " rmc-flow rmc-active";
        else if (n.status === "active") cls += " rmc-flow";
        list.push({ key: `${from.id}->${n.id}`, d, cls });
      });
    });
    return list;
  }, [nodes, byId]);

  const svgSize = useMemo(() => {
    const maxX = Math.max(300, ...nodes.map((n) => (n.x || 0) + 260));
    const maxY = Math.max(300, ...nodes.map((n) => (n.y || 0) + 160));
    return { width: maxX, height: maxY };
  }, [nodes]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const updateSize = () => {
      setViewportSize({
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nodes.length || !viewportSize.width) return;
    const nextScale = Math.min(
      1,
      (viewportSize.width - 32) / svgSize.width,
      (height - 32) / svgSize.height,
    );
    setScale(nextScale);
    setPan({
      x: Math.max(16, (viewportSize.width - svgSize.width * nextScale) / 2),
      y: 16,
    });
  }, [height, nodes.length, svgSize, viewportSize.width]);

  const handleDrag = useCallback((id, x, y) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);
  const handleDragEnd = useCallback(
    (id) => {
      const n = byId.get(id);
      if (n) onNodeMove?.(id, n.x, n.y);
    },
    [byId, onNodeMove],
  );

  const applyStatusUpdate = useCallback(
    (id, patch) => {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id !== id) return n;
          const wasDone = n.status === "done";
          const next = { ...n, ...patch };
          if (patch.status && !wasDone && patch.status === "done") {
            setSparkIds((s) => new Set([...s, id]));
          }
          prevStatus.current.set(id, next.status);
          return next;
        }),
      );
      onNodeUpdate?.(id, patch);
    },
    [onNodeUpdate],
  );

  const handleCycleStatus = useCallback(
    (id) => {
      const n = byId.get(id);
      if (!n) return;
      const next =
        STATUS_ORDER[
          (STATUS_ORDER.indexOf(n.status) + 1) % STATUS_ORDER.length
        ];
      applyStatusUpdate(id, { status: next });
    },
    [byId, applyStatusUpdate],
  );

  const handleDelete = useCallback(
    (id) => {
      setNodes((prev) =>
        prev
          .filter((n) => n.id !== id)
          .map((n) => ({
            ...n,
            dependsOn: (n.dependsOn || []).filter((d) => d !== id),
          })),
      );
      onNodeDelete?.(id);
    },
    [onNodeDelete],
  );

  const handleAdd = useCallback(() => {
    const id = `step-${Date.now()}`;
    const node = {
      id,
      title: "New step",
      subtitle: "Describe what happens here.",
      status: "pending",
      dependsOn: [],
    };
    setNodes((prev) => autoLayout([...prev, node]));
    onNodeAdd?.(node);
  }, [onNodeAdd]);

  const handleSparkleDone = useCallback((id) => {
    setSparkIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  }, []);

  // --- canvas pan ---
  const onViewportPointerDown = (e) => {
    if (!editable || e.target.closest(".rmc-node")) return;
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pan.x,
      origY: pan.y,
    };
    viewportRef.current?.setPointerCapture(e.pointerId);
    viewportRef.current?.classList.add("rmc-panning");
  };
  const onViewportPointerMove = (e) => {
    if (!editable || !panRef.current) return;
    setPan({
      x: panRef.current.origX + (e.clientX - panRef.current.startX),
      y: panRef.current.origY + (e.clientY - panRef.current.startY),
    });
  };
  const onViewportPointerUp = () => {
    if (!editable) return;
    panRef.current = null;
    viewportRef.current?.classList.remove("rmc-panning");
  };

  const fitView = () => {
    if (!nodes.length) return;
    const minX = Math.min(...nodes.map((n) => n.x || 0));
    const minY = Math.min(...nodes.map((n) => n.y || 0));
    setPan({ x: 40 - minX, y: 40 - minY });
    setScale(1);
  };

  return (
    <div
      className={`rmc-root${className ? ` ${className}` : ""}`}
      style={{ height }}
    >
      <div
        ref={viewportRef}
        className="rmc-viewport"
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={onViewportPointerUp}
      >
        <div
          className="rmc-world"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          <svg
            className="rmc-edges"
            width={svgSize.width}
            height={svgSize.height}
          >
            {edges.map((e) => (
              <React.Fragment key={e.key}>
                <path className={e.cls} d={e.d} />
                {e.cls.includes("rmc-active") ? (
                  <circle className="rmc-signal-dot" r="4">
                    <animateMotion
                      dur="1.35s"
                      repeatCount="indefinite"
                      path={e.d}
                    />
                  </circle>
                ) : null}
              </React.Fragment>
            ))}
          </svg>
          <div className="rmc-nodes">
            {nodes.map((n) => (
              <Node
                key={n.id}
                node={n}
                editable={editable}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onUpdate={applyStatusUpdate}
                onDelete={handleDelete}
                onCycleStatus={handleCycleStatus}
                sparkling={sparkIds.has(n.id)}
                onSparkleDone={handleSparkleDone}
                onNodeCourseClick={onNodeCourseClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
