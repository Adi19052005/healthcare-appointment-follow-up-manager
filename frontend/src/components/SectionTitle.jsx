import Card from './ui/Card';

export default function SectionTitle({ title, subtitle, boxed = false }) {
  const inner = (
    <div className="mb-4">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
    </div>
  );

  return boxed ? <Card className="p-3">{inner}</Card> : inner;
}
