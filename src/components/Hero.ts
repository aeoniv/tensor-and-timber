export function renderHero(): string {
  return `
    <section class="hero-section" id="hero-section">
      <div class="app-container">
        <div class="hero-content">
          <div class="hero-text-col">
            <div class="hero-badge-row">
              <span class="section-tag gold">
                Private Architectural Atelier
              </span>
              <span class="section-tag-subtle">
                Aerospace Tensile Rigging
              </span>
            </div>

            <h1 class="hero-title">
              Sculptural Hardwoods.<br>
              <span class="gold-gradient">Defying Gravity</span> Through Tension.
            </h1>

            <p class="hero-subtitle">
              We design and handcraft floating tensegrity furniture and timber geodesic sanctuaries for luxury residences and architectural spaces. Hand-calibrated in solid FSC hardwoods with aerospace-grade rigging.
            </p>

            <div class="hero-cta-group">
              <a href="#atelier-section" class="btn btn-primary-gold" id="hero-btn-design-3d">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Design Custom Piece in 3D</span>
              </a>

              <button type="button" class="btn btn-glass" id="hero-btn-commission">
                <span>Request Commission Quote</span>
              </button>
            </div>

            <div class="hero-stats-row">
              <div class="stat-item">
                <span class="stat-val">6–8 Wks</span>
                <span class="stat-label">Bespoke Fabrication</span>
              </div>
              <div class="stat-item">
                <span class="stat-val cyan">1,800 kg</span>
                <span class="stat-label">Tensile Load Rating</span>
              </div>
              <div class="stat-item">
                <span class="stat-val">4 Slots</span>
                <span class="stat-label">Quarterly Capacity</span>
              </div>
            </div>
          </div>

          <!-- Hero 3D Stage -->
          <div class="hero-visual-stage">
            <div class="stage-overlay-hud">
              <span class="hud-pill" id="hero-model-pill">
                <strong>✨ Leviton Masterpiece</strong> &bull; Real 3D Neural Mesh
              </span>
              <span class="hud-pill">
                Left Click: Orbit &bull; Scroll: Zoom
              </span>
            </div>

            <div class="stage-canvas-container" id="hero-3d-canvas"></div>

            <div class="stage-bottom-controls">
              <div class="toggle-group">
                <button class="toggle-btn active" id="hero-btn-autorotate">Spin: ON</button>
                <button class="toggle-btn" id="hero-btn-wireframe">Wireframe</button>
              </div>

              <div class="toggle-group">
                <button class="toggle-btn active" id="hero-light-studio">Warm</button>
                <button class="toggle-btn" id="hero-light-daylight">Daylight</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
