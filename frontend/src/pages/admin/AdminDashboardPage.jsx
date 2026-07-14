import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Users,
  UserRound,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Activity,
  Clock3,
  ShieldCheck,
  Stethoscope,
  ArrowUpRight,
} from "lucide-react";

import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data.data || {});
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Doctors",
      value: stats.totalDoctors || 0,
      icon: Stethoscope,
      color: "text-violet-300",
      bg: "bg-violet-500/20",
    },
    {
      title: "Patients",
      value: stats.totalPatients || 0,
      icon: Users,
      color: "text-cyan-300",
      bg: "bg-cyan-500/20",
    },
    {
      title: "Appointments",
      value: stats.totalAppointments || 0,
      icon: CalendarDays,
      color: "text-amber-300",
      bg: "bg-amber-500/20",
    },
    {
      title: "Completed",
      value: stats.completedAppointments || 0,
      icon: CheckCircle2,
      color: "text-green-300",
      bg: "bg-green-500/20",
    },
    {
      title: "Cancelled",
      value: stats.cancelledAppointments || 0,
      icon: XCircle,
      color: "text-red-300",
      bg: "bg-red-500/20",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-fuchsia-600/20 p-8 backdrop-blur-xl"
      >
        <div className="flex flex-col lg:flex-row justify-between gap-6">

          <div>

            <p className="text-sm text-violet-300">
              Healthcare Management
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              Welcome, Administrator
            </h2>

            <p className="mt-3 max-w-2xl text-slate-300">
              Monitor appointments, doctors, patients and
              overall healthcare operations from one place.
            </p>

          </div>

          <div className="flex items-center">

            <div className="rounded-3xl bg-white/5 p-6">

              <Activity
                size={55}
                className="text-violet-300"
              />

            </div>

          </div>

        </div>
      </motion.div>

      {/* Statistics */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-3xl bg-white/10"
              />
            ))
          : cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex justify-between">

                  <div>

                    <p className="text-sm text-slate-400">
                      {card.title}
                    </p>

                    <h3 className="mt-4 text-4xl font-bold">
                      {card.value}
                    </h3>

                  </div>

                  <div
                    className={`rounded-2xl p-3 ${card.bg}`}
                  >
                    <card.icon
                      className={card.color}
                      size={22}
                    />
                  </div>

                </div>

              </motion.div>
            ))}

      </div>

      {/* Bottom Grid */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* System Health */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >

          <h3 className="text-xl font-semibold">
            System Health
          </h3>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">

              <span>Backend API</span>

              <span className="text-green-400">
                Operational
              </span>

            </div>

            <div className="flex justify-between">

              <span>Database</span>

              <span className="text-green-400">
                Connected
              </span>

            </div>

            <div className="flex justify-between">

              <span>Redis</span>

              <span className="text-green-400">
                Active
              </span>

            </div>

            <div className="flex justify-between">

              <span>Kafka</span>

              <span className="text-green-400">
                Running
              </span>

            </div>

          </div>

        </motion.div>

        {/* Quick Actions */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >

          <h3 className="text-xl font-semibold">
            Quick Actions
          </h3>

          <div className="mt-6 space-y-3">

            <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 hover:bg-white/10">

              Add Doctor

              <ArrowUpRight size={18} />

            </button>

            <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 hover:bg-white/10">

              View Appointments

              <ArrowUpRight size={18} />

            </button>

            <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 p-4 hover:bg-white/10">

              Manage Patients

              <ArrowUpRight size={18} />

            </button>

          </div>

        </motion.div>

      </div>

      {/* Activity */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >

        <div className="flex items-center gap-3">

          <Clock3 className="text-violet-300" />

          <h3 className="text-xl font-semibold">
            Recent Activity
          </h3>

        </div>

        <div className="mt-6 space-y-4 text-slate-300">

          <p>No recent activity available.</p>

        </div>

      </motion.div>

    </div>
  );
}