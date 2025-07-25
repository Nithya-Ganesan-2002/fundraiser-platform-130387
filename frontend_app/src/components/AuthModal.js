import React, { useState } from "react";
import { registerUser, loginUser } from "../api";

// PUBLIC_INTERFACE
function AuthModal({ open, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!open) return null;

  const switchMode = () => {
    setIsLogin((x) => !x);
    setMsg(null);
  };
  const onInput = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (isLogin) {
        const out = await loginUser({ email: form.email, password: form.password });
        onLoginSuccess(out.access_token);
      } else {
        await registerUser(form);
        setMsg("Registration successful! Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      setMsg(err.message || "An error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" style={modalBackdropStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        <h2 style={{ color: "#1a73e8" }}>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            required
            onChange={onInput}
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            minLength={6}
            required
            onChange={onInput}
            style={inputStyle}
          />
          {!isLogin && (
            <input
              name="name"
              placeholder="Full Name (optional)"
              value={form.name}
              onChange={onInput}
              style={inputStyle}
            />
          )}
          <button className="btn" type="submit" style={{ background: "#1a73e8", color: "#fff" }} disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div style={{ marginTop: 13 }}>
          {isLogin ? (
            <span>
              New user?{" "}
              <button onClick={switchMode} style={linkBtnStyle}>
                Register
              </button>
            </span>
          ) : (
            <span>
              Already a member?{" "}
              <button onClick={switchMode} style={linkBtnStyle}>
                Login
              </button>
            </span>
          )}
        </div>
        {msg && <div style={{ color: "#b90023", marginTop: 7 }}>{msg}</div>}
      </div>
    </div>
  );
}

const modalBackdropStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.26)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center"
};
const modalContentStyle = {
  background: "#fff", borderRadius: 8, maxWidth: 360,
  padding: 30, minWidth: 300, boxShadow: "0 2px 16px rgba(80,80,80,0.10)",
  position: "relative",
};
const closeButtonStyle = {
  position: "absolute", top: 12, right: 12, fontSize: 24, background: "none", border: "none", cursor: "pointer", color: "#888"
};
const inputStyle = {
  padding: "10px 14px", borderRadius: 6, border: "1px solid var(--border-color)", fontSize: 17
};
const linkBtnStyle = {
  background: "none", border: "none", color: "#1a73e8", cursor: "pointer", textDecoration: "underline"
};

export default AuthModal;
