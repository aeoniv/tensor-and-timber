export function renderHero(): string {
  return `
    <section class="hero-section" id="hero">
      <div class="container hero-content">
        
        <!-- Left Column: Editorial & Value Proposition -->
        <div class="hero-text-col">
          <div class="hero-badge-row">
            <span class="section-tag gold">
              <span class="flag-dot-green"></span>
              Ateliê Brasil &bull; Marcenaria Autoral
            </span>
            <span class="section-tag-subtle">
              Engenharia Tensa &bull; Madeiras Nobres FSC®
            </span>
          </div>

          <h1 class="hero-title">
            Mobiliário Escultural.<br>
            <span class="gold-gradient">Desafiando a Gravidade</span> por Tensão.
          </h1>

          <p class="hero-subtitle">
            Mesas de jantar suspensas, poltronas flutuantes e aparadores esculturais produzidos sob encomenda. Equilíbrio estético e físico absoluto entre madeiras nobres brasileiras — Cumaru, Freijó, Jacarandá e Pequiá — e tirantes de aço aeroespacial naval.
          </p>

          <div class="hero-cta-group">
            <a href="#real-furniture-section" class="btn btn-primary-gold btn-lg">
              <span>Explorar Peças Reais</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#atelier-section" class="btn btn-glass btn-lg">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
              </svg>
              <span>Personalizar no Ateliê 3D</span>
            </a>
          </div>

          <!-- Trust & Value Signals (Clean 4 metrics) -->
          <div class="hero-stats-row">
            <div class="stat-item">
              <span class="stat-val font-serif">100% FSC®</span>
              <span class="stat-label">Madeiras Nacionais</span>
            </div>
            <div class="stat-item">
              <span class="stat-val cyan font-serif">1.800 kg</span>
              <span class="stat-label">Carga de Ruptura</span>
            </div>
            <div class="stat-item">
              <span class="stat-val font-serif">6–8 Sem</span>
              <span class="stat-label">Produção Sob Medida</span>
            </div>
            <div class="stat-item">
              <span class="stat-val font-serif gold-text">Vitalícia</span>
              <span class="stat-label">Garantia Estrutural</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive 3D Visualizer -->
        <div class="hero-visual-stage">
          <div class="stage-overlay-hud">
            <span class="hud-pill" id="hero-model-pill">
              <strong>✨ Mesa Flutuante Ipanema</strong> &bull; Cumaru &amp; Inox Naval
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
