export default function FormDatePicker({ label, value, onChange, name, className = "", error }) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-2 block">{label}</span>
      <input
        aria-invalid={error ? true : undefined}
        name={name}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 ${error ? 'border-rose-400' : ''} ${className}`}
      />
      {error ? <div className="mt-1 text-sm text-rose-400">{error}</div> : null}
    </label>
  );
}
