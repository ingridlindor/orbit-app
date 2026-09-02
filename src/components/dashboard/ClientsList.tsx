"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { NewClientDialog } from "@/components/dashboard/NewClientDialog";

interface RecentProject {
  id: string;
  name: string;
  lastWorkedAt: string | null;
}

interface ClientListItem {
  id: string;
  name: string;
  company_name?: string | null;
  status: "active" | "inactive";
  recentProjects: RecentProject[];
  totalProjects: number;
  totalHours: number;
  revenue: number;
  mostRecentProjectId: string | null;
}

export function ClientsList({ clients }: { clients: ClientListItem[] }) {
  const [query, setQuery] = useState("");

  const filteredClients = clients.filter((client) => {
    const search = query.trim().toLowerCase();
    if (!search) return true;
    return (
      client.name.toLowerCase().includes(search) ||
      client.company_name?.toLowerCase().includes(search)
    );
  });

  if (clients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
        <p className="text-white/70">No clients yet</p>
        <p className="text-white/40 text-sm mt-1">
          Add your first client to start tracking projects and time.
        </p>
        <div className="mt-4 inline-block">
          <NewClientDialog />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative max-w-xs mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
        <Input
          placeholder="Search clients..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 pl-9 bg-[#10142A] border-white/[0.06] text-white placeholder:text-white/40 focus-visible:ring-orbit-blue/30 focus-visible:border-orbit-blue/40"
        />
      </div>

      {filteredClients.length === 0 ? (
        <p className="text-white/40 text-sm">No clients match &quot;{query}&quot;.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              id={client.id}
              name={client.name}
              companyName={client.company_name}
              recentProjects={client.recentProjects}
              totalProjects={client.totalProjects}
              totalHours={client.totalHours}
              revenue={client.revenue}
              status={client.status}
              mostRecentProjectId={client.mostRecentProjectId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
