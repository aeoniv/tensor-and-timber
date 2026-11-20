import {
  ALL_MDF_FINISHES,
  MDF_FEATURED_FINISHES,
  HARDWARE_KIT_OPTIONS,
  MODULE_CATALOG_TEMPLATES,
} from '../data/pricingCatalog';

export function renderRoomPlannerStudio(): string {
  const finishesHtml = MDF_FEATURED_FINISHES.map((f, idx) => `
    <button
      type="button"
      class="wood-card-btn room-finish-btn ${idx === 0 ? 'active' : ''}"
      data-finish-id="${f.id}"
      title="${f.name15} • ${f.tierLabel} • Cód: ${f.cod15}"
    >
      <span class="wood-color-dot" style="background: ${f.hex};"></span>
      <div>
        <span class="wood-text-k">${f.label}</span>
        <span class="wood-text-v">R$ ${f.sellPrice15.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ch</span>
      </div>
    </button>
  `).join('');

  const catalogOptionsHtml = ALL_MDF_FINISHES.map((f) => `
    <option value="${f.id}">
      ${f.label} — ${f.tierLabel} (${f.cod15}) • R$ ${f.sellPrice15.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ch
    </option>
  `).join('');

  const carcassOptionsList = ALL_MDF_FINISHES.filter(
    (f) => ['branco-artico', 'branco-ultra', 'cinza-platina', 'gianduia-sense'].includes(f.id) || f.name15.toLowerCase().includes('ultra')
  );
  const carcassOptionsHtml = carcassOptionsList
    .map((f) => `<option value="${f.id}">Caixaria: ${f.label}${f.name15.toLowerCase().includes('ultra') && !f.label.toLowerCase().includes('ultra') ? ' (Ultra)' : ''} (R$ ${f.sellPrice15.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ch)</option>`)
    .join('');

  const hardwareHtml = HARDWARE_KIT_OPTIONS.map((h) => `
    <button
      type="button"
      class="tension-pill room-hardware-btn ${h.id === 'slow' ? 'active' : ''}"
      data-hardware-id="${h.id}"
      title="${h.description}"
    >
      ${h.label}
    </button>
  `).join('');

  const addModuleOptionsHtml = MODULE_CATALOG_TEMPLATES.map(
    (tpl) => `<option value="${tpl.type}">${tpl.category} — ${tpl.label} (${tpl.widthCm}×${tpl.heightCm}×${tpl.depthCm}cm)</option>`
  ).join('');

  return `
    <div id="room-planner-section" class="hub-inner-workspace">
      <div class="hub-workspace-caption">
        <span><strong>Projeto por Foto</strong> &bull; Envie a foto do espaço e visualize a proposta em 3D.</span>
        <span class="badge">Simulação Interativa</span>
      </div>

      <div class="atelier-grid">

          <!-- Coluna Esquerda: Fluxo Rápido -> Ação IA -> Personalização Ao Vivo -->
          <div class="config-box">

            <!-- Passo 1: 7 Tipos de Cômodo -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">1</span>
                <span class="step-label">Escolha o Ambiente</span>
              </div>
              <div class="room-type-grid" id="room-type-selector">
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
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
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
                <span class="step-label">Medida Real &amp; O que Você Precisa</span>
              </div>
              <div class="measure-grid">
                <div class="field-group">
                  <label for="room-ref-type" class="field-label">Referência da foto</label>
                  <select id="room-ref-type" class="select-control">
                    <option value="wall_width">Largura da parede</option>
                    <option value="ceiling_height">Altura pé-direito</option>
                  </select>
                </div>
                <div class="field-group">
                  <label for="room-ref-cm" class="field-label">Medida exata</label>
                  <div class="input-unit-wrap">
                    <input
                      id="room-ref-cm"
                      type="number"
                      min="120"
                      max="900"
                      step="5"
                      value="320"
                      class="number-control"
                      aria-label="Medida de referência em centímetros"
                    />
                    <span class="input-unit-suffix">cm</span>
                  </div>
                </div>
              </div>

              <div class="field-group">
                <label for="room-requirements-input" class="field-label">Móveis desejados ou observações</label>
                <textarea
                  id="room-requirements-input"
                  rows="2"
                  class="prompt-input-area"
                  placeholder="Ex: Quero balcão de pia, cooktop, torre quente e armário aéreo..."
                ></textarea>
              </div>
              <div class="prompt-chips-row" id="room-req-chips"></div>
            </div>

            <!-- Ação Principal Imediata (antes das opções avançadas) -->
            <div class="planner-cta-block">
              <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-analyze-empty-room">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <span id="btn-analyze-room-text">Analisar Foto e Gerar Proposta 3D</span>
              </button>
              <button type="button" class="btn btn-outline btn-block btn-sm" id="btn-start-blank-room">
                Reiniciar Ambiente em Modo Manual (Sem Foto)
              </button>
              <p id="room-ai-engine-hint" class="planner-cta-hint">
                Visão Computacional 3D &bull; Layouts em L / Ilha &bull; Atualização ao vivo no painel ao lado
              </p>
            </div>

            <!-- Passo 4: Personalização Ao Vivo de MDF, Frentes & Ferragens -->
            <details class="customizer-accordion" open>
              <summary class="customizer-summary">
                <div class="step-header" style="margin-bottom: 0;">
                  <span class="step-number">4</span>
                  <span class="step-label">MDF, Frentes &amp; Ferragens (Ao Vivo no 3D)</span>
                </div>
                <span class="customizer-chevron">▾</span>
              </summary>

              <div class="customizer-body">
                <div class="wood-grid" id="room-finish-selector">
                  ${finishesHtml}
                </div>

                <div class="field-group">
                  <label for="room-full-catalog-select" class="field-label">
                    Pesquisar todos os ${ALL_MDF_FINISHES.length} padrões Duratex / Arauco:
                  </label>
                  <select id="room-full-catalog-select" class="select-control select-control--compact">
                    ${catalogOptionsHtml}
                  </select>
                </div>

                <!-- Combinação 2 cores: Caixaria interna -->
                <div class="subpanel-card">
                  <label class="checkbox-row">
                    <input type="checkbox" id="room-split-carcass-toggle" checked />
                    <span>Combinar Caixaria Interna em Branco (economia de chapas)</span>
                  </label>
                  <div id="room-carcass-select-wrap">
                    <select id="room-carcass-select" class="select-control select-control--compact" aria-label="Padrão da caixaria interna">
                      ${carcassOptionsHtml}
                    </select>
                  </div>
                </div>

                <!-- Tampo -->
                <div class="field-group">
                  <span class="field-label">Tom da Bancada / Tampo</span>
                  <div class="pill-toggle-row" id="room-counter-selector">
                    <button type="button" class="ctrl-btn active room-counter-btn" data-counter="claro">Tampo Claro</button>
                    <button type="button" class="ctrl-btn room-counter-btn" data-counter="escuro">Tampo Escuro</button>
                    <button type="button" class="ctrl-btn room-counter-btn" data-counter="madeira">Tampo Madeira</button>
                  </div>
                </div>

                <!-- Estilo das Frentes, Puxador e Espessura -->
                <div class="subpanel-card">
                  <div class="field-group">
                    <span class="field-label">Estilo das Frentes / Vidros</span>
                    <div class="pill-toggle-row" id="room-front-style-selector">
                      <button type="button" class="ctrl-btn active room-front-style-btn" data-front-style="lisa">Lisa Reta</button>
                      <button type="button" class="ctrl-btn room-front-style-btn" data-front-style="cava45">Cava 45°</button>
                      <button type="button" class="ctrl-btn room-front-style-btn" data-front-style="provencal">Provençal</button>
                      <button type="button" class="ctrl-btn room-front-style-btn" data-front-style="vidro_reflecta">Vidro Reflecta</button>
                    </div>
                  </div>
                  <div class="two-col-grid">
                    <div class="field-group">
                      <label for="room-handle-style-select" class="field-label">Puxador / Acionamento</label>
                      <select id="room-handle-style-select" class="select-control select-control--compact">
                        <option value="perfil_18">Perfil Alumínio 18mm</option>
                        <option value="perfil_15">Perfil Slim 15mm</option>
                        <option value="fecho_toque">Fecho Toque (Sem Puxador)</option>
                      </select>
                    </div>
                    <div class="field-group">
                      <label for="room-thickness-select" class="field-label">Espessura Estrutural</label>
                      <select id="room-thickness-select" class="select-control select-control--compact">
                        <option value="15mm">15mm Padrão (+6mm)</option>
                        <option value="18mm">18mm Reforçado</option>
                        <option value="25mm_engrossado">25/30mm Engrossado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="field-group">
                  <span class="field-label">Linha de Ferragens</span>
                  <div class="tension-pills-row" id="room-hardware-selector">
                    ${hardwareHtml}
                  </div>
                </div>
              </div>
            </details>

          </div>

          <!-- Coluna Direita (Fixa no Scroll Desktop): Visualizador 3D + Orçamento + Edição + Export -->
          <div class="visualizer-column">

            <div class="atelier-canvas-card">
              <div class="atelier-canvas-header">
                <span class="stage-pill-tag" id="room-status-pill">Aguardando foto do cômodo vazio</span>
                <span class="stage-hint" id="room-dims-pill">Escala calibrada (cm)</span>
              </div>

              <div class="atelier-canvas-viewport" id="room-planner-canvas"></div>

              <div class="stage-controls-stack">
                <div class="stage-controls-row">
                  <span class="controls-group-label">Cena 3D:</span>
                  <button type="button" class="ctrl-btn" id="room-btn-autorotate">Girar: OFF</button>
                  <button type="button" class="ctrl-btn" id="room-btn-wireframe">Aramado</button>
                  <button type="button" class="ctrl-btn active" id="room-btn-shell">Paredes</button>
                  <button type="button" class="ctrl-btn" id="room-btn-moge" style="display: none;">Malha MoGe-2</button>
                </div>
                <div class="stage-controls-row stage-controls-row--export">
                  <span class="controls-group-label">Exportar:</span>
                  <button type="button" class="ctrl-btn ctrl-btn--primary" id="room-btn-export-dae" title="Exportar para SketchUp">SketchUp</button>
                  <button type="button" class="ctrl-btn" id="room-btn-export-obj" title="Exportar malha 3D">3D (.OBJ)</button>
                  <button type="button" class="ctrl-btn ctrl-btn--accent" id="room-btn-export-dxf" title="Exportar planta de corte 2D">Planta 2D</button>
                  <button type="button" class="ctrl-btn ctrl-btn--accent" id="room-btn-export-csv" title="Exportar lista de corte">Lista de Corte</button>
                  <button type="button" class="ctrl-btn" id="room-btn-download-glb" title="Baixar modelo 3D">Modelo 3D</button>
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

              <div id="room-analysis-details" class="analysis-details-wrap">
                <p id="room-architect-notes" class="architect-notes-text"></p>
                <div id="room-obstacles-badges" class="obstacles-badges-row"></div>
                <div id="room-modules-list" class="module-list-card"></div>

                <!-- Adicionar módulo avulso direto na cena 3D -->
                <div id="room-add-module-bar" class="add-module-bar">
                  <select id="room-add-module-type" class="select-control select-control--compact" aria-label="Tipo de módulo para adicionar">
                    ${addModuleOptionsHtml}
                  </select>
                  <select id="room-add-module-wall" class="select-control select-control--compact" aria-label="Parede de posicionamento">
                    <option value="back">Fundo</option>
                    <option value="left">Esq.</option>
                    <option value="right">Dir.</option>
                    <option value="center">Centro</option>
                  </select>
                  <button type="button" class="ctrl-btn active" id="btn-add-custom-module">+ Módulo</button>
                </div>
              </div>

              <div class="deal-perks" id="room-bom-perks">
                <div class="deal-perk-item">✓ Cantos em L, tamponamento até o teto e muxarabi</div>
                <div class="deal-perk-item">✓ Cava 45°, Provençal, Vidro Reflecta e 18/25mm</div>
                <div class="deal-perk-item">✓ Exportação para SketchUp e lista de corte</div>
                <div class="deal-perk-item">✓ Adicione móveis e ajuste medidas (-/+ 10 cm) na hora</div>
              </div>

              <div class="deal-actions">
                <a
                  id="room-btn-whatsapp"
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20orçar%20um%20projeto%20planejado%20pelo%20simulador%203D%20da%2083%20Ambientes."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-whatsapp btn-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                  </svg>
                  <span>Enviar Projeto 3D e Pré-Orçamento no WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

    </div>
  `;
}
