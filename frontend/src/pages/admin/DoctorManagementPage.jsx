import { useEffect, useMemo, useState } from "react";
import { Stethoscope, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../../components/SearchBar";
import GlassCard from "../../components/GlassCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import DataTable from "../../components/DataTable";
import FormInput from "../../components/FormInput";

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const schema = z.object({
    name: z.string().min(1, 'Enter a name'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    password: z.string().optional(),
    specialization: z.string().optional(),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', password: '', specialization: '' }
  });

  useEffect(() => {
    void loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/admin/doctors");
      setDoctors(data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load doctors.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function createDoctor(values) {
    try {
      await api.post("/admin/doctors", {
        ...values,
        password: values.password || "Password123!",
      });
      toast.success("Doctor added.");
      reset();
      void loadDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to add doctor.");
    }
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => `${doctor.user?.name || doctor.name || ""} ${doctor.user?.email || doctor.email || ""} ${doctor.specialization || ""}`.toLowerCase().includes(search.toLowerCase()));
  }, [doctors, search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Doctor Management" subtitle="Search, review, and manage physician accounts." icon={Stethoscope} accent="text-amber-300" />

      <GlassCard>
        <form onSubmit={handleSubmit(createDoctor)} className="grid gap-4 md:grid-cols-2">
          <FormInput label="Name" {...register('name')} placeholder="Dr. Name" error={errors.name?.message} />
          <FormInput label="Email" {...register('email')} placeholder="doctor@example.com" error={errors.email?.message} />
          <FormInput label="Phone" {...register('phone')} placeholder="Phone number" error={errors.phone?.message} />
          <FormInput label="Password" {...register('password')} type="password" placeholder="Temporary password" error={errors.password?.message} />
          <FormInput label="Specialization" {...register('specialization')} placeholder="Cardiology" error={errors.specialization?.message} />
          <button type="submit" className="md:col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-medium text-white transition hover:opacity-90">
            <PlusCircle size={18} /> Add doctor
          </button>
        </form>
      </GlassCard>

      <GlassCard>
        <SearchBar value={search} onChange={setSearch} placeholder="Search doctors" className="mb-4" />
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : error ? (
          <EmptyState title="Unable to load doctors" description={error} icon={Stethoscope} />
        ) : filteredDoctors.length === 0 ? (
          <EmptyState title="No doctors found" description="Try a different search term." icon={Stethoscope} />
        ) : (
          <DataTable headers={["Name", "Email", "Specialization", "Status"]} rows={filteredDoctors} renderRow={(doctor) => (
            <>
              <td className="px-4 py-3 text-white">{doctor.user?.name || doctor.name || "Doctor"}</td>
              <td className="px-4 py-3 text-slate-400">{doctor.user?.email || doctor.email || "N/A"}</td>
              <td className="px-4 py-3 text-slate-400">{doctor.specialization || "General"}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">Active</span>
              </td>
            </>
          )} />
        )}
      </GlassCard>
    </div>
  );
}
