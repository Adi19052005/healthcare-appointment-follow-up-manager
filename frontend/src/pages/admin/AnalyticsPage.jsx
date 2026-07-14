import { useEffect, useMemo, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import StatCard from "../../components/StatCard";

import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function AnalyticsPage() {

  const [stats, setStats] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dashboardRes, appointmentsRes] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/appointments")
        ]);

        setStats(dashboardRes.data.data || {});
        setAppointments(appointmentsRes.data.data || []);

      } catch (err) {
        toast.error(err.response?.data?.message || "Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // aggregate appointments per day for a simple chart
  const countsPerDay = useMemo(() => {
    const map = {};
    for (const a of appointments) {
      const d = new Date(a.appointmentDate).toISOString().slice(0, 10);
      map[d] = (map[d] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [appointments]);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Track operational health and service trends." icon={BarChart3} accent="text-amber-300" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Appointments" value={stats.totalAppointments ?? 0} detail="Total" icon={TrendingUp} accent="text-amber-300" />
        <StatCard title="Doctors" value={stats.totalDoctors ?? 0} detail="Registered" icon={BarChart3} accent="text-cyan-300" />
        <StatCard title="Patients" value={stats.totalPatients ?? 0} detail="Registered" icon={BarChart3} accent="text-emerald-300" />
        <StatCard title="Revenue" value={stats.revenue ? `$${stats.revenue}` : "-"} detail="Estimated" icon={TrendingUp} accent="text-fuchsia-300" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white">Appointments Over Time</h3>
          <div className="mt-6 h-48 rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-4">

            {loading ? (
              <div className="h-full animate-pulse" />
            ) : countsPerDay.length === 0 ? (
              <div className="text-slate-400">No appointment data available.</div>
            ) : (
              <div className="flex items-end h-full gap-2">
                {countsPerDay.map(([date, count]) => (
                  <div key={date} className="flex-1 text-center">
                    <div className="mx-auto mb-2 h-24 w-6 bg-emerald-400" style={{ height: `${Math.min(100, count * 8)}%` }} />
                    <div className="text-xs text-slate-400">{date.slice(5)}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <div className="mt-6 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-400 animate-pulse">&nbsp;</div>
              ))
            ) : (
              (appointments.slice(0, 5).map((a) => {
                const actor = a.patient?.user?.name || a.doctor?.user?.name || "User";
                const msg = a.status === "BOOKED" ? `Appointment booked with ${a.doctor?.user?.name || "Doctor"}` : `Appointment ${a.status.toLowerCase()}`;
                return (
                  <div key={a.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-400">{msg} — {new Date(a.appointmentDate).toLocaleDateString()}</div>
                );
              }))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
