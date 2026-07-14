import Card from './ui/Card';

export default function ProfileCard({ title, children }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </Card>
  );
}
