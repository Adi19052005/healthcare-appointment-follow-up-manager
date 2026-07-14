import { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
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

export default function PatientManagementPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const schema = z.object({
    name: z.string().min(1, 'Enter a name'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    bloodGroup: z.string().optional(),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', bloodGroup: '' }
  });

  useEffect(() => {
    void loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/admin/patients");
      setPatients(data.data || []);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to load patients.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function createPatient(values) {
    try {
      await api.post('/admin/patients', values);
      toast.success('Patient added.');
      reset();
      void loadPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to add patient.');
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => `${patient.user?.name || patient.name || ""} ${patient.user?.email || patient.email || ""}`.toLowerCase().includes(search.toLowerCase()));
  }, [patients, search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Management" subtitle="Search patient accounts and monitor core health metrics." icon={Users} accent="text-amber-300" />

      <GlassCard>
        <form onSubmit={handleSubmit(createPatient)} className="grid gap-4 md:grid-cols-2 mb-6">
          <FormInput label="Name" {...register('name')} placeholder="Patient name" error={errors.name?.message} />
          <FormInput label="Email" {...register('email')} placeholder="patient@example.com" error={errors.email?.message} />
          <FormInput label="Phone" {...register('phone')} placeholder="Phone number" error={errors.phone?.message} />
          <FormInput label="Blood group" {...register('bloodGroup')} placeholder="A+" error={errors.bloodGroup?.message} />
          <button type="submit" className="md:col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:opacity-90">Add patient</button>
        </form>
        <SearchBar value={search} onChange={setSearch} placeholder="Search patients" className="mb-4" />
        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : error ? (
          <EmptyState title="Unable to load patients" description={error} icon={Users} />
        ) : filteredPatients.length === 0 ? (
          <EmptyState title="No patients found" description="Try a different search term." icon={Users} />
        ) : (
          <DataTable headers={["Name", "Email", "Profile", "Status"]} rows={filteredPatients} renderRow={(patient) => (
            <>
              <td className="px-4 py-3 text-white">{patient.user?.name || patient.name || "Patient"}</td>
              <td className="px-4 py-3 text-slate-400">{patient.user?.email || patient.email || "N/A"}</td>
              <td className="px-4 py-3 text-slate-400">{patient.bloodGroup ? `Blood ${patient.bloodGroup}` : "Active"}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">Active</span>
              </td>
            </>
          )} />
        )}
      </GlassCard>
    </div>
  );
}
