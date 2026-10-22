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
          <h2 class="section-title">Display &amp; Inspect <span class="cyan-gradient">AI 3D Objects</span> on Site</h2>
          <p class="section-subtitle">
            No external redirects. View and manipulate 3D models synthesized from Hugging Face AI architectures (TRELLIS.2, TripoSR, InteriorGen3D, and Instant4D Gaussian Splats) directly in our real-time WebGL studio.
          </p>
        </div>

        <!-- Master Interactive 3D Object Stage -->
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
              <span class="hud-pill" style="pointer-events: auto;">
                Orbit: Left Drag &bull; Zoom: Scroll &bull; Pan: Right Drag
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

              <div style="display: flex; gap: 8px;">
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

        <!-- Interactive AI Prompt Crafter -->
        <div class="prompt-crafter-card glass-panel gold-glow">
          <div style="margin-bottom: 24px;">
            <span class="section-tag gold">Client Prompt Generator</span>
            <h3 style="font-family: var(--font-display); font-size: 1.6rem; color: var(--text-main); margin-bottom: 6px;">
              Craft the Perfect AI Prompt for Your Space
            </h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
              Select your room type, furniture archetype, timber species, and lighting mood. Generate an optimized prompt ready to feed into AI spatial synthesis models.
            </p>
          </div>

          <div class="crafter-grid">
            <div class="crafter-field">
              <label>Space / Room Type</label>
              <select id="crafter-room">
                <option value="minimalist architectural penthouse living room">Minimalist Penthouse Living Room</option>
                <option value="luxury mountain retreat dining area">Luxury Alpine Chalet Dining Room</option>
                <option value="sunlit modern timber garden conservatory">Sunlit Garden Conservatory</option>
                <option value="biophilic executive corner office">Biophilic Executive Office</option>
                <option value="off-grid scenic meadow landscape">Scenic Meadow / Glamping Site</option>
              </select>
            </div>

            <div class="crafter-field">
              <label>Project Archetype</label>
              <select id="crafter-type">
                <option value="solid wood floating tensegrity dining table suspended by aircraft cables">Tensegrity Floating Dining Table</option>
                <option value="sculptural tensegrity coffee table with counter-intuitive balance">Tensegrity Coffee Table</option>
                <option value="architectural timber geodesic dome with triangular glass facets">Timber Geodesic Dome Sanctuary</option>
                <option value="cantilevered tensegrity executive desk with floating drawers">Cantilever Tensegrity Desk</option>
              </select>
            </div>

            <div class="crafter-field">
              <label>Hardwood Species</label>
              <select id="crafter-wood">
                <option value="American Black Walnut with rich grain and satin oil finish">American Black Walnut</option>
                <option value="Bavarian European White Oak with blonde medullary rays">European White Oak</option>
                <option value="Charred Japanese Yakisugi Cedar with sculptural matte black texture">Yakisugi Charred Cedar</option>
                <option value="Reclaimed Brazilian Teak with deep honey bronze patina">Reclaimed Brazilian Teak</option>
              </select>
            </div>

            <div class="crafter-field">
              <label>Lighting &amp; Ambience</label>
              <select id="crafter-lighting">
                <option value="warm 2700K golden hour sunlight, soft rim lighting, ultra-realistic architectural photography">Golden Hour Ambient</option>
                <option value="diffused Scandinavian morning light, clean shadows, 8k octane render">Diffused Scandinavian Light</option>
                <option value="dramatic moody evening spotlight, brass reflections, cinematic 35mm lens">Moody Evening Cinematic</option>
              </select>
            </div>
          </div>

          <div class="crafter-output-box">
            <div class="crafter-output-text" id="crafter-result-text">
              Loading prompt...
            </div>
            <button class="btn btn-primary-gold btn-sm" id="btn-copy-crafter-prompt">
              <span>Copy Prompt</span>
            </button>
          </div>
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
