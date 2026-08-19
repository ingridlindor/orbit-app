// components/dashboard/WeeklyHoursCard.tsx
interface DayHours {
  day: string;
  hours: number;
}

interface WeeklyHoursCardProps {
  data: DayHours[];
  totalLabel: string;
  trend: string;
}

export function WeeklyHoursCard({ data, totalLabel, trend }: WeeklyHoursCardProps) {
  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <div className="flex-1 bg-[#10142A] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="font-display text-2xl text-white">{totalLabel}</p>
          <p className="text-xs text-white/50 mt-1">Tracked this week</p>
        </div>
        <p className="text-[11px] font-semibold text-green-400">{trend}</p>
      </div>

      <div className="flex items-end justify-between gap-2 h-20">
        {data.map(({ day, hours }) => {
          const heightPct = maxHours > 0 ? (hours / maxHours) * 100 : 0;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full h-16 flex items-end">
                <div
                  className="w-full rounded-md bg-signal-amber/80 transition-all"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] text-white/40">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}