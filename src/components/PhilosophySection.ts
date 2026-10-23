export function renderPhilosophySection(): string {
  return `
    <section class="section philosophy-section" id="philosophy-section">
      <div class="container">
        
        <div class="section-header text-center">
          <span class="section-tag gold">
            <span class="flag-dot-green"></span>
            Manifesto &bull; Marcenaria Autoral Brasileira
          </span>
          <h2 class="section-title">
            O Encontro entre a <span class="gold-gradient">Maciça Brasileira</span> e a Física Tensil
          </h2>
          <p class="section-subtitle">
            Unimos o legado do modernismo brasileiro — Sergio Rodrigues, Zanine Caldas e Niemeyer — à engenharia de estruturas tensionadas da era aeroespacial.
          </p>
        </div>

        <div class="philosophy-pillars-grid">
          
          <!-- Pillar 1: Sustainable Timber Origin -->
          <div class="pillar-card glass-panel">
            <div class="pillar-icon-box">
              <span class="pillar-icon">🌳</span>
            </div>
            <h3 class="pillar-title">Madeiras Nativas 100% FSC®</h3>
            <p class="pillar-desc">
              Trabalhamos exclusivamente com pranchas maciças de manejo florestal sustentável ou vigas de demolição com documentação DOF e rastreabilidade pelo IBAMA.
            </p>
            <div class="pillar-tags">
              <span>Cumaru Amazônico</span>
              <span>Freijó</span>
              <span>Jacarandá da Bahia</span>
              <span>Pequiá</span>
            </div>
          </div>

          <!-- Pillar 2: Aerospace Tensile Engineering -->
          <div class="pillar-card glass-panel">
            <div class="pillar-icon-box">
              <span class="pillar-icon">⚙️</span>
            </div>
            <h3 class="pillar-title">Engenharia de Tensegridade</h3>
            <p class="pillar-desc">
              Nossas peças não utilizam pernas rígidas convencionais. O tampo flutua no ar sustentado por cabos de aço naval 316 e titânio PVD, calibrados para deflexão zero sob cargas de até 480 kg.
            </p>
            <div class="pillar-tags">
              <span>Aço Inox Naval 316</span>
              <span>Titânio PVD</span>
              <span>Deflexão Zero</span>
            </div>
          </div>

          <!-- Pillar 3: Handcrafted Luxury Atelier -->
          <div class="pillar-card glass-panel">
            <div class="pillar-icon-box">
              <span class="pillar-icon">✨</span>
            </div>
            <h3 class="pillar-title">Execução Artesanal &amp; Única</h3>
            <p class="pillar-desc">
              Cada peça é esculpida à mão por mestres marceneiros em nossos ateliês em São Paulo e Paraty. Acabamento orgânico com óleos vegetais atóxicos que preservam o toque e aroma natural da madeira.
            </p>
            <div class="pillar-tags">
              <span>Óleo Vegetal Natural</span>
              <span>Garantia Vitalícia</span>
              <span>Peças Numeradas</span>
            </div>
          </div>

        </div>

        <!-- Quote from the Atelier -->
        <div class="philosophy-quote-card glass-panel">
          <blockquote class="philosophy-quote">
            "A tensegridade nos ensina que a estabilidade não vem da rigidez maciça, mas da harmonia perfeita entre forças opostas de tração e compressão."
          </blockquote>
          <div class="quote-author">
            <strong>Ateliê Tensor &amp; Timber</strong> &bull; São Paulo &amp; Paraty, Brasil
          </div>
        </div>

      </div>
    </section>
  `;
}
