import Badge from './ui/Badge';
import Card from './ui/Card';

export default function PatientCard({ patient, onSelect }) {
  return (
    <button onClick={() => onSelect?.(patient)} className="w-full text-left">
      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-white">{patient?.name || "Patient"}</h3>
            <p className="mt-1 text-sm text-slate-400">{patient?.email || "No email provided"}</p>
          </div>
          <Badge className="bg-fuchsia-500/10 text-fuchsia-300">View</Badge>
        </div>
      </Card>
    </button>
  );
}
