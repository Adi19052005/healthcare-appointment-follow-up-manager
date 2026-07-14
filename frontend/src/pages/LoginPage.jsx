
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login(form.email, form.password);
      switch (data.user.role) {
        case "PATIENT":
          navigate("/patient");
          break;
        case "DOCTOR":
          navigate("/doctor");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-slate-800/60 p-8">
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-400 mb-6">Login to continue.</p>

          <label className="text-sm">Email</label>
          <div className="mt-2 mb-4">
            <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
              <Mail size={18} className="text-slate-400" />
              <input
                required
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent px-3 py-2 outline-none"
              />
            </div>
          </div>

          <label className="text-sm">Password</label>
          <div className="mt-2 mb-4">
            <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
              <Lock size={18} className="text-slate-400" />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent px-3 py-2 outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-slate-300">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-cyan-300 hover:text-cyan-200">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 py-3 font-semibold text-slate-900 flex items-center justify-center gap-2"
          >
            {loading ? "Signing In..." : "Sign In"}
            <ArrowRight size={18} />
          </button>

          <div className="mt-4 text-center text-sm">
            Don't have an account? <Link to="/register" className="font-semibold text-cyan-300">Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}