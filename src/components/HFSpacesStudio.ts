export function renderHFSpacesStudio(): string {
  return `
    <section class="section" id="hf-spaces-section" style="padding-top: 60px;">
      <div class="app-container">
        <!-- Section Header -->
        <div class="section-header" style="margin-bottom: 28px;">
          <span class="section-tag gold">Spatial 3D Synthesis Studio</span>
          <h2 class="section-title">
            Generate <span class="gold-gradient">Real 3D Objects</span> From Prompt or Image
          </h2>
          <p class="section-subtitle">
            Create custom tensegrity furniture and geodesic structures in real time. Describe your vision or upload a sketch to generate real 3D geometry with physics equilibrium, wireframe inspection, and direct .GLB export.
          </p>
        </div>

        <!-- =================================================================
             UNIFIED SIDE-BY-SIDE 3D ATELIER WORKSPACE
             Left: Generator Controls & Big Action Button
             Right: Live Interactive 3D WebGL Canvas
             ================================================================= -->
        <div style="display: grid; grid-template-columns: minmax(360px, 440px) 1fr; gap: 28px; align-items: start; margin-bottom: 40px;" class="generator-workspace-grid">

          <!-- ================= LEFT COLUMN: GENERATOR CONTROLS ================= -->
          <div class="glass-panel gold-glow" style="padding: 24px; border-radius: var(--radius-xl); border: 1px solid rgba(212, 175, 55, 0.3); display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="pulse-indicator gold"></span>
                <span style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--text-main);">
                  3D Generator Controls
                </span>
              </div>
              <button type="button" class="btn btn-glass btn-xs" id="btn-clear-ai-inputs" style="font-size: 0.72rem; padding: 4px 8px;">
                Reset
              </button>
            </div>

            <!-- Quick Archetype Preset Buttons -->
            <div>
              <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; display: block; margin-bottom: 6px;">
                1. Select Furniture Archetype:
              </span>
              <div class="toggle-group" id="ai-viewer-model-tabs" style="flex-wrap: wrap; width: 100%;">
                <button class="toggle-btn active" data-archetype="dining-table" style="font-size: 0.76rem; padding: 5px 10px;">Dining Table</button>
                <button class="toggle-btn" data-archetype="lounge-chair" style="font-size: 0.76rem; padding: 5px 10px;">Lounge Chair</button>
                <button class="toggle-btn" data-archetype="shelving-unit" style="font-size: 0.76rem; padding: 5px 10px;">Shelving</button>
                <button class="toggle-btn" data-archetype="geodesic-dome" style="font-size: 0.76rem; padding: 5px 10px;">Dome</button>
                <button class="toggle-btn" data-archetype="cantilever-desk" style="font-size: 0.76rem; padding: 5px 10px;">Desk</button>
              </div>
            </div>

            <!-- Prompt Specification Textarea -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label for="ai-custom-prompt-input" style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">
                  2. Architectural Prompt Specification:
                </label>
                <span style="font-size: 0.7rem; color: #f5c542;">Auto-parses size &amp; wood</span>
              </div>
              <textarea id="ai-custom-prompt-input" rows="3" style="width: 100%; background: rgba(9, 10, 15, 0.75); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 10px; color: var(--text-main); font-family: var(--font-body); font-size: 0.84rem; line-height: 1.4; resize: none; outline: none;" placeholder="e.g. 240x100x75cm solid American black walnut live-edge floating tensegrity dining table with PVD gold cables and river glass..."></textarea>

              <!-- Keyword Chips -->
              <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;">
                <button type="button" class="prompt-chip" data-phrase="240x100x75cm Dining Table" style="font-size: 0.7rem; padding: 3px 7px;">+ 240x100cm</button>
                <button type="button" class="prompt-chip" data-phrase="Ergonomic Lounge Chair" style="font-size: 0.7rem; padding: 3px 7px;">+ Chair</button>
                <button type="button" class="prompt-chip" data-phrase="4-Tier Floating Shelves" style="font-size: 0.7rem; padding: 3px 7px;">+ Shelves</button>
                <button type="button" class="prompt-chip" data-phrase="Yakisugi Charred Cedar" style="font-size: 0.7rem; padding: 3px 7px;">+ Charred Wood</button>
                <button type="button" class="prompt-chip" data-phrase="PVD Gold Titanium Cables" style="font-size: 0.7rem; padding: 3px 7px;">+ Gold Cables</button>
                <button type="button" class="prompt-chip" data-phrase="Translucent Blue River Glass" style="font-size: 0.7rem; padding: 3px 7px;">+ River Glass</button>
              </div>
            </div>

            <!-- Attach Sketch / Blueprint Upload Area -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">
                  3. Attach Sketch or Photo (Optional):
                </label>
                <span style="font-size: 0.7rem; color: #38bdf8;">Extracts 3D contour</span>
              </div>

              <div id="ai-sketch-dropzone" style="height: 100px; border: 2px dashed rgba(56, 189, 248, 0.35); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; text-align: center; cursor: pointer; transition: all 0.25s ease; background: rgba(56, 189, 248, 0.03); position: relative; overflow: hidden;">
                <input type="file" id="ai-sketch-file-input" accept="image/png,image/jpeg,image/webp" style="display: none;">

                <div id="ai-sketch-empty-state" style="display: flex; flex-direction: column; align-items: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.8" style="margin-bottom: 4px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  <p style="font-size: 0.76rem; color: var(--text-main); font-weight: 500; margin-bottom: 2px;">
                    Drop sketch or photo to extrude 3D shape
                  </p>
                  <button type="button" class="btn btn-glass btn-xs" id="btn-browse-sketch" style="font-size: 0.7rem; padding: 2px 8px;">
                    Browse File
                  </button>
                </div>

                <div id="ai-sketch-preview-wrap" style="display: none; width: 100%; height: 100%; position: absolute; inset: 0; background: #0b0f19;">
                  <img id="ai-sketch-preview-img" src="" alt="Attached Concept" style="width: 100%; height: 100%; object-fit: contain;">
                  <button type="button" id="btn-remove-sketch" style="position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.3); color: #fff; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold;">&times;</button>
                </div>
              </div>

              <!-- Quick Concept Blueprints -->
              <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;">
                <span style="font-size: 0.68rem; color: var(--text-muted); width: 100%;">Sample contours:</span>
                <button type="button" class="sample-img-pill" data-sample="walnut-tensegrity" style="font-size: 0.68rem; padding: 2px 6px;">Table Blueprint</button>
                <button type="button" class="sample-img-pill" data-sample="cantilever-desk" style="font-size: 0.68rem; padding: 2px 6px;">Chair Concept</button>
                <button type="button" class="sample-img-pill" data-sample="charred-coffee" style="font-size: 0.68rem; padding: 2px 6px;">Yakisugi Contour</button>
              </div>
            </div>

            <!-- ================= PRIMARY GENERATE 3D BUTTON ================= -->
            <div style="margin-top: 6px;">
              <button class="btn btn-primary-gold btn-lg" id="btn-synthesize-3d-furniture" style="width: 100%; justify-content: center; padding: 15px; font-weight: 700; font-size: 1.05rem; letter-spacing: 0.04em; box-shadow: 0 0 30px rgba(245, 197, 66, 0.45); border-radius: var(--radius-md);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>GENERATE 3D OBJECT</span>
              </button>
              <span style="font-size: 0.72rem; color: var(--text-muted); text-align: center; display: block; margin-top: 6px;">
                Constructs real Three.js BufferGeometry &bull; Instant WebGL rendering
              </span>
            </div>

            <!-- Progress / Status Box -->
            <div id="ai-generation-progress" style="display: none; padding: 12px; background: rgba(15, 23, 42, 0.85); border: 1px solid var(--border-medium); border-radius: var(--radius-md);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.78rem;">
                <span id="ai-gen-step-status" style="color: #f5c542; font-weight: 600;">
                  Constructing 3D geometry...
                </span>
                <span id="ai-gen-step-pct" style="color: var(--text-secondary); font-family: monospace;">
                  0%
                </span>
              </div>
              <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                <div id="ai-gen-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #38bdf8, #f5c542); transition: width 0.2s ease;"></div>
              </div>
            </div>

            <!-- Success Alert Bar -->
            <div id="ai-generation-success-bar" style="display: none; padding: 12px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: var(--radius-md); flex-direction: column; gap: 8px;">
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span style="color: #10b981; font-size: 1.1rem; line-height: 1;">&#10004;</span>
                <span style="font-size: 0.8rem; color: var(--text-main); font-weight: 600;" id="ai-success-msg">
                  Real 3D Object generated! Inspect in the 3D viewport on the right.
                </span>
              </div>
              <button class="btn btn-primary-gold btn-xs" id="btn-commission-generated-piece" style="align-self: flex-start;">
                <span>Commission this Exact Piece</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- ================= RIGHT COLUMN: LIVE 3D OBJECT VIEWPORT ================= -->
          <div class="glass-panel cyan-glow" style="padding: 24px; border-radius: var(--radius-xl); border: 1px solid rgba(56, 189, 248, 0.25); display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <span class="section-tag cyan" style="font-size: 0.68rem; margin-bottom: 2px;">Live 3D Viewport</span>
                <h3 style="font-family: var(--font-display); font-size: 1.35rem; color: var(--text-main); margin: 0;" id="ai-active-model-title">
                  Real 3D Geometry: Live-Edge Tensegrity Dining Table
                </h3>
              </div>

              <!-- Viewport Quick Actions -->
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-glass btn-sm" id="btn-ai-download-glb" title="Export real .GLB binary file for Blender / CAD" style="font-size: 0.78rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  <span>Download .GLB</span>
                </button>
                <button class="btn btn-primary-gold btn-sm" id="btn-ai-order-design" style="font-size: 0.78rem;">
                  <span>Commission</span>
                </button>
              </div>
            </div>

            <!-- The WebGL Canvas Container -->
            <div style="height: 520px; width: 100%; border-radius: var(--radius-lg); position: relative; overflow: hidden; border: 1px solid var(--border-medium); background: radial-gradient(circle at center, #181d29 0%, #090a0f 100%);">
              <div id="ai-studio-3d-canvas" style="width: 100%; height: 100%;"></div>

              <!-- Top Canvas HUD -->
              <div style="position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; z-index: 10;">
                <span class="hud-pill" style="pointer-events: auto; font-size: 0.76rem;" id="ai-mesh-stats-pill">
                  <strong>Real 3D Mesh</strong> &bull; Loading Geometry...
                </span>

                <div class="toggle-group" style="pointer-events: auto;">
                  <button class="toggle-btn" id="btn-ai-wireframe" style="font-size: 0.72rem; padding: 4px 8px;">Wireframe: OFF</button>
                  <button class="toggle-btn active" id="btn-ai-autorotate" style="font-size: 0.72rem; padding: 4px 8px;">Spin: ON</button>
                </div>
              </div>

              <!-- Bottom Canvas HUD -->
              <div style="position: absolute; bottom: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
                <div class="toggle-group">
                  <button class="toggle-btn active" id="btn-ai-light-studio" style="font-size: 0.72rem; padding: 4px 8px;">Studio Warm</button>
                  <button class="toggle-btn" id="btn-ai-light-daylight" style="font-size: 0.72rem; padding: 4px 8px;">Daylight</button>
                  <button class="toggle-btn" id="btn-ai-light-midnight" style="font-size: 0.72rem; padding: 4px 8px;">Midnight</button>
                </div>

                <span style="font-size: 0.7rem; color: var(--text-muted); background: rgba(0,0,0,0.6); padding: 3px 8px; border-radius: 4px;">
                  Left-drag to Orbit &bull; Right-drag to Pan &bull; Scroll to Zoom
                </span>
              </div>
            </div>

            <!-- Compact Direct Model Dropzone -->
            <div id="hf-model-dropzone" style="border: 1px dashed rgba(56, 189, 248, 0.3); border-radius: var(--radius-md); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; background: rgba(56, 189, 248, 0.02); cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span style="font-size: 0.78rem; color: var(--text-secondary);">
                  Drop any existing 3D model (<strong>.glb</strong>, <strong>.gltf</strong>, <strong>.obj</strong>) to inspect in our atelier viewport
                </span>
              </div>
              <button class="btn btn-glass btn-xs" id="btn-browse-model-file" style="font-size: 0.72rem;">
                Browse 3D File
              </button>
              <input type="file" id="hf-file-input" accept=".glb,.gltf,.obj" style="display: none;">
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
