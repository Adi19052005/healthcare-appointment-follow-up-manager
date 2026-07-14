import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import FormTextarea from "../../components/FormTextarea";
import FormInput from "../../components/FormInput";

export default function ClinicalNotesPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ appointmentId: "", soap: "", diagnosis: "", prescription: "", advice: "", observations: "" });

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
      const clinicalNotes = [
        `SOAP: ${form.soap}`,
        `Diagnosis: ${form.diagnosis}`,
        `Prescription: ${form.prescription}`,
        `Advice: ${form.advice}`,
        `Observations: ${form.observations}`,
      ].filter(Boolean).join("\n\n");

      const prescriptionLog = form.prescription ? [form.prescription] : undefined;

      await api.put(`/appointments/${form.appointmentId}/consultation`, {
        clinicalNotes,
        prescriptionLog,
        status: "COMPLETED",
      });
      toast.success("Clinical notes saved.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save notes.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Clinical Notes" subtitle="Document SOAP notes, diagnosis, prescription, and follow-up advice." icon={FileText} accent="text-fuchsia-300" />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState title="Unable to load appointments" description={error} icon={FileText} />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments available" description="There are no appointments to review yet." icon={FileText} />
      ) : (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Appointment ID" name="appointmentId" value={form.appointmentId} onChange={handleChange} />
            <FormTextarea label="SOAP Notes" name="soap" value={form.soap} onChange={handleChange} rows={5} placeholder="Subjective, objective, assessment, plan" />
            <FormInput label="Diagnosis" name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Primary diagnosis" />
            <FormTextarea label="Prescription" name="prescription" value={form.prescription} onChange={handleChange} rows={4} placeholder="Medication plan" />
            <FormTextarea label="Follow-up Advice" name="advice" value={form.advice} onChange={handleChange} rows={4} placeholder="Recovery advice" />
            <FormTextarea label="Doctor Observations" name="observations" value={form.observations} onChange={handleChange} rows={4} placeholder="Additional clinical observations" />
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 font-medium text-white transition hover:opacity-90">
              Save notes
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
