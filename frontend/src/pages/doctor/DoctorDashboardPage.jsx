import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  CalendarDays,
  ClipboardCheck,
  Activity,
  Clock3,
  Users,
  UserRound,
  ArrowRight,
  BrainCircuit,
  Stethoscope,
} from "lucide-react";

import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboardPage() {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {

    try {

      const [
        dashboardRes,
        appointmentsRes
      ] = await Promise.all([

        api.get("/doctors/dashboard"),
        api.get("/appointments/doctor")

      ]);

      setStats(dashboardRes.data.data || {});
      setAppointments(appointmentsRes.data.data || []);

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Unable to load dashboard."
      );

    } finally {

      setLoading(false);

    }

  }

  const patientsToday = useMemo(() => appointments.filter((appointment) => appointment.status !== "CANCELLED").length, [appointments]);

  const cards = [

    {
      title: "Appointments",
      value: stats.totalAppointments || 0,
      icon: CalendarDays,
      color: "text-violet-300",
      bg: "bg-violet-500/20"
    },

    {
      title: "Upcoming",
      value: stats.upcomingAppointments || 0,
      icon: Clock3,
      color: "text-cyan-300",
      bg: "bg-cyan-500/20"
    },

    {
      title: "Completed",
      value: stats.completedAppointments || 0,
      icon: ClipboardCheck,
      color: "text-green-300",
      bg: "bg-green-500/20"
    },

    {
      title: "Patients Today",
      value: patientsToday,
      icon: Users,
      color: "text-amber-300",
      bg: "bg-amber-500/20"
    }

  ];

  return (

    <div className="space-y-8">

      {/* Hero */}

      <motion.div

        initial={{ opacity:0,y:20 }}
        animate={{ opacity:1,y:0 }}

        className="rounded-3xl border border-white/10 bg-gradient-to-r from-fuchsia-600/20 via-violet-600/20 to-indigo-600/20 p-8 backdrop-blur-xl"

      >

        <div className="flex flex-col lg:flex-row justify-between gap-8">

          <div>

            <p className="text-fuchsia-300 text-sm">
              Doctor Workspace
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Welcome Dr. {user?.name}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">

              Manage today's appointments,
              review AI-generated patient summaries,
              update clinical notes and prescriptions.

            </p>

          </div>

          <div>

            <div className="rounded-3xl bg-white/5 p-6">

              <Stethoscope
                size={60}
                className="text-fuchsia-300"
              />

            </div>

          </div>

        </div>

      </motion.div>

      {/* Statistics */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {

          loading ?

          Array.from({ length:4 }).map((_,i)=>(

            <div

              key={i}

              className="h-36 rounded-3xl bg-white/10 animate-pulse"

            />

          ))

          :

          cards.map((card,index)=>(

            <motion.div

              key={card.title}

              initial={{ opacity:0,y:15 }}

              animate={{ opacity:1,y:0 }}

              transition={{ delay:index*0.08 }}

              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

            >

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-slate-400">

                    {card.title}

                  </p>

                  <h2 className="mt-4 text-4xl font-bold">

                    {card.value}

                  </h2>

                </div>

                <div className={`rounded-2xl p-3 ${card.bg}`}>

                  <card.icon

                    className={card.color}

                    size={22}

                  />

                </div>

              </div>

            </motion.div>

          ))

        }

      </div>
          {/* Today's Queue & AI Summary */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Today's Appointments */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-semibold">
                Today's Queue
              </h2>

              <p className="text-sm text-slate-400">
                Upcoming patient appointments
              </p>

            </div>

            <CalendarDays className="text-fuchsia-300" />

          </div>

          {

            loading ?

            <div className="space-y-4">

              {

                Array.from({ length: 4 }).map((_, i) => (

                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-2xl bg-white/10"
                  />

                ))

              }

            </div>

            :

            appointments.length === 0 ?

            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">

              No appointments scheduled.

            </div>

            :

            <div className="space-y-4">

              {

                appointments.slice(0, 5).map((appointment) => (

                  <motion.div

                    whileHover={{ scale: 1.01 }}

                    key={appointment.id}

                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"

                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div>

                        <h3 className="text-lg font-semibold">

                          {appointment.patient?.user?.name || "Patient"}

                        </h3>

                        <p className="mt-1 text-sm text-slate-400">

                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString()}

                          {" • "}

                          {appointment.slotStartTime}

                        </p>

                      </div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs text-fuchsia-300">

                          {appointment.status}

                        </span>

                        {

                          appointment.preSummary ?

                          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">

                            AI Ready

                          </span>

                          :

                          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">

                            Waiting AI

                          </span>

                        }

                      </div>

                    </div>

                  </motion.div>

                ))

              }

            </div>

          }

        </motion.div>

        {/* Next Patient */}

        <motion.div

          initial={{ opacity: 0, y: 15 }}

          animate={{ opacity: 1, y: 0 }}

          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

        >

          <div className="flex items-center gap-3">

            <UserRound className="text-fuchsia-300" />

            <h2 className="text-xl font-semibold">

              Next Patient

            </h2>

          </div>

          {

            appointments.length > 0 ?

            <div className="mt-6 space-y-5">

              <div>

                <p className="text-sm text-slate-400">

                  Patient

                </p>

                <p className="text-xl font-semibold">

                  {

                    appointments[0].patient?.user?.name

                  }

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-400">

                  Time

                </p>

                <p>

                  {appointments[0].slotStartTime}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-400">

                  Status

                </p>

                <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-sm text-fuchsia-300">

                  {appointments[0].status}

                </span>

              </div>

            </div>

            :

            <div className="mt-8 text-center text-slate-400">

              No appointments today.

            </div>

          }

        </motion.div>

      </div>

      {/* AI Summary */}

      <motion.div

        initial={{ opacity: 0, y: 15 }}

        animate={{ opacity: 1, y: 0 }}

        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

      >

        <div className="mb-5 flex items-center gap-3">

          <BrainCircuit className="text-fuchsia-300" />

          <h2 className="text-2xl font-semibold">

            AI Pre-Visit Summary

          </h2>

        </div>

        {

          appointments.length > 0 ?

          appointments[0].preSummary ?

          <div className="space-y-5">

            <div>

              <p className="text-sm text-slate-400">

                Urgency

              </p>

              <span className="mt-2 inline-block rounded-full bg-red-500/20 px-4 py-2 text-red-300">

                {

                  appointments[0].urgencyLevel ||

                  "MEDIUM"

                }

              </span>

            </div>

            <div>

              <p className="text-sm text-slate-400">

                AI Generated Summary

              </p>

              <div className="mt-3 rounded-2xl bg-slate-900/70 p-5 leading-7">

                {

                  appointments[0].preSummary

                }

              </div>

            </div>

          </div>

          :

          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">

            <BrainCircuit
              size={42}
              className="mx-auto mb-3 text-fuchsia-400"
            />

            <p className="text-slate-300">

              A pre-visit summary will appear here once the patient completes the symptom form or the AI workflow finishes.

            </p>

          </div>

          :

          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">

            No appointment selected.

          </div>

        }

      </motion.div>
            {/* Bottom Widgets */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Working Hours */}

        <motion.div

          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}

          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

        >

          <div className="flex items-center gap-3 mb-6">

            <Clock3 className="text-fuchsia-300" />

            <h2 className="text-xl font-semibold">

              Working Hours

            </h2>

          </div>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-slate-400">

                Start Time

              </span>

              <span>

                {stats.workingHoursStart || "09:00"}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                End Time

              </span>

              <span>

                {stats.workingHoursEnd || "17:00"}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Slot Duration

              </span>

              <span>

                {stats.slotDurationMins || 30} mins

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-400">

                Status

              </span>

              <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-300">

                Available

              </span>

            </div>

          </div>

        </motion.div>

        {/* Quick Actions */}

        <motion.div

          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}

          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

        >

          <div className="flex items-center gap-3 mb-6">

            <ArrowRight className="text-fuchsia-300" />

            <h2 className="text-xl font-semibold">

              Quick Actions

            </h2>

          </div>

          <div className="space-y-4">

            <button onClick={() => navigate('/doctor/appointments')} className="w-full rounded-2xl bg-fuchsia-500/20 px-5 py-4 text-left transition hover:bg-fuchsia-500/30">

              📅 View Today's Appointments

            </button>

            <button onClick={() => navigate('/doctor/consultation')} className="w-full rounded-2xl bg-cyan-500/20 px-5 py-4 text-left transition hover:bg-cyan-500/30">

              📝 Unified Consultation

            </button>

            <button onClick={() => navigate('/doctor/patients')} className="w-full rounded-2xl bg-violet-500/20 px-5 py-4 text-left transition hover:bg-violet-500/30">

              👤 View Patient History

            </button>

          </div>

        </motion.div>

      </div>

      {/* Recent Activity */}

      <motion.div

        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}

        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

      >

        <div className="flex items-center gap-3 mb-6">

          <Activity className="text-fuchsia-300" />

          <h2 className="text-xl font-semibold">

            Recent Activity

          </h2>

        </div>

        {

          appointments.length === 0 ?

          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">

            No recent activity available.

          </div>

          :

          <div className="space-y-4">

            {

              appointments.slice(0,5).map((appointment)=>(

                <div

                  key={appointment.id}

                  className="flex items-center justify-between rounded-2xl bg-slate-900/70 p-5"

                >

                  <div>

                    <h3 className="font-medium">

                      {

                        appointment.patient?.user?.name ||

                        "Patient"

                      }

                    </h3>

                    <p className="text-sm text-slate-400">

                      {

                        new Date(

                          appointment.appointmentDate

                        ).toLocaleDateString()

                      }

                    </p>

                  </div>

                  <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs text-fuchsia-300">

                    {appointment.status}

                  </span>

                </div>

              ))

            }

          </div>

        }

      </motion.div>

    </div>

  );

}