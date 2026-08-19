import { LucideIcon } from "lucide-react";
interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  value: string;
  label: string;
  trend: string;
  trendColor?: string;
}

export function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  value,
  label,
  trend,
  trendColor = "text-white/50",
}: StatCardProps) {
  return (
    <div className="flex-1 bg-[#10142A] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <div
          className="size-9 rounded-lg flex items-center justify-center mb-3.5"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="size-4" style={{ color: iconColor }} />
        </div>
        <p className="font-display text-2xl text-white">{value}</p>
        <p className="text-xs text-white/50 mt-1">{label}</p>
      </div>
      <p className={`text-[11px] font-semibold mt-3 ${trendColor}`}>{trend}</p>
    </div>
  );
}