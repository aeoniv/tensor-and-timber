export function renderHero(): string {
  return `
    <section class="hero-section" id="hero-section">
      <div class="app-container">
        <div class="hero-content">
          <div class="hero-text-col">
            <div class="hero-badge-row">
              <span class="section-tag gold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Master-Crafted Architectural Woodwork
              </span>
              <span class="section-tag cyan">
                Aerospace Tensile Engineering
              </span>
            </div>

            <h1 class="hero-title">
              Defying Gravity with <span class="gold-gradient">Solid Hardwoods</span> &amp; <span class="cyan-gradient">Geometric Tension</span>.
            </h1>

            <p class="hero-subtitle">
              We design and handcraft floating tensegrity furniture and timber geodesic dome sanctuaries. Where ancient Japanese joinery harmonizes with continuous tension to create structural miracles that redefine residential and commercial spaces.
            </p>

            <div class="hero-cta-group">
              <a href="#planner-section" class="btn btn-primary-gold" id="hero-btn-planner">
                <span>Configure Your Project in 3D</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>

              <a href="#projects-section" class="btn btn-glass">
                <span>Explore Featured Works</span>
              </a>

              <a href="#hf-spaces-section" class="btn btn-outline-gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                <span>Hugging Face AI Visualizer</span>
              </a>
            </div>

            <div class="hero-stats-row">
              <div class="stat-item">
                <span class="stat-val">100%</span>
                <span class="stat-label">FSC Solid Hardwoods</span>
              </div>
              <div class="stat-item">
                <span class="stat-val cyan">1,800 kg</span>
                <span class="stat-label">Tensile Load Safety Factor</span>
              </div>
              <div class="stat-item">
                <span class="stat-val">0.2 mm</span>
                <span class="stat-label">CNC Joint Tolerance</span>
              </div>
            </div>
          </div>

          <!-- Hero 3D Stage -->
          <div class="hero-visual-stage">
            <div class="stage-overlay-hud">
              <span class="hud-pill" id="hero-model-pill">
                <strong>Floating Leviton Model</strong> &bull; Interactive 3D WebGL
              </span>
              <span class="hud-pill">
                Drag to Rotate &bull; Scroll to Zoom
              </span>
            </div>

            <div class="stage-canvas-container" id="hero-3d-canvas"></div>

            <div class="stage-bottom-controls">
              <div class="toggle-group">
                <button class="toggle-btn active" id="hero-toggle-tensegrity">Tensegrity Table</button>
                <button class="toggle-btn" id="hero-toggle-geodesic">Geodesic Dome</button>
              </div>

              <div class="toggle-group">
                <button class="toggle-btn" id="hero-btn-autorotate" title="Toggle Auto-Spin">Auto-Spin: ON</button>
                <button class="toggle-btn" id="hero-btn-vectors" title="Toggle Physics Vectors">Physics Vectors</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
