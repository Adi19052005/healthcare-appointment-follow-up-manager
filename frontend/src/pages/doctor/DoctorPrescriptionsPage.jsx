import { useEffect, useState } from "react";
import { Pill } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import FormInput from "../../components/FormInput";
import FormTextarea from "../../components/FormTextarea";

export default function DoctorPrescriptionsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ appointmentId: "", medicine: "", dosage: "", frequency: "", followUp: "" });

  useEffect(() => {
    void loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/appointments/doctor");
      setAppointments(data.data || []);
      if (data.data?.length) setForm((current) => ({ ...current, appointmentId: data.data[0].id }));
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load appointments.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const prescriptionLog = [form.medicine, form.dosage, form.frequency, form.followUp].filter(Boolean).join(" | ");
      await api.put(`/appointments/${form.appointmentId}/consultation`, {
        prescriptionLog,
        status: "COMPLETED",
      });
      toast.success("Prescription saved.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save prescription.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" subtitle="Create medication plans and follow-up reminders for patients." icon={Pill} accent="text-fuchsia-300" />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState title="Unable to load appointments" description={error} icon={Pill} />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments available" description="Create an appointment first to add a prescription." icon={Pill} />
      ) : (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Appointment ID" name="appointmentId" value={form.appointmentId} onChange={handleChange} />
            <FormInput label="Medicine" name="medicine" value={form.medicine} onChange={handleChange} placeholder="Medication name" />
            <FormInput label="Dosage" name="dosage" value={form.dosage} onChange={handleChange} placeholder="e.g. 1 tablet" />
            <FormInput label="Frequency" name="frequency" value={form.frequency} onChange={handleChange} placeholder="e.g. Twice daily" />
            <FormTextarea label="Follow-up reminder" name="followUp" value={form.followUp} onChange={handleChange} rows={4} placeholder="Care instructions and reminders" />
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 font-medium text-white transition hover:opacity-90">
              Save prescription
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
