import styles from "./TimerRing.module.css";
// CSS Module: as classes definidas em TimerRing.module.css são importadas
// como um objeto (styles.stage, styles.orbit, etc.), e o Next.js gera
// nomes únicos por baixo dos panos (ex: "TimerRing_stage__a1b2c") para
// evitar colisão de nomes de classe com outros componentes do projeto

// Componente puramente visual/decorativo — o "anel" animado que é a
// assinatura visual do Orbit, usado na landing/login (lado esquerdo
// do split-screen). Não recebe props nem tem lógica: toda a animação
// (rotação dos "orbits") deve estar definida via @keyframes no CSS Module
export default function TimerRing() {
  return (
    // Container principal que dá o "palco" (tamanho/posicionamento)
    // para os elementos orbitais e o núcleo central
    <div className={styles.stage}>
      {/* Primeiro anel orbital — provavelmente tem uma animação CSS
          de rotação contínua (ex: @keyframes spin) definida no module.css,
          simulando um planeta/satélite girando ao redor do centro */}
      <div className={styles.orbit}>
        {/* O "dot" é o ponto/satélite que se move junto com a órbita
            (a rotação do .orbit pai carrega o .dot junto) */}
        <div className={styles.dot} />
      </div>

      {/* Segundo anel, com uma classe extra ".small" combinada via
          template string — provavelmente um raio menor e/ou velocidade
          de rotação diferente, criando profundidade visual (múltiplas órbitas
          em tamanhos diferentes, como um sistema planetário) */}
      <div className={`${styles.orbit} ${styles.small}`}>
        <div className={styles.dot} />
      </div>

      {/* Núcleo central, fixo (não gira com as órbitas), mostrando
          o tempo decorrido como elemento decorativo estático
          (não é um timer real conectado a dados — é só parte do visual
          da landing/login, diferente do TimerCard do dashboard que
          mostra o elapsedTime real vindo do Supabase) */}
      <div className={styles.core}>
        <span className={styles.time}>02:14:36</span>
      </div>
    </div>
  );
}