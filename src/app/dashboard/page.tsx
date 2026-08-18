import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/actions'
import { createClientRecord, createProjectRecord } from '@/app/dashboard/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    redirect('/login')
  }

  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 500, margin: '80px auto' }}>
      <h1>Dashboard</h1>
      <p>Logado como: {userData.user.email}</p>

      <form action={logout}>
        <button type="submit">Sair</button>
      </form>

      <hr style={{ margin: '32px 0' }} />

      <h2>Novo cliente</h2>
      <form action={createClientRecord}>
        <div>
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" type="text" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" />
        </div>
        <button type="submit">Adicionar cliente</button>
      </form>

      <h2>Meus clientes</h2>
      {clientsError && <p>Erro ao carregar clientes: {clientsError.message}</p>}
      {clients?.length === 0 && <p>Nenhum cliente cadastrado ainda.</p>}
      <ul>
        {clients?.map((client) => (
          <li key={client.id}>
            {client.name} {client.email && `— ${client.email}`}
          </li>
        ))}
      </ul>

      <hr style={{ margin: '32px 0' }} />

      <h2>Novo projeto</h2>
      {clients?.length === 0 ? (
        <p>Cadastre um cliente antes de criar um projeto.</p>
      ) : (
        <form action={createProjectRecord}>
          <div>
            <label htmlFor="project_name">Nome do projeto</label>
            <input id="project_name" name="name" type="text" required />
          </div>
          <div>
            <label htmlFor="client_id">Cliente</label>
            <select id="client_id" name="client_id" required>
              <option value="">Selecione um cliente</option>
              {clients?.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hourly_rate">Valor por hora (opcional)</label>
            <input id="hourly_rate" name="hourly_rate" type="number" step="0.01" />
          </div>
          <button type="submit">Adicionar projeto</button>
        </form>
      )}

      <h2>Meus projetos</h2>
      {projectsError && <p>Erro ao carregar projetos: {projectsError.message}</p>}
      {projects?.length === 0 && <p>Nenhum projeto cadastrado ainda.</p>}
      <ul>
        {projects?.map((project) => (
          <li key={project.id}>
            {project.name} — cliente: {project.clients?.name}
            {project.hourly_rate && ` — R$ ${project.hourly_rate}/h`}
          </li>
        ))}
      </ul>
    </div>
  )
}