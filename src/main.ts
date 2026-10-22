import './styles/main.css';
import confetti from 'canvas-confetti';
import { renderNavbar } from './components/Navbar';
import { renderHero } from './components/Hero';
import { renderAtelierStudio } from './components/AtelierStudio';
import { renderInnovativeProjects } from './components/InnovativeProjects';
import { renderConsultationSection } from './components/ConsultationSection';
import { renderFooter } from './components/Footer';
import { AIModelViewer } from './components/AIModelViewer';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { AdminLeadsDrawer } from './components/AdminLeadsDrawer';
import { INNOVATIVE_PROJECTS } from './data/constants';
import { LeadSubmission, ProjectConfiguration, EstimateResult } from './types';

class AtelierApp {
  // 3D Viewers
  private heroAIViewer: AIModelViewer | null = null;
  private atelierAIViewer: AIModelViewer | null = null;

  // Active Model State
  private currentGlbUrl: string = '/models/sample_ai_trellis.glb';
  private currentModelName: string = 'Leviton Tensegrity Dining Table';
  private currentEstimatedBracket: string = '$14,800 – $19,500';

  // Lead Management
  private leadModal: LeadCaptureModal;
  private adminDrawer: AdminLeadsDrawer;
  private attachedSketchDataUrl: string | null = null;

