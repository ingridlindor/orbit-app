import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ClientCard } from "@/components/dashboard/ClientCard";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, company_name")
    .eq("user_id", user?.id);

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, client_id")
    .eq("user_id", user?.id);

  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select("project_id, started_at")
    .eq("user_id", user?.id)
    .order("started_at", { ascending: false });

  const lastWorkedByProject = new Map<string, string>();
  timeEntries?.forEach((entry) => {
    if (!lastWorkedByProject.has(entry.project_id)) {
      lastWorkedByProject.set(entry.project_id, entry.started_at);
    }
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

    return {
      ...client,
      recentProjects,
      totalProjects: allClientProjects.length,
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-white">Clients</h1>
          <p className="text-white/60 mt-1">Manage your clients and recent projects</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="rounded-lg bg-orbit-blue/15 text-orbit-blue text-sm font-medium px-4 py-2 hover:bg-orbit-blue/25 transition-colors"
        >
          + New client
        </Link>
      </div>

      {clientsWithProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <p className="text-white/70">No clients yet</p>
          <p className="text-white/40 text-sm mt-1">
            Add your first client to start tracking projects and time.
          </p>
          <Link
            href="/dashboard/clients/new"
            className="inline-block mt-4 rounded-lg bg-orbit-blue/15 text-orbit-blue text-sm font-medium px-4 py-2 hover:bg-orbit-blue/25 transition-colors"
          >
            + New client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {clientsWithProjects.map((client) => (
            <ClientCard
              key={client.id}
              id={client.id}
              name={client.name}
              companyName={client.company_name}
              recentProjects={client.recentProjects}
              totalProjects={client.totalProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}