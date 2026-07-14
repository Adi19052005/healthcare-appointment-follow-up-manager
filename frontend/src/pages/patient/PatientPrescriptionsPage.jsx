import { useEffect, useState } from "react";
import { Pill } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadPrescriptions();
  }, []);

  async function loadPrescriptions() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/appointments/my");
      const items = (data.data || []).filter((item) => Boolean(item.prescriptionLog));
      setPrescriptions(items);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load prescriptions.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function parsePrescription(item) {
    const parts = (item.prescriptionLog || "").split(" | ").filter(Boolean);
    return {
      medicine: parts[0] || "Medication plan",
      dosage: parts[1] || "As advised",
      frequency: parts[2] || "Daily",
      followUp: parts[3] || "Schedule a follow-up",
    };
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" subtitle="View medication details and follow-up reminders." icon={Pill} accent="text-cyan-300" />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState title="Unable to load prescriptions" description={error} icon={Pill} />
      ) : prescriptions.length === 0 ? (
        <EmptyState title="No prescriptions yet" description="Your approved medication plans will appear here." icon={Pill} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {prescriptions.map((item) => {
            const prescription = parsePrescription(item);
            return (
              <GlassCard key={item.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{prescription.medicine}</h3>
                    <p className="mt-1 text-sm text-slate-400">Doctor: {item.doctor?.user?.name || item.doctor?.name || "Assigned clinician"}</p>
                  </div>
                  <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                    <Pill size={18} />
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-400">
                  <p>Dosage: {prescription.dosage}</p>
                  <p>Frequency: {prescription.frequency}</p>
                  <p>Follow-up reminder: {prescription.followUp}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
