import './styles/main.css';
import { renderNavbar } from './components/Navbar';
import { renderHero } from './components/Hero';
import { renderInnovativeProjects } from './components/InnovativeProjects';
import { renderHFSpacesStudio } from './components/HFSpacesStudio';
import { renderFooter } from './components/Footer';
import { TensegrityViewer } from './components/TensegrityViewer';
import { GeodesicViewer } from './components/GeodesicViewer';
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

    // File Dropzone handling
    const dropzone = document.getElementById('hf-model-dropzone');
    const fileInput = document.getElementById('hf-file-input') as HTMLInputElement;
    const browseBtn = document.getElementById('btn-browse-model-file');

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          this.showToast(`Loaded ${fileInput.files[0].name} into Atelier 3D viewport!`);
        }
      });
    }

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
          this.showToast(`Loaded ${e.dataTransfer.files[0].name} into Atelier 3D viewport!`);
        }
      });
    }

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
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new AtelierApp();
});
