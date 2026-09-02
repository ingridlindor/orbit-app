// components/dashboard/ClientCard.tsx
import Link from "next/link";
import { Play } from "lucide-react";
import { startTimeEntry } from "@/app/dashboard/actions";

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
  totalHours: number;
  revenue: number;
  status: "active" | "inactive";
  mostRecentProjectId: string | null;
}

const statusStyles = {
  active: "bg-emerald-500/15 text-emerald-400",
  inactive: "bg-white/10 text-white/50",
};

const statusLabel = {
  active: "Active",
  inactive: "Inactive",
};

export function ClientCard({
  id,
  name,
  companyName,
  recentProjects,
  totalProjects,
  totalHours,
  revenue,
  status,
  mostRecentProjectId,
}: ClientCardProps) {
  return (
    <div className="bg-[#10142A] border border-white/[0.06] rounded-2xl p-5 transition-colors hover:border-white/20">
      <Link href={`/dashboard/clients/${id}`} className="block">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-9 rounded-full bg-orbit-blue/15 flex items-center justify-center text-sm font-bold text-orbit-blue">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-white text-sm">{name}</p>
            {companyName && <p className="text-[11px] text-white/40">{companyName}</p>}
          </div>
          <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
            {statusLabel[status]}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <p className="text-[11px] text-white/40">{totalHours.toFixed(1)}h logged</p>
          {revenue > 0 && (
            <>
              <span className="text-white/20">·</span>
              <p className="text-[11px] text-white/40">
                ${revenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </>
          )}
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

      {mostRecentProjectId && (
        <form action={startTimeEntry.bind(null, mostRecentProjectId)} className="mt-3 pt-3 border-t border-white/[0.06]">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Play className="size-3" />
            Start timer
          </button>
        </form>
      )}
    </div>
  );
}