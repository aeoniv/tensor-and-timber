import { HUGGING_FACE_SPACES } from '../data/constants';

export function renderHFSpacesStudio(): string {
  const spacesCards = HUGGING_FACE_SPACES.map(space => {
    const modelPresetKey = space.id.includes('trellis')
      ? 'trellis-tensegrity'
      : space.id.includes('triposr')
      ? 'triposr-geodesic'
      : space.id.includes('interior')
      ? 'interior-loft'
      : space.id.includes('splat')
      ? 'instant4d-splat'
      : 'trellis-tensegrity';

    return `
      <div class="glass-panel hf-space-card cyan-glow">
        <div class="hf-space-header">
          <div>
            <h4 class="hf-space-title">${space.name}</h4>
            <span class="hf-space-author">by @${space.author}</span>
          </div>
          <span class="hf-badge-tier">${space.hardwareTier.split('/')[0]}</span>
        </div>

        <p class="hf-space-desc">${space.description}</p>

        <div style="font-size: 0.8rem; margin-bottom: 12px; color: var(--text-main);">
          <strong>Visualization Role:</strong> <span style="color: var(--cyan-high-tensile);">${space.primaryUse}</span>
        </div>

        <div class="hf-space-tags">
          ${space.tags.map(tag => `<span class="hf-tag">${tag}</span>`).join('')}
        </div>

        <!-- Sample Prompt -->
        <div class="hf-prompt-box">
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase;">
            Synthesized AI Prompt:
          </div>
          <span class="prompt-text">${space.samplePrompt}</span>
          <button class="hf-copy-prompt-btn btn-copy-hf-prompt" data-prompt="${space.samplePrompt.replace(/"/g, '&quot;')}" title="Copy Prompt">
            Copy
          </button>
        </div>

        <!-- Actions: Display 3D Object Directly on Website or Launch In-Page Generator -->
        <div style="margin-top: auto; display: flex; flex-direction: column; gap: 8px;">
          <button class="btn btn-primary-cyan btn-sm btn-display-3d-model" data-preset="${modelPresetKey}" data-title="${space.name}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
            <span>Display 3D Object on Site</span>
          </button>

          <button class="btn btn-glass btn-sm btn-embed-space-modal" data-embed-url="${space.directEmbedUrl}" data-title="${space.name}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span>Launch Generator in Modal</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="section" id="hf-spaces-section">
      <div class="app-container">
        <div class="section-header">
          <span class="section-tag cyan">AI 3D Synthesis &amp; Virtual Staging</span>
          <h2 class="section-title">Attach a <span class="gold-gradient">Prompt or Image</span> to Generate 3D Furniture</h2>
          <p class="section-subtitle">
            Input your custom architectural vision or upload a sketch, reference photo, or room picture. Our on-page 3D engine synthesizes and displays your custom piece directly in WebGL.
          </p>
        </div>

        <!-- =================================================================
             PROMPT & IMAGE ATTACHMENT GENERATOR CONSOLE
             ================================================================= -->
        <div class="ai-generator-console">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
            <div>
              <span class="section-tag gold" style="font-size: 0.72rem; margin-bottom: 4px;">ZeroGPU 3D Synthesizer</span>
              <h3 style="font-family: var(--font-display); font-size: 1.45rem; color: var(--text-main);">
                Generate Custom 3D Furniture from Prompt or Photo
              </h3>
            </div>
            <div style="font-size: 0.8rem; color: var(--cyan-high-tensile); font-weight: 600;">
              &bull; Powered by Microsoft TRELLIS.2 &amp; TripoSR Architecture
            </div>
          </div>

          <div class="generator-columns">
            <!-- Left Column: Image / Sketch Upload -->
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
                1. Attach Image, Sketch, or Room Photo (Optional)
              </label>

              <!-- Upload Dropzone -->
              <div class="image-attach-box" id="ai-sketch-dropzone">
                <div id="ai-sketch-empty-state">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.6" style="margin-bottom: 10px;">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <div style="font-weight: 600; font-size: 0.88rem; color: var(--text-main); margin-bottom: 4px;">
                    Drop your sketch, photo, or room picture here
                  </div>
                  <div style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 12px;">
                    Supports PNG, JPG, WEBP &bull; Max 25 MB
                  </div>
                  <button class="btn btn-glass btn-sm" id="btn-browse-sketch" type="button">
                    Browse Image
                  </button>
                  <input type="file" id="ai-sketch-file-input" accept="image/*" style="display: none;">
                </div>

                <!-- Preview State (when attached) -->
                <div class="image-preview-wrapper" id="ai-sketch-preview-wrap" style="display: none;">
                  <img id="ai-sketch-preview-img" src="" alt="Attached inspiration" />
                  <button class="image-remove-btn" id="btn-remove-sketch" title="Remove Image">&times;</button>
                </div>
              </div>

              <!-- Quick Sample Inspirations -->
              <div style="margin-top: 10px;">
                <span style="font-size: 0.74rem; color: var(--text-muted);">Or try sample concept sketch:</span>
                <div class="sample-pills-row">
                  <button class="sample-img-pill" data-sample="walnut-tensegrity" type="button">Walnut Tensegrity Table</button>
                  <button class="sample-img-pill" data-sample="cantilever-desk" type="button">Cantilever Desk</button>
                  <button class="sample-img-pill" data-sample="geodesic-dome" type="button">Timber Geodesic Pod</button>
                  <button class="sample-img-pill" data-sample="charred-coffee" type="button">Yakisugi Coffee Table</button>
                </div>
              </div>
            </div>

            <!-- Right Column: Prompt Input & Engine -->
            <div style="display: flex; flex-direction: column;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
                2. Enter Custom Prompt Description
              </label>

              <textarea id="ai-custom-prompt-input" rows="3" placeholder="Describe your custom furniture (e.g. 'Solid American black walnut floating tensegrity dining table with 6mm stainless steel tension cables and live-edge contour for an architectural loft')..."></textarea>

              <!-- Quick Prompt Keyword Chips -->
              <div class="prompt-chips-row">
                <button class="prompt-chip" data-phrase="American Black Walnut with rich grain">+ Black Walnut</button>
                <button class="prompt-chip" data-phrase="floating tensegrity dining table with continuous cable suspension">+ Floating Tensegrity</button>
                <button class="prompt-chip" data-phrase="PVD Gold titanium aircraft cables with brass turnbuckles">+ PVD Gold Rigging</button>
                <button class="prompt-chip" data-phrase="3V timber geodesic dome with triangular skylights">+ Geodesic Dome (3V)</button>
                <button class="prompt-chip" data-phrase="sculptural charred Yakisugi cedar with matte carbon cordage">+ Yakisugi Charred</button>
                <button class="prompt-chip" data-phrase="cantilevered executive desk with floating drawers">+ Cantilever Desk</button>
              </div>

              <!-- Engine & Action Row -->
              <div style="display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: center; margin-top: auto;">
                <div>
                  <label style="display: block; font-size: 0.74rem; color: var(--text-muted); margin-bottom: 4px;">AI Generation Engine</label>
                  <select id="ai-generator-engine-select" style="width: 100%; font-size: 0.85rem;">
                    <option value="parametric-cad">Real Parametric CAD Engine &bull; Instant Three.js BufferGeometry &bull; Downloadable GLB</option>
                    <option value="hf-trellis">Hugging Face TRELLIS.2 Live API &bull; ZeroGPU Dense PBR Mesh Extraction</option>
                    <option value="triposr">TripoSR (Stability AI) &bull; Rapid 3D Volumetric Mesh</option>
                  </select>
                </div>

                <div style="padding-top: 18px;">
                  <button class="btn btn-primary-gold" id="btn-synthesize-3d-furniture" style="padding: 14px 28px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span>Generate 3D Furniture</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic Progress Notification Box -->
          <div class="generation-progress-box" id="ai-generation-progress" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 0.9rem; color: var(--cyan-high-tensile);" id="ai-gen-step-status">
                Analyzing prompt and attached sketch geometry...
              </span>
              <span style="font-family: monospace; font-size: 0.82rem; color: var(--gold-light);" id="ai-gen-step-pct">
                15%
              </span>
            </div>
            <div class="gen-progress-bar-wrap">
              <div class="gen-progress-bar-fill" id="ai-gen-progress-bar"></div>
            </div>
          </div>

          <!-- Success Alert Bar -->
          <div id="ai-generation-success-bar" style="display: none; margin-top: 18px; padding: 14px 18px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #10b981; font-size: 1.2rem;">&#10004;</span>
              <span style="font-size: 0.88rem; color: var(--text-main); font-weight: 600;" id="ai-success-msg">
                Custom 3D Furniture synthesized successfully! Displayed in the WebGL viewport below.
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
                TRELLIS.2 &bull; Floating Tensegrity Coffee Table
              </h3>
            </div>

            <!-- Model Presets Selector Tabs -->
            <div class="toggle-group" id="ai-viewer-model-tabs" style="flex-wrap: wrap;">
              <button class="toggle-btn active" data-preset="trellis-tensegrity">TRELLIS Table</button>
              <button class="toggle-btn" data-preset="triposr-geodesic">TripoSR Dome</button>
              <button class="toggle-btn" data-preset="interior-loft">InteriorGen3D Loft</button>
              <button class="toggle-btn" data-preset="instant4d-splat">4D Splat Cloud</button>
            </div>
          </div>

          <!-- 3D Canvas Box -->
          <div style="height: 520px; width: 100%; border-radius: var(--radius-lg); position: relative; overflow: hidden; border: 1px solid var(--border-medium); background: radial-gradient(circle at center, #181d29 0%, #090a0f 100%);">
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

        <!-- Curated HF Spaces Cards Grid -->
        <div class="hf-spaces-grid">
          ${spacesCards}
        </div>

        <!-- 3D Model Dropzone: Loads files directly into WebGL canvas -->
        <div class="dropzone-box" id="hf-model-dropzone">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.5" style="margin-bottom: 12px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-main); margin-bottom: 6px;">
            Upload Your 3D Model (.glb, .gltf, .obj) Directly to the Canvas
          </h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem; max-width: 540px; margin: 0 auto 18px;">
            Drag &amp; drop any 3D asset generated from Hugging Face TRELLIS, TripoSR, or CAD to inspect geometry, materials, and scale directly in our Atelier 3D viewport.
          </p>
          <button class="btn btn-glass btn-sm" id="btn-browse-model-file">
            Browse 3D File (.glb / .obj)
          </button>
          <input type="file" id="hf-file-input" accept=".glb,.gltf,.obj" style="display: none;">
        </div>
      </div>
    </section>

    <!-- Embedded In-Page Hugging Face Generator Modal (Zero External Redirects) -->
    <div class="modal-overlay" id="hf-embedded-modal-overlay">
      <div class="modal-card" style="max-width: 960px; height: 85vh; display: flex; flex-direction: column; padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <span class="section-tag cyan" style="font-size: 0.7rem; margin-bottom: 2px;">In-Page Embedded AI Generator</span>
            <h3 style="font-family: var(--font-display); font-size: 1.35rem; color: var(--text-main);" id="hf-embedded-modal-title">
              Hugging Face Space Generator
            </h3>
          </div>
          <button class="modal-close-btn" id="btn-close-hf-embedded-modal">&times;</button>
        </div>

        <div style="flex: 1; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-medium); background: #000; position: relative;">
          <iframe id="hf-embedded-iframe" src="" style="width: 100%; height: 100%; border: none;" allow="accelerometer; camera; microphone; gyroscope; xr-spatial-tracking"></iframe>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-size: 0.82rem; color: var(--text-muted);">
          <span>Tip: After exporting your 3D GLB file, drag it into our 3D canvas above to inspect it in high-fidelity PBR!</span>
          <button class="btn btn-primary-cyan btn-sm" id="btn-done-hf-embedded">Done Generating</button>
        </div>
      </div>
    </div>
  `;
}
