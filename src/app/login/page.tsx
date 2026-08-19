import { login } from '@/app/auth/actions'
// Importa a Server Action "login" definida em app/auth/actions.ts
// (a mesma que faz supabase.auth.signInWithPassword)

export default function LoginPage() {
  // Componente de página simples, sem "use client" — como não há nenhum
  // estado ou interatividade no lado do cliente (só um form nativo),
  // ele pode continuar sendo um Server Component

  return (
    // Estilo inline básico só pra centralizar o form na tela
    // (versão simples, ainda sem o design system / split-screen do Orbit)
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h1>Entrar</h1>

      {/* A prop "action" de um <form> aceita diretamente uma Server Action.
          Quando o usuário submete o form, o Next.js empacota os campos
          em um FormData e chama login(formData) no servidor —
          não precisa de onSubmit, fetch, nem JavaScript no client */}
      <form action={login}>
        <div>
          <label htmlFor="email">Email</label>
          {/* "name" é o que a Server Action usa pra ler o valor via
              formData.get('email') — o htmlFor/id são só pra acessibilidade,
              ligando o <label> ao <input> */}
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" required />
        </div>

        {/* type="submit" dispara o form, que por sua vez chama a action */}
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}