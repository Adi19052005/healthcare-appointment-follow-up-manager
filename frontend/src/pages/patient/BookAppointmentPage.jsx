import { useEffect, useMemo, useState } from "react";
import { CalendarPlus2 } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import FormInput from "../../components/FormInput";
import FormTextarea from "../../components/FormTextarea";
import FormSelect from "../../components/FormSelect";
import FormDatePicker from "../../components/FormDatePicker";
import DoctorCard from "../../components/DoctorCard";
import { useAuth } from "../../contexts/AuthContext";

export default function BookAppointmentPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
     symptoms: "",
     urgency: "NORMAL",
  });

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === form.doctorId) || null,
    [doctors, form.doctorId]
  );

  useEffect(() => {
    // Allow patients and admins to view directory
    if (user?.role === "PATIENT" || user?.role === "ADMIN") {
      void loadDoctors();
      return;
    }

    setDoctors([]);
    setLoading(false);
    setError("Doctor directory access is not available for this role. Enter a doctor ID manually to continue booking.");
  }, [user?.role]);

  async function loadDoctors() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/patients/doctors");
      setDoctors(data.data || []);
      if ((data.data || []).length > 0) {
        setForm((current) => ({ ...current, doctorId: current.doctorId || data.data[0].id }));
      }
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load doctors.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // When doctor or date changes, fetch available slots from backend
    async function loadSlots() {
      if (!selectedDoctor || !form.date) {
        // fallback to default time if nothing selected
        if (!form.time) {
          setForm((current) => ({ ...current, time: "09:00" }));
        }
        setAvailableSlots([]);
        return;
      }

      try {
        const { data } = await api.get(`/patients/doctors/${selectedDoctor.id}/availability`, {
          params: { date: form.date }
        });

        const slots = data.data || [];
        setAvailableSlots(slots);
        setForm((current) => ({ ...current, time: slots.includes(current.time) ? current.time : slots[0] || "" }));
      } catch (err) {
        toast.error(err.response?.data?.message || "Unable to load availability.");
        setAvailableSlots([]);
      }
    }

    void loadSlots();
  }, [selectedDoctor, form.date]);

  function buildTimeSlots(doctor) {
    const start = doctor?.workingHoursStart || "09:00";
    const end = doctor?.workingHoursEnd || "17:00";
    const duration = Number(doctor?.slotDurationMins) || 30;

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const slots = [];
    let current = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    while (current < endTime) {
      const hour = String(Math.floor(current / 60)).padStart(2, "0");
      const minute = String(current % 60).padStart(2, "0");
      slots.push(`${hour}:${minute}`);
      current += duration;
    }

    return slots;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.doctorId || !form.date || !form.time || !form.symptoms.trim()) {
      toast.error("Please complete the appointment booking and intake fields before submitting.");
      return;
    }

    try {
      await api.post("/appointments", {
        doctorId: form.doctorId,
        appointmentDate: form.date,
        slotStartTime: form.time,
         symptoms: form.symptoms.trim(),
         status: 'BOOKED'
      });
      toast.success("Appointment booked successfully.");
      setForm({
        doctorId: form.doctorId,
        date: "",
        time: "",
         symptoms: "",
         urgency: "NORMAL",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Appointment"
        subtitle="Choose a doctor, preferred date, and time for your next care visit."
        icon={CalendarPlus2}
        accent="text-cyan-300"
      />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : error ? (
        <EmptyState title="Provider availability is limited" description={error} icon={CalendarPlus2} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white">Select a doctor</h3>
            {doctors.length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} onSelect={() => setForm((current) => ({ ...current, doctorId: doctor.id }))} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">The doctor directory is not available for your role. Enter the doctor ID manually and continue booking.</p>
            )}
          </GlassCard>

          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormDatePicker label="Select date" name="date" value={form.date} onChange={(val) => setForm((current) => ({ ...current, date: val }))} />
              <FormSelect
                label="Preferred time"
                name="time"
                value={form.time}
                onChange={handleChange}
                options={(availableSlots.length > 0 ? availableSlots : (selectedDoctor ? buildTimeSlots(selectedDoctor) : ["09:00"])).map((slot) => ({ value: slot, label: slot }))}
              />
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <h3 className="text-lg font-semibold text-white">Medical Intake</h3>
                <div className="mt-4 space-y-4">
                     <FormTextarea label="Symptoms / Chief complaint" name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="Describe your symptoms" rows={4} required />
                     <FormSelect label="Urgency" name="urgency" value={form.urgency} onChange={handleChange} options={[{ value: 'NORMAL', label: 'Normal' }, { value: 'URGENT', label: 'Urgent' }, { value: 'EMERGENCY', label: 'Emergency' }]} />
                  </div>
              </div>
              <FormInput label="Doctor ID" name="doctorId" value={form.doctorId} onChange={handleChange} placeholder="Enter the doctor ID" />
              <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white transition hover:opacity-90">
                Book appointment
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
