import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";

export default function ProgressCard({ title, sub, badge, badgeVariant, amount, amountColor, target, pct, metaLeft, metaRight }) {
  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[#1a1a18]">{title}</p>
          <p className="text-xs text-[#5F5E5A] mt-0.5">{sub}</p>
        </div>
        <Badge variant={badgeVariant}>{badge}</Badge>
      </div>
      <p className={`text-[22px] font-bold mb-1 ${amountColor}`}>{amount}</p>
      <p className="text-xs text-[#5F5E5A] mb-3">{target}</p>
      <ProgressBar value={pct} />
      <div className="flex justify-between text-xs text-[#5F5E5A] mt-2">
        <span>{metaLeft}</span>
        <span>{metaRight}</span>
      </div>
    </Card>
  );
}
