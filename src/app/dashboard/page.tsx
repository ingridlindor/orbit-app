// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { WeeklyHoursCard } from "@/components/ui/dashboard/WeeklyHoursCard";
import { TimerCard } from "@/components/ui/dashboard/TimerCard";

// Server Component assíncrono — roda no servidor a cada request,
// busca os dados direto do Supabase antes de renderizar (sem precisar
// de useEffect/loading state no client). Por isso não tem "use client" aqui
export default async function DashboardPage() {
  const supabase = await createClient();

  // Pega o usuário logado a partir da sessão (cookies).
  // Aqui já desestruturamos direto até "user", diferente da server action
  // que guardava em "userData" — jeito mais direto de acessar o mesmo dado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Cálculo do início da semana (segunda-feira, 00:00 no horário local) ---
  const now = new Date();

  // getDay() retorna 0 (domingo) a 6 (sábado)
  const dayOfWeek = now.getDay();

  // Queremos sempre voltar até a segunda-feira mais recente.
  // Se hoje é domingo (0), a segunda foi há 6 dias (-6).
  // Para qualquer outro dia, a diferença é 1 - dayOfWeek
  // (ex: hoje é quarta/3 -> 1 - 3 = -2, ou seja, "volte 2 dias")
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  // Clona a data atual e ajusta para a segunda-feira correspondente
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  // Zera horas/minutos/segundos/ms para ter exatamente 00:00:00.000
  // (início do dia), garantindo que a query pegue o dia inteiro de segunda
  monday.setHours(0, 0, 0, 0);

  // Busca todas as entradas de tempo do usuário logado que começaram
  // a partir de segunda-feira (>= monday), ordenadas da mais recente pra mais antiga
  const { data: timeEntries, error } = await supabase
    .from("time_entries")
    .select("started_at, ended_at, description, project_id")
    .eq("user_id", user?.id)
    .gte("started_at", monday.toISOString()) // gte = "greater than or equal"
    .order("started_at", { ascending: false });

  // Loga o erro no servidor mas não interrompe a renderização —
  // a página ainda tenta renderizar com timeEntries undefined/vazio
  if (error) {
    console.error("Failed to fetch time entries:", error);
  }

  // Uma entrada "em andamento" (o timer ainda rodando) é identificada
  // por ended_at === null (o usuário ainda não parou o cronômetro).
  // Assume-se que só existe UMA entrada ativa por vez (por isso .find, não .filter)
  const activeEntry = timeEntries?.find((e) => e.ended_at === null);

  // Todas as outras entradas (já finalizadas) — usadas para calcular o total de horas.
  // "?? []" garante um array vazio caso timeEntries seja undefined (ex: se deu erro acima)
  const completedEntries = timeEntries?.filter((e) => e.ended_at !== null) ?? [];

  // --- Agrupamento de horas por dia da semana ---
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Cria um objeto tipo { Mon: 0, Tue: 0, Wed: 0, ... } como acumulador inicial,
  // usando Object.fromEntries + map para não precisar escrever cada chave manualmente
  const hoursByDay: Record<string, number> = Object.fromEntries(
    daysOfWeek.map((d) => [d, 0])
  );

  completedEntries.forEach((entry) => {
    const start = new Date(entry.started_at);
    // "!" (non-null assertion) diz ao TypeScript "confie em mim, ended_at não é null aqui"
    // — seguro porque já filtramos completedEntries só com ended_at !== null acima
    const end = new Date(entry.ended_at!);

    // Diferença em milissegundos convertida para horas
    // (1000ms * 60s * 60min = 1 hora em ms)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    // getDay() do JS retorna 0=domingo...6=sábado, mas nosso array
    // daysOfWeek começa em "Mon" (índice 0). Por isso remapeamos:
    // domingo (0) vira índice 6 (último do array), e os demais dias
    // recuam 1 posição (ex: segunda/1 vira índice 0)
    const entryDayIndex = start.getDay();
    const dayLabel = daysOfWeek[entryDayIndex === 0 ? 6 : entryDayIndex - 1];

    // Acumula as horas dessa entrada no dia correspondente
    hoursByDay[dayLabel] += durationHours;
  });

  // Transforma o objeto acumulador de volta em um array de objetos
  // (formato que o componente de gráfico/card provavelmente espera),
  // arredondando para 1 casa decimal (Math.round(x*10)/10 é o truque
  // clássico pra arredondar com precisão de 1 dígito)
  const weeklyData = daysOfWeek.map((day) => ({
    day,
    hours: Math.round(hoursByDay[day] * 10) / 10,
  }));

  // Soma todas as horas da semana para exibir o total geral
  const totalHours = weeklyData.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div>
      <h1 className="font-display text-2xl text-white">Good afternoon, Ingrid</h1>
      <p className="text-white/60 mt-1 mb-6">
        Here&apos;s where your business stands today,{" "}
        {/* Formata a data atual como "Aug 18" (mês abreviado + dia) */}
        {now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </p>

      <div className="flex gap-5">
        {/* Renderiza o card do timer só se houver uma entrada em andamento.
            Renderização condicional simples via && */}
        {activeEntry && (
          <TimerCard
            client="TrustNet Co." // Nota: hardcoded — futuramente deve vir de um join com a tabela clients/projects
            task={activeEntry.description ?? "Untitled task"} // fallback caso a descrição esteja vazia
            elapsedTime={getElapsedTime(activeEntry.started_at)}
            progress={70} // Nota: também hardcoded — não calculado a partir de dados reais ainda
          />
        )}

        <WeeklyHoursCard
          data={weeklyData}
          totalLabel={`${totalHours.toFixed(1)}h`} // ex: "12.5h"
          trend="↑ 8% vs last week" // Nota: hardcoded — não é calculado comparando com a semana anterior ainda
        />
      </div>
    </div>
  );
}

// Função utilitária pura (sem I/O) que calcula há quanto tempo
// uma entrada de tempo está rodando, formatado como "HH:MM:SS"
function getElapsedTime(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();

  // Converte a diferença total em ms para horas, minutos e segundos "quebrados"
  // (não são horas/minutos/segundos absolutos, mas sim decompostos, tipo um cronômetro)
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  // Formata cada unidade com 2 dígitos (ex: 5 -> "05") e junta com ":"
  // resultando em algo como "01:23:45"
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}