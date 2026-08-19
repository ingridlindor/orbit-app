import { signup } from '@/app/auth/actions'
// Server Action que chama supabase.auth.signUp() e redireciona
// para /signup/check-email em caso de sucesso

export default function SignupPage() {
  // Mesmo padrão da LoginPage: sem "use client", form nativo
  // com action apontando direto pra Server Action

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h1>Criar conta</h1>

      {/* Ao submeter, o Next.js monta um FormData com os campos abaixo
          e chama signup(formData) no servidor */}
      <form action={signup}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          {/* minLength={6} é validação só no lado do client (HTML5) —
              útil pra UX, mas não substitui validação no servidor/Supabase,
              já que alguém pode burlar isso enviando o form de outra forma */}
          <input id="password" name="password" type="password" required minLength={6} />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}