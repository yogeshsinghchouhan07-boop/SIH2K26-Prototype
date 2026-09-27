import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const purple = "#6952c9";
const text = "#171717";
const muted = "#737373";
const border = "#dedede";

const shell = {
  minHeight: "100vh",
  background: "#f4e9fb",
  display: "grid",
  overflow: "hidden",
};

const fieldBase = {
  width: "100%",
  height: 46,
  boxSizing: "border-box",
  border: `1px solid ${border}`,
  borderRadius: 7,
  background: "#fff",
  color: text,
  padding: "0 13px",
  fontSize: 14,
  outline: "none",
};

function SelectField({ label, value, onChange, options = [], required = true }) {
  return (
    <label style={{ display: "block", marginBottom: 17 }}>
      <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: text, marginBottom: 7 }}>
        {label} {required && <span style={{ color: "#c44747" }}>*</span>}
      </span>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={onChange} style={{ ...fieldBase, appearance: "none", paddingRight: 42, color: value ? "#4b4b4b" : "#777" }}>
          <option value="" disabled>{`Select ${label.toLowerCase()}`}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown size={18} color="#555" style={{ position: "absolute", right: 13, top: 14, pointerEvents: "none" }} />
      </div>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text", required = true, right }) {
  return (
    <label style={{ display: "block", marginBottom: 17 }}>
      <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: text, marginBottom: 7 }}>
        {label} {required && <span style={{ color: "#c44747" }}>*</span>}
      </span>
      <div style={{ position: "relative" }}>
        <input value={value} onChange={onChange} type={type} placeholder={placeholder} style={{ ...fieldBase, paddingRight: right ? 44 : 13 }} />
        {right}
      </div>
    </label>
  );
}

function RadioGroup({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 23, alignItems: "center", marginBottom: 18 }}>
      {["Centre", "State"].map((item) => (
        <label key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: text, cursor: "pointer" }}>
          <input type="radio" name="centre-state" checked={value === item} onChange={() => onChange(item)} style={{ accentColor: purple, width: 17, height: 17 }} />
          {item}
        </label>
      ))}
    </div>
  );
}

function AuthImagePanel() {
  return (
    <div className="auth-image-panel" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#eee2fb 0%,#f8eafb 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 28, boxSizing: "border-box" }}>
      <img src="/assets/auth-left-reference.png" alt="StatSkill AI platform preview" style={{ width: "100%", maxWidth: 920, height: "auto", display: "block", borderRadius: 2 }} />
    </div>
  );
}

function AuthHeader({ title, subtitle }) {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/")} style={{ border: 0, background: "none", padding: 0, display: "flex", alignItems: "center", gap: 7, color: "#686868", fontSize: 13, cursor: "pointer", marginBottom: 23 }}>
        <ArrowLeft size={15} /> Back to the website
      </button>
      <img src="/assets/logo.svg" alt="StatSkill AI" style={{ width: 128, height: "auto", objectFit: "contain", objectPosition: "left", marginBottom: 20 }} />
      <h1 style={{ margin: 0, fontSize: 25, lineHeight: 1.2, color: "#151515", fontWeight: 750 }}>{title}</h1>
      <p style={{ margin: "5px 0 23px", fontSize: 14, color: muted }}>{subtitle}</p>
    </>
  );
}

