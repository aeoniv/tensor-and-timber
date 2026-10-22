export function renderHFSpacesStudio(): string {
  return `
    <section class="section" id="hf-spaces-section">
      <div class="app-container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag cyan">Spatial 3D Synthesis Studio</span>
          <h2 class="section-title">
            Generate <span class="cyan-gradient">Real 3D Objects</span> From Prompt or Image
          </h2>
          <p class="section-subtitle">
            Synthesize genuine, mathematically balanced 3D furniture models from your custom prompt or uploaded sketch. Every model computes real BufferGeometry, physical cable vectors, and exportable binary .GLB files.
          </p>
        </div>

        <!-- =================================================================
             AI 3D FURNITURE GENERATOR CONSOLE (DUAL-INPUT: IMAGE + PROMPT)
             ================================================================= -->
        <div class="glass-panel cyan-glow" style="padding: 32px; margin-bottom: 36px; border-radius: var(--radius-xl); border: 1px solid rgba(56, 189, 248, 0.25);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <span class="pulse-indicator cyan"></span>
                <span class="section-tag cyan" style="font-size: 0.72rem; letter-spacing: 0.12em;">Spatial CAD &amp; Computer Vision Engine</span>
              </div>
              <h3 style="font-family: var(--font-display); font-size: 1.65rem; color: var(--text-main);">
                Parametric 3D Furniture &amp; Structure Generator
              </h3>
              <p style="color: var(--text-secondary); font-size: 0.92rem; max-width: 680px; margin-top: 4px;">
                Describe your bespoke furniture vision in natural language or upload an architectural sketch. Our computer vision engine extracts the exact perimeter contour and surface relief to build a real 3D timber piece in physical tension equilibrium.
              </p>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="hud-pill" style="font-size: 0.76rem; border-color: rgba(56, 189, 248, 0.3); color: #38bdf8;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; margin-right: 6px;"></span>
                Client-Side Engine Active &bull; Instant Generation
              </span>
            </div>
          </div>

          <!-- Dual Input Columns: Left = Sketch / Image, Right = Text Prompt -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 24px;">

            <!-- Column 1: Attach Sketch or Photo -->
            <div style="background: rgba(15, 23, 42, 0.55); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <label style="font-size: 0.88rem; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  1. Attach Sketch, Blueprint or Photo
                </label>
                <span style="font-size: 0.72rem; color: var(--text-muted);">PNG, JPG, WEBP</span>
              </div>

              <!-- Upload Drag-and-Drop Area -->
              <div id="ai-sketch-dropzone" style="flex: 1; min-height: 140px; border: 2px dashed rgba(56, 189, 248, 0.35); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; text-align: center; cursor: pointer; transition: all 0.25s ease; background: rgba(56, 189, 248, 0.03); position: relative; overflow: hidden;">
                <input type="file" id="ai-sketch-file-input" accept="image/png,image/jpeg,image/webp" style="display: none;">

                <div id="ai-sketch-empty-state" style="display: flex; flex-direction: column; align-items: center;">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.6" style="margin-bottom: 8px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <p style="font-size: 0.82rem; color: var(--text-main); font-weight: 500; margin-bottom: 4px;">
                    Drag &amp; drop sketch or room photo here
                  </p>
                  <p style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 10px;">
                    Contour is automatically traced and extruded into 3D
                  </p>
                  <button type="button" class="btn btn-glass btn-xs" id="btn-browse-sketch" style="font-size: 0.75rem;">
                    Browse Image
                  </button>
                </div>

                <!-- Preview State (Hidden by default) -->
                <div id="ai-sketch-preview-wrap" style="display: none; width: 100%; height: 100%; position: absolute; inset: 0; background: #0b0f19;">
                  <img id="ai-sketch-preview-img" src="" alt="Attached Concept Sketch" style="width: 100%; height: 100%; object-fit: contain;">
                  <button type="button" id="btn-remove-sketch" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.75); border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">&times;</button>
                </div>
              </div>

              <!-- Quick Blueprint Inspiration Pills -->
              <div style="margin-top: 10px;">
                <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 6px;">
                  Or click sample concept blueprint:
                </span>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="sample-img-pill" data-sample="walnut-tensegrity">Tensegrity Table</button>
                  <button type="button" class="sample-img-pill" data-sample="cantilever-desk">Lounge Chair</button>
                  <button type="button" class="sample-img-pill" data-sample="geodesic-dome">3V Timber Dome</button>
                  <button type="button" class="sample-img-pill" data-sample="charred-coffee">Yakisugi Table</button>
                </div>
              </div>
            </div>

            <!-- Column 2: Prompt Input & Engineering Directives -->
            <div style="background: rgba(15, 23, 42, 0.55); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <label for="ai-custom-prompt-input" style="font-size: 0.88rem; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c542" stroke-width="2">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  2. Architectural Prompt Specification
                </label>
                <span style="font-size: 0.72rem; color: #f5c542;">Auto-parses dimensions &amp; species</span>
              </div>

              <textarea id="ai-custom-prompt-input" rows="4" style="width: 100%; flex: 1; background: rgba(9, 10, 15, 0.7); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 12px; color: var(--text-main); font-family: var(--font-body); font-size: 0.88rem; line-height: 1.5; resize: none; outline: none;" placeholder="e.g. 240x100x75cm solid American black walnut live-edge floating tensegrity dining table with PVD gold cables, turnbuckles, and epoxy glass river inlay..."></textarea>

              <!-- Quick Prompt Keyword Chips -->
              <div style="margin-top: 10px;">
                <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 6px;">
                  Append architectural parameters:
                </span>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="prompt-chip" data-phrase="240x100x75cm Dining Table">+ Dining Table (240x100cm)</button>
                  <button type="button" class="prompt-chip" data-phrase="Tensegrity Ergonomic Lounge Chair">+ Lounge Chair</button>
                  <button type="button" class="prompt-chip" data-phrase="4-Tier Floating Tension Bookshelf">+ 4-Tier Shelves</button>
                  <button type="button" class="prompt-chip" data-phrase="8m Timber Geodesic Dome">+ 8m Geodesic Dome</button>
                  <button type="button" class="prompt-chip" data-phrase="Yakisugi Charred Cedar">+ Charred Cedar</button>
                  <button type="button" class="prompt-chip" data-phrase="PVD Gold Titanium Cables">+ Gold Cables</button>
                  <button type="button" class="prompt-chip" data-phrase="Translucent Blue River Glass Inlay">+ River Glass</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Row: Synthesize Button & Status -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <button class="btn btn-primary-cyan btn-lg" id="btn-synthesize-3d-furniture" style="box-shadow: 0 0 25px rgba(56, 189, 248, 0.35);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Synthesize Real 3D Furniture</span>
              </button>

              <span style="font-size: 0.82rem; color: var(--text-muted);">
                Instant client-side 3D geometry &bull; Direct .GLB export
              </span>
            </div>

            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn btn-glass btn-sm" id="btn-clear-ai-inputs" style="font-size: 0.78rem;">
                Reset Inputs
              </button>
            </div>
          </div>

          <!-- Progress Alert Bar -->
          <div id="ai-generation-progress" style="display: none; margin-top: 20px; padding: 16px; background: rgba(15, 23, 42, 0.85); border: 1px solid var(--border-medium); border-radius: var(--radius-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.84rem;">
              <span id="ai-gen-step-status" style="color: #38bdf8; font-weight: 600;">
                Initializing spatial geometry engine...
              </span>
              <span id="ai-gen-step-pct" style="color: var(--text-secondary); font-family: monospace;">
                0%
              </span>
            </div>
            <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
              <div id="ai-gen-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #38bdf8, #f5c542); transition: width 0.25s ease;"></div>
            </div>
          </div>

          <!-- Success Alert Bar -->
          <div id="ai-generation-success-bar" style="display: none; margin-top: 18px; padding: 14px 18px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #10b981; font-size: 1.2rem;">&#10004;</span>
              <span style="font-size: 0.88rem; color: var(--text-main); font-weight: 600;" id="ai-success-msg">
                Real 3D Furniture synthesized successfully! Displayed in the WebGL viewport below.
              </span>
            </div>
            <button class="btn btn-primary-gold btn-sm" id="btn-commission-generated-piece">
              <span>Commission this Exact 3D Piece</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- =================================================================
             MASTER INTERACTIVE 3D OBJECT STAGE (DIRECTLY ON WEBSITE)
             ================================================================= -->
        <div class="glass-panel gold-glow" style="padding: 24px; margin-bottom: 50px; border-radius: var(--radius-xl);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 14px;">
            <div>
              <span class="section-tag gold" style="font-size: 0.7rem; margin-bottom: 4px;">Live In-Page WebGL Renderer</span>
              <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--text-main);" id="ai-active-model-title">
                Real 3D Geometry: Live-Edge Tensegrity Dining Table
              </h3>
            </div>

            <!-- Real Archetype Quick Switches -->
            <div class="toggle-group" id="ai-viewer-model-tabs" style="flex-wrap: wrap;">
              <button class="toggle-btn active" data-archetype="dining-table">Dining Table</button>
              <button class="toggle-btn" data-archetype="lounge-chair">Lounge Chair</button>
              <button class="toggle-btn" data-archetype="shelving-unit">Shelving Unit</button>
              <button class="toggle-btn" data-archetype="geodesic-dome">Geodesic Dome</button>
              <button class="toggle-btn" data-archetype="cantilever-desk">Executive Desk</button>
            </div>
          </div>

          <!-- 3D Canvas Box -->
          <div style="height: 540px; width: 100%; border-radius: var(--radius-lg); position: relative; overflow: hidden; border: 1px solid var(--border-medium); background: radial-gradient(circle at center, #181d29 0%, #090a0f 100%);">
            <div id="ai-studio-3d-canvas" style="width: 100%; height: 100%;"></div>

            <!-- Canvas Top HUD -->
            <div style="position: absolute; top: 16px; left: 16px; right: 16px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; z-index: 10;">
              <span class="hud-pill" style="pointer-events: auto;" id="ai-mesh-stats-pill">
                <strong>Real 3D Mesh</strong> &bull; Loading Geometry...
              </span>

              <div class="toggle-group" style="pointer-events: auto;">
                <button class="toggle-btn" id="btn-ai-wireframe">Wireframe: OFF</button>
                <button class="toggle-btn active" id="btn-ai-autorotate">Spin: ON</button>
              </div>
            </div>

            <!-- Canvas Bottom HUD -->
            <div style="position: absolute; bottom: 16px; left: 16px; right: 16px; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
              <div class="toggle-group">
                <button class="toggle-btn active" id="btn-ai-light-studio">Studio Warm</button>
                <button class="toggle-btn" id="btn-ai-light-daylight">Daylight</button>
                <button class="toggle-btn" id="btn-ai-light-midnight">Midnight</button>
              </div>

              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn btn-glass btn-sm" id="btn-ai-download-glb" title="Export real .GLB binary file for Blender / CAD">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  <span>Download Real .GLB</span>
                </button>
                <button class="btn btn-primary-gold btn-sm" id="btn-ai-order-design">
                  <span>Commission this Design</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 3D Model Dropzone: Loads files directly into WebGL canvas -->
        <div class="dropzone-box" id="hf-model-dropzone">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.5" style="margin-bottom: 12px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-main); margin-bottom: 6px;">
            Drop Any 3D Asset (.glb, .gltf, .obj) Directly onto the Stage
          </h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem; max-width: 540px; margin: 0 auto 18px;">
            Inspect any 3D asset from Blender, Rhino, or CAD directly in our Atelier WebGL viewport with real vertex count, polygon metrics, and lighting simulations.
          </p>
          <button class="btn btn-glass btn-sm" id="btn-browse-model-file">
            Browse 3D File (.glb / .obj)
          </button>
          <input type="file" id="hf-file-input" accept=".glb,.gltf,.obj" style="display: none;">
        </div>
      </div>
    </section>
  `;
}
