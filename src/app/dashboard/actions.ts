'use server'
// Marca as funções deste arquivo como Server Actions —
// podem ser chamadas direto de formulários no client (<form action={createClientRecord}>)

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createClientRecord(formData: FormData) {
  const supabase = await createClient()

  // Pega o usuário autenticado a partir da sessão atual (cookies).
  // Precisamos disso para saber a quem esse "client" (cliente do freelancer)
  // pertence, já que a tabela `clients` tem RLS baseado em user_id
  const { data: userData } = await supabase.auth.getUser()

  // Guarda de segurança: se por algum motivo não houver usuário logado
  // (sessão expirada, cookie ausente, etc.), interrompe a execução aqui
  // lançando um erro em vez de tentar inserir um registro "órfão"
  if (!userData?.user) {
    throw new Error('Usuário não autenticado')
  }

  // Extrai os campos do formulário (assume inputs com name="name" e name="email")
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Insere o novo cliente na tabela `clients`, associando ao user_id
  // do usuário logado (isso é o que o RLS vai usar para filtrar
  // quem pode ver/editar esse registro depois)
  const { error } = await supabase.from('clients').insert({
    user_id: userData.user.id,
    name,
    email,
  })

  // Se o insert falhar (ex: violação de constraint, RLS bloqueando, etc.),
  // propaga o erro. Como não há redirect aqui, esse erro provavelmente
  // deve ser tratado no client (ex: via try/catch ou error boundary)
  if (error) {
    throw new Error(error.message)
  }

  // Invalida o cache da rota /dashboard para que a lista de clientes
  // seja atualizada imediatamente após a criação, sem precisar de reload manual
  revalidatePath('/dashboard')
}

export async function createProjectRecord(formData: FormData) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) {
    throw new Error('Usuário não autenticado')
  }

  // Extrai os campos do formulário de criação de projeto
  const name = formData.get('name') as string

  // client_id vem como string do formulário (provavelmente de um <select>
  // listando os clientes já cadastrados), usado para linkar o projeto ao cliente
  const clientId = formData.get('client_id') as string

  // hourly_rate também vem como string do FormData (todo valor de form
  // input é string por padrão, mesmo que o input seja type="number")
  const hourlyRateRaw = formData.get('hourly_rate') as string

  const { error } = await supabase.from('projects').insert({
    user_id: userData.user.id,
    client_id: clientId,
    name,
    // Converte a string para number antes de salvar no banco
    // (coluna hourly_rate deve ser numeric/float no schema).
    // Se o campo vier vazio (string vazia é "falsy"), salva null
    // em vez de tentar converter "" para número (o que resultaria em NaN)
    hourly_rate: hourlyRateRaw ? Number(hourlyRateRaw) : null,
  })

  if (error) {
    throw new Error(error.message)
  }

  // Mesma lógica: garante que o dashboard mostre o novo projeto
  // imediatamente após a criação
  revalidatePath('/dashboard')
}