import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import FormInput from "../../components/FormInput";

export default function WorkingHoursPage() {
  const [form, setForm] = useState({
    openingTime: "09:00",
    closingTime: "17:00",
    slotDuration: "30",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await api.get('/doctors/profile');
        const doc = data.data || {};
        setForm({
          openingTime: doc.workingHoursStart || '09:00',
          closingTime: doc.workingHoursEnd || '17:00',
          slotDuration: String(doc.slotDurationMins || 30)
        });
      } catch (err) {
        // ignore silently
      }
    }

    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.put("/doctors/working-hours", {
        workingHoursStart: form.openingTime,
        workingHoursEnd: form.closingTime,
        slotDurationMins: Number(form.slotDuration)
      });
      toast.success("Working hours updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update working hours.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Working Hours" subtitle="Define your availability and slot length for appointments." icon={Clock3} accent="text-fuchsia-300" />

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <FormInput label="Opening time" name="openingTime" value={form.openingTime} onChange={handleChange} type="time" />
            <FormInput label="Closing time" name="closingTime" value={form.closingTime} onChange={handleChange} type="time" />
            <FormInput label="Slot duration (minutes)" name="slotDuration" value={form.slotDuration} onChange={handleChange} type="number" />
          </div>
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 font-medium text-white transition hover:opacity-90">
            Save schedule
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
