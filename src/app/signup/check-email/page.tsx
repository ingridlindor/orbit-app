// Página estática exibida logo após o signup (redirect('/signup/check-email')
// na Server Action "signup"). Não precisa de dados nem de "use client" —
// é só uma tela informativa dizendo pro usuário conferir a caixa de entrada
export default function CheckEmailPage() {
  return (
    // Mesmo estilo inline simples usado na LoginPage, ainda sem o
    // design system definitivo do Orbit aplicado aqui
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h1>Confira seu email</h1>
      <p>Enviamos um link de confirmação. Clique nele para ativar sua conta.</p>
      {/* O link mencionado aqui é o que aponta para /auth/confirm,
          configurado via emailRedirectTo na função signup() */}
    </div>
  )
}