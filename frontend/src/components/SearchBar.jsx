import Card from './ui/Card';

export default function SearchBar({ value, onChange, placeholder = "Search", className = "" }) {
  return (
    <Card className={`p-2 ${className}`}> 
      <label className="flex items-center gap-2 rounded-xl px-3 py-2">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          aria-label="Search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </label>
    </Card>
  );
}
