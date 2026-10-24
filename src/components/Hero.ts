export function renderHero(): string {
  return `
    <section class="hero-section" id="hero">
      <div class="container">
        <div class="hero-grid">
          
          <!-- Text Column -->
          <div class="hero-text-col">
            <div class="hero-badge">
              Marcenaria &bull; João Pessoa, PB
            </div>

            <h1 class="hero-title">
              Móveis e Estruturas <span class="accent-text">Sob Medida</span> para seu Espaço.
            </h1>

            <p class="hero-subtitle">
              Projetos residenciais e corporativos fabricados em João Pessoa. Desenvolvemos mesas, estantes, aparadores e peças com estrutura tensil. Você define as dimensões, o material e o acabamento.
            </p>

            <div class="hero-ctas">
              <a 
                href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20solicitar%20um%20orçamento%20de%20móvel%20sob%20medida." 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-whatsapp btn-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                </svg>
                <span>Falar no WhatsApp</span>
              </a>

              <a href="#real-furniture-section" class="btn btn-outline btn-lg">
                <span>Ver Modelos</span>
              </a>
            </div>

            <!-- Trust Signals -->
            <div class="hero-trust-row">
              <div class="trust-item">
                <span class="trust-title">Sob Medida</span>
                <span class="trust-desc">Dimensões personalizadas para seu ambiente</span>
              </div>
              <div class="trust-item">
                <span class="trust-title">Sua Escolha</span>
                <span class="trust-desc">MDF, compensado ou madeira maciça</span>
              </div>
              <div class="trust-item">
                <span class="trust-title">Modelo 3D</span>
                <span class="trust-desc">Visualização prévia antes da produção</span>
              </div>
            </div>
          </div>

          <!-- 3D Stage Column -->
          <div class="hero-stage-card">
            <div class="hero-stage-header">
              <span class="stage-pill-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
                </svg>
                <span id="hero-model-pill">Mesa Tensegrity Interativa</span>
              </span>
              <span class="stage-hint">Arraste para girar 360&deg;</span>
            </div>

            <!-- Canvas Box -->
            <div id="hero-3d-canvas" class="hero-canvas-box"></div>

            <!-- Controls -->
            <div class="stage-controls-bar">
              <div style="display: flex; gap: 8px;">
                <button class="ctrl-btn active" id="hero-btn-autorotate">Girar: ON</button>
                <button class="ctrl-btn" id="hero-btn-wireframe">Aramado</button>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="ctrl-btn active" id="hero-light-studio">Estúdio</button>
                <button class="ctrl-btn" id="hero-light-daylight">Luz Natural</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}
