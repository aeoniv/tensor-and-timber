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
    // 1. Archetype Quick Switcher Tabs in AI 3D Stage
    const modelTabs = document.getElementById('ai-viewer-model-tabs');
    const titleEl = document.getElementById('ai-active-model-title');

    const updateArchetype = async (archetype: string) => {
      modelTabs?.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.archetype === archetype);
      });

      let prompt = 'American Black Walnut live-edge floating tensegrity dining table with PVD gold cables';
      switch (archetype) {
        case 'dining-table':
          prompt = '240x100x75cm Solid American Black Walnut live-edge floating tensegrity dining table with PVD gold cables';
          break;
        case 'lounge-chair':
          prompt = 'Ergonomic floating tensegrity lounge chair in European White Oak with curved seat and stainless cables';
          break;
        case 'shelving-unit':
          prompt = '4-Tier suspended tensegrity shelving unit in Reclaimed Brazilian Teak with marine stainless cables';
          break;
        case 'geodesic-dome':
          prompt = '6m Handcrafted Timber Geodesic Dome with CNC aluminum hubs and stargazing glass crown';
          break;
        case 'cantilever-desk':
          prompt = 'Zero-gravity cantilever executive desk in European White Oak with floating drawer pedestal';
          break;
      }

      if (this.aiModelViewer) {
        this.showToast('Generating real 3D geometry...');
        const meta = await this.aiModelViewer.generateCustom3DObject(prompt);
        if (titleEl) {
          titleEl.textContent = `Real 3D Geometry: ${meta.name} (${meta.dimensions.lengthCm} × ${meta.dimensions.widthCm} × ${meta.dimensions.heightCm} cm)`;
        }
        this.showToast(`Synthesized ${meta.name} (${meta.vertexCount.toLocaleString()} vertices)!`);
      }
    };

    modelTabs?.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const archetype = (e.currentTarget as HTMLElement).dataset.archetype || 'dining-table';
        updateArchetype(archetype);
      });
    });

    // 2. Wireframe, Auto-rotate, Lighting
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
          this.showToast('Downloaded real .GLB file! You can open it in Blender, AutoCAD, or Windows 3D Viewer.');
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
      const meta = this.aiModelViewer?.getMetadata();
      if (meta) {
        cfg.title = meta.name;
        cfg.customNotes = `Commissioning ${meta.name} (${meta.dimensions.lengthCm}x${meta.dimensions.widthCm}x${meta.dimensions.heightCm} cm) in ${meta.timberSpecies} with ${meta.tensionHardware}.`;
      }
      this.leadModal.open(cfg, est);
    });

    // 3. File upload / Dropzone for .glb / .obj directly to canvas
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
    const clearBtn = document.getElementById('btn-clear-ai-inputs');
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

    const clearSketch = () => {
      this.attachedSketchDataUrl = null;
      if (previewWrap && emptyState && sketchInput) {
        previewWrap.style.display = 'none';
        emptyState.style.display = 'flex';
        sketchInput.value = '';
      }
    };

    removeSketchBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      clearSketch();
    });

    clearBtn?.addEventListener('click', () => {
      clearSketch();
      if (promptInput) promptInput.value = '';
      if (progressBox) progressBox.style.display = 'none';
      if (successBar) successBar.style.display = 'none';
      this.showToast('Reset generator inputs.');
    });

    // 2. Sample Image Inspiration Pills
    const sampleBlueprints: Record<string, { prompt: string; shape: string }> = {
      'walnut-tensegrity': {
        prompt: '240x100x75cm Solid American black walnut live-edge floating tensegrity dining table with PVD gold cables',
        shape: '<ellipse cx="150" cy="100" rx="110" ry="55" fill="#3d2b1f" stroke="#d4af37" stroke-width="3"/>'
      },
      'cantilever-desk': {
        prompt: 'Ergonomic floating tensegrity lounge chair in European White Oak with curved seat and aerospace cables',
        shape: '<path d="M70 140 Q 110 150 150 130 Q 180 110 210 140 L 230 110 Q 180 70 130 90 Z" fill="#b8976b" stroke="#38bdf8" stroke-width="3"/>'
      },
      'geodesic-dome': {
        prompt: '6m Handcrafted 3V timber geodesic dome glamping sanctuary with CNC hubs and stargazing glass crown',
        shape: '<polygon points="150,30 220,70 240,150 150,170 60,150 80,70" fill="#c8894d" stroke="#f5c542" stroke-width="3"/>'
      },
      'charred-coffee': {
        prompt: '130x75x42cm Sculptural Yakisugi charred cedar coffee table with matte carbon fiber cables and live edge',
        shape: '<path d="M60 100 Q 100 50 180 60 Q 250 80 230 130 Q 180 160 100 140 Z" fill="#18191c" stroke="#555" stroke-width="3"/>'
      }
    };

    document.querySelectorAll('.sample-img-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sampleKey = (e.currentTarget as HTMLElement).dataset.sample || 'walnut-tensegrity';
        const sample = sampleBlueprints[sampleKey];
        if (sample && promptInput) {
          promptInput.value = sample.prompt;

          const svgData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%230b0f19"/>${sample.shape}</svg>`;
          this.attachedSketchDataUrl = svgData;
          if (previewImg && previewWrap && emptyState) {
            previewImg.src = svgData;
            previewWrap.style.display = 'block';
            emptyState.style.display = 'none';
          }
          this.showToast(`Loaded blueprint concept: ${sampleKey}`);
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

    // 4. "Generate Real 3D Furniture" Action Flow (100% Client-Side Instant Synthesis)
    synthesizeBtn?.addEventListener('click', async () => {
      let promptText = promptInput?.value.trim() || '';
      if (!promptText && !this.attachedSketchDataUrl) {
        promptText = 'Solid American black walnut live-edge floating tensegrity dining table with PVD Gold cables';
        if (promptInput) promptInput.value = promptText;
      }

      if (progressBox && progressBar && statusLabel && statusPct) {
        progressBox.style.display = 'block';
        if (successBar) successBar.style.display = 'none';

        statusLabel.textContent = this.attachedSketchDataUrl
          ? 'Extracting contour vectors from sketch & extruding 3D timber geometry...'
          : 'Parsing architectural parameters & constructing 3D BufferGeometry in tension equilibrium...';
        progressBar.style.width = '70%';
        statusPct.textContent = '70%';

        try {
          let metadata: any = null;
          if (this.aiModelViewer) {
            metadata = await this.aiModelViewer.generateCustom3DObject(promptText, this.attachedSketchDataUrl);
          }

          progressBar.style.width = '100%';
          statusPct.textContent = '100%';
          progressBox.style.display = 'none';
          if (successBar) successBar.style.display = 'flex';

          const titleEl = document.getElementById('ai-active-model-title');
          if (titleEl && metadata) {
            titleEl.textContent = `Real 3D Geometry: ${metadata.name} (${metadata.dimensions.lengthCm} × ${metadata.dimensions.widthCm} × ${metadata.dimensions.heightCm} cm)`;
          }

          if (successMsg && metadata) {
            const origin = metadata.isFromImageContour ? 'Image Silhouette Contour Extrusion' : 'Parametric CAD Engine';
            successMsg.textContent = `Real 3D Mesh synthesized via ${origin}! Constructed ${metadata.vertexCount.toLocaleString()} vertices & ${metadata.triangleCount.toLocaleString()} polygons. Download the real .GLB file or request commission.`;
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
        } catch (genErr) {
          console.error('Geometry synthesis error:', genErr);
          progressBox.style.display = 'none';
          this.showToast('Error synthesizing 3D geometry.');
        }
      }
    });

    // 5. "Commission this Generated Piece" button
    commissionGenBtn?.addEventListener('click', () => {
      const cfg = this.planner.getConfig();
      const est = this.planner.calculateEstimate();
      const meta = this.aiModelViewer?.getMetadata();
      if (meta) {
        cfg.title = meta.name;
        cfg.customNotes = `Commissioning ${meta.name} (${meta.dimensions.lengthCm}x${meta.dimensions.widthCm}x${meta.dimensions.heightCm} cm) in ${meta.timberSpecies} with ${meta.tensionHardware}. User Prompt: ${promptInput?.value || 'N/A'}`;
      }
      this.leadModal.open(cfg, est);
    });
  }
}
// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new AtelierApp();
});
