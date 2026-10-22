export function renderHero(): string {
  return `
    <section class="hero-section" id="hero">
      <div class="app-container hero-container">
        
        <!-- Left Column: Editorial Copy & Value Proposition -->
        <div class="hero-content">
          <div class="hero-tag-badge">
            <span class="flag-icon-mini">🇧🇷</span>
            <span>MARCENARIA FINA &amp; ENGENHARIA TENSA</span>
          </div>

          <h1 class="hero-title">
            Mobiliário Escultural em <span class="br-gradient-text">Madeira Maciça &amp; Tensão</span>
          </h1>

          <p class="hero-subtitle">
            Projetamos e executamos mesas de jantar suspensas, poltronas flutuantes e cúpulas geodésicas autorais. 
            Peças exclusivas esculpidas em madeiras nobres brasileiras com calibração estrutural aeroespacial que desafia a gravidade.
          </p>

          <div class="hero-cta-group">
            <a href="#real-furniture-section" class="btn btn-br-primary btn-lg">
              <span>Ver Mobiliário Real</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#atelier-section" class="btn btn-glass-br btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              </svg>
              <span>Ateliê 3D Interativo</span>
            </a>
          </div>

          <!-- Trust & Value Signals -->
          <div class="hero-prestige-metrics">
            <div class="metric-card">
              <span class="metric-number font-serif">6–8 Sem</span>
              <span class="metric-label">Produção Sob Medida</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-card">
              <span class="metric-number font-serif">1.800 kg</span>
              <span class="metric-label">Carga de Ruptura</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-card">
              <span class="metric-number font-serif">100% FSC®</span>
              <span class="metric-label">Madeiras Brasileiras</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-card">
              <span class="metric-number font-serif text-accent-gold">3 Vagas</span>
              <span class="metric-label">Ateliê Q4 Restantes</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Auto-Loaded Three.js 3D Visualizer -->
        <div class="hero-stage-column">
          <div class="hero-stage-wrapper glass-panel">
            <div class="hero-stage-header">
              <div class="stage-status-indicator">
                <span class="pulse-dot"></span>
                <span class="stage-status-text">Visualizador 3D em Tempo Real</span>
              </div>
              <div class="stage-model-pill" id="hero-model-pill">Mesa Leviton Cumaru (GLB)</div>
            </div>

            <!-- Canvas Container -->
            <div class="hero-canvas-viewport" id="hero-3d-canvas" style="min-height: 480px; position: relative;">
              <!-- Three.js renders here automatically on page load -->
            </div>

            <!-- Stage Interaction Controls -->
            <div class="stage-controls-bar">
              <button class="stage-ctrl-btn" id="hero-btn-autorotate" title="Alternar Rotação Automática">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
                <span>Girar</span>
              </button>
              <button class="stage-ctrl-btn" id="hero-btn-wireframe" title="Alternar Modo Aramado Estrutural">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                </svg>
                <span>Aramado</span>
              </button>
              <button class="stage-ctrl-btn" id="hero-btn-light" title="Alternar Iluminação de Estúdio">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
                <span>Luz</span>
              </button>
              <div class="stage-controls-spacer"></div>
              <a href="#atelier-section" class="stage-link-atelier">
                <span>Personalizar no Ateliê</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  `;
}
