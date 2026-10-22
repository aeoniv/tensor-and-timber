export function renderAtelierStudio(): string {
  return `
    <section class="section" id="atelier-section">
      <div class="app-container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag gold">Bespoke 3D Atelier</span>
          <h2 class="section-title">
            Envision Your Commission in <span class="gold-gradient">Real-Time 3D</span>
          </h2>
          <p class="section-subtitle">
            Configure your custom tensegrity furniture or timber geodesic sanctuary. Describe your vision or upload a concept sketch to generate real 3D geometry with physics equilibrium and instant investment brackets.
          </p>
        </div>

        <!-- Unified Side-by-Side 3D Workspace -->
        <div class="atelier-workspace-grid">

          <!-- Left Column: Architectural Controls -->
          <div class="glass-panel gold-glow atelier-controls-card">
            <div class="atelier-card-header">
              <div class="atelier-title-group">
                <span class="pulse-indicator gold"></span>
                <span class="card-heading">Architectural Specification</span>
              </div>
              <button type="button" class="btn btn-glass btn-xs" id="btn-clear-atelier-inputs">
                Reset
              </button>
            </div>

            <!-- Archetype Pills -->
            <div class="control-block">
              <label class="control-label">1. Select Archetype:</label>
              <div class="toggle-group full-width" id="atelier-archetype-tabs">
                <button class="toggle-btn active" data-archetype="dining-table">Dining Table</button>
                <button class="toggle-btn" data-archetype="lounge-chair">Lounge Chair</button>
                <button class="toggle-btn" data-archetype="geodesic-dome">Geodesic Dome</button>
                <button class="toggle-btn" data-archetype="cantilever-desk">Executive Desk</button>
              </div>
            </div>

            <!-- Architectural Prompt Input -->
            <div class="control-block">
              <div class="control-label-row">
                <label for="atelier-prompt-input" class="control-label">2. Architectural Vision or Dimensions:</label>
                <span class="helper-badge">Auto-parses wood &amp; scale</span>
              </div>
              <textarea id="atelier-prompt-input" rows="3" class="luxury-textarea" placeholder="e.g. 240x100x75cm solid American black walnut live-edge floating tensegrity dining table with PVD gold cables..."></textarea>

              <div class="chips-row">
                <button type="button" class="prompt-chip" data-phrase="240x100x75cm Dining Table">+ 240&times;100cm</button>
                <button type="button" class="prompt-chip" data-phrase="Solid American Black Walnut">+ Walnut</button>
                <button type="button" class="prompt-chip" data-phrase="Yakisugi Charred Cedar">+ Charred Cedar</button>
                <button type="button" class="prompt-chip" data-phrase="PVD Gold Titanium Cables">+ Gold Cables</button>
                <button type="button" class="prompt-chip" data-phrase="Translucent Blue River Glass">+ River Glass</button>
              </div>
            </div>

            <!-- Sketch / Photo Reference Upload -->
            <div class="control-block">
              <div class="control-label-row">
                <label class="control-label">3. Concept Sketch or Photo (Optional):</label>
                <span class="helper-badge cyan">Neural 3D extraction</span>
              </div>

              <div id="atelier-sketch-dropzone" class="luxury-dropzone">
                <input type="file" id="atelier-sketch-file-input" accept="image/png,image/jpeg,image/webp" style="display: none;">

                <div id="atelier-sketch-empty-state" class="dropzone-empty">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.8">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <span class="dropzone-text">Drop sketch, CAD drawing, or photo</span>
                  <button type="button" class="btn btn-glass btn-xs" id="btn-browse-atelier-sketch">Browse File</button>
                </div>

                <div id="atelier-sketch-preview-wrap" class="dropzone-preview" style="display: none;">
                  <img id="atelier-sketch-preview-img" src="" alt="Uploaded Blueprint">
                  <button type="button" id="btn-remove-atelier-sketch" class="dropzone-remove-btn">&times;</button>
                </div>
              </div>
            </div>

            <!-- Generate Action -->
            <div class="generate-btn-wrap">
              <button class="btn btn-primary-gold btn-lg btn-full" id="btn-atelier-generate">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>GENERATE 3D OBJECT &amp; QUOTE</span>
              </button>
              <div class="generator-guarantee-note">
                Constructs genuine Three.js geometry &bull; Direct .GLB export
              </div>
            </div>

            <!-- Generation Progress Box -->
            <div id="atelier-progress-box" class="progress-box" style="display: none;">
              <div class="progress-status-row">
                <span id="atelier-progress-status" class="progress-status-text">Synthesizing 3D geometry...</span>
                <span id="atelier-progress-pct" class="progress-pct-text">25%</span>
              </div>
              <div class="progress-track">
                <div id="atelier-progress-bar" class="progress-bar-fill" style="width: 25%;"></div>
              </div>
            </div>

            <!-- Success Bar -->
            <div id="atelier-success-bar" class="success-bar" style="display: none;">
              <span class="success-icon">&#10004;</span>
              <span id="atelier-success-msg" class="success-text">Real 3D model generated and loaded into the viewport.</span>
            </div>
          </div>

          <!-- Right Column: Live 3D Visualizer & Deal Closing Card -->
          <div class="glass-panel cyan-glow atelier-viewport-card">
            <div class="viewport-card-header">
              <div>
                <span class="section-tag cyan" style="font-size: 0.68rem; margin-bottom: 2px;">Interactive 3D Stage</span>
                <h3 class="viewport-title" id="atelier-active-model-title">
                  Real 3D Geometry: Leviton Tensegrity Dining Table
                </h3>
              </div>

              <!-- Quick Viewport Actions -->
              <div class="viewport-header-actions">
                <button class="btn btn-glass btn-sm" id="btn-atelier-download-glb" title="Export .GLB for Blender / Rhino / CAD">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  <span>Export .GLB</span>
                </button>
              </div>
            </div>

            <!-- The WebGL Canvas -->
            <div class="atelier-canvas-container">
              <div id="atelier-3d-canvas" style="width: 100%; height: 100%;"></div>

              <!-- Top Canvas HUD -->
              <div class="canvas-hud-top">
                <span class="hud-pill" id="atelier-mesh-stats-pill">
                  <strong>Leviton Dining Table</strong> &bull; 23,763 Vertices &bull; 43,973 Polys &bull; 240&times;100&times;75 cm
                </span>

                <div class="toggle-group">
                  <button class="toggle-btn" id="btn-atelier-wireframe">Wireframe: OFF</button>
                  <button class="toggle-btn active" id="btn-atelier-autorotate">Spin: ON</button>
                </div>
              </div>

              <!-- Bottom Canvas HUD -->
              <div class="canvas-hud-bottom">
                <div class="toggle-group">
                  <button class="toggle-btn active" id="btn-atelier-light-studio">Studio Warm</button>
                  <button class="toggle-btn" id="btn-atelier-light-daylight">Daylight</button>
                  <button class="toggle-btn" id="btn-atelier-light-midnight">Midnight</button>
                </div>

                <div class="canvas-help-pill">
                  Drag to Orbit &bull; Scroll to Zoom &bull; Right Click to Pan
                </div>
              </div>
            </div>

            <!-- ================= DEAL CLOSING & INVESTMENT CARD ================= -->
            <div class="deal-closing-card">
              <div class="deal-specs-col">
                <span class="deal-tag">Commission Estimate</span>
                <div class="deal-price-val" id="atelier-price-estimate">
                  $14,800 &ndash; $19,500
                </div>
                <div class="deal-meta-text" id="atelier-meta-specs">
                  Solid FSC Hardwood Slab &bull; Aerospace Dyneema/Titanium Rigging &bull; 6–8 Wks Delivery
                </div>
              </div>

              <div class="deal-cta-col">
                <button class="btn btn-primary-gold btn-lg btn-glow" id="btn-atelier-commission-now">
                  <span>Reserve This Commission Slot</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <span class="deal-guarantee-micro">
                  Includes FEA tension certification &bull; Complimentary wood swatch kit
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  `;
}
