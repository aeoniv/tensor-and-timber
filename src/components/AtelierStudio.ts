export function renderAtelierStudio(): string {
  return `
    <section class="section" id="atelier-section">
      <div class="app-container">
        
        <!-- Section Header -->
        <div class="section-header text-center">
          <div class="br-section-badge">
            <span class="flag-icon-mini">🇧🇷</span>
            <span>ATELIÊ 3D SOB MEDIDA</span>
          </div>
          <h2 class="section-title">
            Configure seu Projeto em <span class="br-gradient-text">Tempo Real</span>
          </h2>
          <p class="section-subtitle">
            Experimente arquétipos, refine materiais com madeiras nobres brasileiras e visualize instantaneamente a estimativa de investimento e o modelo 3D para sua encomenda.
          </p>
        </div>

        <!-- 2-Column Unified Studio Workspace -->
        <div class="atelier-workspace-grid">
          
          <!-- Left Column: Vision & Parameter Controls -->
          <div class="atelier-controls-panel glass-panel">
            <div class="panel-section-title">
              <span class="step-num">01</span>
              <span>Escolha o Arquétipo Estrutural</span>
            </div>

            <!-- Archetype Selector Tabs -->
            <div class="archetype-tabs-grid" id="archetype-selector">
              <button class="archetype-tab active" data-archetype="dining-table" data-name="Mesa de Jantar Flutuante" data-price="R$ 38.500 – R$ 48.000">
                <div class="tab-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="6" width="20" height="4" rx="1"/>
                    <line x1="6" y1="10" x2="6" y2="20"/>
                    <line x1="18" y1="10" x2="18" y2="20"/>
                    <line x1="6" y1="15" x2="18" y2="15"/>
                  </svg>
                </div>
                <div class="tab-info">
                  <div class="tab-title">Mesa de Jantar</div>
                  <div class="tab-desc">6 a 12 Lugares Suspensa</div>
                </div>
              </button>

              <button class="archetype-tab" data-archetype="lounge-chair" data-name="Poltrona Tensa Niemeyer" data-price="R$ 18.900 – R$ 24.500">
                <div class="tab-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zM5 12h14"/>
                  </svg>
                </div>
                <div class="tab-info">
                  <div class="tab-title">Poltrona Lounge</div>
                  <div class="tab-desc">Freijó &amp; Couro Natural</div>
                </div>
              </button>

              <button class="archetype-tab" data-archetype="canopy" data-name="Aparador Escultural Cerrado" data-price="R$ 26.000 – R$ 34.000">
                <div class="tab-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                  </svg>
                </div>
                <div class="tab-info">
                  <div class="tab-title">Aparador &amp; Buffet</div>
                  <div class="tab-desc">Jacarandá &amp; Tirantes Latão</div>
                </div>
              </button>

              <button class="archetype-tab" data-archetype="dome" data-name="Cúpula Geodésica Biosfera" data-price="R$ 68.000 – R$ 98.000">
                <div class="tab-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9z"/>
                  </svg>
                </div>
                <div class="tab-info">
                  <div class="tab-title">Cúpula Geodésica</div>
                  <div class="tab-desc">Spas &amp; Pavilhões 3V</div>
                </div>
              </button>
            </div>

            <!-- Vision Prompt & Material Descriptors -->
            <div class="panel-section-title" style="margin-top: 24px;">
              <span class="step-num">02</span>
              <span>Diretrizes de Design &amp; Madeiras</span>
            </div>

            <div class="prompt-chips-wrapper">
              <span class="prompt-chip" data-text="Madeira Cumaru maciça e cabos de aço inox naval 316">Cumaru &amp; Inox Naval</span>
              <span class="prompt-chip" data-text="Freijó curvado no vapor com tirantes dourados em titânio PVD">Freijó &amp; Titânio Dourado</span>
              <span class="prompt-chip" data-text="Jacarandá da Bahia com detalhes em latão escovado">Jacarandá &amp; Latão</span>
              <span class="prompt-chip" data-text="Minimalismo modernista brasileiro com borda orgânica natural">Design Brasileiro Orgânico</span>
            </div>

            <div class="input-group-atelier">
              <textarea 
                id="atelier-vision-input" 
                class="atelier-textarea" 
                rows="3" 
                placeholder="Descreva suas dimensões ou preferências de madeira nobre (ex: Mesa de 3 metros em Cumaru com cabos discretos para living em São Paulo)..."
              >Mesa de jantar suspensa para 10 lugares em madeira Cumaru maciça com cabos de aço inoxidável naval 316 e esticadores ocultos.</textarea>
            </div>

            <!-- Optional Image Upload Dropzone -->
            <div class="sketch-dropzone" id="atelier-sketch-zone">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="opacity: 0.6;">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <div class="dropzone-text">
                <span class="dropzone-main">Anexar planta, esboço ou foto do ambiente</span>
                <span class="dropzone-sub">PNG, JPG, PDF até 25MB (Opcional)</span>
              </div>
              <input type="file" id="atelier-file-input" accept="image/*,.pdf" style="display: none;" />
            </div>

            <!-- Generate Button -->
            <button class="btn btn-br-primary btn-block btn-lg" id="btn-generate-3d" style="margin-top: 16px;">
              <span>✨ Gerar Visualização 3D &amp; Orçamento</span>
              <div class="spinner-sm" id="generate-spinner" style="display: none;"></div>
            </button>
          </div>

          <!-- Right Column: Live 3D Mesh Stage & Deal Closing Card -->
          <div class="atelier-visualizer-column">
            
            <!-- 3D Canvas Stage -->
            <div class="atelier-canvas-wrapper glass-panel">
              <div class="atelier-canvas-header">
                <div class="stage-status-indicator">
                  <span class="pulse-dot"></span>
                  <span class="stage-status-text" id="atelier-status-label">Renderização 3D Concluída</span>
                </div>
                <div class="stage-model-pill" id="atelier-model-pill">Mesa Leviton Cumaru (GLB)</div>
              </div>

              <div class="atelier-canvas-viewport" id="atelier-3d-canvas" style="min-height: 400px; position: relative;">
                <!-- Three.js renders here automatically -->
              </div>
            </div>

            <!-- Deal Closing Card: Immediate Value & Reservation -->
            <div class="deal-closing-card glass-panel" id="deal-closing-card">
              <div class="deal-card-header">
                <div>
                  <div class="deal-card-tag">ESTIMATIVA DE INVESTIMENTO</div>
                  <h3 class="deal-card-title" id="deal-project-name">Mesa de Jantar Flutuante Ipanema</h3>
                </div>
                <div class="deal-price-bracket" id="deal-price-bracket">
                  R$ 38.500 – R$ 48.000
                </div>
              </div>

              <div class="deal-inclusions-grid">
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Madeira Nobre 100% FSC® com Seleção de Veios</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Cálculo Estrutural de Tensão &amp; Deflexão Zero</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Entrega White-Glove e Montagem Especializada</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Certificado de Autenticidade &amp; Calibração Vitalícia</span>
                </div>
              </div>

              <div class="deal-action-buttons">
                <button class="btn btn-br-gold btn-lg btn-reserve-slot" id="btn-reserve-atelier-slot">
                  <span>Reservar Vaga de Produção no Ateliê →</span>
                </button>
                <button class="btn btn-glass-br btn-lg" id="btn-download-glb">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  <span>Baixar Arquivo 3D (.GLB)</span>
                </button>
              </div>

              <div class="deal-scarcity-footnote">
                <span class="chip-dot-green"></span>
                <span>Restam apenas <strong>3 vagas de marcenaria</strong> disponíveis para entrega no 4º trimestre.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}
