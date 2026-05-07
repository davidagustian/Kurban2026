export default function ProgressBar({ value = 0 }) {
  const clamped = Math.min(100, Math.max(0, value));

  const fillColor =
    clamped >= 100
      ? "bg-[#639922]"
      : clamped >= 50
      ? "bg-[#378ADD]"
      : "bg-[#E9A800]";

  return (
    <div className="h-2 bg-[#F1EFE8] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${fillColor}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
