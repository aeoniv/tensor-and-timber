import { HUGGING_FACE_SPACES } from '../data/constants';

export function renderHFSpacesStudio(): string {
  const spacesCards = HUGGING_FACE_SPACES.map(space => {
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
          <strong>Best For:</strong> <span style="color: var(--cyan-high-tensile);">${space.primaryUse}</span>
        </div>

        <div class="hf-space-tags">
          ${space.tags.map(tag => `<span class="hf-tag">${tag}</span>`).join('')}
        </div>

        <!-- Sample Prompt -->
        <div class="hf-prompt-box">
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase;">
            Recommended Prompt for Carpentry:
          </div>
          <span class="prompt-text">${space.samplePrompt}</span>
          <button class="hf-copy-prompt-btn btn-copy-hf-prompt" data-prompt="${space.samplePrompt.replace(/"/g, '&quot;')}" title="Copy Prompt">
            Copy
          </button>
        </div>

        <div style="margin-top: auto; display: flex; gap: 10px;">
          <a href="${space.spaceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-cyan btn-sm" style="flex: 1;">
            <span>Open on Hugging Face</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
          </a>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="section" id="hf-spaces-section">
      <div class="app-container">
        <div class="section-header">
          <span class="section-tag cyan">Hugging Face Spaces AI Hub</span>
          <h2 class="section-title">Visualize Your Project with <span class="cyan-gradient">Open-Source AI Spaces</span></h2>
          <p class="section-subtitle">
            We researched and curated the top Hugging Face Spaces for 3D furniture synthesis and virtual room staging. Test your concepts with cutting-edge ZeroGPU models, generate 3D assets, and import them right into our atelier studio.
          </p>
        </div>

        <!-- Banner with Holograma reference -->
        <div class="hf-hero-banner">
          <div class="hf-banner-text">
            <h3>From 2D Sketches &amp; Video Scans to 3D &amp; 4D Splats</h3>
            <p>
              Drawing inspiration from our <strong>Holograma</strong> pipeline (which converts phone video into 4D Gaussian Splats via Instant4D and serves them flat over WebGL), clients can now take a video scan of their room or use Hugging Face Spaces like <strong>TRELLIS.2</strong> and <strong>InteriorGen3D</strong> to preview custom woodwork directly inside their real living environment.
            </p>
          </div>
          <div style="text-align: right;">
            <a href="https://huggingface.co/spaces/microsoft/TRELLIS.2" target="_blank" rel="noopener noreferrer" class="btn btn-primary-cyan">
              <span>Explore TRELLIS.2 Space</span>
            </a>
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
              Select your room type, furniture archetype, timber species, and lighting mood. Generate an optimized prompt ready to paste directly into Hugging Face Spaces or Midjourney.
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

        <!-- 3D Model Dropzone (Importing from HF Spaces into Viewer) -->
        <div class="dropzone-box" id="hf-model-dropzone">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.5" style="margin-bottom: 12px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <h4 style="font-family: var(--font-display); font-size: 1.25rem; color: var(--text-main); margin-bottom: 6px;">
            Have a 3D Model from Hugging Face TRELLIS or TripoSR?
          </h4>
          <p style="color: var(--text-secondary); font-size: 0.88rem; max-width: 520px; margin: 0 auto 18px;">
            Drag &amp; drop your exported <code>.glb</code> or <code>.obj</code> file here to inspect scale, lighting, and materials directly in our Atelier 3D viewport.
          </p>
          <button class="btn btn-glass btn-sm" id="btn-browse-model-file">
            Browse 3D File
          </button>
          <input type="file" id="hf-file-input" accept=".glb,.gltf,.obj" style="display: none;">
        </div>
      </div>
    </section>
  `;
}
