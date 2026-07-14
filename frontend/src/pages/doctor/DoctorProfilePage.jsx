import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import FormInput from "../../components/FormInput";
import FormTextarea from "../../components/FormTextarea";

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    experience: "",
    consultationFee: "",
    phone: "",
    email: "",
    bio: "",
    googleCalendarConnected: false,
  });

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data } = await api.get("/doctors/profile");
      const doctor = data.data || {};
      setProfile({
        name: doctor.user?.name || "",
        specialization: doctor.specialization || "",
        experience: doctor.experience ? String(doctor.experience) : "",
        consultationFee: doctor.consultationFee ? String(doctor.consultationFee) : "",
        phone: doctor.user?.phone || "",
        email: doctor.user?.email || "",
        bio: doctor.bio || "",
        googleCalendarConnected: !!doctor.googleCalendarConnected,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load profile.");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.put("/doctors/profile", {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        specialization: profile.specialization,
        experience: profile.experience,
        consultationFee: Number(profile.consultationFee) || 0,
      });
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update profile.");
    }
  }

  async function handleConnect() {
    try {
      const res = await api.get('/doctors/google/connect');
      const url = res.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error('Unable to get connect URL');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to start Google connect.');
    }
  }

  async function handleDisconnect() {
    try {
      await api.post('/doctors/google/disconnect');
      setProfile((p) => ({ ...p, googleCalendarConnected: false }));
      toast.success('Google Calendar disconnected');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to disconnect.');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Profile" subtitle="Manage professional details and contact information." icon={Stethoscope} accent="text-fuchsia-300" />

      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Name" name="name" value={profile.name} onChange={handleChange} />
            <FormInput label="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Experience" name="experience" value={profile.experience} onChange={handleChange} />
            <FormInput label="Consultation fee" name="consultationFee" value={profile.consultationFee} onChange={handleChange} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
            <FormInput label="Email" name="email" value={profile.email} onChange={handleChange} />
          </div>
          <FormTextarea label="Professional bio" name="bio" value={profile.bio} onChange={handleChange} rows={5} />
          <div className="grid gap-4 md:grid-cols-2">
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 font-medium text-white transition hover:opacity-90">
              Save profile
            </button>

            {profile.googleCalendarConnected ? (
              <button type="button" onClick={handleDisconnect} className="w-full rounded-2xl border border-slate-700 bg-transparent px-4 py-3 font-medium text-white">
                Disconnect Google Calendar
              </button>
            ) : (
              <button type="button" onClick={handleConnect} className="w-full rounded-2xl border border-slate-700 bg-transparent px-4 py-3 font-medium text-white">
                Connect Google Calendar
              </button>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
