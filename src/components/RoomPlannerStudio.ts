import {
  ALL_MDF_FINISHES,
  MDF_FEATURED_FINISHES,
  HARDWARE_KIT_OPTIONS,
} from '../data/pricingCatalog';

export function renderRoomPlannerStudio(): string {
  const finishesHtml = MDF_FEATURED_FINISHES.map((f, idx) => `
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

  const catalogOptionsHtml = ALL_MDF_FINISHES.map((f) => `
    <option value="${f.id}">
      ${f.label} — ${f.tierLabel} (${f.cod15}) • R$ ${f.sellPrice15.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ch
    </option>
  `).join('');

  const carcassIds = ['branco-artico', 'branco-ultra', 'cinza-platina', 'gianduia-sense'];
  const carcassOptionsHtml = carcassIds
    .map((cid) => MDF_FEATURED_FINISHES.find((f) => f.id === cid))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .map((f) => `<option value="${f.id}">Caixaria: ${f.label} (R$ ${f.sellPrice15.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ch)</option>`)
    .join('');

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
          <span class="badge">7 Ambientes &bull; 30+ Móveis &bull; ${ALL_MDF_FINISHES.length} Padrões Duratex</span>
          <h2 class="section-title">
            Projeto 3D e Pré-Orçamento por <span class="accent-text">Foto do Cômodo</span>
          </h2>
          <p class="section-subtitle">
            Envie a foto de qualquer cômodo vazio (cozinha, quarto, closet, sala, banheiro, lavanderia, escritório ou área gourmet). A IA detecta aberturas e pontos técnicos, propõe os móveis em 3D e calcula pela nossa tabela real.
          </p>
        </div>

        <div class="atelier-grid">

          <!-- Coluna Esquerda: Inputs do Cômodo -->
          <div class="config-box">

            <!-- Passo 1: 7 Tipos de Cômodo -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">1</span>
                <span class="step-label">Escolha o Ambiente</span>
              </div>
              <div class="archetype-tabs-row" id="room-type-selector" style="flex-wrap: wrap;">
                <button type="button" class="archetype-tab room-type-tab active" data-room-type="cozinha" data-default-cm="320">Cozinha</button>
                <button type="button" class="archetype-tab room-type-tab" data-room-type="quarto" data-default-cm="340">Quarto / Closet</button>
                <button type="button" class="archetype-tab room-type-tab" data-room-type="sala" data-default-cm="340">Sala / Home</button>
                <button type="button" class="archetype-tab room-type-tab" data-room-type="banheiro" data-default-cm="180">Banheiro</button>
                <button type="button" class="archetype-tab room-type-tab" data-room-type="lavanderia" data-default-cm="240">Lavanderia</button>
                <button type="button" class="archetype-tab room-type-tab" data-room-type="escritorio" data-default-cm="280">Escritório</button>
                <button type="button" class="archetype-tab room-type-tab" data-room-type="varanda_gourmet" data-default-cm="320">Área Gourmet</button>
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
                placeholder="Ex: Quero balcão de pia, cooktop, torre quente e armário aéreo..."
              ></textarea>
              <div class="prompt-chips-row" id="room-req-chips"></div>
            </div>

            <!-- Passo 4: Padrão MDF (2 Cores + Catálogo Completo) & Ferragens -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">4</span>
                <span class="step-label">Padrões MDF (Frentes &amp; Caixaria) &amp; Ferragens</span>
              </div>

              <div class="wood-grid" id="room-finish-selector">
                ${finishesHtml}
              </div>

              <div style="margin-top: 10px;">
                <label for="room-full-catalog-select" style="display:block; font-size:0.74rem; font-weight:600; color:var(--text-secondary); margin-bottom:4px;">
                  Ou pesquise todos os ${ALL_MDF_FINISHES.length} padrões da tabela (${ALL_MDF_FINISHES.length} Duratex/Arauco):
                </label>
                <select id="room-full-catalog-select" class="prompt-input-area" style="padding: 8px 10px; min-height: 0; font-size: 0.8rem;">
                  ${catalogOptionsHtml}
                </select>
              </div>

              <!-- Combinação 2 cores: Caixaria interna -->
              <div style="margin-top: 10px; padding: 9px 10px; border-radius: 8px; background: var(--bg-subtle); border: 1px solid var(--border-subtle);">
                <label style="display:flex; align-items:center; gap:8px; font-size:0.79rem; font-weight:600; cursor:pointer; color:var(--text-primary);">
                  <input type="checkbox" id="room-split-carcass-toggle" checked />
                  <span>Combinar Caixaria Interna em Branco (economia de chapas)</span>
                </label>
                <div id="room-carcass-select-wrap" style="margin-top: 6px;">
                  <select id="room-carcass-select" class="prompt-input-area" style="padding: 6px 8px; min-height: 0; font-size: 0.78rem;">
                    ${carcassOptionsHtml}
                  </select>
                </div>
              </div>

              <!-- Tampo / Pedra + Ferragens -->
              <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top: 10px;" id="room-counter-selector">
                <button type="button" class="ctrl-btn active room-counter-btn" data-counter="claro">Tampo Claro</button>
                <button type="button" class="ctrl-btn room-counter-btn" data-counter="escuro">Tampo Escuro</button>
                <button type="button" class="ctrl-btn room-counter-btn" data-counter="madeira">Tampo Madeira</button>
              </div>

              <div class="tension-row" id="room-hardware-selector" style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
                ${hardwareHtml}
              </div>
            </div>

            <!-- Botão Principal -->
            <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-analyze-empty-room" style="margin-top: 16px;">
              <span id="btn-analyze-room-text">🔍 Analisar Cômodo e Gerar Proposta 3D</span>
            </button>
            <p id="room-ai-engine-hint" style="font-size: 0.76rem; color: var(--text-muted); text-align: center; margin-top: 8px;">
              Visão Computacional Hugging Face (MoGe-2 + Qwen2-VL) &bull; Layouts em L / Ilha &bull; Tabela real
            </p>

          </div>

          <!-- Coluna Direita: Visualizador 3D + Estimativa + Edição Rápida + WhatsApp -->
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
                  <p class="deal-summary" id="room-deal-finish-summary">Frentes: Branco Ártico Trama &bull; Ferragens Slow / Oculta</p>
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
                <div class="deal-perk-item">✓ Chapas 15mm/6mm e ferragens reais da planilha</div>
                <div class="deal-perk-item">✓ Exportação 3D compatível com SketchUp (.OBJ)</div>
                <div class="deal-perk-item">✓ Ajuste larguras (-/+ 10 cm) e veja o preço na hora</div>
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
