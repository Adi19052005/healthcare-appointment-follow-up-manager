import { useEffect, useMemo, useState } from "react";
import { useForm } from 'react-hook-form';
import { CalendarDays } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import DataTable from "../../components/DataTable";
import FormSelect from "../../components/FormSelect";

export default function AppointmentManagementPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { register, watch } = useForm({ defaultValues: { statusFilter: 'ALL' } });
  const watchedStatus = watch('statusFilter');

  useEffect(() => {
    if (watchedStatus) setStatusFilter(watchedStatus);
  }, [watchedStatus]);

  useEffect(() => {
    void loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/admin/appointments");
      setAppointments(data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load appointments.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchText = `${appointment.patient?.user?.name || appointment.patient?.name || ""} ${appointment.doctor?.user?.name || appointment.doctor?.name || ""} ${appointment.reason || ""}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || (appointment.status || "BOOKED").toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Appointment Management" subtitle="Review all appointments and clinical status updates." icon={CalendarDays} accent="text-amber-300" />

      <GlassCard className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search appointment" className="lg:max-w-md" />
          <FormSelect label="" {...register('statusFilter')} options={[
            { value: "ALL", label: "All statuses" },
            { value: "BOOKED", label: "Booked" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
          ]} className="lg:w-48" />
        </div>
      </GlassCard>

      <GlassCard>
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : error ? (
          <EmptyState title="Unable to load appointments" description={error} icon={CalendarDays} />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState title="No appointments found" description="Try adjusting the filters." icon={CalendarDays} />
        ) : (
          <DataTable headers={["Patient", "Doctor", "Date", "Status"]} rows={filteredAppointments} renderRow={(appointment) => (
            <>
              <td className="px-4 py-3 text-white">{appointment.patient?.user?.name || appointment.patient?.name || "Patient"}</td>
              <td className="px-4 py-3 text-slate-400">{appointment.doctor?.user?.name || appointment.doctor?.name || "Doctor"}</td>
              <td className="px-4 py-3 text-slate-400">{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : "TBD"}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">{appointment.status || "BOOKED"}</span>
              </td>
            </>
          )} />
        )}
      </GlassCard>
    </div>
  );
}
