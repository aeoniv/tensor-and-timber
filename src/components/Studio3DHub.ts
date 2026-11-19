export function renderStudio3DHub(roomHtml: string, atelierHtml: string): string {
  return `
    <section class="section studio-hub-section" id="studio-3d-hub">
      <div class="container">

        <div class="section-header text-center studio-hub-header">
          <span class="section-tag">Suíte 3D Interativa</span>
          <h2 class="section-title">
            Projete em <span class="accent-text">3D em Tempo Real</span>
          </h2>
          <p class="section-subtitle">
            Todas as ferramentas 3D em um único espaço: gere o ambiente completo pela foto (com SketchUp .DAE e corte CNC) ou crie peças avulsas por texto e croqui.
          </p>

          <!-- Unified Switcher Tabs between both 3D Studios -->
          <div class="studio-hub-switcher" role="tablist" aria-label="Ferramentas do Estúdio 3D">
            <button
              type="button"
              role="tab"
              aria-selected="true"
              aria-controls="hub-panel-room"
              class="studio-hub-tab active"
              id="hub-tab-room"
              data-hub-tab="room"
            >
              <span class="studio-tab-title">📐 Ambientes Planejados</span>
              <span class="studio-tab-sub">Foto do cômodo &bull; 124 MDFs &bull; .DAE / .DXF</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected="false"
              aria-controls="hub-panel-atelier"
              class="studio-hub-tab"
              id="hub-tab-atelier"
              data-hub-tab="atelier"
            >
              <span class="studio-tab-title">✨ Criador de Móvel 3D</span>
              <span class="studio-tab-sub">Texto ou croqui &bull; Peças exclusivas .GLB</span>
            </button>
          </div>
        </div>

        <div class="studio-hub-panels">
          <div id="hub-panel-room" class="studio-hub-panel is-active" role="tabpanel" aria-labelledby="hub-tab-room">
            ${roomHtml}
          </div>
          <div id="hub-panel-atelier" class="studio-hub-panel" role="tabpanel" aria-labelledby="hub-tab-atelier">
            ${atelierHtml}
          </div>
        </div>

      </div>
    </section>
  `;
}
