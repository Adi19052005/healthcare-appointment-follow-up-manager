import { useEffect, useState } from "react";
import { UserCircle2, LockKeyhole, Phone, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import ProfileCard from "../../components/ProfileCard";
import FormInput from "../../components/FormInput";
import FormTextarea from "../../components/FormTextarea";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    address: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    void loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data } = await api.get("/patients/profile");
      const patient = data.data || {};
      setProfile((current) => ({
        ...current,
        name: patient.user?.name || patient.name || current.name,
        email: patient.user?.email || patient.email || current.email,
        phone: patient.user?.phone || patient.phone || current.phone,
        emergencyContact: patient.emergencyContact || current.emergencyContact,
        address: patient.address || current.address,
      }));
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

    if (profile.password || profile.confirmPassword || profile.currentPassword) {
      if (!profile.currentPassword || !profile.password || profile.password !== profile.confirmPassword) {
        toast.error("Please provide your current password and matching new password.");
        return;
      }
    }

    try {
      await api.put("/patients/profile", {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        emergencyContact: profile.emergencyContact,
        address: profile.address,
      });

      if (profile.password) {
        await api.put("/auth/change-password", {
          currentPassword: profile.currentPassword,
          newPassword: profile.password,
        });
      }

      toast.success("Profile updated.");
      setProfile((current) => ({ ...current, currentPassword: "", password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update profile.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" subtitle="Maintain your personal and emergency contact details." icon={UserCircle2} accent="text-cyan-300" />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput label="Full name" name="name" value={profile.name} onChange={handleChange} />
              <FormInput label="Email" name="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormInput label="Phone" name="phone" value={profile.phone} onChange={handleChange} />
              <FormInput label="Emergency contact" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} />
            </div>
            <FormTextarea label="Address" name="address" value={profile.address} onChange={handleChange} rows={4} />
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-medium text-white transition hover:opacity-90">
              Save profile
            </button>
          </form>
        </GlassCard>

        <div className="space-y-4">
          <ProfileCard title="Security" accent="border-cyan-400/20">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <LockKeyhole className="text-cyan-300" size={18} />
              <div>
                <p className="text-sm text-white">Change password</p>
                <p className="text-sm text-slate-400">Use a strong, unique password.</p>
              </div>
            </div>
            <FormInput label="Current password" name="currentPassword" type="password" value={profile.currentPassword} onChange={handleChange} />
            <FormInput label="New password" name="password" type="password" value={profile.password} onChange={handleChange} />
            <FormInput label="Confirm password" name="confirmPassword" type="password" value={profile.confirmPassword} onChange={handleChange} />
          </ProfileCard>

          <ProfileCard title="Contact & Emergency" accent="border-cyan-400/20">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <Phone className="text-cyan-300" size={18} />
              <div>
                <p className="text-sm text-white">Primary contact</p>
                <p className="text-sm text-slate-400">{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <ShieldAlert className="text-cyan-300" size={18} />
              <div>
                <p className="text-sm text-white">Emergency contact</p>
                <p className="text-sm text-slate-400">{profile.emergencyContact}</p>
              </div>
            </div>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
}
