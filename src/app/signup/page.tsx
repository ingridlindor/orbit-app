import { signup } from '@/app/auth/actions'

export default function SignupPage() {
  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h1>Criar conta</h1>
      <form action={signup}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" required minLength={6} />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}