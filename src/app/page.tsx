import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
// Field/FieldLabel/FieldGroup são componentes wrapper do shadcn/ui
// que padronizam espaçamento e estrutura de label+input (mais consistente
// que montar isso na mão com <div><label/><input/></div> em todo form)
import { Button } from "@/components/ui/button";
import { login } from "@/app/auth/actions";
import TimerRing from "@/components/ui/landing/TimerRing";
// Componente visual "assinatura" do Orbit — o anel SVG animado
// criado na fase de landing page, reaproveitado aqui como elemento decorativo

export default function Home() {
  // Esta é a rota raiz "/" — ou seja, a landing page E a tela de login
  // estão fundidas nesta mesma página (split-screen: TimerRing de um lado,
  // form de login do outro)
  return (
    // min-h-dvh (em vez de min-h-screen) evita o bug clássico de mobile
    // onde a barra de endereço do navegador "come" espaço e causa
    // scroll indesejado ou corte de conteúdo
    // overflow-x-hidden evita scroll horizontal acidental (ex: por causa
    // de elementos decorativos que ultrapassem a viewport)
    <div className="flex flex-col min-h-dvh bg-deep-space overflow-x-hidden">
      {/* Navbar só aparece em telas médias+ (hidden no mobile, block a partir de md).
          No mobile, o logo reaparece mais abaixo dentro do form (ver mais adiante) */}
      <nav className="hidden md:block border-b border-mist/10 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-4 py-4">
          <Image
            src="/orbit_logo_vectorized_white.svg"
            alt="Orbit Logo"
            width={640}
            height={400}
            // width/height acima são as dimensões "intrínsecas" da imagem
            // (usadas pelo Next para calcular proporção e evitar layout shift),
            // mas o tamanho visual real é controlado via className (h-13, h-15)
            className="h-13 w-auto md:h-15"
          />
          <Button className="h-9 md:h-12 px-3 md:px-6 text-sm md:text-base whitespace-nowrap">
            See how it works
          </Button>
        </div>
      </nav>

      {/* Container principal: empilha verticalmente no mobile (flex-col),
          vira lado a lado no desktop (md:flex-row). flex-1 faz essa área
          ocupar o espaço restante entre nav e footer */}
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center">
        <div className="flex w-full max-w-6xl items-center justify-center gap-8 md:gap-24 flex-col md:flex-row px-8 md:px-0">
          {/* Lado esquerdo (no desktop): o TimerRing decorativo.
              "order-2 md:order-1" faz ele aparecer DEPOIS do form no mobile
              (via ordem no DOM/flex), mas ANTES (à esquerda) no desktop —
              prioriza o form de login em telas pequenas.
              "hidden md:flex" esconde completamente no mobile (não faz
              sentido mostrar o anel decorativo numa tela pequena, só ocuparia espaço) */}
          <div className="order-2 md:order-1 hidden md:flex items-center justify-center">
            <TimerRing />
          </div>

          {/* Lado direito: form de login */}
          <div className="order-1 md:order-2 flex items-center justify-center px-1 py-1 w-full md:min-w-[24rem] md:w-auto">
            {/* min-w-[24rem] no desktop evita que o form "encolha" demais
                quando dividindo espaço com o TimerRing (padrão flex-1 + min-w
                mencionado nas notas do projeto para controlar layouts split) */}
            <div className="w-full max-w-sm">
              {/* Logo alternativo, exibido SÓ no mobile (md:hidden),
                  já que a nav com logo fica escondida em telas pequenas —
                  isso garante que o branding do Orbit apareça em algum lugar
                  independente do tamanho de tela */}
              <Image
                src="/orbit_logo_vectorized_white.svg"
                alt="Orbit Logo"
                width={640}
                height={400}
                className="h-20 w-auto md:h-19 mx-auto mb-6 md:hidden"
              />
              <h1 className="font-display text-2xl text-white mb-1 text-center md:text-left">
                Welcome to Orbit!
              </h1>
              <p className="font-body text-sm text-white/60 mb-8 text-center md:text-left">
                Sign in to continue on Orbit
              </p>

              {/* Mesmo padrão de Server Action usado na LoginPage simples:
                  form nativo com action={login}, sem necessidade de
                  JavaScript no client para lidar com submit */}
              <form action={login}>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="email" className="text-white/80">
                      E-mail
                    </FieldLabel>
                    <Input id="email" name="email" type="email" required placeholder="Your-email@email.com" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password" className="text-white/80">
                      password
                    </FieldLabel>
                    <Input id="password" name="password" type="password" required placeholder="••••••••" />
                  </Field>

                  <Button
                    type="submit"
                    // Aqui já usa as cores do design system (signal-amber),
                    // diferente das versões simples de Login/Signup vistas antes
                    className="mt-2 bg-signal-amber text-deep-space font-medium hover:bg-signal-amber/90"
                  >
                    Login
                  </Button>
                </FieldGroup>
              </form>

              {/* Links auxiliares abaixo do form: recuperar senha e criar conta */}
              <div className="flex justify-between mt-4 text-sm">
                <Link href="/forgot-password" className="text-white/50 hover:text-orbit-blue transition-colors">
                  forgot password?
                </Link>
                <Link href="/signup" className="text-white/50 hover:text-orbit-blue transition-colors">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer com shrink-0 pra garantir que ele nunca seja espremido
          pelo flex-1 do conteúdo principal — sempre mantém sua altura natural */}
      <footer className="border-t border-mist/10 py-4 md:py-8 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 md:px-8 font-mono text-xs text-mist gap-2 text-center">
          <p>© 2026 ORBIT</p>
          <p>built with next.js · supabase · claude</p>
        </div>
      </footer>
    </div>
  );
}