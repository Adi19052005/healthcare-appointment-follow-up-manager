import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Eye } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import FormSelect from "../../components/FormSelect";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    void loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/appointments/doctor");
      setAppointments(data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load appointments.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(appointmentId, status) {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });
      setAppointments((current) => current.map((item) => (item.id === appointmentId ? { ...item, status } : item)));
      toast.success("Status updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update status.");
    }
  }

  const filtered = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch = `${appointment.patient?.user?.name || appointment.patient?.name || ""} ${appointment.symptoms || appointment.reason || ""}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || (appointment.status || "BOOKED").toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Appointments" subtitle="Review today's appointment queue and update patient progress." icon={CalendarDays} accent="text-fuchsia-300" />

      <GlassCard className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search patient or reason" className="lg:max-w-md" />
          <FormSelect
            label=""
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[
              { value: "ALL", label: "All statuses" },
              { value: "BOOKED", label: "Booked" },
              { value: "COMPLETED", label: "Completed" },
              { value: "CANCELLED", label: "Cancelled" },
            ]}
            className="lg:w-48"
          />
        </div>
      </GlassCard>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState title="Unable to load appointments" description={error} icon={CalendarDays} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No appointments" description="No matching records for the current filter." icon={CalendarDays} />
      ) : (
        <div className="space-y-4">
          {filtered.map((appointment) => (
            <GlassCard key={appointment.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{appointment.patient?.user?.name || appointment.patient?.name || "Patient"}</h3>
                    <StatusBadge status={appointment.status || "BOOKED"} tone={appointment.status === "COMPLETED" ? "success" : appointment.status === "CANCELLED" ? "danger" : "info"} />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Reason: {appointment.symptoms || appointment.reason || "Consultation"}</p>
                  <p className="mt-1 text-sm text-slate-400">Scheduled: {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : "TBD"} · {appointment.slotStartTime || appointment.time || "TBD"}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => void updateStatus(appointment.id, "COMPLETED")} className="rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/30">Mark complete</button>
                  <button onClick={() => void updateStatus(appointment.id, "CANCELLED")} className="rounded-2xl bg-rose-500/20 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/30">Cancel</button>
                  <button className="rounded-2xl bg-fuchsia-500/20 px-3 py-2 text-sm text-fuchsia-300 transition hover:bg-fuchsia-500/30">
                    <span className="flex items-center gap-2"><Eye size={16} /> Open patient</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
