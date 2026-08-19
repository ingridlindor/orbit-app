import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Este é um Route Handler do Next.js (App Router).
// Como o arquivo se chama route.ts dentro de app/.../confirm (ou similar),
// o Next expõe automaticamente um endpoint HTTP nesse caminho.
// A função GET aqui responde a requisições GET feitas para essa rota.
export async function GET(request: NextRequest) {
  // request.url é a URL completa (ex: https://seusite.com/auth/confirm?token_hash=abc&type=email&next=/dashboard)
  // Criamos um objeto URL para poder ler os query params facilmente
  const { searchParams } = new URL(request.url)

  // token_hash é o código que o Supabase envia por e-mail para confirmar
  // o cadastro (ou reset de senha, etc.) — vem como query param no link do e-mail
  const token_hash = searchParams.get('token_hash')

  // type indica qual ação está sendo confirmada (ex: 'signup', 'recovery', 'email_change')
  // O cast "as EmailOtpType | null" é necessário porque searchParams.get()
  // sempre retorna string | null, mas queremos que o TypeScript trate
  // esse valor como um dos tipos válidos aceitos pelo Supabase (EmailOtpType)
  const type = searchParams.get('type') as EmailOtpType | null

  // next é para onde o usuário deve ser redirecionado após confirmar com sucesso.
  // Se não vier na URL, usamos '/dashboard' como valor padrão (fallback)
  const next = searchParams.get('next') ?? '/dashboard'

  // Só tentamos verificar o OTP (One-Time Password / token) se os dois
  // parâmetros essenciais estiverem presentes na URL
  if (token_hash && type) {
    // createClient() aqui é a versão "server" do cliente Supabase
    // (usa cookies do servidor, diferente do client usado no browser)
    const supabase = await createClient()

    // verifyOtp valida o token_hash junto com o Supabase Auth.
    // Se o token for válido e ainda não tiver expirado, isso efetivamente
    // "loga" o usuário e cria a sessão dele (via cookies)
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    // Se não houve erro, a confirmação deu certo — redireciona o usuário
    // para a página de destino (ex: /dashboard).
    // Importante: redirect() do Next.js lança uma exceção internamente
    // para interromper a execução e fazer o redirect, então nada depois
    // dessa linha (dentro deste if) será executado
    if (!error) {
      redirect(next)
    }
  }

  // Se chegou até aqui, é porque:
  // 1) token_hash ou type estavam ausentes na URL, OU
  // 2) verifyOtp retornou erro (token inválido/expirado)
  // Em ambos os casos, mandamos o usuário de volta para o login
  // com uma mensagem de erro na query string, que a página de login
  // pode ler e exibir para o usuário
  redirect('/login?error=Link de confirmação inválido ou expirado')
}