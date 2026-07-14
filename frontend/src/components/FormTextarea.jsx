import { forwardRef } from "react";

const FormTextarea = forwardRef(function FormTextarea(
  { label, value, onChange, placeholder, name, rows = 4, className = "", error, ...props },
  ref
) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-2 block">{label}</span>
      <textarea
        {...props}
        ref={ref}
        aria-invalid={error ? true : undefined}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 ${error ? 'border-rose-400' : ''} ${className}`}
      />
      {error ? <div className="mt-1 text-sm text-rose-400">{error}</div> : null}
    </label>
  );
});

export default FormTextarea;
