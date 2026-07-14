import { useEffect, useState } from "react";
import { CalendarX2 } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import FormInput from "../../components/FormInput";

export default function LeaveManagementPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });

  useEffect(() => {
    void loadLeaves();
  }, []);

  async function loadLeaves() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/doctors/leaves");
      setLeaves(data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load leave history.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.post("/doctors/leaves", form);
      toast.success("Leave request submitted.");
      setForm({ startDate: "", endDate: "", reason: "" });
      void loadLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to submit leave request.");
    }
  }

  async function removeLeave(leaveId) {
    try {
      await api.delete(`/doctors/leaves/${leaveId}`);
      setLeaves((current) => current.filter((item) => item.id !== leaveId));
      toast.success("Leave removed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to remove leave.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Management" subtitle="Schedule time off, review history, and manage absences." icon={CalendarX2} accent="text-fuchsia-300" />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Start date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
            <FormInput label="End date" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
            <FormInput label="Reason" name="reason" value={form.reason} onChange={handleChange} placeholder="Type your reason" />
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 font-medium text-white transition hover:opacity-90">
              Add leave
            </button>
          </form>
        </GlassCard>

        <GlassCard>
          {loading ? (
            <LoadingSkeleton rows={4} />
          ) : error ? (
            <EmptyState title="Unable to load leaves" description={error} icon={CalendarX2} />
          ) : leaves.length === 0 ? (
            <EmptyState title="No leave requests" description="Your leave history will appear here." icon={CalendarX2} />
          ) : (
            <div className="space-y-3">
              {leaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div>
                    <p className="font-medium text-white">{leave.reason || "Leave request"}</p>
                    <p className="mt-1 text-sm text-slate-400">{leave.startDate || "-"} → {leave.endDate || "-"}</p>
                  </div>
                  <button onClick={() => void removeLeave(leave.id)} className="rounded-2xl bg-rose-500/20 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/30">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
