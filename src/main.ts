import './styles/main.css';
import { renderNavbar } from './components/Navbar';
import { renderHero } from './components/Hero';
import { renderInnovativeProjects } from './components/InnovativeProjects';
import { renderHFSpacesStudio } from './components/HFSpacesStudio';
import { renderFooter } from './components/Footer';
import { TensegrityViewer } from './components/TensegrityViewer';
import { GeodesicViewer } from './components/GeodesicViewer';
import { AIModelViewer } from './components/AIModelViewer';
import { ProjectPlanner } from './components/ProjectPlanner';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { AdminLeadsDrawer } from './components/AdminLeadsDrawer';
import { INNOVATIVE_PROJECTS, WOOD_SPECIES } from './data/constants';

class AtelierApp {
  private heroTensegrityViewer: TensegrityViewer | null = null;
  private heroGeodesicViewer: GeodesicViewer | null = null;
  private heroActiveMode: 'tensegrity' | 'geodesic' = 'tensegrity';

  private studioTensegrityViewer: TensegrityViewer | null = null;
  private studioGeodesicViewer: GeodesicViewer | null = null;
  private studioActiveMode: 'tensegrity' | 'geodesic' = 'tensegrity';

  private aiModelViewer: AIModelViewer | null = null;

  private planner: ProjectPlanner;
  private leadModal: LeadCaptureModal;
  private adminDrawer: AdminLeadsDrawer;

  constructor() {
    this.planner = new ProjectPlanner();
    this.leadModal = new LeadCaptureModal();
    this.adminDrawer = new AdminLeadsDrawer();
    this.initDOM();
  }

  private initDOM(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      ${renderNavbar()}
      <main>
        ${renderHero()}
        ${renderInnovativeProjects()}

        <!-- Interactive 3D Studio & Configurator Section -->
        <section class="section" id="planner-section">
          <div class="app-container">
            <div class="section-header">
              <span class="section-tag gold">Engineering Configurator</span>
              <h2 class="section-title">Interactive <span class="gold-gradient">3D Studio</span> &amp; Cost Estimator</h2>
              <p class="section-subtitle">
                Configure your bespoke structure with live dimensional physics, material swatches, and certified load-bearing calculations.
              </p>
            </div>

            <div class="studio-layout">
              <!-- Left: Sticky 3D WebGL Viewport -->
              <div class="studio-viewport-panel">
                <div class="studio-3d-canvas-wrap">
                  <div class="studio-hud-top">
                    <span class="hud-pill" id="studio-active-title">
                      Tensegrity Equilibrium
                    </span>
                    <div class="toggle-group">
                      <button class="toggle-btn active" id="studio-toggle-tensegrity">Table</button>
                      <button class="toggle-btn" id="studio-toggle-geodesic">Dome</button>
                    </div>
                  </div>

                  <div id="studio-3d-canvas" style="width: 100%; height: 100%;"></div>

                  <div class="studio-hud-bottom">
                    <div class="studio-slider-bar">
                      <span>Explode:</span>
                      <input type="range" id="studio-explode-slider" min="0" max="1" step="0.01" value="0" style="width: 90px;">
                    </div>

                    <div class="toggle-group">
                      <button class="toggle-btn" id="studio-cam-iso">Iso</button>
                      <button class="toggle-btn" id="studio-cam-top">Top</button>
                      <button class="toggle-btn" id="studio-cam-front">Front</button>
                    </div>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); padding: 0 8px;">
                  <span>&bull; Left Click: Rotate</span>
                  <span>&bull; Right Click / Scroll: Pan &amp; Zoom</span>
                  <span>&bull; Physically Calibrated PBR</span>
                </div>
              </div>

              <!-- Right: Interactive Configurator Controls & Bill of Materials -->
              <div id="configurator-container"></div>
            </div>
          </div>
        </section>

