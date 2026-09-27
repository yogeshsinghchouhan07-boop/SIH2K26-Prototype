import { Home, Workflow, Layers3, Network, BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function SideRail() {
  const { scrollTo } = useApp();
  const items = [
    ["home", "Home", Home],
    ["how-it-works", "How it works", Workflow],
    ["features", "Features", Layers3],
    ["igot", "iGOT", Network],
    ["resources", "Resources", BookOpen],
  ];
  return (
    <aside className="side-rail" aria-label="Page navigation">
      {items.map(([id, label, I]) => (
        <button
          className="rail-item"
          title={label}
          key={id}
          onClick={() => scrollTo(id)}
        >
          <I size={17} />
          <span>{label}</span>
        </button>
      ))}
    </aside>
  );
}
