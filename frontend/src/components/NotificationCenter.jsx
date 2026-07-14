import { useEffect, useState, useRef } from "react";
import { Bell, X, Trash2 } from "lucide-react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Card from './ui/Card';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = useRef();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  // Poll unread count every 20s
  useEffect(() => {
    let mounted = true;
    async function fetchCount() {
      try {
        const res = await api.get('/notifications/unread-count');
        if (!mounted) return;
        const c = res.data?.data?.count ?? 0;
        // update badge without fetching full list
        setNotifications((cur) => cur.map((n) => n));
        // store unread in state by setting a dummy notification array length; we'll keep unreadCount derived
        // Instead: set a separate state? but we compute unreadCount from notifications; so fetch full small list if none loaded
        if (!open) {
          // load a small page to compute unread count if notifications empty
          if (notifications.length === 0) {
            const r = await api.get('/notifications?limit=5');
            setNotifications(r.data.data || []);
          }
        }
      } catch (err) {
        // ignore
      }
    }

    fetchCount();
    const id = setInterval(fetchCount, 20000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  async function loadNotifications() {
    setLoading(true);
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function markAll() {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications((cur) => cur.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to mark all read.');
    }
  }

  async function markRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((cur) => cur.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to mark read.");
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((cur) => cur.filter((n) => n.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete notification.");
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((s) => !s)} className="relative rounded-xl bg-white/5 p-3 hover:bg-white/10">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">{unreadCount}</span>
        )}
      </button>

      {open && (
        <Card className="absolute right-0 mt-2 w-96 p-3 shadow-lg">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <button onClick={() => setOpen(false)} className="p-1 text-slate-400 hover:text-white"><X size={16} /></button>
          </div>

          <div className="mt-2 flex items-center justify-between px-2">
            <div className="text-sm text-slate-400">{notifications.length} items</div>
            <div className="flex items-center gap-2">
              <button onClick={markAll} className="text-xs text-cyan-300">Mark all read</button>
              <button onClick={() => loadNotifications()} className="text-xs text-slate-400">Refresh</button>
            </div>
          </div>

          <div className="mt-2 px-2">
            <button onClick={() => {
              const base = user?.role === 'DOCTOR' ? '/doctor' : user?.role === 'ADMIN' ? '/admin' : '/patient';
              navigate(`${base}/notifications`);
              setOpen(false);
            }} className="w-full rounded-xl bg-white/5 py-2 text-sm text-slate-200">View all notifications</button>
          </div>

          <div className="mt-2 max-h-64 overflow-auto space-y-2">
            {loading ? (
              <div className="p-4 text-slate-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-slate-400">No notifications.</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`flex items-start justify-between gap-3 rounded-2xl p-3 ${n.isRead ? 'bg-slate-800/60' : 'bg-slate-700/70'}`}>
                  <div>
                    <div className="font-medium">{n.title}</div>
                    <div className="text-sm text-slate-400 mt-1">{n.message}</div>
                    <div className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {!n.isRead && <button onClick={() => markRead(n.id)} className="text-xs text-cyan-300">Mark</button>}
                    <button onClick={() => remove(n.id)} className="text-xs text-rose-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-2 flex justify-center">
            <button onClick={async () => {
              // load next page
              try {
                const next = (notifications.length / 20) + 1;
                const res = await api.get(`/notifications?page=${next}&limit=20`);
                setNotifications((cur) => [...cur, ...(res.data.data || [])]);
              } catch (err) {
                toast.error('Unable to load more.');
              }
            }} className="text-sm text-slate-400">Load more</button>
          </div>
        </Card>
      )}
    </div>
  );
}
