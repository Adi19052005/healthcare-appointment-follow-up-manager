import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      // Toast handled in AuthContext
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-slate-800/60 p-8"
        >
          <h2 className="text-2xl font-bold mb-2">
            Create an Account
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            Register as a patient to book appointments.
          </p>

          <div className="space-y-4">

            <Input
              icon={<User size={18} />}
              placeholder="Full Name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
            />

            <Input
              icon={<Mail size={18} />}
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(v) => updateField("email", v)}
            />

            <Input
              icon={<Phone size={18} />}
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
            />

            <PasswordInput
              placeholder="Password"
              value={form.password}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              onChange={(v) => updateField("password", v)}
            />

            <PasswordInput
              placeholder="Confirm Password"
              value={form.confirmPassword}
              show={showConfirmPassword}
              toggle={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              onChange={(v) =>
                updateField("confirmPassword", v)
              }
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-cyan-500 py-3 font-semibold text-slate-900 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight size={18} />
          </button>

          <div className="mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 px-3 py-2 focus-within:border-cyan-400 transition">
      <div className="text-slate-400">
        {icon}
      </div>

      <input
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-3 py-2 outline-none"
      />
    </div>
  );
}

function PasswordInput({
  placeholder,
  value,
  onChange,
  show,
  toggle,
}) {
  return (
    <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 px-3 py-2 focus-within:border-cyan-400 transition">
      <Lock size={18} className="text-slate-400" />

      <input
        required
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-3 py-2 outline-none"
      />

      <button
        type="button"
        onClick={toggle}
        className="ml-2 text-slate-300 hover:text-white"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
