import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../services/api";

export default function ResetPasswordPage() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({

    password: "",
    confirmPassword: "",

  });

  const passwordStrength = () => {

    let score = 0;

    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;

    return score;

  };

  async function handleSubmit(e) {

    e.preventDefault();

    if (!token) {

      return toast.error("Invalid reset link.");

    }

    if (form.password !== form.confirmPassword) {

      return toast.error("Passwords do not match.");

    }

    try {

      setLoading(true);

      const { data } = await api.post("/auth/reset-password", {

        token,
        password: form.password,

      });

      toast.success(

        data.message ||

        "Password reset successfully."

      );

      navigate("/login");

    } catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Unable to reset password."

      );

    } finally {

      setLoading(false);

    }

  }

  const strength = passwordStrength();

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] flex items-center justify-center p-6 text-white">

      <motion.form

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        onSubmit={handleSubmit}

        className="w-full max-w-md rounded-[36px] border border-white/10 bg-slate-900/70 p-10 backdrop-blur-xl shadow-2xl"

      >

        <div className="mb-8 flex items-center gap-4">

          <div className="rounded-3xl bg-cyan-500/20 p-4">

            <ShieldCheck

              size={30}

              className="text-cyan-300"

            />

          </div>

          <div>

            <h1 className="text-3xl font-bold">

              Reset Password

            </h1>

            <p className="mt-2 text-sm text-slate-400">

              Choose a strong password for your account.

            </p>

          </div>

        </div>

        {/* Password */}

        <div className="relative">

          <label className="text-sm text-slate-300">

            New Password

          </label>

          <input

            type={showPassword ? "text" : "password"}

            required

            value={form.password}

            onChange={(e)=>

              setForm({

                ...form,

                password:e.target.value

              })

            }

            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 outline-none focus:border-cyan-400"

          />

          <button

            type="button"

            onClick={()=>

              setShowPassword(!showPassword)

            }

            className="absolute right-4 top-11"

          >

            {

              showPassword ?

              <EyeOff size={18}/>

              :

              <Eye size={18}/>

            }

          </button>

        </div>

        {/* Confirm */}

        <div className="relative mt-5">

          <label className="text-sm text-slate-300">

            Confirm Password

          </label>

          <input

            type={showConfirm ? "text" : "password"}

            required

            value={form.confirmPassword}

            onChange={(e)=>

              setForm({

                ...form,

                confirmPassword:e.target.value

              })

            }

            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 outline-none focus:border-cyan-400"

          />

          <button

            type="button"

            onClick={()=>

              setShowConfirm(!showConfirm)

            }

            className="absolute right-4 top-11"

          >

            {

              showConfirm ?

              <EyeOff size={18}/>

              :

              <Eye size={18}/>

            }

          </button>

        </div>

        {/* Password Strength */}

        <div className="mt-6">

          <div className="flex gap-2">

            {[1,2,3,4].map((n)=>(

              <div

                key={n}

                className={`h-2 flex-1 rounded-full ${

                  strength>=n

                  ?

                  "bg-green-400"

                  :

                  "bg-slate-700"

                }`}

              />

            ))}

          </div>

          <p className="mt-2 text-xs text-slate-400">

            Use at least 8 characters,

            uppercase,

            number,

            and special character.

          </p>

        </div>

        <button

          disabled={loading}

          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-4 font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:opacity-60"

        >

          {

            loading ?

            "Updating Password..."

            :

            "Reset Password"

          }

          <ArrowRight size={18}/>

        </button>

        <div className="mt-6 text-center text-sm">

          <Link

            to="/login"

            className="text-cyan-300 hover:text-cyan-200"

          >

            Back to Login

          </Link>

        </div>

      </motion.form>

    </div>

  );

}