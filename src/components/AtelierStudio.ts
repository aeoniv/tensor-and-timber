export function renderAtelierStudio(): string {
  return `
    <section class="section" id="atelier-section">
      <div class="container">
        
        <!-- Section Header -->
        <div class="section-header text-center">
          <span class="section-tag gold">
            <span class="flag-dot-green"></span>
            Ateliê 3D Interativo 🇧🇷
          </span>
          <h2 class="section-title">
            Configure seu Projeto em <span class="gold-gradient">Tempo Real</span>
          </h2>
          <p class="section-subtitle">
            Selecione o móvel, a madeira nobre brasileira e os tirantes para visualizar a estrutura em 3D e a estimativa de investimento para sua encomenda.
          </p>
        </div>

        <!-- 2-Column Unified Studio Workspace -->
        <div class="atelier-workspace-grid">
          
          <!-- Left Column: Simple Step-by-Step Selectors -->
          <div class="atelier-controls-panel glass-panel">
            
            <!-- Step 1: Piece Archetype -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">01</span>
                <span>Selecione o Móvel</span>
              </div>
              <div class="archetype-tabs-grid" id="archetype-selector">
                <button class="archetype-tab active" data-archetype="dining-table" data-name="Mesa de Jantar Flutuante Ipanema" data-price="R$ 38.500 – R$ 48.000">
                  <div class="tab-icon">🪑</div>
                  <div class="tab-info">
                    <div class="tab-title">Mesa de Jantar</div>
                    <div class="tab-desc">R$ 38.500 &bull; Suspensa</div>
                  </div>
                </button>

                <button class="archetype-tab" data-archetype="lounge-chair" data-name="Poltrona Tensa Niemeyer" data-price="R$ 18.900 – R$ 24.500">
                  <div class="tab-icon">🛋️</div>
                  <div class="tab-info">
                    <div class="tab-title">Poltrona Lounge</div>
                    <div class="tab-desc">R$ 18.900 &bull; Couro &amp; Freijó</div>
                  </div>
                </button>

                <button class="archetype-tab" data-archetype="canopy" data-name="Aparador Escultural Cerrado" data-price="R$ 26.000 – R$ 34.000">
                  <div class="tab-icon">🏛️</div>
                  <div class="tab-info">
                    <div class="tab-title">Aparador &amp; Buffet</div>
                    <div class="tab-desc">R$ 26.000 &bull; Jacarandá</div>
                  </div>
                </button>

                <button class="archetype-tab" data-archetype="coffee-table" data-name="Mesa de Centro Tupi" data-price="R$ 15.800 – R$ 21.000">
                  <div class="tab-icon">🪵</div>
                  <div class="tab-info">
                    <div class="tab-title">Mesa de Centro</div>
                    <div class="tab-desc">R$ 15.800 &bull; Pequiá &amp; Vidro</div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Step 2: Wood Species -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">02</span>
                <span>Madeira Nobre Brasileira</span>
              </div>
              <div class="wood-selector-grid" id="wood-selector">
                <button class="wood-option-btn active" data-wood="cumaru" data-wood-name="Cumaru Amazônico">
                  <span class="wood-swatch" style="background: #8b5a2b;"></span>
                  <div class="wood-option-info">
                    <span class="wood-title">Cumaru</span>
                    <span class="wood-sub">Tom Mel Dourado &bull; Alta Densidade</span>
                  </div>
                </button>

                <button class="wood-option-btn" data-wood="freijo" data-wood-name="Freijó Maciço">
                  <span class="wood-swatch" style="background: #b8976b;"></span>
                  <div class="wood-option-info">
                    <span class="wood-title">Freijó</span>
                    <span class="wood-sub">Tom Palha &bull; Modernismo Brasileiro</span>
                  </div>
                </button>

                <button class="wood-option-btn" data-wood="jacaranda" data-wood-name="Jacarandá da Bahia">
                  <span class="wood-swatch" style="background: #3d2b1f;"></span>
                  <div class="wood-option-info">
                    <span class="wood-title">Jacarandá</span>
                    <span class="wood-sub">Tom Escuro Nobre &bull; Demolição</span>
                  </div>
                </button>

                <button class="wood-option-btn" data-wood="pequia" data-wood-name="Pequiá Natural">
                  <span class="wood-swatch" style="background: #dfbe8f;"></span>
                  <div class="wood-option-info">
                    <span class="wood-title">Pequiá</span>
                    <span class="wood-sub">Borda Orgânica &bull; Textura Viva</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Step 3: Tension System -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">03</span>
                <span>Acabamento dos Tirantes Tensores</span>
              </div>
              <div class="tension-selector-row" id="tension-selector">
                <button class="tension-pill active" data-tension="inox">
                  <span class="tension-swatch" style="background: #d8dee9;"></span>
                  <span>Inox Naval 316</span>
                </button>
                <button class="tension-pill" data-tension="ouro">
                  <span class="tension-swatch" style="background: #f1c40f;"></span>
                  <span>Ouro Titânio PVD</span>
                </button>
                <button class="tension-pill" data-tension="preto">
                  <span class="tension-swatch" style="background: #22252a;"></span>
                  <span>Preto Stealth</span>
                </button>
              </div>
            </div>

            <!-- Custom Note (Optional & Simple) -->
            <div class="config-step-block" style="margin-top: 14px;">
              <input 
                type="text" 
                id="atelier-custom-dimension" 
                class="atelier-input-simple" 
                placeholder="Dimensões personalizadas? (ex: 3,00m x 1,10m para 12 lugares)"
              />
            </div>

          </div>

          <!-- Right Column: Clean 3D Stage & Direct Deal Card -->
          <div class="atelier-visualizer-column">
            
            <!-- 3D Canvas Stage -->
            <div class="atelier-canvas-wrapper glass-panel">
              <div class="atelier-canvas-header">
                <div class="stage-status-indicator">
                  <span class="pulse-dot"></span>
                  <span class="stage-status-text" id="atelier-status-label">Visualização 3D Ativa</span>
                </div>
                <div class="stage-model-pill" id="atelier-model-pill">Mesa Flutuante em Cumaru</div>
              </div>

              <div class="atelier-canvas-viewport" id="atelier-3d-canvas" style="min-height: 440px; position: relative;">
                <!-- Three.js renders here automatically -->
              </div>

              <div class="stage-footer-hints">
                <span>Arraste para girar 360&deg; &bull; Scroll para zoom</span>
                <button class="btn btn-link-subtle" id="btn-download-glb">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  <span>Baixar Arquivo 3D (.GLB)</span>
                </button>
              </div>
            </div>

            <!-- Clean Deal Closing Box -->
            <div class="deal-closing-card glass-panel" id="deal-closing-card">
              <div class="deal-card-header">
                <div class="deal-info-group">
                  <span class="deal-card-tag">ESTIMATIVA DE INVESTIMENTO</span>
                  <h3 class="deal-card-title" id="deal-project-name">Mesa de Jantar Flutuante Ipanema</h3>
                  <div class="deal-wood-summary" id="deal-wood-summary">Cumaru Amazônico Maciço &bull; Inox Naval 316</div>
                </div>
                <div class="deal-price-bracket" id="deal-price-bracket">
                  R$ 38.500 – R$ 48.000
                </div>
              </div>

              <div class="deal-inclusions-grid">
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Madeira 100% FSC® com seleção de veios</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Cálculo estrutural de deflexão zero</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Entrega White-Glove e montagem no local</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Garantia estrutural vitalícia</span>
                </div>
              </div>

              <div class="deal-action-buttons">
                <a 
                  id="deal-btn-whatsapp" 
                  href="https://wa.me/5511999998888?text=Olá!%20Gostaria%20de%20encomendar%20a%20Mesa%20de%20Jantar%20Flutuante%20Ipanema%20em%20Cumaru%20Maciço." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                  </svg>
                  <span>Encomendar Esta Configuração via WhatsApp</span>
                </a>
                <button class="btn btn-glass" id="btn-reserve-atelier-slot">
                  <span>Solicitar Proposta Formal</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}
