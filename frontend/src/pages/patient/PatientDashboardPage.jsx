import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  CalendarClock,
  ClipboardCheck,
  Activity,
  BellRing,
  HeartPulse,
  CalendarDays,
  PlusCircle,
} from "lucide-react";

import api from "../../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PatientDashboardPage() {

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

        api.get("/patients/dashboard"),
        api.get("/appointments/my")

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

  const cards = [

    {
      title: "Appointments",
      value: stats.totalAppointments || 0,
      icon: CalendarClock,
      color: "text-cyan-300",
      bg: "bg-cyan-500/20"
    },

    {
      title: "Upcoming",
      value: stats.upcomingAppointments || 0,
      icon: Activity,
      color: "text-blue-300",
      bg: "bg-blue-500/20"
    },

    {
      title: "Completed",
      value: stats.completedAppointments || 0,
      icon: ClipboardCheck,
      color: "text-green-300",
      bg: "bg-green-500/20"
    },

    {
      title: "Health Records",
      value: appointments.length,
      icon: HeartPulse,
      color: "text-pink-300",
      bg: "bg-pink-500/20"
    }

  ];

  return (

    <div className="space-y-8">

      {/* Hero */}

      <motion.div

        initial={{ opacity:0,y:20 }}
        animate={{ opacity:1,y:0 }}

        className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-600/20 via-sky-600/20 to-indigo-600/20 p-8 backdrop-blur-xl"

      >

        <div className="flex flex-col lg:flex-row justify-between gap-8">

          <div>

            <p className="text-cyan-300 text-sm">

              Patient Portal

            </p>

            <h1 className="mt-2 text-4xl font-bold">

              Welcome back, {user?.name}

            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">

              Book appointments,
              monitor your healthcare,
              receive AI-powered pre-visit summaries,
              and access all your medical records
              from one place.

            </p>

          </div>

          <div>

            <div className="rounded-3xl bg-white/5 p-6">

              <HeartPulse
                size={60}
                className="text-cyan-300"
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

            {/* Main Dashboard */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Upcoming Appointment */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-semibold">

                Upcoming Appointments

              </h2>

              <p className="text-sm text-slate-400">

                Your scheduled healthcare visits

              </p>

            </div>

            <button onClick={() => navigate('/patient/book')}
              className="flex items-center gap-2 rounded-2xl bg-cyan-500/20 px-4 py-3 text-cyan-300 transition hover:bg-cyan-500/30"
            >

              <PlusCircle size={18} />

              Book Appointment

            </button>

          </div>

          {

            loading ?

            <div className="space-y-4">

              {

                Array.from({ length: 3 }).map((_, i) => (

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

              No appointments found.

            </div>

            :

            <div className="space-y-4">

              {

                appointments.slice(0,4).map((appointment)=>(

                  <motion.div

                    whileHover={{ scale:1.01 }}

                    key={appointment.id}

                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"

                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      <div>

                        <h3 className="text-lg font-semibold">

                          {

                            appointment.doctor?.user?.name ||

                            "Doctor"

                          }

                        </h3>

                        <p className="mt-1 text-sm text-slate-400">

                          {

                            new Date(

                              appointment.appointmentDate

                            ).toLocaleDateString()

                          }

                          {" • "}

                          {appointment.slotStartTime}

                        </p>

                      </div>

                      <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm text-cyan-300">

                        {appointment.status}

                      </span>

                    </div>

                  </motion.div>

                ))

              }

            </div>

          }

        </motion.div>

        {/* Next Visit */}

        <motion.div

          initial={{ opacity:0,y:15 }}
          animate={{ opacity:1,y:0 }}

          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

        >

          <div className="flex items-center gap-3">

            <CalendarDays className="text-cyan-300"/>

            <h2 className="text-xl font-semibold">

              Next Visit

            </h2>

          </div>

          {

            appointments.length > 0 ?

            <div className="mt-6 space-y-5">

              <div>

                <p className="text-sm text-slate-400">

                  Doctor

                </p>

                <p className="text-xl font-semibold">

                  {

                    appointments[0].doctor?.user?.name

                  }

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-400">

                  Date

                </p>

                <p>

                  {

                    new Date(

                      appointments[0].appointmentDate

                    ).toLocaleDateString()

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

                <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-cyan-300">

                  {appointments[0].status}

                </span>

              </div>

            </div>

            :

            <div className="mt-10 text-center text-slate-400">

              No upcoming visits.

            </div>

          }

        </motion.div>

      </div>

      {/* Notifications + Quick Actions */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Notifications */}

        <motion.div

          initial={{ opacity:0,y:15 }}
          animate={{ opacity:1,y:0 }}

          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

        >

          <div className="mb-5 flex items-center gap-3">

            <BellRing className="text-cyan-300"/>

            <h2 className="text-xl font-semibold">

              Notifications

            </h2>

          </div>

          <div className="space-y-4">

            <div className="rounded-2xl bg-slate-900/70 p-4">

              <h3 className="font-medium">

                Intake Form Available

              </h3>

              <p className="mt-2 text-sm text-slate-400">

                Complete your intake during booking for an AI-generated pre-visit summary.

              </p>

            </div>

            <div className="rounded-2xl bg-slate-900/70 p-4">

              <h3 className="font-medium">

                Follow-up Summary

              </h3>

              <p className="mt-2 text-sm text-slate-400">

                Visit summaries and prescriptions will
                appear here after consultation.

              </p>

            </div>

          </div>

        </motion.div>

        {/* Quick Actions */}

        <motion.div

          initial={{ opacity:0,y:15 }}
          animate={{ opacity:1,y:0 }}

          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

        >

          <h2 className="mb-6 text-xl font-semibold">

            Quick Actions

          </h2>

          <div className="space-y-4">

            <button onClick={() => navigate('/patient/book')} className="w-full rounded-2xl bg-cyan-500/20 px-5 py-4 text-left transition hover:bg-cyan-500/30">

              📅 Book Appointment

            </button>

            <button onClick={() => navigate('/patient/book')} className="w-full rounded-2xl bg-blue-500/20 px-5 py-4 text-left transition hover:bg-blue-500/30">

              🩺 Complete Intake During Booking

            </button>

            <button onClick={() => navigate('/patient/records')} className="w-full rounded-2xl bg-green-500/20 px-5 py-4 text-left transition hover:bg-green-500/30">

              📋 View Medical Records

            </button>

            <button onClick={() => navigate('/patient/prescriptions')} className="w-full rounded-2xl bg-violet-500/20 px-5 py-4 text-left transition hover:bg-violet-500/30">

              💊 View Prescriptions

            </button>

          </div>

        </motion.div>

      </div>
            {/* AI Summary + Prescription */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* AI Summary */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >

          <div className="mb-5 flex items-center gap-3">

            <Activity className="text-cyan-300" />

            <h2 className="text-xl font-semibold">

              AI Pre-Visit Summary

            </h2>

          </div>

          {

            appointments.length > 0 ?

            appointments[0].preSummary ?

            <div className="space-y-5">

              <div>

                <p className="text-sm text-slate-400">

                  Urgency Level

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

            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">

              <Activity
                size={42}
                className="mx-auto mb-4 text-cyan-300"
              />

              <p className="text-slate-300">

                Your pre-visit summary will appear after you submit your intake or once the care team completes the assessment.

              </p>

            </div>

            :

            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">

              No appointment selected.

            </div>

          }

        </motion.div>

        {/* Post-Visit Summary */}

        <motion.div

          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}

          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

        >

          <div className="mb-5 flex items-center gap-3">

            <ClipboardCheck className="text-green-300" />

            <h2 className="text-xl font-semibold">

              Post-Visit Summary

            </h2>

          </div>

          {

            appointments.length > 0 ?

            appointments[0].postSummary ?

            <div className="space-y-5">

              <div>

                <p className="text-sm text-slate-400">

                  Consultation Summary

                </p>

                <div className="mt-3 rounded-2xl bg-slate-900/70 p-5 leading-7">

                  {

                    appointments[0].postSummary

                  }

                </div>

              </div>

            </div>

            :

            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">

              <ClipboardCheck
                size={42}
                className="mx-auto mb-4 text-green-300"
              />

              <p className="text-slate-300">

                Your post-visit summary will appear here after the consultation is complete or when the clinician updates the record.

              </p>

            </div>

            :

            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">

              No appointment selected.

            </div>

          }

        </motion.div>

        {/* Prescription */}

        <motion.div

          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}

          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

        >

          <div className="mb-5 flex items-center gap-3">

            <ClipboardCheck className="text-green-300" />

            <h2 className="text-xl font-semibold">

              Latest Prescription

            </h2>

          </div>

          {

            appointments.length > 0 &&

            appointments[0].prescriptionLog ?

            <pre className="overflow-auto rounded-2xl bg-slate-900/70 p-5 text-sm">

              {

                JSON.stringify(

                  appointments[0].prescriptionLog,

                  null,

                  2

                )

              }

            </pre>

            :

            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">

              No prescription available.

            </div>

          }

        </motion.div>

      </div>

      {/* Medical History */}

      <motion.div

        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}

        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"

      >

        <div className="mb-6 flex items-center gap-3">

          <CalendarClock className="text-cyan-300"/>

          <h2 className="text-xl font-semibold">

            Recent Medical History

          </h2>

        </div>

        {

          appointments.length === 0 ?

          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">

            No medical history found.

          </div>

          :

          <div className="space-y-4">

            {

              appointments.slice(0,5).map((appointment)=>(

                <div

                  key={appointment.id}

                  className="rounded-2xl bg-slate-900/70 p-5"

                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                      <h3 className="font-semibold">

                        {

                          appointment.doctor?.user?.name ||

                          "Doctor"

                        }

                      </h3>

                      <p className="mt-1 text-sm text-slate-400">

                        {

                          new Date(

                            appointment.appointmentDate

                          ).toLocaleDateString()

                        }

                      </p>

                    </div>

                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">

                      {appointment.status}

                    </span>

                  </div>

                </div>

              ))

            }

          </div>

        }

      </motion.div>

      {/* Health Tips */}

      <motion.div

        initial={{ opacity:0,y:15 }}
        animate={{ opacity:1,y:0 }}

        className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-6 backdrop-blur-xl"

      >

        <h2 className="text-xl font-semibold">

          💙 Daily Health Reminder

        </h2>

        <p className="mt-4 text-slate-300 leading-7">

          Keep your intake details updated before every visit.
          AI-powered summaries help your doctor understand
          your condition even before your appointment,
          resulting in faster consultations and better care.

        </p>

      </motion.div>

    </div>

  );

}