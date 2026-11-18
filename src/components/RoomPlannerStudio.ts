import { MDF_FINISH_OPTIONS, HARDWARE_KIT_OPTIONS } from '../data/pricingCatalog';

export function renderRoomPlannerStudio(): string {
  const finishesHtml = MDF_FINISH_OPTIONS.map((f, idx) => `
    <button
      type="button"
      class="wood-card-btn room-finish-btn ${idx === 0 ? 'active' : ''}"
      data-finish-id="${f.id}"
      title="${f.name15} • Cód: ${f.cod15}"
    >
      <span class="wood-color-dot" style="background: ${f.hex}; border: 1px solid rgba(0,0,0,0.18);"></span>
      <div>
        <span class="wood-text-k">${f.label}</span>
        <span class="wood-text-v">${f.tierLabel} &bull; R$ ${f.sellPrice15.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ch</span>
      </div>
    </button>
  `).join('');

  const hardwareHtml = HARDWARE_KIT_OPTIONS.map((h, idx) => `
    <button
      type="button"
      class="tension-pill room-hardware-btn ${idx === 1 ? 'active' : ''}"
      data-hardware-id="${h.id}"
      title="${h.description}"
    >
      ${h.id === 'padrao' ? 'Padrão (Telescópica)' : 'Alto Padrão (Slow / Oculta)'}
    </button>
  `).join('');

  return `
    <section class="section section-atelier" id="room-planner-section" style="border-bottom: 1px solid var(--border-subtle);">
      <div class="container">

        <div class="section-header text-center">
          <span class="badge">IA Espacial + Tabela Real &bull; Cozinha, Quarto e Sala</span>
          <h2 class="section-title">
            Projeto 3D e Pré-Orçamento por <span class="accent-text">Foto do Cômodo</span>
          </h2>
          <p class="section-subtitle">
            Envie uma foto do ambiente vazio e informe uma medida de referência. A IA mapeia paredes, portas, janelas, hidráulica e tomadas via Hugging Face, gera a proposta em 3D e calcula a estimativa real pela nossa tabela.
          </p>
        </div>

        <div class="atelier-grid">

          <!-- Coluna Esquerda: Inputs do Cômodo -->
          <div class="config-box">

            <!-- Passo 1: Cômodo -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">1</span>
                <span class="step-label">Tipo de Cômodo</span>
              </div>
              <div class="archetype-tabs-row" id="room-type-selector">
                <button type="button" class="archetype-tab room-type-tab active" data-room-type="cozinha">
                  Cozinha
                </button>
                <button type="button" class="archetype-tab room-type-tab" data-room-type="quarto">
                  Quarto / Closet
                </button>
                <button type="button" class="archetype-tab room-type-tab" data-room-type="sala">
                  Sala / Painel TV
                </button>
              </div>
            </div>

            <!-- Passo 2: Foto do Cômodo Vazio -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">2</span>
                <span class="step-label">Foto do Cômodo Vazio</span>
              </div>
              <div class="sketch-dropzone" id="room-photo-dropzone">
                <input type="file" id="room-photo-input" accept="image/png,image/jpeg,image/webp" style="display: none;" />

                <div class="sketch-empty-state" id="room-photo-empty">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <p class="sketch-drop-title">Enviar Foto do Ambiente Vazio</p>
                  <p class="sketch-drop-hint">Arraste ou clique (JPG, PNG, WEBP) com a parede principal visível</p>
                </div>

                <div class="sketch-preview-wrap" id="room-photo-preview-wrap" style="display: none;">
                  <div style="position: relative; display: inline-block; max-width: 100%;">
                    <img id="room-photo-preview-img" src="" alt="Foto do cômodo vazio" class="sketch-preview-img" />
                    <canvas id="room-detection-overlay" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; border-radius: 6px;"></canvas>
                  </div>
                  <button type="button" class="btn-remove-sketch" id="btn-remove-room-photo" title="Remover foto">&times;</button>
                </div>
              </div>
            </div>

            <!-- Passo 3: Medida Real + Requisitos -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">3</span>
                <span class="step-label">Medida de Referência &amp; Requisitos</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 96px; gap: 8px; margin-bottom: 10px;">
                <select id="room-ref-type" class="prompt-input-area" style="padding: 9px 10px; min-height: 0;">
                  <option value="wall_width">Largura da parede (cm)</option>
                  <option value="ceiling_height">Altura pé-direito (cm)</option>
                </select>
                <input
                  id="room-ref-cm"
                  type="number"
                  min="120"
                  max="900"
                  step="5"
                  value="320"
                  class="prompt-input-area"
                  style="padding: 9px 10px; min-height: 0; text-align: center; font-weight: 700;"
                  aria-label="Medida de referência em centímetros"
                />
              </div>

              <textarea
                id="room-requirements-input"
                rows="2"
                class="prompt-input-area"
                placeholder="Ex: Quero balcão de pia, gaveteiro, torre quente para forno/micro e armário aéreo sem tampar a janela..."
              ></textarea>
              <div class="prompt-chips-row" id="room-req-chips">
                <button type="button" class="prompt-chip room-req-chip" data-phrase="Cozinha com balcão de pia, gaveteiro, torre quente e aéreo">Cozinha c/ Torre Quente</button>
                <button type="button" class="prompt-chip room-req-chip" data-phrase="Balcão inferior completo com gavetas profundas e nicho para geladeira">Cozinha + Nicho Geladeira</button>
              </div>
            </div>

            <!-- Passo 4: Padrão MDF + Ferragens da Planilha -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">4</span>
                <span class="step-label">Padrão MDF (Tabela Atual) &amp; Ferragens</span>
              </div>
              <div class="wood-grid" id="room-finish-selector">
                ${finishesHtml}
              </div>

              <div class="tension-row" id="room-hardware-selector" style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                ${hardwareHtml}
              </div>
            </div>

            <!-- Botão Principal -->
            <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-analyze-empty-room" style="margin-top: 16px;">
              <span id="btn-analyze-room-text">🔍 Analisar Cômodo e Gerar Proposta 3D</span>
            </button>
            <p id="room-ai-engine-hint" style="font-size: 0.76rem; color: var(--text-muted); text-align: center; margin-top: 8px;">
              Visão Computacional Hugging Face (MoGe-2 + Qwen2-VL) &bull; Escala real &bull; Estimativa vinculada à planilha
            </p>

          </div>

          <!-- Coluna Direita: Visualizador 3D + Estimativa + WhatsApp -->
          <div class="visualizer-column">

            <div class="atelier-canvas-card">
              <div class="atelier-canvas-header">
                <span class="stage-pill-tag" id="room-status-pill">Aguardando foto do cômodo vazio</span>
                <span class="stage-hint" id="room-dims-pill">Escala calibrada (cm)</span>
              </div>

              <div class="atelier-canvas-viewport" id="room-planner-canvas" style="min-height: 410px;"></div>

              <div class="stage-controls-bar">
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="ctrl-btn" id="room-btn-autorotate">Girar: OFF</button>
                  <button type="button" class="ctrl-btn" id="room-btn-wireframe">Aramado</button>
                  <button type="button" class="ctrl-btn active" id="room-btn-shell">Paredes</button>
                  <button type="button" class="ctrl-btn" id="room-btn-moge" style="display: none;">Malha MoGe-2</button>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button type="button" class="ctrl-btn" id="room-btn-download-glb">Baixar .GLB</button>
                  <button type="button" class="ctrl-btn" id="room-btn-export-obj">SketchUp (.OBJ)</button>
                </div>
              </div>
            </div>

            <!-- Card de Leitura Arquitetônica, Orçamento e WhatsApp -->
            <div class="deal-card" id="room-deal-card">
              <div class="deal-header">
                <div>
                  <h3 class="deal-title" id="room-deal-title">Proposta Sob Medida (Pré-Orçamento)</h3>
                  <p class="deal-summary" id="room-deal-finish-summary">Branco Ártico Trama &bull; Linha Slow / Oculta</p>
                </div>
                <div class="deal-price" id="room-deal-price">Envie uma foto</div>
              </div>

              <div id="room-analysis-details" style="display: none; margin: 12px 0; font-size: 0.85rem; color: var(--text-secondary);">
                <p id="room-architect-notes" style="margin-bottom: 10px; line-height: 1.5;"></p>
                <div id="room-obstacles-badges" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;"></div>
                <div id="room-modules-list" style="background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 10px 12px;"></div>
              </div>

              <div class="deal-perks" id="room-bom-perks">
                <div class="deal-perk-item">✓ Respeita portas, janelas e tomadas detectadas</div>
                <div class="deal-perk-item">✓ Chapas MDF 15mm/6mm e ferragens reais</div>
                <div class="deal-perk-item">✓ Exportação 3D compatível com SketchUp (.OBJ)</div>
                <div class="deal-perk-item">✓ Estimativa sujeita à medição final no local</div>
              </div>

              <div class="deal-actions">
                <a
                  id="room-btn-whatsapp"
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20um%20orçamento%20de%20móveis%20planejados%20com%20a%2083%20Ambientes%20Planejados."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-whatsapp btn-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                  </svg>
                  <span>Enviar Projeto + Estimativa no WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}
