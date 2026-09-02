import { createClient } from "@/utils/supabase/server";
import { ClientsList } from "@/components/dashboard/ClientsList";
import { NewClientDialog } from "@/components/dashboard/NewClientDialog";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, company_name, status")
    .eq("user_id", user?.id);

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, client_id, hourly_rate")
    .eq("user_id", user?.id);

  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select("project_id, started_at, ended_at")
    .eq("user_id", user?.id)
    .order("started_at", { ascending: false });

  const lastWorkedByProject = new Map<string, string>();
  timeEntries?.forEach((entry) => {
    if (!lastWorkedByProject.has(entry.project_id)) {
      lastWorkedByProject.set(entry.project_id, entry.started_at);
    }
  });

  const totalHoursByProject = new Map<string, number>();
  timeEntries?.forEach((entry) => {
    if (!entry.ended_at) return; // ignora entrada em andamento (timer ainda rodando)
    const start = new Date(entry.started_at).getTime();
    const end = new Date(entry.ended_at).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    const current = totalHoursByProject.get(entry.project_id) ?? 0;
    totalHoursByProject.set(entry.project_id, current + hours);
  });

  const clientsWithProjects = (clients ?? []).map((client) => {
    const allClientProjects = (projects ?? []).filter((p) => p.client_id === client.id);

    const recentProjects = allClientProjects
      .map((p) => ({
        id: p.id,
        name: p.name,
        lastWorkedAt: lastWorkedByProject.get(p.id) ?? null,
      }))
      .sort((a, b) => {
        if (!a.lastWorkedAt) return 1;
        if (!b.lastWorkedAt) return -1;
        return new Date(b.lastWorkedAt).getTime() - new Date(a.lastWorkedAt).getTime();
      })
      .slice(0, 2);

    const totalHours = allClientProjects.reduce(
      (sum, p) => sum + (totalHoursByProject.get(p.id) ?? 0),
      0
    );

    const revenue = allClientProjects.reduce((sum, p) => {
      const hours = totalHoursByProject.get(p.id) ?? 0;
      const rate = p.hourly_rate ?? 0;
      return sum + hours * rate;
    }, 0);

    return {
      ...client,
      recentProjects,
      totalProjects: allClientProjects.length,
      totalHours,
      revenue,
      // Projeto mais recente do cliente, usado pro botão de "Start timer" rápido no card
      mostRecentProjectId: recentProjects[0]?.id ?? null,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-white">Clients</h1>
          <p className="text-white/60 mt-1">Manage your clients and recent projects</p>
        </div>
        <NewClientDialog />
      </div>

      <ClientsList clients={clientsWithProjects} />
    </div>
  );
}