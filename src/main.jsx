import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Karmayogi AI failed to render", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main role="alert" style={{ maxWidth: 720, margin: "10vh auto", padding: 24, fontFamily: "system-ui, sans-serif", color: "#17233b" }}>
          <h1 style={{ fontSize: 24 }}>Karmayogi AI couldn’t load</h1>
          <p>The page encountered an error while rendering. Refresh the page to try again.</p>
          <pre style={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap", padding: 16, borderRadius: 8, background: "#f2f4f8", color: "#8b2635" }}>{this.state.error.message}</pre>
        </main>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>
);
