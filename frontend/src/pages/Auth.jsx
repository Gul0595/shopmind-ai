import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Auth({ mode }) {
  const [form, setForm] = useState({ email: "", password: "", business_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await signup(form.email, form.password, form.business_name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">ShopMind<span className="dot">.ai</span></Link>
        <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
        <p className="auth-sub">{isLogin ? "Sign in to your dashboard" : "Start free — no credit card needed."}</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={submit} className="auth-form">
          {!isLogin && (
            <div className="field">
              <label>Business Name</label>
              <input name="business_name" value={form.business_name} onChange={handle} placeholder="e.g. Priya's Fashion Store" required />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@business.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder={isLogin ? "Your password" : "Min. 8 characters"} minLength={8} required />
          </div>
          <button type="submit" className="btn-primary full" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        <p className="auth-switch">
          {isLogin ? (<>Don't have an account? <Link to="/signup">Sign up free</Link></>) : (<>Already have an account? <Link to="/login">Sign in</Link></>)}
        </p>
      </div>
    </div>
  );
}
