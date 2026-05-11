export default function Badge({ children, variant = "indigo" }) {
  const variants = {
    indigo: "bg-indigo-50 text-indigo-700",
    amber:  "bg-amber-50 text-amber-700",
    green:  "bg-green-50 text-green-700",
    blue:   "bg-blue-50 text-blue-700",
    red:    "bg-red-50 text-red-600",
    slate:  "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${variants[variant] ?? variants.indigo}`}>
      {children}
    </span>
  );
}