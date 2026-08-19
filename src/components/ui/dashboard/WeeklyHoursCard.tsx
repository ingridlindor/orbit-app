// components/dashboard/WeeklyHoursCard.tsx
interface DayHours {
  day: string;   // rótulo do dia (ex: "Mon", "Tue"...)
  hours: number; // total de horas trabalhadas naquele dia
}

interface WeeklyHoursCardProps {
  data: DayHours[]; // array com um item por dia da semana (ex: o "weeklyData"
  // calculado na DashboardPage a partir das time_entries do Supabase)
  totalLabel: string; // total já formatado como string (ex: "12.5h")
  trend: string;       // texto de tendência (ex: "↑ 8% vs last week")
}

// Componente "puro" — só recebe dados prontos via props e renderiza,
// sem buscar nada do Supabase nem manter estado próprio (Server Component
// friendly, embora aqui não tenha "use client" nem "use server" porque
// não precisa de nenhum dos dois — funciona em ambos os contextos)
export function WeeklyHoursCard({ data, totalLabel, trend }: WeeklyHoursCardProps) {
  // Encontra o maior valor de horas entre os dias, para usar como
  // referência de 100% na altura das barras do gráfico
  // (spread "...data.map(...)" transforma o array de números em
  // argumentos separados pro Math.max, já que Math.max não aceita array direto)
  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <div className="flex-1 bg-[#10142A] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="font-display text-2xl text-white">{totalLabel}</p>
          <p className="text-xs text-white/50 mt-1">Tracked this week</p>
        </div>
        {/* Nota: cor fixa "text-green-400" aqui, mesmo que a trend seja negativa
            (diferente do StatCard, que recebe trendColor customizável).
            Se um dia a tendência puder ser negativa (↓), essa cor verde
            fixa passaria a informação errada visualmente */}
        <p className="text-[11px] font-semibold text-green-400">{trend}</p>
      </div>

      {/* Container do "gráfico de barras" simples feito com divs
          (sem lib de charts) — h-20 define a altura total disponível */}
      <div className="flex items-end justify-between gap-2 h-20">
        {data.map(({ day, hours }) => {
          // Calcula a altura da barra como % relativa ao dia com mais horas.
          // Proteção contra divisão por zero: se maxHours for 0
          // (nenhuma hora registrada na semana toda), heightPct vira 0
          // em vez de NaN (0/0)
          const heightPct = maxHours > 0 ? (hours / maxHours) * 100 : 0;
          return (
            // key={day} assume que os dias são únicos no array (o que é
            // seguro aqui, já que representam Mon-Sun sem repetição)
            <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
              {/* Wrapper com altura fixa (h-16) e items-end: a barra "cresce"
                  de baixo para cima dentro desse espaço fixo, como um gráfico real */}
              <div className="w-full h-16 flex items-end">
                <div
                  className="w-full rounded-md bg-signal-amber/80 transition-all"
                  // Altura dinâmica via style inline, já que é um valor
                  // calculado em tempo de execução (Tailwind não suporta
                  // porcentagens arbitrárias dinâmicas via className)
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] text-white/40">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}