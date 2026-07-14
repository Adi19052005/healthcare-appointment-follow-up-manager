import { useEffect, useMemo, useState } from "react";
import { CalendarDays, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import AppointmentCard from "../../components/AppointmentCard";
import FormSelect from "../../components/FormSelect";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [actionType, setActionType] = useState("cancel");

  useEffect(() => {
    void loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/appointments/my");
      setAppointments(data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load appointments.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(appointment, type) {
    try {
      if (type === "cancel") {
        await api.patch(`/appointments/${appointment.id}/cancel`);
      } else {
        const currentDate = appointment.appointmentDate || appointment.date || new Date().toISOString();
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const appointmentDate = nextDate.toISOString().slice(0, 10);
        const slotStartTime = appointment.slotStartTime || appointment.time || "09:00";
        await api.patch(`/appointments/${appointment.id}/reschedule`, { appointmentDate, slotStartTime });
      }

      const updated = appointments.map((item) =>
        item.id === appointment.id
          ? {
              ...item,
              status: type === "cancel" ? "CANCELLED" : "BOOKED",
            }
          : item
      );
      setAppointments(updated);
      toast.success(type === "cancel" ? "Appointment cancelled." : "Appointment rescheduled.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    } finally {
      setPendingAppointment(null);
    }
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch = `${appointment.symptoms || appointment.reason || ""} ${appointment.doctor?.user?.name || appointment.doctor?.name || ""}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || (appointment.status || "BOOKED").toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Appointments"
        subtitle="Manage upcoming visits, request changes, and track progress."
        icon={CalendarDays}
        accent="text-cyan-300"
        action={
          <button onClick={() => void loadAppointments()} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      <GlassCard className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by reason or doctor" className="lg:max-w-md" />
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
      ) : filteredAppointments.length === 0 ? (
        <EmptyState title="No appointments found" description="You currently do not have any matching visits." icon={CalendarDays} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={() => {
                setPendingAppointment(appointment);
                setActionType("cancel");
              }}
              onReschedule={() => {
                setPendingAppointment(appointment);
                setActionType("reschedule");
              }}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingAppointment}
        title={actionType === "cancel" ? "Cancel appointment" : "Request reschedule"}
        description={actionType === "cancel" ? "This will cancel the selected appointment." : "A reschedule request will be sent for the selected appointment."}
        onCancel={() => setPendingAppointment(null)}
        onConfirm={() => void handleAction(pendingAppointment, actionType)}
      />
    </div>
  );
}
