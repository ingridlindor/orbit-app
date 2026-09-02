import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { updateClientStatus } from "@/app/dashboard/actions";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email, company_name, status")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  // Cliente não existe, ou não pertence ao usuário logado (RLS/filtro acima)
  if (!client) {
    notFound();
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, hourly_rate")
    .eq("client_id", id)
    .eq("user_id", user?.id);

  const projectIds = (projects ?? []).map((p) => p.id);

  const { data: timeEntries } = projectIds.length
    ? await supabase
        .from("time_entries")
        .select("project_id, started_at, ended_at")
        .in("project_id", projectIds)
    : { data: [] };

  const hoursByProject = new Map<string, number>();
  timeEntries?.forEach((entry) => {
    if (!entry.ended_at) return; // ignora timer em andamento
    const start = new Date(entry.started_at).getTime();
    const end = new Date(entry.ended_at).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    hoursByProject.set(entry.project_id, (hoursByProject.get(entry.project_id) ?? 0) + hours);
  });

  const projectsWithHours = (projects ?? []).map((p) => {
    const hours = hoursByProject.get(p.id) ?? 0;
    return {
      ...p,
      hours,
      revenue: hours * (p.hourly_rate ?? 0),
    };
  });

  const totalHours = projectsWithHours.reduce((sum, p) => sum + p.hours, 0);
  const totalRevenue = projectsWithHours.reduce((sum, p) => sum + p.revenue, 0);

  const nextStatus = client.status === "active" ? "inactive" : "active";

  return (
    <div>
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-white/50 text-sm hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        Back to clients
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-orbit-blue/15 flex items-center justify-center text-xl font-bold text-orbit-blue">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl text-white">{client.name}</h1>
            {client.company_name && <p className="text-white/50 text-sm">{client.company_name}</p>}
            {client.email && <p className="text-white/40 text-xs mt-0.5">{client.email}</p>}
          </div>
        </div>

        <form action={updateClientStatus.bind(null, client.id, nextStatus)}>
          <button
            type="submit"
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              client.status === "active"
                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                : "bg-white/10 text-white/50 hover:bg-white/20"
            }`}
          >
            {client.status === "active" ? "Active" : "Inactive"} · Mark as{" "}
            {nextStatus === "active" ? "Active" : "Inactive"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        <div className="rounded-2xl border border-white/[0.06] bg-[#10142A] p-5">
          <p className="text-white/40 text-xs">Total hours</p>
          <p className="font-display text-xl text-white mt-1">{totalHours.toFixed(1)}h</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#10142A] p-5">
          <p className="text-white/40 text-xs">Total revenue</p>
          <p className="font-display text-xl text-white mt-1">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <h2 className="font-display text-lg text-white mb-4">Projects</h2>
      {projectsWithHours.length === 0 ? (
        <p className="text-white/40 text-sm">No projects yet for this client.</p>
      ) : (
        <div className="space-y-2">
          {projectsWithHours.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between bg-[#10142A] border border-white/[0.06] rounded-xl px-4 py-3"
            >
              <span className="text-white text-sm">{project.name}</span>
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>{project.hours.toFixed(1)}h</span>
                {project.revenue > 0 && (
                  <span>
                    ${project.revenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
