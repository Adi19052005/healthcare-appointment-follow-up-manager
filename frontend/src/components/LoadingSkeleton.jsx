export default function LoadingSkeleton({ rows = 4, className = "h-20 rounded-2xl bg-white/10" }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className={`animate-pulse ${className}`} />
      ))}
    </div>
  );
}
