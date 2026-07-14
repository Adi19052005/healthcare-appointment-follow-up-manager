import Card from './ui/Card';

export default function EmptyState({ title, description, icon: Icon }) {
  return (
    <Card className="border-dashed p-10 text-center">
      {Icon ? <Icon className="mx-auto text-slate-400" size={36} /> : null}
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </Card>
  );
}
