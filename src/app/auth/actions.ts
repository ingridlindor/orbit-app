'use server'
// Diretiva do Next.js que marca TODAS as funções exportadas deste arquivo
// como Server Actions — ou seja, código que roda apenas no servidor,
// mas que pode ser chamado diretamente de um formulário/componente no cliente
// (ex: <form action={signup}>), sem precisar criar uma API route manualmente

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  // Versão "server" do cliente Supabase (usa cookies do servidor)
  const supabase = await createClient()

  // FormData vem diretamente do <form> submetido pelo usuário.
  // .get() sempre retorna FormDataEntryValue | null, então usamos
  // "as string" para dizer ao TypeScript que confiamos que são strings
  // (assumindo que os inputs do form têm name="email" e name="password")
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Cria o usuário no Supabase Auth.
  // emailRedirectTo define para onde o link de confirmação do e-mail vai apontar —
  // nesse caso, para a rota /auth/confirm (o route handler que verifica o token_hash)
  // NEXT_PUBLIC_SITE_URL precisa estar configurada no .env para isso funcionar
  // corretamente em produção (e não apontar para localhost, por exemplo)
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  // Se o Supabase retornar erro (ex: e-mail já cadastrado, senha fraca),
  // redireciona de volta para /signup carregando a mensagem de erro
  // como query param (encodeURIComponent evita quebrar a URL com
  // caracteres especiais tipo espaços, acentos, etc.)
  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  // Se deu tudo certo, o Supabase já disparou o e-mail de confirmação.
  // Redireciona o usuário para uma página avisando "verifique seu e-mail"
  redirect('/signup/check-email')
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Tenta autenticar com email + senha (diferente do signup, aqui não
  // há criação de conta, só verificação de credenciais existentes)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Credenciais inválidas -> volta pro login mostrando o erro
  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  // revalidatePath força o Next.js a invalidar o cache da rota '/'
  // (e do layout inteiro, por causa do segundo argumento 'layout').
  // Isso é importante porque componentes tipo a Sidebar ou o header
  // podem depender do estado de autenticação (ex: mostrar nome do usuário),
  // e sem isso o Next poderia servir uma versão em cache desatualizada
  revalidatePath('/', 'layout')

  // Login bem-sucedido -> manda pro dashboard
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()

  // Encerra a sessão do usuário no Supabase (invalida/remove os cookies de auth)
  await supabase.auth.signOut()

  // Mesma lógica do login: invalida o cache pra garantir que a UI
  // reflita imediatamente que o usuário não está mais autenticado
  revalidatePath('/', 'layout')

  // Manda de volta pro login
  redirect('/login')
}