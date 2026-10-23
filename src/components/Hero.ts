export function renderHero(): string {
  return `
    <section class="hero-section" id="hero">
      <div class="container hero-content">
        
        <!-- Left Column: Editorial & Value Proposition -->
        <div class="hero-text-col">
          <div class="hero-badge-row">
            <span class="section-tag gold">
              83 Ambientes Planejados &bull; João Pessoa, PB
            </span>
            <span class="section-tag-subtle">
              Marcenaria Sob Medida &bull; Estruturas Especiais
            </span>
          </div>

          <h1 class="hero-title">
            Marcenaria e Móveis<br>
            <span class="gold-gradient">Sob Medida</span> para seu Espaço.
          </h1>

          <p class="hero-subtitle">
            Projetos residenciais e corporativos, móveis sob medida e estruturas em tensegridade. A escolha das medidas, da madeira e dos acabamentos é sempre sua, com suporte técnico e visualização em modelo 3D antes da produção.
          </p>

          <div class="hero-cta-group">
            <a href="#real-furniture-section" class="btn btn-primary-gold btn-lg">
              <span>Ver Modelos de Referência</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#atelier-section" class="btn btn-glass btn-lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
              </svg>
              <span>Personalizar no Estúdio 3D</span>
            </a>
          </div>

          <!-- Trust & Value Signals (Clean 4 metrics) -->
          <div class="hero-stats-row">
            <div class="stat-item">
              <span class="stat-val font-serif">Sob Medida</span>
              <span class="stat-label">Formatos personalizados</span>
            </div>
            <div class="stat-item">
              <span class="stat-val cyan font-serif">Sua Escolha</span>
              <span class="stat-label">Madeira e acabamento</span>
            </div>
            <div class="stat-item">
              <span class="stat-val font-serif">Modelo 3D</span>
              <span class="stat-label">Visualização prévia</span>
            </div>
            <div class="stat-item">
              <span class="stat-val font-serif gold-text">João Pessoa</span>
              <span class="stat-label">Atendimento e montagem</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive 3D Visualizer -->
        <div class="hero-visual-stage">
          <div class="stage-overlay-hud">
            <span class="hud-pill" id="hero-model-pill">
              Mesa Tensegrity &bull; Modelo 3D Interativo
            </span>
            <span class="hud-pill subtle-hint">
              Arraste para girar 360&deg;
            </span>
          </div>

          <!-- Canvas Container -->
          <div id="hero-3d-canvas" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></div>

          <!-- Clean Interaction Controls -->
          <div class="stage-bottom-controls">
            <div class="toggle-group">
              <button class="toggle-btn active" id="hero-btn-autorotate">Girar: ON</button>
              <button class="toggle-btn" id="hero-btn-wireframe">Aramado</button>
            </div>
            <div class="toggle-group">
              <button class="toggle-btn active" id="hero-light-studio">Estúdio</button>
              <button class="toggle-btn" id="hero-light-daylight">Luz Natural</button>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}
