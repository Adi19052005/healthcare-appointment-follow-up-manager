import { useEffect, useState } from "react";
import { ClipboardList, BrainCircuit } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

export default function PatientRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadRecords();
  }, []);

  async function loadRecords() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/appointments/my");
      setRecords(data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load medical records.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function formatAppointmentLabel(record) {
    const date = record.appointmentDate
      ? new Date(record.appointmentDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Pending";
    const time = record.slotStartTime || "TBD";
    const doctorName = record.doctor?.user?.name || record.doctor?.name || "Assigned clinician";
    return `${doctorName} • ${date} • ${time}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical Records"
        subtitle="Track each appointment, its assigned clinician, and the AI-generated summaries tied to it."
        icon={ClipboardList}
        accent="text-cyan-300"
      />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState title="Unable to load records" description={error} icon={ClipboardList} />
      ) : records.length === 0 ? (
        <EmptyState title="No medical records yet" description="Your previous visits will appear here." icon={ClipboardList} />
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <GlassCard key={record.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{record.symptoms || "Consultation"}</h3>
                    <StatusBadge status={record.status || "pending"} tone={record.status === "COMPLETED" ? "success" : record.status === "CANCELLED" ? "danger" : "info"} />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Appointment: {formatAppointmentLabel(record)}</p>
                  <p className="mt-1 text-sm text-slate-400">Doctor: {record.doctor?.user?.name || record.doctor?.name || "Assigned clinician"}</p>
                  <p className="mt-1 text-sm text-slate-400">Time: {record.slotStartTime || "TBD"}</p>
                </div>
                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                  <BrainCircuit size={20} />
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-white">Chief Complaint / Intake</p>
                  <div className="mt-2 text-sm text-slate-400">
                    <p className="font-medium">Symptoms: {record.symptoms || '—'}</p>
                    <p>Urgency: {record.urgencyLevel || '—'}</p>
                    <p className="whitespace-pre-line">Pre-visit summary: {record.preSummary || '—'}</p>
                    <p className="mt-4 text-sm font-semibold text-white">Doctor Notes</p>
                    <p className="mt-2 whitespace-pre-line text-sm text-slate-400">{record.clinicalNotes || "No notes yet."}</p>
                    <p className="mt-2 whitespace-pre-line">Post-visit summary: {record.postSummary || '—'}</p>
                    <p className="mt-2 whitespace-pre-line">Prescription: {record.prescriptionLog ? JSON.stringify(record.prescriptionLog) : '—'}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-white">Pre-visit Summary</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-400">{record.preSummary || "No pre-visit summary generated yet."}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-white">Doctor Notes</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-400">{record.clinicalNotes || "No notes yet."}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-sm font-semibold text-white">Post-visit Summary</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-400">{record.postSummary || "No post-visit summary generated yet."}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
