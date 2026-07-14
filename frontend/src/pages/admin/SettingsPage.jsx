import { Settings2, Bell, Mail, ShieldCheck, Palette } from "lucide-react";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import PageHeader from "../../components/PageHeader";
import GlassCard from "../../components/GlassCard";
import FormInput from "../../components/FormInput";
import FormTextarea from "../../components/FormTextarea";
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const schema = z.object({
    hospitalName: z.string().min(1).optional(),
    hospitalDescription: z.string().optional(),
    smtpHost: z.string().optional(),
    supportEmail: z.string().email().optional(),
  });

  const { register, handleSubmit, reset, watch } = useForm({ resolver: zodResolver(schema), defaultValues: { hospitalName: '', hospitalDescription: '', smtpHost: '', supportEmail: '' } });

  useEffect(() => {
    // load settings
    void (async () => {
      try {
        const { data } = await api.get('/admin/settings');
        reset({ hospitalName: data.data?.hospitalName || '', hospitalDescription: data.data?.hospitalDescription || '', smtpHost: data.data?.smtpHost || '', supportEmail: data.data?.supportEmail || '' });
      } catch (err) {
        // ignore
      }
    })();
  }, [reset]);

  async function onSubmit(values) {
    try {
      await api.put('/admin/settings', values);
      toast.success('Settings saved.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save settings.');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Configure hospital profile, notifications, theme, and security preferences." icon={Settings2} accent="text-amber-300" />

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white">Hospital profile</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormInput label="Hospital name" {...register('hospitalName')} />
            <FormTextarea label="Hospital description" {...register('hospitalDescription')} rows={4} />
            <button type="submit" className="rounded-2xl bg-amber-500/20 px-4 py-2 text-amber-300">Save profile</button>
          </form>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white">Notification settings</h3>
          <div className="mt-4 space-y-3">
            {["Appointment reminders", "Follow-up alerts", "Emergency escalation"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">
                <span>{item}</span>
                <Bell size={18} className="text-amber-300" />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white">Email settings</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormInput label="SMTP host" {...register('smtpHost')} />
            <FormInput label="Support email" {...register('supportEmail')} />
            <button type="submit" className="rounded-2xl bg-amber-500/20 px-4 py-2 text-amber-300">Save email</button>
          </form>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white">Theme and security</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Palette size={16} className="text-amber-300" /> Dark theme</span>
              <span className="text-white">Enabled</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">
              <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-300" /> MFA protection</span>
              <span className="text-white">Enabled</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Mail size={16} className="text-amber-300" /> Email notifications</span>
              <span className="text-white">On</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
