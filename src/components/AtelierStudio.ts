export function renderAtelierStudio(): string {
  return `
    <section class="section atelier-studio-section" id="atelier-section">
      <div class="container">
        
        <!-- Header -->
        <div class="section-header text-center">
          <span class="section-tag gold">
            Estúdio 3D Interativo
          </span>
          <h2 class="section-title">
            Configure seu Móvel e <span class="gold-gradient">Visualize em 3D</span>
          </h2>
          <p class="section-subtitle">
            Escolha o modelo, defina o material de sua preferência e visualize a estrutura tridimensional antes de solicitar seu orçamento.
          </p>
        </div>

        <!-- 2-Column Responsive Workspace -->
        <div class="atelier-workspace-grid">
          
          <!-- Left Column: Simple Configurator -->
          <div class="atelier-config-panel glass-panel">
            
            <!-- Step 1: Base Archetype Selection -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">01</span>
                <span>Tipo de Peça</span>
              </div>
              <div class="archetype-tabs-row" id="archetype-selector">
                <button class="archetype-tab active" data-archetype="dining-table" data-name="Mesa de Jantar Flutuante" data-price="R$ 38.500 – R$ 48.000">
                  <span class="tab-label">Mesa de Jantar</span>
                </button>
                <button class="archetype-tab" data-archetype="chair" data-name="Poltrona Tensa Lounge" data-price="R$ 18.900 – R$ 24.500">
                  <span class="tab-label">Poltrona Lounge</span>
                </button>
                <button class="archetype-tab" data-archetype="shelving-unit" data-name="Aparador Suspenso Cerrado" data-price="R$ 26.000 – R$ 34.000">
                  <span class="tab-label">Aparador Suspenso</span>
                </button>
                <button class="archetype-tab" data-archetype="coffee-table" data-name="Mesa de Centro Tupi" data-price="R$ 15.800 – R$ 21.000">
                  <span class="tab-label">Mesa de Centro</span>
                </button>
              </div>
            </div>

            <!-- Step 2: Custom Request Prompt / Image Sketch -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">02</span>
                <span>Descreva sua Ideia ou Selecione um Exemplo</span>
              </div>
              
              <div class="ai-prompt-input-group">
                <textarea 
                  id="atelier-custom-prompt-input" 
                  rows="3" 
                  class="prompt-textarea"
                  placeholder="Descreva seu projeto sob medida (ex: Mesa de jantar para 8 pessoas com tampo em madeira e cabos de aço inox)..."
                ></textarea>
                
                <!-- Prompt Suggestion Chips -->
                <div class="prompt-chips-row">
                  <button type="button" class="prompt-chip" data-phrase="Mesa de jantar para 8 pessoas com cabos de aço">Mesa de Jantar (8 Lugares)</button>
                  <button type="button" class="prompt-chip" data-phrase="Aparador suspenso com portas ripadas">Aparador Suspenso</button>
                  <button type="button" class="prompt-chip" data-phrase="Mesa de centro com apoio tensil e tampo circular">Mesa de Centro</button>
                  <button type="button" class="prompt-chip" data-phrase="Bancada de trabalho sob medida">Bancada Sob Medida</button>
                </div>

                <!-- Sketch / Photo Uploader -->
                <div class="sketch-uploader-row">
                  <label for="atelier-sketch-upload" class="sketch-upload-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span>Anexar Esboço, Foto ou Planta (Opcional)</span>
                  </label>
                  <input type="file" id="atelier-sketch-upload" accept="image/*" style="display: none;" />
                  <div id="sketch-preview-badge" class="sketch-preview-badge" style="display: none;">
                    <span id="sketch-preview-filename">imagem.png</span>
                    <button type="button" id="btn-remove-sketch">&times;</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Material / Wood Selection (Client's Choice) -->
            <div class="config-step-block">
              <div class="panel-section-title">
                <span class="step-num">03</span>
                <span>Opções de Madeira ou Material de Referência</span>
              </div>
              <p class="step-note-simple">A madeira e o acabamento são definidos pelo cliente. Veja algumas opções de referência:</p>
              
              <div class="wood-options-grid" id="wood-species-selector">
                <button class="wood-option-btn active" data-wood="cumaru" data-wood-name="Cumaru">
                  <span class="wood-swatch" style="background: #8b5a2b;"></span>
                  <div class="wood-option-info">
                    <span class="wood-title">Cumaru</span>
                    <span class="wood-sub">Tom Castanho &bull; Alta Densidade</span>
                  </div>
                </button>

                <button class="wood-option-btn" data-wood="freijo" data-wood-name="Freijó">
                  <span class="wood-swatch" style="background: #b8976b;"></span>
                  <div class="wood-option-info">
                    <span class="wood-title">Freijó</span>
                    <span class="wood-sub">Tom Claro &bull; Veios Suaves</span>
                  </div>
                </button>

                <button class="wood-option-btn" data-wood="jacaranda" data-wood-name="Jacarandá">
                  <span class="wood-swatch" style="background: #3d2b1f;"></span>
                  <div class="wood-option-info">
                    <span class="wood-title">Jacarandá</span>
                    <span class="wood-sub">Tom Escuro &bull; Desenho Marcante</span>
                  </div>
                </button>

                <button class="wood-option-btn" data-wood="pequia" data-wood-name="Pequiá">
                  <span class="wood-swatch" style="background: #dfbe8f;"></span>
                  <div class="wood-option-info">
                    <span class="wood-title">Pequiá</span>
                    <span class="wood-sub">Tom Amarelado &bull; Textura Viva</span>
                  </div>
                </button>
              </div>
              <p class="wood-disclaimer-note">
                * Também trabalhamos com MDF, compensado naval e outras madeiras de acordo com a sua preferência e orçamento.
              </p>
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
                  <span>Aço Inox</span>
                </button>
                <button class="tension-pill" data-tension="ouro">
                  <span class="tension-swatch" style="background: #f1c40f;"></span>
                  <span>Acabamento Dourado</span>
                </button>
                <button class="tension-pill" data-tension="preto">
                  <span class="tension-swatch" style="background: #22252a;"></span>
                  <span>Preto Fosco</span>
                </button>
              </div>
            </div>

            <!-- PRIMARY ACTION: Generate 3D Object Button -->
            <div class="generate-action-block">
              <button class="btn btn-primary-gold btn-lg btn-synthesize-3d" id="btn-generate-custom-3d">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span id="btn-generate-3d-text">Gerar Modelo 3D Sob Medida</span>
              </button>
              <div class="generator-guarantee-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Visualização interativa imediata no navegador</span>
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
                <div class="stage-model-pill" id="atelier-model-pill">Mesa de Jantar em Cumaru</div>
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
                  <span class="deal-card-tag">RESUMO DO PROJETO &bull; ESTIMATIVA</span>
                  <h3 class="deal-card-title" id="deal-project-name">Mesa de Jantar Flutuante</h3>
                  <div class="deal-wood-summary" id="deal-wood-summary">Cumaru &bull; Aço Inox</div>
                </div>
                <div class="deal-price-bracket" id="deal-price-bracket">
                  R$ 38.500 – R$ 48.000
                </div>
              </div>

              <div class="deal-inclusions-grid">
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Material e acabamento à escolha do cliente</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Dimensões adaptadas ao seu ambiente</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Acompanhamento visual em modelo 3D</span>
                </div>
                <div class="inclusion-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Entrega e montagem no local</span>
                </div>
              </div>

              <div class="deal-action-buttons">
                <a 
                  id="deal-btn-whatsapp" 
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20orçamento%20para%20uma%20Mesa%20de%20Jantar%20Flutuante%20sob%20medida." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                  </svg>
                  <span>Conversar sobre este Projeto no WhatsApp</span>
                </a>
                <button class="btn btn-glass" id="btn-reserve-atelier-slot">
                  <span>Solicitar Orçamento Detalhado</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}
