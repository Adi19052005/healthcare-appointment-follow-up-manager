import Badge from './ui/Badge';

export default function StatusBadge({ status, tone = "default" }) {
  const map = {
    default: "bg-slate-700/60 text-slate-200",
    success: "bg-emerald-500/20 text-emerald-300",
    warning: "bg-amber-500/20 text-amber-300",
    danger: "bg-rose-500/20 text-rose-300",
    info: "bg-cyan-500/20 text-cyan-300",
    purple: "bg-fuchsia-500/20 text-fuchsia-300",
  };

  return (
    <Badge className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${map[tone] || map.default}`}>
      {status}
    </Badge>
  );
}
