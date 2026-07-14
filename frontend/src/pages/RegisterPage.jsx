import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  UserPlus,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  HeartPulse,
  CalendarDays,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import AutosaveIndicator from "../components/ui/AutosaveIndicator";

export default function RegisterPage() {

  const navigate = useNavigate();

  const { register } = useAuth();
            return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-2xl">
        <motion.form className="rounded-2xl border border-white/10 bg-slate-800/60 p-8 w-full">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-sm text-slate-400 mb-6">Register as a patient to book appointments.</p>

          <div className="grid grid-cols-2 gap-4">
            <Input icon={<User />} placeholder="Full name" value={""} onChange={() => {}} />
            <Input icon={<Mail />} placeholder="Email" value={""} onChange={() => {}} />
            <Input icon={<Phone />} placeholder="Phone" value={""} onChange={() => {}} />
            <Input icon={<CalendarDays />} placeholder="Date of birth" value={""} onChange={() => {}} />
          </div>

          <div className="mt-6 flex gap-4">
            <button className="flex-1 rounded-2xl bg-cyan-500 py-3 font-semibold text-slate-900">Create Account</button>
            <Link to="/login" className="underline text-sm self-center">Sign in</Link>
          </div>

        </motion.form>
      </div>
    </div>
  );

}

/* =======================================
   Reusable Input Component
======================================= */

function Input({

  icon,

  placeholder,

  value,

  onChange,

  type = "text",

  required = true,

  autoComplete = "off"

}) {

  return (

    <div className="group flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 transition-all duration-300 focus-within:border-cyan-400 focus-within:bg-white/10 focus-within:shadow-lg focus-within:shadow-cyan-500/10">

      <div className="text-slate-400 transition-colors group-focus-within:text-cyan-300">

        {icon}

      </div>

      <input

        required={required}

        autoComplete={autoComplete}

        type={type}

        placeholder={placeholder}

        value={value}

        onChange={(e) => onChange(e.target.value)}

        className="w-full bg-transparent px-4 py-4 text-white outline-none placeholder:text-slate-500"

      />

    </div>

  );

}