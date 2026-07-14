import { forwardRef } from "react";

const FormSelect = forwardRef(function FormSelect(
  { label, value, onChange, options = [], name, className = "", error, ...props },
  ref
) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-2 block">{label}</span>
      <select
        {...props}
        ref={ref}
        aria-invalid={error ? true : undefined}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 ${error ? 'border-rose-400' : ''} ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900">
            {option.label}
          </option>
        ))}
      </select>
      {error ? <div className="mt-1 text-sm text-rose-400">{error}</div> : null}
    </label>
  );
});

export default FormSelect;
