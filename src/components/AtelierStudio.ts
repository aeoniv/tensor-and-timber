export function renderAtelierStudio(): string {
  return `
    <section class="section" id="atelier-section">
      <div class="container">
        
        <!-- Section Header -->
        <div class="section-header text-center">
          <div class="hero-badge-row" style="justify-content: center; margin-bottom: 12px;">
            <span class="section-tag gold">
              <span class="flag-dot-green"></span>
              Ateliê 3D Digital &bull; Marcenaria Paramétrica
            </span>
          </div>
          <h2 class="section-title">
            Configure ou <span class="gold-gradient">Gere seu Objeto 3D Sob Medida</span>
          </h2>
          <p class="section-subtitle">
            Crie peças autorais em tempo real. Escolha um arquétipo ou descreva seu conceito para síntese tridimensional com física de tensegridade e exportação direta em .GLB.
          </p>
        </div>

        <!-- Unified Side-by-Side Atelier Workspace -->
        <div class="atelier-unified-layout">
          
          <!-- Left Column: Generator & Customization Controls -->
          <div class="atelier-controls-column glass-panel">
            
            <!-- Step 1: Quick Archetype Selector -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">01</span>
                <span>Selecione o Arquétipo Estrutural</span>
              </div>
              <div class="archetype-selector-tabs" id="archetype-selector">
                <button class="archetype-tab active" data-archetype="dining-table" data-name="Mesa de Jantar Flutuante Ipanema" data-price="R$ 38.500 – R$ 48.000">
                  <span>Mesa Flutuante</span>
                </button>
                <button class="archetype-tab" data-archetype="lounge-chair" data-name="Poltrona Tensa Niemeyer" data-price="R$ 18.900 – R$ 24.500">
                  <span>Poltrona Tensa</span>
                </button>
                <button class="archetype-tab" data-archetype="shelving-unit" data-name="Aparador Escultural Cerrado" data-price="R$ 26.000 – R$ 34.000">
                  <span>Aparador Suspenso</span>
                </button>
                <button class="archetype-tab" data-archetype="geodesic-dome" data-name="Cúpula Geodésica Biosfera 3V" data-price="R$ 68.000 – R$ 92.000">
                  <span>Cúpula Biosfera 3V</span>
                </button>
                <button class="archetype-tab" data-archetype="cantilever-desk" data-name="Mesa Executiva Cantilever Aetherium" data-price="R$ 42.000 – R$ 56.000">
                  <span>Mesa Cantilever</span>
                </button>
              </div>
            </div>

            <!-- Step 2: Custom Prompt & Vision Specifications -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">02</span>
                <span>Especificação Criativa ou Conceito</span>
              </div>
              
              <div class="prompt-input-wrapper">
                <textarea 
                  id="atelier-custom-prompt-input" 
                  class="atelier-textarea"
                  rows="3" 
                  placeholder="Descreva seu projeto sob medida (ex: Mesa de jantar para 10 lugares em Cumaru com borda orgânica e tirantes de ouro titânio PVD...)"
                ></textarea>

                <!-- Prompt Inspiration Chips -->
                <div class="prompt-chips-row">
                  <span class="chips-label">Inspirações:</span>
                  <button type="button" class="prompt-chip" data-phrase="Mesa de jantar flutuante para 10 lugares em Cumaru com borda orgânica natural">+ 10 Lugares</button>
                  <button type="button" class="prompt-chip" data-phrase="Tampo em Cumaru com canal de resina azul cristalino e cabos dourados">+ Rio de Vidro</button>
                  <button type="button" class="prompt-chip" data-phrase="Poltrona lounge modernista em Freijó curvado com tirantes tensores">+ Poltrona Tensa</button>
                  <button type="button" class="prompt-chip" data-phrase="Aparador escultural suspenso em Jacarandá de demolição">+ Aparador Suspenso</button>
                  <button type="button" class="prompt-chip" data-phrase="Cúpula geodésica 3V em madeira tratada de 6 metros">+ Cúpula 3V</button>
                </div>
              </div>

              <!-- Attach Sketch or Drawing (Computer Vision Contour) -->
              <div class="sketch-upload-block">
                <div class="sketch-upload-header">
                  <span class="sketch-title">Anexar Croqui ou Referência (Opcional)</span>
                  <span class="sketch-badge">Visão Computacional</span>
                </div>

                <div id="atelier-sketch-dropzone" class="sketch-dropzone">
                  <input type="file" id="atelier-sketch-file-input" accept="image/png,image/jpeg,image/webp" style="display: none;">
                  
                  <div id="atelier-sketch-empty-state" class="sketch-empty-state">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span>Arraste um croqui/planta ou <strong>selecione do dispositivo</strong></span>
                  </div>

                  <div id="atelier-sketch-preview-wrap" class="sketch-preview-wrap" style="display: none;">
                    <img id="atelier-sketch-preview-img" src="" alt="Croqui anexado" class="sketch-preview-img" />
                    <button type="button" id="btn-remove-atelier-sketch" class="btn-remove-sketch" aria-label="Remover imagem">&times;</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Brazilian Hardwoods Swatches -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">03</span>
                <span>Madeira Nobre Brasileira Certificada FSC®</span>
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

            <!-- Step 4: Tension System Finishes -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">04</span>
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

            <!-- PRIMARY ACTION: Generate 3D Object Button -->
            <div class="generate-action-block">
              <button class="btn btn-primary-gold btn-lg btn-synthesize-3d" id="btn-generate-custom-3d">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span id="btn-generate-3d-text">✨ Gerar Objeto 3D Sob Medida</span>
              </button>
              <div class="generator-guarantee-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Cálculo de equilíbrio e renderização Three.js instantânea</span>
              </div>
            </div>

          </div>

          <!-- Right Column: Interactive 3D WebGL Canvas & Direct Deal Card -->
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

              <!-- WebGL Canvas Container -->
              <div class="atelier-canvas-viewport" id="atelier-3d-canvas" style="min-height: 420px; position: relative;">
                <!-- Three.js renders here automatically -->
              </div>

              <!-- Stage Bottom Tools -->
              <div class="stage-footer-hints">
                <div class="viewport-controls-row">
                  <button class="btn btn-glass btn-xs" id="atelier-btn-autorotate">Girar: ON</button>
                  <button class="btn btn-glass btn-xs" id="atelier-btn-wireframe">Aramado</button>
                  <button class="btn btn-glass btn-xs" id="atelier-btn-lighting">Luz Natural</button>
                </div>
                <button class="btn btn-link-subtle" id="btn-download-glb">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  <span>Baixar Arquivo 3D (.GLB)</span>
                </button>
              </div>
            </div>

            <!-- Direct Deal Closing & Investment Box -->
            <div class="deal-closing-card glass-panel" id="deal-closing-card">
              <div class="deal-card-header">
                <div class="deal-info-group">
                  <span class="deal-card-tag">ESTIMATIVA DE INVESTIMENTO &bull; PRODUÇÃO REAL</span>
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
