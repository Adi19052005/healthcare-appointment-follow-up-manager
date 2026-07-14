import Card from './ui/Card';

export default function StatCard({ title, value, detail, icon: Icon, accent = "text-cyan-300" }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{value}</h3>
          {detail ? <p className="mt-1 text-sm text-slate-400">{detail}</p> : null}
        </div>
        {Icon ? <Icon className={accent} size={22} /> : null}
      </div>
    </Card>
  );
}
