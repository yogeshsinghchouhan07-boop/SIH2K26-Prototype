import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [learner, setLearner] = useState({ name: "Government Learner", competency: 67, role: "Statistics Professional" });
  const [auth, setAuth] = useState(()=>{
    try { const saved=localStorage.getItem("statskill-auth"); return saved?JSON.parse(saved):null; } catch { return null; }
  });

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
  // BACKEND TODO (Django): replace the demo login call with POST /api/auth/login/ and store the returned access token securely.
  const login = user => { setAuth(user); localStorage.setItem("statskill-auth",JSON.stringify(user)); };
  const logout = () => { setAuth(null); localStorage.removeItem("statskill-auth"); };

  const value = useMemo(()=>({sidebarOpen,setSidebarOpen,learner,setLearner,scrollTo,auth,isAuthenticated:Boolean(auth),login,logout}),[sidebarOpen,learner,auth]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
