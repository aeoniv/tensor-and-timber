export function renderAtelierStudio(): string {
  return `
    <section class="section section-atelier" id="atelier-section">
      <div class="container">
        
        <div class="section-title-wrap">
          <span class="badge">Estúdio 3D Interativo &bull; Hugging Face ZeroGPU</span>
          <h2 class="section-title">Geração 3D por Texto ou Imagem</h2>
          <p class="section-subtitle">
            Informe a descrição do móvel ou faça upload de um croqui/foto de referência. O motor neural ZeroGPU processa a geometria e compila a malha 3D real (.GLB) diretamente no navegador.
          </p>
        </div>

        <div class="atelier-grid">
          
          <!-- Configurator Column -->
          <div class="config-box">
            
            <!-- Step 1: Archetype -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">1</span>
                <span class="step-label">Tipo de Mobiliário</span>
              </div>
              <div class="archetype-tabs-row" id="archetype-selector">
                <button class="archetype-tab active" data-archetype="dining-table" data-name="Mesa de Jantar Flutuante" data-price="R$ 38.500 – R$ 48.000">
                  Mesa de Jantar
                </button>
                <button class="archetype-tab" data-archetype="chair" data-name="Poltrona Tensa Lounge" data-price="R$ 18.900 – R$ 24.500">
                  Poltrona
                </button>
                <button class="archetype-tab" data-archetype="shelving-unit" data-name="Aparador Suspenso Cerrado" data-price="R$ 26.000 – R$ 34.000">
                  Aparador
                </button>
                <button class="archetype-tab" data-archetype="coffee-table" data-name="Mesa de Centro Tupi" data-price="R$ 15.800 – R$ 21.000">
                  Mesa de Centro
                </button>
              </div>
            </div>

            <!-- Step 2: Custom Prompt (Text Input) -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">2</span>
                <span class="step-label">Entrada por Texto (Prompt)</span>
              </div>
              <textarea 
                id="atelier-custom-prompt-input" 
                rows="2" 
                class="prompt-input-area"
                placeholder="Ex: Mesa de jantar retangular flutuante em madeira nobre com cabos de aço inox e base tensil..."
              ></textarea>
              <div class="prompt-chips-row">
                <button type="button" class="prompt-chip" data-phrase="Mesa de jantar para 8 pessoas com cabos de aço e madeira maciça">Mesa (8 Lugares)</button>
                <button type="button" class="prompt-chip" data-phrase="Aparador suspenso com portas ripadas em freijó">Aparador Suspenso</button>
                <button type="button" class="prompt-chip" data-phrase="Mesa de centro com apoio tensil e tampo circular">Mesa de Centro</button>
                <button type="button" class="prompt-chip" data-phrase="Banqueta minimalista com pés cônicos em peroba rosa">Banqueta Minimalista</button>
              </div>
            </div>

            <!-- Step 3: Image / Sketch Upload (Image Input) -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">3</span>
                <span class="step-label">Entrada por Imagem (Croqui ou Foto)</span>
              </div>
              <div class="sketch-dropzone" id="atelier-sketch-dropzone">
                <input type="file" id="atelier-sketch-file-input" accept="image/png,image/jpeg,image/webp" style="display: none;" />
                
                <div class="sketch-empty-state" id="atelier-sketch-empty-state">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p class="sketch-drop-title">Anexar Croqui ou Foto de Referência</p>
                  <p class="sketch-drop-hint">Clique ou arraste um arquivo PNG, JPG ou WEBP para a IA reconstruir em 3D</p>
                </div>

                <div class="sketch-preview-wrap" id="atelier-sketch-preview-wrap" style="display: none;">
                  <img id="atelier-sketch-preview-img" src="" alt="Croqui anexado" class="sketch-preview-img" />
                  <button type="button" class="btn-remove-sketch" id="btn-remove-atelier-sketch" title="Remover imagem">&times;</button>
                </div>
              </div>
            </div>

            <!-- Step 4: Wood / Material -->
            <div class="config-step">
              <div class="step-header">
                <span class="step-number">4</span>
                <span class="step-label">Opção de Madeira ou Acabamento</span>
              </div>
              <p class="step-subtitle">A madeira e o acabamento são definidos pelo cliente. Veja opções de referência:</p>
              
              <div class="wood-grid" id="wood-species-selector">
                <button class="wood-card-btn active" data-wood="cumaru" data-wood-name="Cumaru">
                  <span class="wood-color-dot" style="background: #8b5a2b;"></span>
                  <div>
                    <span class="wood-text-k">Cumaru</span>
                    <span class="wood-text-v">Tom Castanho &bull; Alta Densidade</span>
                  </div>
                </button>

                <button class="wood-card-btn" data-wood="freijo" data-wood-name="Freijó">
                  <span class="wood-color-dot" style="background: #b8976b;"></span>
                  <div>
                    <span class="wood-text-k">Freijó</span>
                    <span class="wood-text-v">Tom Claro &bull; Veios Suaves</span>
                  </div>
                </button>

                <button class="wood-card-btn" data-wood="jacaranda" data-wood-name="Jacarandá">
                  <span class="wood-color-dot" style="background: #3d2b1f;"></span>
                  <div>
                    <span class="wood-text-k">Jacarandá</span>
                    <span class="wood-text-v">Tom Escuro &bull; Desenho Marcante</span>
                  </div>
                </button>

                <button class="wood-card-btn" data-wood="pequia" data-wood-name="Pequiá">
                  <span class="wood-color-dot" style="background: #dfbe8f;"></span>
                  <div>
                    <span class="wood-text-k">Pequiá</span>
                    <span class="wood-text-v">Tom Claro &bull; Textura Viva</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- PRIMARY ACTION: GENERATE 3D BUTTON -->
            <button class="btn btn-primary btn-block btn-lg" id="btn-generate-custom-3d" style="margin-top: 20px;">
              <span id="btn-generate-3d-text">✨ Gerar Objeto 3D com IA (Hugging Face ZeroGPU)</span>
            </button>
            <p style="font-size: 0.78rem; color: #78716c; text-align: center; margin-top: 8px;">
              Motor Neural ZeroGPU ativo &bull; Reconstrução 3D real por texto ou imagem &bull; Download .GLB
            </p>

          </div>

          <!-- 3D Stage & Deal Column -->
          <div class="visualizer-column">
            
            <div class="atelier-canvas-card">
              <div class="atelier-canvas-header">
                <span class="stage-pill-tag" id="atelier-status-label">Visualização 3D Ativa</span>
                <span class="stage-hint" id="atelier-model-pill">Mesa de Jantar em Cumaru</span>
              </div>

              <div class="atelier-canvas-viewport" id="atelier-3d-canvas"></div>

              <div class="stage-controls-bar">
                <div style="display: flex; gap: 8px;">
                  <button class="ctrl-btn active" id="atelier-btn-autorotate">Girar: ON</button>
                  <button class="ctrl-btn" id="atelier-btn-wireframe">Aramado</button>
                  <button class="ctrl-btn" id="atelier-btn-lighting">Luz Natural</button>
                </div>
                <button class="ctrl-btn" id="btn-download-glb">Baixar 3D (.GLB)</button>
              </div>
            </div>

            <!-- Deal / Summary Card -->
            <div class="deal-card" id="deal-closing-card">
              <div class="deal-header">
                <div>
                  <h3 class="deal-title" id="deal-project-name">Mesa de Jantar Flutuante</h3>
                  <p class="deal-summary" id="deal-wood-summary">Cumaru &bull; Aço Inox</p>
                </div>
                <div class="deal-price" id="deal-price-bracket">R$ 38.500 – R$ 48.000</div>
              </div>

              <div class="deal-perks">
                <div class="deal-perk-item">✓ Dimensões adaptadas ao seu ambiente</div>
                <div class="deal-perk-item">✓ Madeira e acabamento à sua escolha</div>
                <div class="deal-perk-item">✓ Acompanhamento visual em 3D</div>
                <div class="deal-perk-item">✓ Entrega e montagem no local</div>
              </div>

              <div class="deal-actions">
                <a 
                  id="deal-btn-whatsapp" 
                  href="https://wa.me/558398229900?text=Olá!%20Gostaria%20de%20um%20orçamento%20para%20uma%20Mesa%20de%20Jantar%20Flutuante%20sob%20medida." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-whatsapp btn-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.815 2.791.815 3.179 0 5.765-2.586 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.741 0-3.376-.448-4.807-1.231l-5.193 1.36 1.385-5.059c-.886-1.488-1.385-3.228-1.385-5.07 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                  </svg>
                  <span>Pedir Orçamento desta Configuração no WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}
