export function renderPhilosophySection(): string {
  return `
    <section class="section philosophy-section" id="philosophy-section">
      <div class="container">
        
        <div class="section-header text-center">
          <span class="section-tag gold">
            Como Trabalhamos &bull; Do Projeto à Montagem
          </span>
          <h2 class="section-title">
            Processo Simples, <span class="gold-gradient">Direto e Transparente</span>
          </h2>
          <p class="section-subtitle">
            Do primeiro rascunho até a instalação no seu ambiente, com total clareza e liberdade de escolha dos materiais.
          </p>
        </div>

        <div class="philosophy-pillars-grid">
          
          <!-- Pillar 1: Project & 3D -->
          <div class="pillar-card glass-panel">
            <div class="pillar-icon-box">
              <span class="pillar-icon">📐</span>
            </div>
            <h3 class="pillar-title">1. Ideia e Projeto 3D</h3>
            <p class="pillar-desc">
              Você compartilha as medidas, referências ou a planta do espaço. Criamos a visualização 3D para você conferir as proporções e o visual antes de qualquer corte.
            </p>
            <div class="pillar-tags">
              <span>Sob Medida</span>
              <span>Visualização 3D</span>
              <span>Ajustes Prévios</span>
            </div>
          </div>

          <!-- Pillar 2: Client Chooses Materials -->
          <div class="pillar-card glass-panel">
            <div class="pillar-icon-box">
              <span class="pillar-icon">🪵</span>
            </div>
            <h3 class="pillar-title">2. A Madeira é Sua Escolha</h3>
            <p class="pillar-desc">
              Não impomos materiais específicos. O cliente escolhe entre madeiras maciças (Cumaru, Freijó, Peroba, Pinus), MDF ou compensados, adequando ao seu estilo e orçamento.
            </p>
            <div class="pillar-tags">
              <span>Maciça ou MDF</span>
              <span>Escolha do Cliente</span>
              <span>Acabamentos Diversos</span>
            </div>
          </div>

          <!-- Pillar 3: Craft & Assembly -->
          <div class="pillar-card glass-panel">
            <div class="pillar-icon-box">
              <span class="pillar-icon">🛠️</span>
            </div>
            <h3 class="pillar-title">3. Fabricação e Montagem</h3>
            <p class="pillar-desc">
              Produzimos com ferragens e cabos tensores dimensionados para estabilidade e durabilidade. Realizamos a entrega e montagem cuidadosa no seu endereço.
            </p>
            <div class="pillar-tags">
              <span>João Pessoa e Região</span>
              <span>Envio Nacional</span>
              <span>Montagem no Local</span>
            </div>
          </div>

        </div>

        <!-- Practical Commitment Note -->
        <div class="philosophy-quote-card glass-panel">
          <blockquote class="philosophy-quote">
            "Trabalhamos com marcenaria sob medida e estruturas de tensegridade unindo técnica, durabilidade e respeito às escolhas de cada cliente."
          </blockquote>
          <div class="quote-author">
            <strong>83 Ambientes Planejados &bull; 83 Empreendimentos Ltda</strong> &bull; João Pessoa - PB
          </div>
        </div>

      </div>
    </section>
  `;
}
