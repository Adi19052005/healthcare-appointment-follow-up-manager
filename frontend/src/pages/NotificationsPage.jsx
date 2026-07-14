import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import GlassCard from '../components/GlassCard';
import { Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => { void load(); }, []);

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await api.get(`/notifications?page=${p}&limit=20`);
      if (p === 1) setNotifications(res.data.data || []);
      else setNotifications((cur) => [...cur, ...(res.data.data || [])]);
    } catch (err) {
      toast.error('Unable to load notifications');
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((cur) => cur.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      toast.error('Unable to mark read');
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((cur) => cur.filter((n) => n.id !== id));
    } catch (err) {
      toast.error('Unable to delete');
    }
  }

  async function markAll() {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications((cur) => cur.map((n) => ({ ...n, isRead: true })));
      toast.success('Marked all read');
    } catch (err) {
      toast.error('Unable to mark all');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle="Your recent in-app notifications" icon={Bell} />

      <GlassCard>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-slate-400">Showing {notifications.length} items</div>
          <div className="flex items-center gap-2">
            <button onClick={markAll} className="text-sm text-cyan-300">Mark all read</button>
            <button onClick={() => load(1)} className="text-sm text-slate-400">Refresh</button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {loading && <div className="text-slate-400">Loading...</div>}
          {!loading && notifications.length === 0 && <div className="text-slate-400">No notifications.</div>}
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start justify-between gap-4 p-3 rounded-md ${n.isRead ? 'bg-slate-800/60' : 'bg-slate-700/70'}`}>
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-slate-400">{n.message}</div>
                <div className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!n.isRead && <button onClick={() => markRead(n.id)} className="text-xs text-cyan-300">Mark</button>}
                <button onClick={() => remove(n.id)} className="text-xs text-rose-400">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 text-center">
          <button onClick={async () => { const next = page + 1; await load(next); setPage(next); }} className="text-sm text-slate-400">Load more</button>
        </div>
      </GlassCard>
    </div>
  );
}