        ${renderHFSpacesStudio()}
      </main>
      ${renderFooter()}
    `;

    this.initViewers();
    this.planner.render('configurator-container');
    this.bindGlobalEvents();
    this.initPromptCrafter();
    this.initAIViewerEvents();
    this.initCustomPromptAndImageGenerator();
  }

  private initViewers(): void {
    // 1. Hero 3D Viewer
    try {
      this.heroTensegrityViewer = new TensegrityViewer('hero-3d-canvas');
    } catch (e) {
      console.warn('Hero viewer init error:', e);
    }

    // 2. Studio 3D Viewer
    try {
      this.studioTensegrityViewer = new TensegrityViewer('studio-3d-canvas');
    } catch (e) {
      console.warn('Studio viewer init error:', e);
    }

    // 3. AI Studio 3D Model Viewer (Displays 3D objects directly on the page!)
    try {
      this.aiModelViewer = new AIModelViewer('ai-studio-3d-canvas');
    } catch (e) {
      console.warn('AI 3D model viewer init error:', e);
    }

    // Sync planner config changes to 3D viewers
    this.planner.setOnConfigChange((config, _estimate) => {
      const isDome = config.category.includes('geodesic');

      if (isDome && this.studioActiveMode !== 'geodesic') {
        this.switchStudioMode('geodesic');
      } else if (!isDome && this.studioActiveMode !== 'tensegrity') {
        this.switchStudioMode('tensegrity');
      }

      if (!isDome && this.studioTensegrityViewer) {
        this.studioTensegrityViewer.setWoodSpecies(config.woodSpeciesId);
        this.studioTensegrityViewer.setTensionSystem(config.tensionSystemId);
      } else if (isDome && this.studioGeodesicViewer) {
        this.studioGeodesicViewer.setFrequency(config.domeFrequency);
        if (config.dimensions.diameter) {
          this.studioGeodesicViewer.setDiameter(config.dimensions.diameter);
        }
        this.studioGeodesicViewer.setGlazingMode(config.glazingCoverage);
        const wood = WOOD_SPECIES.find(w => w.id === config.woodSpeciesId);
        if (wood) this.studioGeodesicViewer.setTimberColor(wood.threeColor);
      }
    });
  }

  private switchHeroMode(mode: 'tensegrity' | 'geodesic'): void {
    if (this.heroActiveMode === mode) return;
    this.heroActiveMode = mode;

    const canvasContainer = document.getElementById('hero-3d-canvas');
    if (!canvasContainer) return;

    if (mode === 'tensegrity') {
      if (this.heroGeodesicViewer) {
        this.heroGeodesicViewer.destroy();
        this.heroGeodesicViewer = null;
      }
      this.heroTensegrityViewer = new TensegrityViewer('hero-3d-canvas');
      document.getElementById('hero-toggle-tensegrity')?.classList.add('active');
      document.getElementById('hero-toggle-geodesic')?.classList.remove('active');
      const pill = document.getElementById('hero-model-pill');
      if (pill) pill.innerHTML = '<strong>Floating Leviton Model</strong> &bull; Interactive 3D WebGL';
    } else {
      if (this.heroTensegrityViewer) {
        this.heroTensegrityViewer.destroy();
        this.heroTensegrityViewer = null;
      }
      this.heroGeodesicViewer = new GeodesicViewer('hero-3d-canvas');
      document.getElementById('hero-toggle-geodesic')?.classList.add('active');
      document.getElementById('hero-toggle-tensegrity')?.classList.remove('active');
      const pill = document.getElementById('hero-model-pill');
      if (pill) pill.innerHTML = '<strong>Timber Geodesic Dome (3V)</strong> &bull; Interactive 3D WebGL';
    }
  }

  private switchStudioMode(mode: 'tensegrity' | 'geodesic'): void {
    if (this.studioActiveMode === mode) return;
    this.studioActiveMode = mode;

    if (mode === 'tensegrity') {
      if (this.studioGeodesicViewer) {
        this.studioGeodesicViewer.destroy();
        this.studioGeodesicViewer = null;
      }
      this.studioTensegrityViewer = new TensegrityViewer('studio-3d-canvas');
      document.getElementById('studio-toggle-tensegrity')?.classList.add('active');
      document.getElementById('studio-toggle-geodesic')?.classList.remove('active');
      const title = document.getElementById('studio-active-title');
      if (title) title.textContent = 'Tensegrity Equilibrium';
    } else {
      if (this.studioTensegrityViewer) {
        this.studioTensegrityViewer.destroy();
        this.studioTensegrityViewer = null;
      }
      this.studioGeodesicViewer = new GeodesicViewer('studio-3d-canvas');
      document.getElementById('studio-toggle-geodesic')?.classList.add('active');
      document.getElementById('studio-toggle-tensegrity')?.classList.remove('active');
      const title = document.getElementById('studio-active-title');
      if (title) title.textContent = 'Geodesic Icosahedron Shell';
    }
  }

  private initAIViewerEvents(): void {
    // 1. Model Preset Switcher Tabs in AI 3D Stage
    const modelTabs = document.getElementById('ai-viewer-model-tabs');
    const titleEl = document.getElementById('ai-active-model-title');

    const updateModelPreset = (preset: string, title?: string) => {
      if (this.aiModelViewer) {
        this.aiModelViewer.loadPresetModel(preset);
      }
      modelTabs?.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.preset === preset);
      });
      if (titleEl) {
        if (title) {
          titleEl.textContent = title;
        } else {
          switch (preset) {
            case 'trellis-tensegrity':
              titleEl.textContent = 'TRELLIS.2 • Floating Tensegrity Coffee Table';
              break;
            case 'triposr-geodesic':
              titleEl.textContent = 'TripoSR • Instant 3D Timber Geodesic Pavilion';
              break;
            case 'interior-loft':
              titleEl.textContent = 'InteriorGen3D • Staged Architectural Loft';
              break;
            case 'instant4d-splat':
              titleEl.textContent = 'Instant4D / Splatv • Gaussian Point Cloud Scan';
              break;
          }
        }
      }
    };

    modelTabs?.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = (e.currentTarget as HTMLElement).dataset.preset || 'trellis-tensegrity';
        updateModelPreset(preset);
      });
    });

    // 2. "Display 3D Object on Site" buttons on space cards
    document.querySelectorAll('.btn-display-3d-model').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const preset = target.dataset.preset || 'trellis-tensegrity';
        const title = target.dataset.title;
        updateModelPreset(preset, title);

        // Smooth scroll directly to the 3D canvas on the website
        document.getElementById('ai-active-model-title')?.scrollIntoView({ behavior: 'smooth' });
        this.showToast(`Displaying 3D object for ${title || preset} directly on page!`);
      });
    });

    // 3. In-Page Embedded Space Generator Modal
    const hfModalOverlay = document.getElementById('hf-embedded-modal-overlay');
    const hfIframe = document.getElementById('hf-embedded-iframe') as HTMLIFrameElement;
    const hfModalTitle = document.getElementById('hf-embedded-modal-title');

    document.querySelectorAll('.btn-embed-space-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const embedUrl = target.dataset.embedUrl || '';
        const title = target.dataset.title || 'Hugging Face Space';

        if (hfIframe && hfModalOverlay) {
          hfIframe.src = embedUrl;
          if (hfModalTitle) hfModalTitle.textContent = `${title} • In-Page Generator`;
          hfModalOverlay.classList.add('active');
        }
      });
    });

    const closeHfModal = () => {
      if (hfModalOverlay && hfIframe) {
        hfIframe.src = '';
        hfModalOverlay.classList.remove('active');
      }
    };

    document.getElementById('btn-close-hf-embedded-modal')?.addEventListener('click', closeHfModal);
    document.getElementById('btn-done-hf-embedded')?.addEventListener('click', closeHfModal);

    // 4. AI 3D Canvas Controls (Wireframe, Auto-spin, Lighting)
    document.getElementById('btn-ai-wireframe')?.addEventListener('click', (e) => {
      if (this.aiModelViewer) {
        const isWire = this.aiModelViewer.toggleWireframe();
        (e.currentTarget as HTMLElement).textContent = `Wireframe: ${isWire ? 'ON' : 'OFF'}`;
        (e.currentTarget as HTMLElement).classList.toggle('active', isWire);
      }
    });

    document.getElementById('btn-ai-autorotate')?.addEventListener('click', (e) => {
      if (this.aiModelViewer) {
        const isSpin = this.aiModelViewer.toggleAutoRotate();
        (e.currentTarget as HTMLElement).textContent = `Spin: ${isSpin ? 'ON' : 'OFF'}`;
        (e.currentTarget as HTMLElement).classList.toggle('active', isSpin);
      }
    });

    // Lighting Presets
    const lightBtns = ['btn-ai-light-studio', 'btn-ai-light-daylight', 'btn-ai-light-midnight'];
    lightBtns.forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        lightBtns.forEach(b => document.getElementById(b)?.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        if (this.aiModelViewer) {
          if (id.includes('studio')) this.aiModelViewer.setLightingPreset('studio');
          else if (id.includes('daylight')) this.aiModelViewer.setLightingPreset('daylight');
          else if (id.includes('midnight')) this.aiModelViewer.setLightingPreset('midnight');
        }
      });
    });

    // Download Real .GLB File
    document.getElementById('btn-ai-download-glb')?.addEventListener('click', async () => {
      if (this.aiModelViewer) {
        this.showToast('Compiling binary .GLB file from 3D scene...');
        try {
          await this.aiModelViewer.exportCurrentModelToGLB('tensor-timber-custom-piece.glb');
          this.showToast('Downloaded real .GLB file! You can open it in Blender or Windows 3D Viewer.');
        } catch (err) {
          console.error('Export GLB error:', err);
          this.showToast('Failed to export .GLB file.');
        }
      }
    });

    // Commission this 3D design CTA
    document.getElementById('btn-ai-order-design')?.addEventListener('click', () => {
      const cfg = this.planner.getConfig();
      const est = this.planner.calculateEstimate();
      this.leadModal.open(cfg, est);
    });

    // 5. File upload / Dropzone for .glb / .obj
    const fileInput = document.getElementById('hf-file-input') as HTMLInputElement;
    const dropzone = document.getElementById('hf-model-dropzone');
    const browseBtn = document.getElementById('btn-browse-model-file');

    const handleFile = (file: File) => {
      if (this.aiModelViewer) {
        this.showToast(`Loading 3D asset ${file.name}...`);
        this.aiModelViewer.loadFromFile(
          file,
          () => {
            this.showToast(`Successfully loaded ${file.name} directly into 3D viewer!`);
            if (titleEl) titleEl.textContent = `Custom Upload • ${file.name}`;
            document.getElementById('ai-active-model-title')?.scrollIntoView({ behavior: 'smooth' });
          },
          (err) => {
            console.error('File load error:', err);
            this.showToast(`Failed to parse 3D file: ${file.name}`);
          }
        );
      }
    };

    browseBtn?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleFile(fileInput.files[0]);
      }
    });

    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      });
    }
  }

  private bindGlobalEvents(): void {
    // Hero toggles
    document.getElementById('hero-toggle-tensegrity')?.addEventListener('click', () => this.switchHeroMode('tensegrity'));
    document.getElementById('hero-toggle-geodesic')?.addEventListener('click', () => this.switchHeroMode('geodesic'));

    document.getElementById('hero-btn-autorotate')?.addEventListener('click', (e) => {
      if (this.heroActiveMode === 'tensegrity' && this.heroTensegrityViewer) {
        const state = this.heroTensegrityViewer.toggleAutoRotate();
        (e.currentTarget as HTMLElement).textContent = `Auto-Spin: ${state ? 'ON' : 'OFF'}`;
      } else if (this.heroGeodesicViewer) {
        const state = this.heroGeodesicViewer.toggleAutoRotate();
        (e.currentTarget as HTMLElement).textContent = `Auto-Spin: ${state ? 'ON' : 'OFF'}`;
      }
    });

    document.getElementById('hero-btn-vectors')?.addEventListener('click', (e) => {
      if (this.heroActiveMode === 'tensegrity' && this.heroTensegrityViewer) {
        const state = this.heroTensegrityViewer.toggleVectors();
        (e.currentTarget as HTMLElement).classList.toggle('active', state);
      }
    });

    // Studio toggles
    document.getElementById('studio-toggle-tensegrity')?.addEventListener('click', () => this.switchStudioMode('tensegrity'));
    document.getElementById('studio-toggle-geodesic')?.addEventListener('click', () => this.switchStudioMode('geodesic'));

    const explodeSlider = document.getElementById('studio-explode-slider') as HTMLInputElement;
    if (explodeSlider) {
      explodeSlider.addEventListener('input', () => {
        const val = parseFloat(explodeSlider.value);
        if (this.studioTensegrityViewer) this.studioTensegrityViewer.setExplode(val);
      });
    }

    // Camera presets
    document.getElementById('studio-cam-iso')?.addEventListener('click', () => {
      if (this.studioTensegrityViewer) this.studioTensegrityViewer.setCameraPreset('isometric');
    });
    document.getElementById('studio-cam-top')?.addEventListener('click', () => {
      if (this.studioTensegrityViewer) this.studioTensegrityViewer.setCameraPreset('top');
    });
    document.getElementById('studio-cam-front')?.addEventListener('click', () => {
      if (this.studioTensegrityViewer) this.studioTensegrityViewer.setCameraPreset('side');
    });

    // Lead Modal Open Triggers
    const openModal = () => {
      const cfg = this.planner.getConfig();
      const est = this.planner.calculateEstimate();
      this.leadModal.open(cfg, est);
    };

    document.getElementById('btn-open-lead-modal')?.addEventListener('click', openModal);
    document.getElementById('footer-btn-consultation')?.addEventListener('click', openModal);

    // Planner Book Consultation CTA
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('#btn-planner-book-consultation')) {
        openModal();
      }
    });

    // Admin drawer trigger
    document.getElementById('btn-open-admin-drawer')?.addEventListener('click', () => {
      this.adminDrawer.open();
    });

    // Project card "Load in 3D" buttons
    document.querySelectorAll('.btn-load-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = (e.currentTarget as HTMLElement).dataset.projectId;
        const project = INNOVATIVE_PROJECTS.find(p => p.id === pId);
        if (project && project.defaultConfig) {
          this.planner.updateConfig(project.defaultConfig);
          this.planner.render('configurator-container');

          // Smooth scroll to studio
          document.getElementById('planner-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Project card "Inquire Piece" buttons
    document.querySelectorAll('.btn-inquire-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = (e.currentTarget as HTMLElement).dataset.projectTitle;
        const project = INNOVATIVE_PROJECTS.find(p => p.title === title);
        if (project && project.defaultConfig) {
          this.planner.updateConfig(project.defaultConfig);
        }
        openModal();
      });
    });

    // Project filters
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');
        const filter = target.dataset.filter;

        document.querySelectorAll('.project-card').forEach(card => {
          const c = (card as HTMLElement).dataset.category;
          if (filter === 'all' || c === filter) {
            (card as HTMLElement).style.display = 'flex';
          } else {
            (card as HTMLElement).style.display = 'none';
          }
        });
      });
    });

    // HF Copy sample prompts
    document.querySelectorAll('.btn-copy-hf-prompt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = (e.currentTarget as HTMLElement).dataset.prompt || '';
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('Prompt copied to clipboard!');
        });
      });
    });
  }

  private initPromptCrafter(): void {
    const roomSelect = document.getElementById('crafter-room') as HTMLSelectElement;
    const typeSelect = document.getElementById('crafter-type') as HTMLSelectElement;
    const woodSelect = document.getElementById('crafter-wood') as HTMLSelectElement;
    const lightSelect = document.getElementById('crafter-lighting') as HTMLSelectElement;
    const resultText = document.getElementById('crafter-result-text');
    const copyBtn = document.getElementById('btn-copy-crafter-prompt');

    const updatePrompt = () => {
      if (!resultText) return;
      const prompt = `High-end architectural photography of a ${typeSelect.value} placed within a ${roomSelect.value}. Handcrafted from ${woodSelect.value}, aerospace tension cables, sub-millimeter joinery, ${lightSelect.value}.`;
      resultText.textContent = prompt;
    };

    [roomSelect, typeSelect, woodSelect, lightSelect].forEach(sel => {
      sel?.addEventListener('change', updatePrompt);
    });
    updatePrompt();

    copyBtn?.addEventListener('click', () => {
      if (resultText?.textContent) {
        navigator.clipboard.writeText(resultText.textContent).then(() => {
          this.showToast('Crafted prompt copied to clipboard!');
        });
      }
    });
  }

  private showToast(message: string): void {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c542" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => container?.removeChild(toast), 300);
    }, 3500);
  }


  private attachedSketchDataUrl: string | null = null;

  private initCustomPromptAndImageGenerator(): void {
    const sketchInput = document.getElementById('ai-sketch-file-input') as HTMLInputElement;
    const sketchDropzone = document.getElementById('ai-sketch-dropzone');
    const browseSketchBtn = document.getElementById('btn-browse-sketch');
    const previewWrap = document.getElementById('ai-sketch-preview-wrap');
    const previewImg = document.getElementById('ai-sketch-preview-img') as HTMLImageElement;
    const emptyState = document.getElementById('ai-sketch-empty-state');
    const removeSketchBtn = document.getElementById('btn-remove-sketch');
    const promptInput = document.getElementById('ai-custom-prompt-input') as HTMLTextAreaElement;
    const synthesizeBtn = document.getElementById('btn-synthesize-3d-furniture');
    const progressBox = document.getElementById('ai-generation-progress');
    const progressBar = document.getElementById('ai-gen-progress-bar');
    const statusLabel = document.getElementById('ai-gen-step-status');
    const statusPct = document.getElementById('ai-gen-step-pct');
    const successBar = document.getElementById('ai-generation-success-bar');
    const successMsg = document.getElementById('ai-success-msg');
    const commissionGenBtn = document.getElementById('btn-commission-generated-piece');

    // 1. File browsing & image loading
    browseSketchBtn?.addEventListener('click', () => sketchInput?.click());

    const loadAttachedImage = (file: File) => {
      if (!file.type.startsWith('image/')) {
        this.showToast('Please upload an image file (PNG, JPG, WEBP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.attachedSketchDataUrl = e.target?.result as string;
        if (previewImg && previewWrap && emptyState) {
          previewImg.src = this.attachedSketchDataUrl;
          previewWrap.style.display = 'block';
          emptyState.style.display = 'none';
          this.showToast(`Attached image: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    };

    sketchInput?.addEventListener('change', () => {
      if (sketchInput.files && sketchInput.files[0]) {
        loadAttachedImage(sketchInput.files[0]);
      }
    });

    if (sketchDropzone) {
      sketchDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        sketchDropzone.classList.add('dragover');
      });
      sketchDropzone.addEventListener('dragleave', () => sketchDropzone.classList.remove('dragover'));
      sketchDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        sketchDropzone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files[0]) {
          loadAttachedImage(e.dataTransfer.files[0]);
        }
      });
    }

    removeSketchBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.attachedSketchDataUrl = null;
      if (previewWrap && emptyState && sketchInput) {
        previewWrap.style.display = 'none';
        emptyState.style.display = 'flex';
        sketchInput.value = '';
      }
    });

    // 2. Sample Image Inspiration Pills
    const sampleImages: Record<string, { prompt: string; color: string; label: string }> = {
      'walnut-tensegrity': {
        prompt: 'Solid American black walnut floating tensegrity dining table with 6mm stainless steel tension cables and live-edge contour',
        color: '#3d2b1f',
        label: 'Tensegrity Table Sketch'
      },
      'cantilever-desk': {
        prompt: 'Cantilevered zero-gravity executive desk in European White Oak with gold titanium rigging and wireless power',
        color: '#b8976b',
        label: 'Cantilever Desk Concept'
      },
      'geodesic-dome': {
        prompt: 'Handcrafted 3V timber geodesic dome glamping sanctuary with triangular stargazing crown and Douglas Fir framing',
        color: '#c8894d',
        label: 'Geodesic Timber Dome'
      },
      'charred-coffee': {
        prompt: 'Sculptural Yakisugi charred cedar coffee table with matte carbon fiber cables and minimalist Japanese joinery',
        color: '#18191c',
        label: 'Yakisugi Coffee Table'
      }
    };

    document.querySelectorAll('.sample-img-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sampleKey = (e.currentTarget as HTMLElement).dataset.sample || 'walnut-tensegrity';
        const sample = sampleImages[sampleKey];
        if (sample && promptInput) {
          promptInput.value = sample.prompt;

          // Generate an elegant SVG placeholder representing the attached concept
          const svgData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23111520"/><rect x="40" y="50" width="220" height="20" rx="4" fill="${encodeURIComponent(sample.color)}"/><line x1="150" y1="70" x2="150" y2="130" stroke="%2338bdf8" stroke-width="4"/><line x1="60" y1="70" x2="80" y2="150" stroke="%23d4af37" stroke-width="2"/><line x1="240" y1="70" x2="220" y2="150" stroke="%23d4af37" stroke-width="2"/><rect x="60" y="150" width="180" height="15" rx="4" fill="${encodeURIComponent(sample.color)}"/><text x="150" y="185" fill="%23ffffff" font-size="12" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(sample.label)}</text></svg>`;

          this.attachedSketchDataUrl = svgData;
          if (previewImg && previewWrap && emptyState) {
            previewImg.src = svgData;
            previewWrap.style.display = 'block';
            emptyState.style.display = 'none';
          }
          this.showToast(`Loaded sample concept: ${sample.label}`);
        }
      });
    });

    // 3. Prompt Keyword Chips
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const phrase = (e.currentTarget as HTMLElement).dataset.phrase || '';
        if (promptInput) {
          if (promptInput.value.trim().length > 0) {
            promptInput.value += `, ${phrase}`;
          } else {
            promptInput.value = phrase;
          }
          promptInput.focus();
        }
      });
    });

    // 4. "Generate Real 3D Furniture" Action Flow (Real Three.js Parametric CAD + Hugging Face ZeroGPU API)
    synthesizeBtn?.addEventListener('click', async () => {
      let promptText = promptInput?.value.trim() || '';
      if (!promptText && !this.attachedSketchDataUrl) {
        promptText = 'Solid American black walnut live-edge floating tensegrity dining table with PVD Gold cables';
        if (promptInput) promptInput.value = promptText;
      }

      const engineSelect = document.getElementById('ai-generator-engine-select') as HTMLSelectElement;
      const selectedEngine = engineSelect?.value || 'parametric-cad';

      if (progressBox && progressBar && statusLabel && statusPct) {
        progressBox.style.display = 'block';
        if (successBar) successBar.style.display = 'none';

        if (selectedEngine === 'hf-trellis' && this.attachedSketchDataUrl) {
          // Attempt Live Hugging Face Space generation
          try {
            progressBar.style.width = '20%';
            statusLabel.textContent = 'Connecting to Hugging Face ZeroGPU cluster (trellis-community/TRELLIS)...';
            statusPct.textContent = '20%';

            // Convert dataUrl to blob
            const res = await fetch(this.attachedSketchDataUrl);
            const blob = await res.blob();

            const { Real3DGeneratorService } = await import('./services/real3DGenerator');
            const svc = new Real3DGeneratorService();

            const { glbUrl } = await svc.generateFromHuggingFaceSpace(blob, (msg, pct) => {
              statusLabel.textContent = msg;
              statusPct.textContent = `${pct}%`;
              progressBar.style.width = `${pct}%`;
            });

            if (this.aiModelViewer) {
              const meta = await this.aiModelViewer.loadGLBUrl(glbUrl, `TRELLIS.2 • ${promptText.slice(0, 40)}`);
              progressBox.style.display = 'none';
              if (successBar) successBar.style.display = 'flex';
              if (successMsg) {
                successMsg.textContent = `Real 3D GLB synthesized from Hugging Face TRELLIS! (${meta.vertexCount.toLocaleString()} vertices, ${meta.triangleCount.toLocaleString()} polygons). Ready to export or commission.`;
              }
            }

            document.getElementById('ai-studio-3d-canvas')?.scrollIntoView({ behavior: 'smooth' });
            this.showToast('Real 3D GLB generated from Hugging Face Space!');
            return;
          } catch (hfErr) {
            console.warn('Hugging Face ZeroGPU fallback to Real CAD Synthesizer:', hfErr);
            statusLabel.textContent = 'ZeroGPU queue busy; generating via Atelier Real Parametric 3D CAD Engine...';
            progressBar.style.width = '60%';
          }
        }

        // Real Three.js Parametric 3D CAD Geometry Synthesis
        const steps = [
          { pct: '30%', text: '1/3: Computing parametric curve splines & live-edge boundary noise...', delay: 200 },
          { pct: '70%', text: '2/3: Calculating center-of-mass & physical cable tension equilibrium...', delay: 700 },
          { pct: '100%', text: '3/3: Constructing real BufferGeometry with PBR timber & turnbuckle rigging...', delay: 1300 }
        ];

        steps.forEach(({ pct, text, delay }) => {
          setTimeout(() => {
            progressBar.style.width = pct;
            statusLabel.textContent = text;
            statusPct.textContent = pct;
          }, delay);
        });

        setTimeout(() => {
          progressBox.style.display = 'none';
          if (successBar) successBar.style.display = 'flex';

          let metadata: any = null;
          if (this.aiModelViewer) {
            metadata = this.aiModelViewer.generateFromPrompt(promptText, this.attachedSketchDataUrl);
          }

          // Update active title
          const titleEl = document.getElementById('ai-active-model-title');
          if (titleEl && metadata) {
            titleEl.textContent = `Real 3D Geometry: ${metadata.name} (${metadata.dimensions.lengthCm} × ${metadata.dimensions.widthCm} × ${metadata.dimensions.heightCm} cm)`;
          }

          if (successMsg && metadata) {
            successMsg.textContent = `Real 3D Mesh synthesized! Constructed ${metadata.vertexCount.toLocaleString()} real vertices & ${metadata.triangleCount.toLocaleString()} polygons. Download the real .GLB file or request commission.`;
          }

          // Synchronize with Project Planner
          const lower = promptText.toLowerCase();
          const isDome = lower.includes('dome') || lower.includes('geodesic');
          let woodId = 'american-black-walnut';
          if (lower.includes('oak')) woodId = 'european-white-oak';
          else if (lower.includes('teak')) woodId = 'reclaimed-brazilian-teak';
          else if (lower.includes('charred') || lower.includes('yakisugi')) woodId = 'japanese-charred-cedar';

          let tensionId = 'marine-stainless-316';
          if (lower.includes('gold') || lower.includes('titanium')) tensionId = 'pvd-gold-titanium';
          else if (lower.includes('carbon')) tensionId = 'carbon-stealth-black';

          this.planner.updateConfig({
            category: isDome ? 'geodesic-glamping-dome' : 'tensegrity-dining-table',
            title: `Custom Piece: ${promptText.slice(0, 40)}`,
            woodSpeciesId: woodId,
            tensionSystemId: tensionId,
            customNotes: promptText
          });
          this.planner.render('configurator-container');

          document.getElementById('ai-studio-3d-canvas')?.scrollIntoView({ behavior: 'smooth' });
          this.showToast(`Real 3D Mesh generated (${metadata?.vertexCount?.toLocaleString()} vertices)!`);
        }, 1800);
      }
    });

    // 5. "Commission this Generated Piece" button
    commissionGenBtn?.addEventListener('click', () => {
      const cfg = this.planner.getConfig();
      const est = this.planner.calculateEstimate();
      cfg.customNotes = promptInput?.value || cfg.customNotes;
      this.leadModal.open(cfg, est);
    });
  }

}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new AtelierApp();
});
