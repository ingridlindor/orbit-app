'use server'
// Marca as funções deste arquivo como Server Actions —
// podem ser chamadas direto de formulários no client (<form action={createClientRecord}>)

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createClientRecord(formData: FormData) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) {
    throw new Error('Usuário não autenticado')
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const companyName = formData.get('company_name') as string

  const { error } = await supabase.from('clients').insert({
    user_id: userData.user.id,
    name,
    email,
    company_name: companyName || null,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}

export async function updateClientStatus(clientId: string, status: 'active' | 'inactive') {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) {
    throw new Error('Usuário não autenticado')
  }

  const { error } = await supabase
    .from('clients')
    .update({ status })
    .eq('id', clientId)
    .eq('user_id', userData.user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${clientId}`)
}

export async function startTimeEntry(projectId: string) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) {
    throw new Error('Usuário não autenticado')
  }

  // Só permite um timer ativo por vez (uma entrada com ended_at ainda nulo)
  const { data: activeEntries } = await supabase
    .from('time_entries')
    .select('id')
    .eq('user_id', userData.user.id)
    .is('ended_at', null)

  if (activeEntries && activeEntries.length > 0) {
    throw new Error('Já existe um timer em andamento. Pare-o antes de iniciar outro.')
  }

  const { error } = await supabase.from('time_entries').insert({
    user_id: userData.user.id,
    project_id: projectId,
    started_at: new Date().toISOString(),
    ended_at: null,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
}

export async function stopTimeEntry(entryId: string) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) {
    throw new Error('Usuário não autenticado')
  }

  const { error } = await supabase
    .from('time_entries')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', entryId)
    .eq('user_id', userData.user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
}

export async function createProjectRecord(formData: FormData) {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) {
    throw new Error('Usuário não autenticado')
  }

  const name = formData.get('name') as string
  const clientId = formData.get('client_id') as string
  const hourlyRateRaw = formData.get('hourly_rate') as string

  const { error } = await supabase.from('projects').insert({
    user_id: userData.user.id,
    client_id: clientId,
    name,
    hourly_rate: hourlyRateRaw ? Number(hourlyRateRaw) : null,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}