import Card from "@/components/ui/Card";

export default function SummaryCard({ label, value, sub, iconClass, iconBg, iconColor }) {
  return (
    <Card hover className="p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}>
        <i className={`ti ${iconClass} text-[19px] ${iconColor}`} aria-hidden="true" />
      </div>
      <p className="text-[11.5px] text-[#5F5E5A] mb-1">{label}</p>
      <p className="text-xl font-bold text-[#1a1a18] leading-none">{value}</p>
      {sub && <p className="text-[11px] text-[#888780] mt-1">{sub}</p>}
    </Card>
  );
}