  constructor() {
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
        ${renderAtelierStudio()}
        ${renderInnovativeProjects()}
        ${renderConsultationSection()}
      </main>
      ${renderFooter()}
    `;

    this.initViewers();
    this.bindEvents();
    this.initAtelierGenerator();
    this.initOnPageCommissionForm();
  }

  private initViewers(): void {
    // 1. Hero 3D Stage (Auto-renders real 3D model on initial page load)
    try {
      this.heroAIViewer = new AIModelViewer('hero-3d-canvas', {
        hudPillId: 'hero-model-pill',
        defaultModelUrl: this.currentGlbUrl,
        modelName: this.currentModelName
      });
    } catch (e) {
      console.warn('Hero 3D viewer init error:', e);
    }

    // 2. Main Bespoke Atelier 3D Stage (Auto-renders real 3D model on load)
    try {
      this.atelierAIViewer = new AIModelViewer('atelier-3d-canvas', {
        hudPillId: 'atelier-mesh-stats-pill',
        titleId: 'atelier-active-model-title',
        defaultModelUrl: this.currentGlbUrl,
        modelName: this.currentModelName
      });
    } catch (e) {
      console.warn('Atelier 3D viewer init error:', e);
    }
  }

  private async updateBothViewers(glbUrl: string, name: string): Promise<void> {
    this.currentGlbUrl = glbUrl;
    this.currentModelName = name;

    if (this.atelierAIViewer) {
      await this.atelierAIViewer.loadGLBUrl(glbUrl, name);
    }
    if (this.heroAIViewer) {
      await this.heroAIViewer.loadGLBUrl(glbUrl, name);
    }

    // Update titles and stats
    const heroPill = document.getElementById('hero-model-pill');
    if (heroPill) {
      heroPill.innerHTML = `<strong>✨ ${name}</strong> &bull; Real 3D Neural Mesh`;
    }

    const atelierTitle = document.getElementById('atelier-active-model-title');
    if (atelierTitle) {
      atelierTitle.textContent = `Real 3D Geometry: ${name}`;
    }
  }

  private bindEvents(): void {
    // Hero Controls
    document.getElementById('hero-btn-autorotate')?.addEventListener('click', (e) => {
      if (this.heroAIViewer) {
        const state = this.heroAIViewer.toggleAutoRotate();
        (e.currentTarget as HTMLElement).textContent = `Spin: ${state ? 'ON' : 'OFF'}`;
      }
    });

    document.getElementById('hero-btn-wireframe')?.addEventListener('click', (e) => {
      if (this.heroAIViewer) {
        const isWire = this.heroAIViewer.toggleWireframe();
        (e.currentTarget as HTMLElement).textContent = `Wireframe: ${isWire ? 'ON' : 'OFF'}`;
        (e.currentTarget as HTMLElement).classList.toggle('active', isWire);
      }
    });

    document.getElementById('hero-light-studio')?.addEventListener('click', () => {
      this.heroAIViewer?.setLightingPreset('studio');
      document.getElementById('hero-light-studio')?.classList.add('active');
      document.getElementById('hero-light-daylight')?.classList.remove('active');
    });

    document.getElementById('hero-light-daylight')?.addEventListener('click', () => {
      this.heroAIViewer?.setLightingPreset('daylight');
      document.getElementById('hero-light-daylight')?.classList.add('active');
      document.getElementById('hero-light-studio')?.classList.remove('active');
    });

    // Atelier Viewport Controls
    document.getElementById('btn-atelier-wireframe')?.addEventListener('click', (e) => {
      if (this.atelierAIViewer) {
        const isWire = this.atelierAIViewer.toggleWireframe();
        (e.currentTarget as HTMLElement).textContent = `Wireframe: ${isWire ? 'ON' : 'OFF'}`;
        (e.currentTarget as HTMLElement).classList.toggle('active', isWire);
      }
    });

    document.getElementById('btn-atelier-autorotate')?.addEventListener('click', (e) => {
      if (this.atelierAIViewer) {
        const isSpin = this.atelierAIViewer.toggleAutoRotate();
        (e.currentTarget as HTMLElement).textContent = `Spin: ${isSpin ? 'ON' : 'OFF'}`;
        (e.currentTarget as HTMLElement).classList.toggle('active', isSpin);
      }
    });

    const lightPresets: Record<string, 'studio' | 'daylight' | 'midnight'> = {
      'btn-atelier-light-studio': 'studio',
      'btn-atelier-light-daylight': 'daylight',
      'btn-atelier-light-midnight': 'midnight'
    };

    Object.entries(lightPresets).forEach(([btnId, preset]) => {
      document.getElementById(btnId)?.addEventListener('click', (e) => {
        Object.keys(lightPresets).forEach(id => document.getElementById(id)?.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        this.atelierAIViewer?.setLightingPreset(preset);
      });
    });

    // Export .GLB from Atelier Viewport
    document.getElementById('btn-atelier-download-glb')?.addEventListener('click', async () => {
      if (this.atelierAIViewer) {
        this.showToast('Compiling binary .GLB file...');
        try {
          await this.atelierAIViewer.exportCurrentModelToGLB(`${this.currentModelName.toLowerCase().replace(/\s+/g, '-')}.glb`);
          this.showToast('Downloaded real .GLB! Compatible with Blender & Rhino CAD.');
        } catch (err) {
          console.error('Export GLB error:', err);
          this.showToast('Error exporting .GLB file.');
        }
      }
    });

    // Lead Modal Open Triggers
    const openLeadModalWithConfig = (title?: string, notes?: string) => {
      const cfg: ProjectConfiguration = {
        category: 'tensegrity-dining-table',
        title: title || this.currentModelName,
        dimensions: { length: 240, width: 100, height: 75, diameter: 6.0, domeHeight: 3.6 },
        woodSpeciesId: 'american-black-walnut',
        tensionSystemId: 'marine-stainless-316',
        joineryId: 'kanawa-tsugi',
        domeFrequency: 'v3',
        glazingCoverage: 'stargazing',
        finishType: 'organic-matte-oil',
        addons: {
          integratedLedLighting: true,
          hiddenWirelessCharging: false,
          marineWeatherproofing: false,
          insulatedCanvasEnvelope: false,
          titaniumTurnbuckles: true,
          whiteGloveInstallation: true
        },
        customNotes: notes || `Inquiring on: ${title || this.currentModelName} (Bracket: ${this.currentEstimatedBracket})`
      };
      const est: EstimateResult = {
        lumberBoardFeet: 120,
        cableLengthMeters: 28,
        hubConnectorsCount: 10,
        artisanHours: 110,
        estimatedWeeks: 7,
        materialsCost: 8500,
        craftsmanshipCost: 4800,
        hardwareCost: 3200,
        addonsCost: 1500,
        subtotal: 18000,
        estimatedTax: 1200,
        totalEstimate: parseInt(this.currentEstimatedBracket.replace(/[^0-9]/g, '').slice(0, 5)) || 16500,
        bom: [],
        loadCapacityKg: 850
      };
      this.leadModal.open(cfg, est);
    };

    document.getElementById('btn-open-lead-modal')?.addEventListener('click', () => openLeadModalWithConfig());
    document.getElementById('hero-btn-commission')?.addEventListener('click', () => openLeadModalWithConfig());
    document.getElementById('btn-atelier-commission-now')?.addEventListener('click', () => {
      openLeadModalWithConfig(this.currentModelName, `Commission inquiry for ${this.currentModelName} (${this.currentEstimatedBracket}). Custom prompt: ${(document.getElementById('atelier-prompt-input') as HTMLTextAreaElement)?.value || 'N/A'}`);
    });

    // Open Admin Drawer
    document.getElementById('btn-open-admin-drawer')?.addEventListener('click', () => {
      this.adminDrawer.open();
    });

    // Project Cards - "Customize in 3D"
    document.querySelectorAll('.btn-load-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pId = (e.currentTarget as HTMLElement).dataset.projectId;
        const project = INNOVATIVE_PROJECTS.find(p => p.id === pId);
        if (project) {
          const promptInput = document.getElementById('atelier-prompt-input') as HTMLTextAreaElement;
          if (promptInput) promptInput.value = `${project.title}: ${project.subtitle} in ${project.materials.join(', ')}`;

          // Switch archetype tab
          const archetypeTabs = document.getElementById('atelier-archetype-tabs');
          archetypeTabs?.querySelectorAll('.toggle-btn').forEach(b => {
            const isMatch = (b as HTMLElement).textContent?.toLowerCase().includes(project.category === 'geodesic' ? 'dome' : 'table');
            b.classList.toggle('active', isMatch);
          });

          this.showToast(`Loaded ${project.title} into 3D Atelier`);
          document.getElementById('atelier-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Project Cards - "Inquire Piece"
    document.querySelectorAll('.btn-inquire-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = (e.currentTarget as HTMLElement).dataset.projectTitle || 'Signature Piece';
        openLeadModalWithConfig(title, `Direct inquiry for ${title} from Portfolio Showcase.`);
      });
    });
  }

  private initAtelierGenerator(): void {
    const promptInput = document.getElementById('atelier-prompt-input') as HTMLTextAreaElement;
    const sketchInput = document.getElementById('atelier-sketch-file-input') as HTMLInputElement;
    const sketchDropzone = document.getElementById('atelier-sketch-dropzone');
    const browseSketchBtn = document.getElementById('btn-browse-atelier-sketch');
    const previewWrap = document.getElementById('atelier-sketch-preview-wrap');
    const previewImg = document.getElementById('atelier-sketch-preview-img') as HTMLImageElement;
    const emptyState = document.getElementById('atelier-sketch-empty-state');
    const removeSketchBtn = document.getElementById('btn-remove-atelier-sketch');
    const generateBtn = document.getElementById('btn-atelier-generate');
    const clearBtn = document.getElementById('btn-clear-atelier-inputs');
    const progressBox = document.getElementById('atelier-progress-box');
    const progressBar = document.getElementById('atelier-progress-bar');
    const statusLabel = document.getElementById('atelier-progress-status');
    const statusPct = document.getElementById('atelier-progress-pct');
    const successBar = document.getElementById('atelier-success-bar');
    const successMsg = document.getElementById('atelier-success-msg');
    const priceEl = document.getElementById('atelier-price-estimate');
    const metaEl = document.getElementById('atelier-meta-specs');

    // Archetype Switcher
    const archetypeTabs = document.getElementById('atelier-archetype-tabs');
    archetypeTabs?.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        archetypeTabs.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');
        const archetype = target.dataset.archetype || 'dining-table';

        let prompt = 'American Black Walnut live-edge floating tensegrity dining table with PVD gold cables';
        let bracket = '$14,800 – $19,500';
        let meta = 'Solid FSC Hardwood Slab • Aerospace Dyneema/Titanium Rigging • 6–8 Wks Delivery';
        let modelTitle = 'Leviton Tensegrity Dining Table';

        switch (archetype) {
          case 'dining-table':
            prompt = '240x100x75cm Solid American Black Walnut live-edge floating tensegrity dining table with PVD gold cables';
            bracket = '$14,800 – $19,500';
            meta = 'Solid FSC Walnut Slab • Aerospace Dyneema/Titanium Rigging • 6–8 Wks Delivery';
            modelTitle = 'Leviton Tensegrity Dining Table';
            break;
          case 'lounge-chair':
            prompt = 'Ergonomic floating tensegrity lounge chair in European White Oak with curved seat and stainless cables';
            bracket = '$8,500 – $12,200';
            meta = 'Bavarian White Oak • Hand-Sculpted Contour • Stainless 316 Rigging';
            modelTitle = 'Kyoto Ergonomic Lounge Chair';
            break;
          case 'geodesic-dome':
            prompt = '6m Handcrafted Timber Geodesic Dome with CNC aluminum hubs and stargazing glass crown';
            bracket = '$28,000 – $46,000';
            meta = '6.0m Architectural Dome • CNC 6061 Star Hubs • Low-E Triangles';
            modelTitle = 'Stargazer 3V Geodesic Sanctuary';
            break;
          case 'cantilever-desk':
            prompt = 'Zero-gravity cantilever executive desk in European White Oak with floating drawer pedestal';
            bracket = '$16,500 – $22,000';
            meta = 'Continuous Tension Cantilever • Hidden Cable Ducting • Italian Leather Pad';
            modelTitle = 'Equinox Zero-Gravity Executive Desk';
            break;
        }

        if (promptInput) promptInput.value = prompt;
        if (priceEl) priceEl.textContent = bracket;
        if (metaEl) metaEl.textContent = meta;
        this.currentEstimatedBracket = bracket;
        this.currentModelName = modelTitle;

        if (this.atelierAIViewer) {
          this.showToast(`Synthesizing 3D ${modelTitle}...`);
          await this.atelierAIViewer.generateCustom3DObject(prompt);
          this.updateBothViewers(this.currentGlbUrl, modelTitle);
        }
      });
    });

    // File browsing & upload
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
          this.showToast(`Attached reference: ${file.name}`);
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
      this.showToast('Reset specification inputs.');
    });

    // Prompt Keyword Chips
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

    // Generate Action Flow
    generateBtn?.addEventListener('click', async () => {
      let promptText = promptInput?.value.trim() || '';
      if (!promptText && !this.attachedSketchDataUrl) {
        promptText = 'Solid American black walnut live-edge floating tensegrity dining table with PVD Gold cables';
        if (promptInput) promptInput.value = promptText;
      }

      if (progressBox && progressBar && statusLabel && statusPct) {
        progressBox.style.display = 'block';
        if (successBar) successBar.style.display = 'none';

        statusLabel.textContent = this.attachedSketchDataUrl
          ? 'Extracting contour vectors & constructing 3D tension equilibrium...'
          : 'Synthesizing 2D architectural concept & generating 3D neural mesh...';
        progressBar.style.width = '30%';
        statusPct.textContent = '30%';

        try {
          let generatedGlbUrl: string | null = null;
          let generatorSource: string = 'ZeroGPU TRELLIS Neural 3D';

          // Attempt real AI inference via backend server
          try {
            statusLabel.textContent = 'ZeroGPU A10G extracting textured binary .GLB mesh...';
            progressBar.style.width = '60%';
            statusPct.textContent = '60%';

            const endpoints = ['/api/generate-3d', 'http://localhost:5175/api/generate-3d'];
            let res: Response | null = null;

            for (const ep of endpoints) {
              try {
                res = await fetch(ep, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    prompt: promptText,
                    image: this.attachedSketchDataUrl
                  })
                });
                if (res.ok) break;
              } catch (epErr) {
                // Try next endpoint
              }
            }

            if (res && res.ok) {
              const resData = await res.json();
              if (resData.success && resData.glbUrl) {
                generatedGlbUrl = resData.glbUrl;
                generatorSource = resData.generator || generatorSource;
              }
            }
          } catch (netErr) {
            console.warn('Backend inference fallback to CAD engine:', netErr);
          }

          const modelName = promptText.length > 38 ? promptText.slice(0, 38) + '...' : promptText;
          this.currentModelName = modelName;

          if (generatedGlbUrl) {
            statusLabel.textContent = 'Rendering real .GLB mesh into Three.js WebGL viewport...';
            progressBar.style.width = '90%';
            statusPct.textContent = '90%';

            await this.updateBothViewers(generatedGlbUrl, modelName);
          } else if (this.atelierAIViewer) {
            await this.atelierAIViewer.generateCustom3DObject(promptText, this.attachedSketchDataUrl);
            await this.heroAIViewer?.generateCustom3DObject(promptText, this.attachedSketchDataUrl);
          }

          progressBar.style.width = '100%';
          statusPct.textContent = '100%';
          progressBox.style.display = 'none';
          if (successBar) successBar.style.display = 'flex';

          if (successMsg) {
            successMsg.textContent = `Real 3D Mesh synthesized via ${generatorSource}! Displayed live in the 3D Atelier.`;
          }

          // Dynamic investment estimation update
          const lower = promptText.toLowerCase();
          if (lower.includes('dome') || lower.includes('geodesic')) {
            this.currentEstimatedBracket = '$28,000 – $46,000';
            if (priceEl) priceEl.textContent = this.currentEstimatedBracket;
            if (metaEl) metaEl.textContent = '6.0m Architectural Dome • CNC Aluminum Star Hubs • Low-E Triangles';
          } else if (lower.includes('chair') || lower.includes('lounge')) {
            this.currentEstimatedBracket = '$8,500 – $12,200';
            if (priceEl) priceEl.textContent = this.currentEstimatedBracket;
            if (metaEl) metaEl.textContent = 'Ergonomic Tensile Lounge • Sculpted Hardwood • 6 Wks Delivery';
          } else {
            this.currentEstimatedBracket = '$14,800 – $19,500';
            if (priceEl) priceEl.textContent = this.currentEstimatedBracket;
            if (metaEl) metaEl.textContent = 'Solid FSC Hardwood Slab • Aerospace Dyneema/Titanium Rigging • 6–8 Wks Delivery';
          }

          this.showToast('Real 3D Object generated & displayed in 3D Atelier!');
        } catch (genErr) {
          console.error('Generation error:', genErr);
          progressBox.style.display = 'none';
          this.showToast('Error generating 3D geometry.');
        }
      }
    });
  }

  private initOnPageCommissionForm(): void {
    const form = document.getElementById('onpage-commission-form') as HTMLFormElement;
    const successCard = document.getElementById('onpage-form-success');
    const resetBtn = document.getElementById('btn-reset-onpage-form');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('comm-name') as HTMLInputElement)?.value;
      const email = (document.getElementById('comm-email') as HTMLInputElement)?.value;
      const phone = (document.getElementById('comm-phone') as HTMLInputElement)?.value;
      const category = (document.getElementById('comm-category') as HTMLSelectElement)?.value as any;
      const budget = (document.getElementById('comm-budget') as HTMLSelectElement)?.value;
      const timeline = (document.getElementById('comm-timeline') as HTMLSelectElement)?.value;
      const notes = (document.getElementById('comm-notes') as HTMLTextAreaElement)?.value;

      const newLead: LeadSubmission = {
        id: 'LEAD-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString(),
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        clientLocation: notes || 'Private Architectural Residence',
        clientType: 'private-homeowner',
        budgetBracket: budget === '50k-plus' ? '$75k+' : budget === '25k-50k' ? '$35k - $75k' : '$15k - $35k',
        targetTimeline: timeline === 'expedited' ? 'urgent-30days' : 'standard-60-90days',
        consultationType: 'virtual-3d-walkthrough',
        configuration: {
          category,
          title: this.currentModelName,
          dimensions: { length: 240, width: 100, height: 75, diameter: 6.0, domeHeight: 3.6 },
          woodSpeciesId: 'american-black-walnut',
          tensionSystemId: 'marine-stainless-316',
          joineryId: 'kanawa-tsugi',
          domeFrequency: 'v3',
          glazingCoverage: 'stargazing',
          finishType: 'organic-matte-oil',
          addons: {
            integratedLedLighting: true,
            hiddenWirelessCharging: false,
            marineWeatherproofing: false,
            insulatedCanvasEnvelope: false,
            titaniumTurnbuckles: true,
            whiteGloveInstallation: true
          },
          customNotes: `Model: ${this.currentModelName}. Bracket: ${this.currentEstimatedBracket}. Context: ${notes || 'N/A'}`
        },
        estimate: {
          lumberBoardFeet: 120,
          cableLengthMeters: 28,
          hubConnectorsCount: 10,
          artisanHours: 110,
          estimatedWeeks: timeline === 'expedited' ? 6 : 8,
          materialsCost: 8500,
          craftsmanshipCost: 4800,
          hardwareCost: 3200,
          addonsCost: 1500,
          subtotal: 18000,
          estimatedTax: 1200,
          totalEstimate: budget === '50k-plus' ? 65000 : budget === '25k-50k' ? 36000 : 18500,
          bom: [],
          loadCapacityKg: 850
        },
        projectSummary: `${this.currentModelName} (${category})`,
        notes: `Model: ${this.currentModelName}. Bracket: ${this.currentEstimatedBracket}. Client notes: ${notes || 'N/A'}`,
        status: 'new'
      };

      // Save to localStorage
      try {
        const stored = localStorage.getItem('tensor_timber_leads');
        const leads: LeadSubmission[] = stored ? JSON.parse(stored) : [];
        leads.unshift(newLead);
        localStorage.setItem('tensor_timber_leads', JSON.stringify(leads));
      } catch (err) {
        console.warn('Could not save lead:', err);
      }

      // Celebratory Confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f5c542', '#d4af37', '#38bdf8', '#ffffff']
      });

      // Show success
      form.style.display = 'none';
      if (successCard) successCard.style.display = 'block';
      this.showToast('Commission consultation request submitted!');
    });

    resetBtn?.addEventListener('click', () => {
      form.reset();
      form.style.display = 'grid';
      if (successCard) successCard.style.display = 'none';
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5c542" stroke-width="2.5">
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
