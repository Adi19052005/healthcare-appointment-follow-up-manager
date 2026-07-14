import { useEffect, useMemo, useState } from "react";
import { ClipboardPlus } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import FormInput from "../../components/FormInput";
import FormTextarea from "../../components/FormTextarea";
import FormDatePicker from "../../components/FormDatePicker";

export default function DoctorConsultationPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    appointmentId: "",
    soap: "",
    diagnosis: "",
    medicine: "",
    dosage: "",
    frequency: "",
    prescriptionFollowUp: "",
    advice: "",
    observations: "",
    tests: "",
    followUpDate: "",
    followUpRemarks: ""
  });

  useEffect(() => {
    void loadAppointments();
  }, []);

  // Poll for updates when an appointment is selected and preSummary not yet available
  useEffect(() => {
    let interval;
    if (form.appointmentId) {
      const appt = appointments.find((a) => a.id === form.appointmentId);
      if (appt && !appt.preSummary) {
        interval = setInterval(() => {
          void loadAppointments();
        }, 8000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [form.appointmentId, appointments]);

  const selectedAppointment = useMemo(
    () => appointments.find((a) => a.id === form.appointmentId) || null,
    [appointments, form.appointmentId]
  );

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
        `Observations: ${form.observations}`,
      ].filter(Boolean).join("\n\n");

      const prescriptionLog = [form.medicine, form.dosage, form.frequency, form.prescriptionFollowUp].filter(Boolean);

      await api.put(`/appointments/${form.appointmentId}/consultation`, {
        clinicalNotes,
        diagnosis: form.diagnosis,
        doctorObservations: form.observations,
        advice: form.advice,
        recommendedTests: form.tests,
        followUpDate: form.followUpDate || undefined,
        followUpRemarks: form.followUpRemarks || undefined,
        prescriptionLog: prescriptionLog.length ? prescriptionLog : undefined,
        status: "COMPLETED"
      });

      toast.success("Consultation saved.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save consultation.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Consultation" subtitle="Unified consultation: notes, diagnosis, and prescriptions." icon={ClipboardPlus} accent="text-fuchsia-300" />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState title="Unable to load appointments" description={error} icon={ClipboardPlus} />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments available" description="There are no appointments to review yet." icon={ClipboardPlus} />
      ) : (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white">Select appointment</label>
                  <select name="appointmentId" value={form.appointmentId} onChange={handleChange} className="w-full rounded-md bg-slate-800 border border-white/10 p-2">
                    <option value="">-- Select appointment --</option>
                    {appointments.map((appt) => (
                      <option key={appt.id} value={appt.id}>{`${appt.patient?.user?.name || appt.patient?.name || 'Patient'} • ${new Date(appt.appointmentDate).toLocaleDateString()} ${appt.slotStartTime || ''}`}</option>
                    ))}
                  </select>

                  {selectedAppointment && (
                    <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                      <h4 className="text-sm font-semibold text-white">Patient Intake</h4>
                      <p className="mt-2 text-sm text-slate-300">Name: {selectedAppointment.patient?.user?.name || selectedAppointment.patient?.name}</p>
                      <p className="text-sm text-slate-300">Age: {selectedAppointment.patient?.age ?? '—'}</p>
                      <p className="text-sm text-slate-300">Appointment: {new Date(selectedAppointment.appointmentDate).toLocaleString()} • {selectedAppointment.slotStartTime}</p>
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium text-white">Symptoms</p>
                          <p className="text-sm text-slate-300">{selectedAppointment.symptoms || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">Urgency</p>
                          <p className="text-sm text-slate-300">{selectedAppointment.urgencyLevel || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">Pre-visit summary</p>
                          <p className="text-sm text-slate-300">{selectedAppointment.preSummary || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">Clinical notes (existing)</p>
                          <p className="text-sm text-slate-300">{selectedAppointment.clinicalNotes || '—'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            <FormTextarea label="SOAP Notes" name="soap" value={form.soap} onChange={handleChange} rows={5} placeholder="Subjective, objective, assessment, plan" />
            <FormInput label="Diagnosis" name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Primary diagnosis" />
            <FormTextarea label="Prescription (Medicine)" name="medicine" value={form.medicine} onChange={handleChange} rows={2} placeholder="Medicine name" />
            <div className="grid grid-cols-3 gap-3">
              <FormInput label="Dosage" name="dosage" value={form.dosage} onChange={handleChange} />
              <FormInput label="Frequency" name="frequency" value={form.frequency} onChange={handleChange} />
              <FormInput label="Follow-up" name="prescriptionFollowUp" value={form.prescriptionFollowUp} onChange={handleChange} />
            </div>
            <FormTextarea label="Follow-up Advice" name="advice" value={form.advice} onChange={handleChange} rows={3} placeholder="Recovery advice" />
            <FormTextarea label="Doctor Observations" name="observations" value={form.observations} onChange={handleChange} rows={3} placeholder="Additional clinical observations" />
            <FormTextarea label="Recommended Tests" name="tests" value={form.tests} onChange={handleChange} rows={2} placeholder="Suggested investigations" />
            <div className="grid grid-cols-2 gap-3">
              <FormDatePicker label="Follow-up Date" name="followUpDate" value={form.followUpDate} onChange={(val) => setForm((c) => ({ ...c, followUpDate: val }))} />
              <FormInput label="Follow-up Remarks" name="followUpRemarks" value={form.followUpRemarks} onChange={handleChange} />
            </div>
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 font-medium text-white transition hover:opacity-90">
              Save consultation
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
