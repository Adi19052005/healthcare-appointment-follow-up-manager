import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../services/api";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {

    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your email.");
    }

    try {

      setLoading(true);

      const { data } = await api.post(
        "/auth/forgot-password",
        {
          email
        }
      );

      toast.success(
        data.message ||
        "Password reset link sent."
      );

      setEmail("");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to send reset link."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] flex items-center justify-center p-6">

      <motion.form

        onSubmit={handleSubmit}

        initial={{
          opacity:0,
          y:20
        }}

        animate={{
          opacity:1,
          y:0
        }}

        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur-xl shadow-2xl"

      >

        <div className="mb-8 flex items-center gap-4">

          <div className="rounded-2xl bg-cyan-500/20 p-4">

            <Mail
              className="text-cyan-300"
              size={28}
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-white">

              Forgot Password

            </h1>

            <p className="mt-1 text-sm text-slate-400">

              Enter your registered email to receive a password reset link.

            </p>

          </div>

        </div>

        <div>

          <label className="mb-2 block text-sm text-slate-300">

            Email Address

          </label>

          <input

            type="email"

            required

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            placeholder="john@example.com"

            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"

          />

        </div>

        <button

          disabled={loading}

          className="mt-8 w-full rounded-2xl bg-cyan-500 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"

        >

          {

            loading ?

            "Sending Reset Link..."

            :

            "Send Reset Link"

          }

        </button>

        <Link

          to="/login"

          className="mt-6 flex items-center justify-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"

        >

          <ArrowLeft size={16} />

          Back to Login

        </Link>

      </motion.form>

    </div>

  );

}