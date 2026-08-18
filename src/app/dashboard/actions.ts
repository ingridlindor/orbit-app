'use server'

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

  const { error } = await supabase.from('clients').insert({
    user_id: userData.user.id,
    name,
    email,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
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