import { login } from '@/app/auth/actions'

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h1>Entrar</h1>
      <form action={login}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}