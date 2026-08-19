"use client";
// Precisa ser Client Component porque usa useState (estado local)
// e handlers de clique (onClick) — interatividade que só existe no browser

import { useState } from "react";

interface TimerCardProps {
  client: string;
  task: string;
  elapsedTime: string; // formato "HH:MM:SS" — já vem formatado de fora
  // (calculado, por exemplo, pela função getElapsedTime() vista na DashboardPage)
  progress: number; // 0 a 100 (% do anel preenchido)
  onPause?: () => void; // Callback opcional — permite que o componente pai
  onStop?: () => void;  // saiba quando o usuário pausou/parou, sem o TimerCard
  // precisar conhecer a lógica de negócio (ex: chamar Supabase pra salvar)
}

export function TimerCard({
  client,
  task,
  elapsedTime,
  progress,
  onPause,
  onStop,
}: TimerCardProps) {
  // Estado LOCAL apenas para controlar o texto do botão (Pause <-> Resume)
  // e o visual. Importante notar: esse estado não pausa o cronômetro de fato
  // (o elapsedTime continua vindo como prop calculada por quem usa o componente) —
  // a pausa "real" (parar de contar tempo) precisa ser tratada via onPause
  // no componente pai
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    // Inverte o estado local (toggle) para atualizar o texto do botão
    setIsPaused(!isPaused);
    // "?.()" — optional chaining call: só executa onPause se ela foi passada
    // como prop; evita erro de "onPause is not a function" caso não seja fornecida
    onPause?.();
  };

  return (
    <div className="w-full max-w-sm bg-gradient-to-b from-[#12162E] to-[#0E1226] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">

      <div/>
      {/* Nota: essa div vazia não parece ter função visual (sem className,
          sem conteúdo) — provavelmente sobrou de alguma versão anterior
          do componente e pode ser removida com segurança */}

      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-1.5 text-signal-amber text-[11px] font-semibold tracking-wide">
          {/* Bolinha pulsante/indicadora de "gravando agora" */}
          <span className="size-1.5 rounded-full bg-signal-amber" />
          TRACKING NOW
        </div>
        <span className="text-[11px] text-white/40">{client}</span>
      </div>

      <div className="flex justify-center mb-4 relative">
        {/* O anel de progresso (TimerRing) é feito com conic-gradient puro em CSS,
            não com SVG — importante lembrar que essa técnica NÃO funciona
            no wkhtmltopdf (conforme já descoberto), então mockups em PDF
            desse componente precisam usar círculos SVG como alternativa */}
        <div
          className="size-[190px] rounded-full flex items-center justify-center"
          style={{
            // conic-gradient desenha uma "fatia" de cor a partir do centro.
            // progress vai de 0-100(%), e o círculo tem 360 graus,
            // então multiplicamos por 3.6 (360/100) para converter
            // porcentagem em graus. Do 0 até esse ângulo é amber (preenchido),
            // do ângulo até 360 é a cor de fundo (não preenchido)
            background: `conic-gradient(#F5A623 ${progress * 3.6}deg, rgba(255,255,255,0.06) ${progress * 3.6}deg 360deg)`,
          }}
        >
          {/* Círculo interno menor, com a mesma cor do fundo do card,
              criando o efeito visual de "anel" (círculo grande colorido
              com um buraco no meio mostrando o conteúdo) */}
          <div className="size-[150px] rounded-full bg-[#0E1226] flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold text-white">
              {elapsedTime}
            </span>
            <span className="text-[11px] text-white/50 mt-1 text-center px-4">
              {task}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2.5 relative">
        <button
          onClick={handlePause}
          className="flex-1 rounded-lg py-2.5 text-sm font-semibold bg-white/[0.06] text-white border border-white/10 hover:bg-white/10 transition-colors"
        >
          {/* Texto do botão muda conforme o estado local isPaused */}
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={onStop}
          // Chama onStop diretamente (sem handler intermediário),
          // já que não precisa de nenhuma lógica extra de estado local aqui
          className="flex-1 rounded-lg py-2.5 text-sm font-semibold bg-signal-amber text-deep-space hover:bg-signal-amber/90 transition-colors"
        >
          Stop & log
        </button>
      </div>
    </div>
  );
}