// app/dashboard/layout.tsx
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  FileText,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/time-tracking", label: "Time Tracking", icon: Clock },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
];

const workspaceNav = [
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar className="bg-deep-space border-r border-white/[0.06]">
        <SidebarHeader className="px-10 py-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/orbit_logo_vectorized_white.svg"
              alt="Orbit Logo"
              width={28}
              height={28}
              className="h-13 w-auto"
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarMenu>
              {mainNav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    className="text-white/70 gap-3 transition-colors hover:bg-white/5 hover:text-white data-[active=true]:bg-signal-amber/10 data-[active=true]:text-signal-amber"
                    render={<Link href={href} />}
                  >
                    <Icon className="size-4" />
                    {label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-wider px-3">
              Workspace
            </SidebarGroupLabel>
            <SidebarMenu>
              {workspaceNav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={pathname === href}
                    className="text-white/70 gap-3 transition-colors hover:bg-white/5 hover:text-white data-[active=true]:bg-signal-amber/10 data-[active=true]:text-signal-amber"
                    render={<Link href={href} />}
                  >
                    <Icon className="size-4" />
                    {label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-orbit-blue flex items-center justify-center text-xs font-bold text-white shrink-0">
              IN
            </div>
            <div>
              <p className="text-sm text-white font-medium leading-none">Ingrid</p>
              <p className="text-xs text-white/50 mt-1">Freelancer</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 bg-deep-space">{children}</main>
    </SidebarProvider>
  );
}