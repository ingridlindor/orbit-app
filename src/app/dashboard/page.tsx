// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { WeeklyHoursCard } from "@/components/ui/dashboard/WeeklyHoursCard";
import { TimerCard } from "@/components/ui/dashboard/TimerCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // início da semana (segunda-feira, 00:00 local)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const { data: timeEntries, error } = await supabase
    .from("time_entries")
    .select("started_at, ended_at, description, project_id")
    .eq("user_id", user?.id)
    .gte("started_at", monday.toISOString())
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch time entries:", error);
  }

  // separa a entrada em andamento (se existir) das já concluídas
  const activeEntry = timeEntries?.find((e) => e.ended_at === null);
  const completedEntries = timeEntries?.filter((e) => e.ended_at !== null) ?? [];

  // agrupa horas concluídas por dia da semana
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hoursByDay: Record<string, number> = Object.fromEntries(
    daysOfWeek.map((d) => [d, 0])
  );

  completedEntries.forEach((entry) => {
    const start = new Date(entry.started_at);
    const end = new Date(entry.ended_at!);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    const entryDayIndex = start.getDay();
    const dayLabel = daysOfWeek[entryDayIndex === 0 ? 6 : entryDayIndex - 1];
    hoursByDay[dayLabel] += durationHours;
  });

  const weeklyData = daysOfWeek.map((day) => ({
    day,
    hours: Math.round(hoursByDay[day] * 10) / 10,
  }));

  const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div>
      <h1 className="font-display text-2xl text-white">Good afternoon, Ingrid</h1>
      <p className="text-white/60 mt-1 mb-6">
        Here&apos;s where your business stands today,{" "}
        {now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </p>

      <div className="flex gap-5">
        {activeEntry && (
          <TimerCard
            client="TrustNet Co."
            task={activeEntry.description ?? "Untitled task"}
            elapsedTime={getElapsedTime(activeEntry.started_at)}
            progress={70}
          />
        )}

        <WeeklyHoursCard
          data={weeklyData}
          totalLabel={`${totalHours.toFixed(1)}h`}
          trend="↑ 8% vs last week"
        />
      </div>
    </div>
  );
}

function getElapsedTime(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}