export function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("employee@gov.in");
  const [password, setPassword] = useState("123456");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (email === "employee@gov.in" && password === "123456") {
      onLogin({ name: "Government Learner", email, role: "Learner", department: "Statistics & Data Services" });
      navigate("/overview");
    } else {
      setError("For the frontend demo use employee@gov.in / 123456.");
    }
  };

  return (
    <div className="auth-shell" style={shell}>
      <AuthImagePanel />
      <main style={{ background: "#fff", minHeight: "100vh", overflowY: "auto", padding: "54px clamp(38px, 5vw, 74px)", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <AuthHeader title="Login to StatSkill AI" subtitle="Welcome back to your personalized learning platform." />
          <form onSubmit={submit}>
            <TextField label="Government Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your government email address" />
            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              right={<button type="button" onClick={() => setShow((v) => !v)} style={{ position: "absolute", right: 12, top: 12, border: 0, background: "none", color: "#777", cursor: "pointer" }}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
            />
            {error && <div style={{ background: "#fff2f2", color: "#b33d3d", borderRadius: 7, padding: "10px 12px", fontSize: 12, marginBottom: 14 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "-3px 0 22px", fontSize: 12, color: muted }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7 }}><input type="checkbox" style={{ accentColor: purple }} /> Remember me</label>
              <button type="button" style={{ border: 0, background: "none", color: purple, cursor: "pointer", fontWeight: 650 }}>Forgot password?</button>
            </div>
            <button type="submit" style={{ width: "100%", height: 46, border: 0, borderRadius: 6, background: purple, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Login <ArrowRight size={16} /></button>
          </form>
          <p style={{ textAlign: "center", fontSize: 13, color: muted, marginTop: 25 }}>
            New learner? <button onClick={() => navigate("/signup")} style={{ border: 0, background: "none", color: "#59479e", fontWeight: 650, cursor: "pointer", padding: 0 }}>Register for iGOT</button>
          </p>
        </div>
      </main>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [centreState, setCentreState] = useState("Centre");
  const [form, setForm] = useState({ ministry: "", organisation: "", designation: "", email: "", otp: "", mobile: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const valid = useMemo(() => form.ministry && form.organisation && form.designation && form.email && form.otp && agreed, [form, agreed]);

  const sendOtp = () => {
    if (!form.email) { setMessage("Enter your government email before requesting an OTP."); return; }
    setOtpSent(true);
    setMessage("Demo OTP sent. Use 123456 for the frontend prototype.");
  };

  const register = (e) => {
    e.preventDefault();
    if (!valid) { setMessage("Please complete the required fields and accept the privacy policy & terms."); return; }
    setMessage("Registration details captured. Connect this action to the Django registration and OTP APIs.");
  };

  return (
    <div className="auth-shell" style={shell}>
      <AuthImagePanel />
      <main style={{ background: "#fff", minHeight: "100vh", overflowY: "auto", padding: "54px clamp(38px, 5vw, 74px)", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <AuthHeader title="Register for iGOT" subtitle="Welcome to the platform for growth." />
          <form onSubmit={register}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 9, color: text }}>Center/State <span style={{ color: "#c44747" }}>*</span></div>
            <RadioGroup value={centreState} onChange={setCentreState} />

            <SelectField label="Ministry/Department" value={form.ministry} onChange={(e) => update("ministry", e.target.value)} options={["Ministry of Statistics & Programme Implementation", "Ministry of Electronics & Information Technology", "Ministry of Finance", "Ministry of Education"]} />
            <SelectField label="Organisation" value={form.organisation} onChange={(e) => update("organisation", e.target.value)} options={["National Statistical Office", "Ministry Headquarters", "Attached Office", "Field Office"]} />
            <SelectField label="Designation" value={form.designation} onChange={(e) => update("designation", e.target.value)} options={["Statistical Officer", "Senior Statistical Officer", "Data Analyst", "Section Officer", "Other"]} />
            <TextField label="Email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Enter your government email address" />

            <div style={{ display: "flex", gap: 9, marginBottom: 17 }}>
              <input value={form.otp} onChange={(e) => update("otp", e.target.value)} placeholder="Enter OTP" style={{ ...fieldBase, flex: 1 }} />
              <button type="button" onClick={sendOtp} style={{ minWidth: 112, border: 0, borderRadius: 7, background: purple, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{otpSent ? "Resend OTP" : "Send OTP"}</button>
            </div>

            <TextField label="Mobile Number" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="Enter your mobile number" />
            <TextField label="Password" value={form.password} onChange={(e) => update("password", e.target.value)} type="password" placeholder="Create your password" />

            <label style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "#444", lineHeight: 1.4, margin: "1px 0 18px", cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ accentColor: purple, width: 17, height: 17, marginTop: 1 }} />
              <span>I agree to <span style={{ color: "#62519b" }}>privacy policy &amp; terms</span>?</span>
            </label>

            {message && <div style={{ background: message.startsWith("Registration") ? "#f0faf5" : "#f7f3ff", color: message.startsWith("Registration") ? "#247b58" : "#5d4a9f", borderRadius: 7, padding: "10px 12px", fontSize: 12, marginBottom: 14 }}>{message}</div>}

            <button type="submit" style={{ width: "100%", height: 46, border: 0, borderRadius: 6, background: purple, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Register</button>
          </form>
          <p style={{ textAlign: "center", fontSize: 13, color: muted, marginTop: 23 }}>
            Already have an account? <button onClick={() => navigate("/login")} style={{ border: 0, background: "none", color: "#59479e", fontWeight: 650, cursor: "pointer", padding: 0 }}>Log in instead</button>
          </p>
        </div>
      </main>
    </div>
  );
}
