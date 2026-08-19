// app/dashboard/layout.tsx
"use client";
// Precisa ser Client Component porque usa usePathname() (hook do React
// que depende do estado do navegador/rota) e SidebarProvider provavelmente
// usa Context/estado interno (ex: abrir/fechar sidebar)

import {
  SidebarProvider,   // Contexto que gerencia o estado da sidebar (aberta/fechada, colapsada, etc.)
  Sidebar,           // Container visual da barra lateral em si
  SidebarContent,    // Área de conteúdo rolável dentro da sidebar
  SidebarHeader,     // Topo da sidebar (aqui usado pro logo)
  SidebarFooter,     // Rodapé da sidebar (aqui usado pro perfil do usuário)
  SidebarGroup,      // Agrupa itens de menu relacionados (ex: "Main" vs "Workspace")
  SidebarGroupLabel, // Título/label de um grupo de menu
  SidebarMenu,       // Lista de itens de menu
  SidebarMenuItem,   // Um item individual da lista (wrapper)
  SidebarMenuButton, // O botão/link clicável dentro do item
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
} from "lucide-react"; // Ícones SVG prontos

// Array de configuração para os links principais da sidebar.
// Definir como array de objetos (em vez de escrever cada <SidebarMenuItem> manualmente)
// facilita adicionar/remover itens no futuro e permite fazer .map() no JSX
const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/time-tracking", label: "Time Tracking", icon: Clock },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
];

// Segundo grupo de navegação, separado visualmente do principal
// (aparece embaixo, com o label "Workspace")
const workspaceNav = [
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// Este layout envolve TODAS as páginas dentro de app/dashboard/*
// (o Next.js aplica layouts automaticamente aos filhos da mesma pasta).
// Por isso a Sidebar não precisa ser reimportada em cada page.tsx do dashboard —
// ela já vive aqui, e cada página individual só precisa focar no próprio conteúdo
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Hook do Next.js que retorna a URL atual (ex: "/dashboard/invoices").
  // Usado para saber qual item do menu deve ficar marcado como "ativo"
  const pathname = usePathname();

  return (
    // Provider que dá contexto de sidebar para os componentes filhos
    // (necessário para Sidebar, SidebarContent, etc. funcionarem)
    <SidebarProvider>
      <Sidebar className="bg-deep-space border-r border-white/[0.06]">
        {/* Cabeçalho da sidebar: só o logo por enquanto */}
        <SidebarHeader className="px-10 py-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/orbit_logo_vectorized_white.svg"
              alt="Orbit Logo"
              width={28}
              height={28}
              className="h-13 w-auto" // Nota: h-13 não é uma escala padrão do Tailwind
              // (as escalas padrão pulam de h-12 pra h-14) — verificar se está
              // definida como valor customizado no tailwind.config, senão
              // pode estar sendo ignorada silenciosamente
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          {/* Grupo principal de navegação */}
          <SidebarGroup>
            <SidebarMenu>
              {/* Itera sobre mainNav e gera um item de menu para cada entrada.
                  Desestruturar "icon: Icon" renomeia a propriedade para poder
                  usá-la como componente JSX (<Icon />), já que JSX exige que
                  nomes de componentes comecem com letra maiúscula */}
              {mainNav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    // Compara a rota atual com o href do item para saber
                    // se deve aplicar o estilo "ativo"
                    isActive={pathname === href}
                    className="text-white/70 gap-3 transition-colors hover:bg-white/5 hover:text-white data-[active=true]:bg-signal-amber/10 data-[active=true]:text-signal-amber"
                    // "render" prop: em vez de renderizar um <button> puro,
                    // esse componente aceita um elemento customizado (aqui, o <Link>)
                    // para que a navegação funcione como um link real do Next.js
                    // (client-side navigation), mantendo o estilo do botão
                    render={<Link href={href} />}
                  >
                    <Icon className="size-4" />
                    {label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {/* Segundo grupo, com label "Workspace" acima dos itens */}
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-wider px-3">
              Workspace
            </SidebarGroupLabel>
            <SidebarMenu>
              {/* Mesmo padrão de .map() do grupo principal, reaproveitando
                  a mesma estrutura de SidebarMenuItem/SidebarMenuButton */}
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

        {/* Rodapé fixo da sidebar com informações do usuário logado.
            Por enquanto "IN" e "Ingrid" estão hardcoded — futuramente
            provavelmente virão de supabase.auth.getUser() ou da tabela profiles */}
        <SidebarFooter className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            {/* Avatar "fake" feito com iniciais dentro de um círculo colorido,
                já que ainda não há upload de foto de perfil */}
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

      {/* Área principal onde o conteúdo de cada página do dashboard é renderizado.
          "flex-1" faz essa área ocupar todo o espaço restante ao lado da sidebar */}
      <main className="flex-1 bg-deep-space">{children}</main>
    </SidebarProvider>
  );
}