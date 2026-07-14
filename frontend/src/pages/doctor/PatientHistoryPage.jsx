import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";

export default function PatientHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (value) => {
    if (!value) return "Pending";
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/appointments/doctor");
      setHistory(data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load patient history.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Patient History" subtitle="Review medical timelines, past visits, and AI summaries." icon={History} accent="text-fuchsia-300" />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState title="Unable to load history" description={error} icon={History} />
      ) : history.length === 0 ? (
        <EmptyState title="No history available" description="Patient history will appear once records are available." icon={History} />
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const summaryText = item.postSummary || item.preSummary || item.clinicalNotes || "No generated summary yet. The clinical summary will appear once the consultation is complete.";
            const statusTone = item.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-300" : item.status === "CANCELLED" ? "bg-rose-500/10 text-rose-300" : "bg-fuchsia-500/10 text-fuchsia-300";

            return (
              <GlassCard key={item.id}>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.patient?.user?.name || "Patient"}</h3>
                    <p className="text-sm text-slate-400">{item.doctor?.user?.name || "Doctor"} • {item.doctor?.specialization || "Care team"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-2xl px-3 py-2 text-sm ${statusTone}`}>{item.status || "BOOKED"}</span>
                    <span className="rounded-2xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-300">{formatDate(item.appointmentDate)}</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                    <p className="text-sm font-semibold text-white">Visit Timing</p>
                    <p className="mt-2 text-sm text-slate-400">{formatDate(item.appointmentDate)} • {item.slotStartTime || "Pending"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                    <p className="text-sm font-semibold text-white">Clinical Notes</p>
                    <p className="mt-2 text-sm text-slate-400">{item.clinicalNotes || "No notes captured yet"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                    <p className="text-sm font-semibold text-white">AI Summary</p>
                    <p className="mt-2 text-sm text-slate-400">{summaryText}</p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
