export default function ProgressBar({ value = 0 }) {
  const clamped = Math.min(100, Math.max(0, value));
  const fillColor =
    clamped >= 100 ? "bg-green-500" :
    clamped >= 50  ? "bg-indigo-500" : "bg-amber-400";
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${fillColor}`}
        style={{ width: `${clamped}%` }} />
    </div>
  );
}