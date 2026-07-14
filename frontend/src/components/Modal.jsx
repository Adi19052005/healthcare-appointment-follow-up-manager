export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
