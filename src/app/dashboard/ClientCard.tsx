// components/dashboard/ClientCard.tsx
import Link from "next/link";

interface RecentProject {
  id: string;
  name: string;
  lastWorkedAt: string | null;
}

interface ClientCardProps {
  id: string;
  name: string;
  companyName?: string | null;
  recentProjects: RecentProject[];
  totalProjects: number;
}

export function ClientCard({
  id,
  name,
  companyName,
  recentProjects,
  totalProjects,
}: ClientCardProps) {
  return (
    <Link
      href={`/dashboard/clients/${id}`}
      className="block bg-[#10142A] border border-white/[0.06] rounded-2xl p-5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="size-9 rounded-full bg-orbit-blue/15 flex items-center justify-center text-sm font-bold text-orbit-blue">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-white text-sm">{name}</p>
          {companyName && <p className="text-[11px] text-white/40">{companyName}</p>}
        </div>
      </div>

      {recentProjects.length > 0 ? (
        <div className="space-y-2">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between text-xs bg-white/[0.03] rounded-lg px-3 py-2"
            >
              <span className="text-white/80">{project.name}</span>
              <span className="text-white/40">
                {project.lastWorkedAt
                  ? new Date(project.lastWorkedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "No activity yet"}
              </span>
            </div>
          ))}
          {totalProjects > recentProjects.length && (
            <p className="text-[11px] text-white/40 pt-1">
              +{totalProjects - recentProjects.length} more project
              {totalProjects - recentProjects.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-white/40">No projects yet</p>
      )}
    </Link>
  );
}