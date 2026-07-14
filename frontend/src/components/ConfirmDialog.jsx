export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm text-slate-400">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-2xl bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/30">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
