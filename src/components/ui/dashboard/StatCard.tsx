import { LucideIcon } from "lucide-react";
// LucideIcon é o TYPE de um componente de ícone da lib lucide-react
// (não é um ícone específico, é o "tipo" que qualquer ícone dessa lib tem)
// Isso permite tipar a prop "icon" para aceitar qualquer ícone da lucide,
// em vez de travar num ícone fixo

interface StatCardProps {
  icon: LucideIcon;      // Componente de ícone a ser renderizado (ex: Clock, FileText)
  iconColor: string;     // Cor do ícone (ex: "#F5A623") — vai direto pro style inline
  iconBg: string;        // Cor de fundo do "badge" atrás do ícone
  value: string;         // Valor principal em destaque (ex: "42.5h", "R$ 3.200")
  label: string;         // Legenda pequena abaixo do valor (ex: "Horas essa semana")
  trend: string;         // Texto de tendência (ex: "↑ 8% vs last week")
  trendColor?: string;   // Cor do texto de tendência — opcional, com valor padrão
}

// Componente genérico e reutilizável de "card de estatística" —
// pensado para ser usado várias vezes no dashboard com dados diferentes
// (horas trabalhadas, faturamento, projetos ativos, etc.)
export function StatCard({
  icon: Icon,
  // Desestruturação renomeando "icon" para "Icon" (letra maiúscula),
  // necessário porque JSX só trata como componente algo que comece
  // com maiúscula — se usássemos <icon />, o React trataria como
  // uma tag HTML literal chamada "icon", não como o componente
  iconColor,
  iconBg,
  value,
  label,
  trend,
  // Valor padrão aplicado via destructuring: se quem usa o componente
  // não passar trendColor, cai automaticamente em "text-white/50" (cinza neutro)
  trendColor = "text-white/50",
}: StatCardProps) {
  return (
    // flex-1 permite que múltiplos StatCards lado a lado dividam
    // o espaço disponível igualmente dentro de um container flex pai
    <div className="flex-1 bg-[#10142A] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between">
      <div>
        {/* "Badge" quadrado atrás do ícone, com cor de fundo customizável
            via prop (por isso usa style inline em vez de className —
            Tailwind não suporta cores arbitrárias dinâmicas via string
            interpolada de forma confiável) */}
        <div
          className="size-9 rounded-lg flex items-center justify-center mb-3.5"
          style={{ backgroundColor: iconBg }}
        >
          {/* Mesma lógica: cor do ícone vem como prop dinâmica,
              por isso via style em vez de classe Tailwind fixa */}
          <Icon className="size-4" style={{ color: iconColor }} />
        </div>
        <p className="font-display text-2xl text-white">{value}</p>
        <p className="text-xs text-white/50 mt-1">{label}</p>
      </div>

      {/* Template string para combinar uma classe fixa com a cor
          de tendência que vem como prop (ou o valor padrão definido acima) */}
      <p className={`text-[11px] font-semibold mt-3 ${trendColor}`}>{trend}</p>
    </div>
  );
}