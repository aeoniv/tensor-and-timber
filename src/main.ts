import './styles/main.css';
import confetti from 'canvas-confetti';
import { renderNavbar } from './components/Navbar';
import { renderHero } from './components/Hero';
import { renderRealFurnitureSection } from './components/RealFurnitureSection';
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
  private currentGlbUrl: string = '';
  private currentModelName: string = 'Mesa de Jantar Flutuante Ipanema';
  private currentEstimatedBracket: string = 'R$ 38.500 – R$ 48.000';

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
        ${renderRealFurnitureSection()}
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
    // 1. Hero 3D Stage (Auto-renders authentic Brazilian Cumaru tensegrity model)
    try {
      this.heroAIViewer = new AIModelViewer('hero-3d-canvas', {
        hudPillId: 'hero-model-pill',
        modelName: 'Mesa de Jantar Flutuante Ipanema'
      });
      this.heroAIViewer.generateCustom3DObject('Mesa de Jantar Flutuante em Madeira Cumaru Maciça com Cabos Tensores de Inox');
    } catch (e) {
      console.warn('Hero 3D viewer init error:', e);
    }

    // 2. Main Bespoke Atelier 3D Stage
    try {
      this.atelierAIViewer = new AIModelViewer('atelier-3d-canvas', {
        hudPillId: 'atelier-model-pill',
        modelName: 'Mesa de Jantar Flutuante Ipanema'
      });
      this.atelierAIViewer.generateCustom3DObject('Mesa de Jantar Flutuante em Madeira Cumaru Maciça com Cabos Tensores de Inox');
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

    // Update titles and pills
    const heroPill = document.getElementById('hero-model-pill');
    if (heroPill) {
      heroPill.textContent = `${name} (3D Real)`;
    }

    const atelierPill = document.getElementById('atelier-model-pill');
    if (atelierPill) {
      atelierPill.textContent = `${name} (3D Real)`;
    }

    const dealTitle = document.getElementById('deal-project-name');
    if (dealTitle) {
      dealTitle.textContent = name;
    }
  }

  private bindEvents(): void {
    // Hero Controls
    document.getElementById('hero-btn-autorotate')?.addEventListener('click', (e) => {
      if (this.heroAIViewer) {
        const state = this.heroAIViewer.toggleAutoRotate();
        const span = (e.currentTarget as HTMLElement).querySelector('span');
        if (span) span.textContent = state ? 'Pausar' : 'Girar';
      }
    });

    document.getElementById('hero-btn-wireframe')?.addEventListener('click', (e) => {
      if (this.heroAIViewer) {
        const isWire = this.heroAIViewer.toggleWireframe();
        const span = (e.currentTarget as HTMLElement).querySelector('span');
        if (span) span.textContent = isWire ? 'Sólido' : 'Aramado';
        (e.currentTarget as HTMLElement).classList.toggle('active', isWire);
      }
    });

    document.getElementById('hero-btn-light')?.addEventListener('click', () => {
      if (this.heroAIViewer) {
        this.heroAIViewer.setLightingPreset('daylight');
        this.showToast('Iluminação de estúdio natural aplicada.');
      }
    });

    // Navigation Drawer Toggle
    document.getElementById('nav-btn-leads')?.addEventListener('click', () => {
      this.adminDrawer.open();
    });

    // Real Furniture Card Buttons
    document.querySelectorAll('.btn-inquire-piece').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const pieceName = el.dataset.pieceName || 'Mobiliário em Tensegridade';
        const price = el.dataset.piecePrice || 'R$ 38.500';
        const wood = el.dataset.pieceWood || 'Madeira Brasileira';
        this.openLeadModalWithCustomPiece(pieceName, price, wood);
      });
    });

    document.querySelectorAll('.btn-view-3d-piece').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const el = e.currentTarget as HTMLElement;
        const pieceName = el.dataset.pieceName || 'Mobiliário em Tensegridade';
        this.currentModelName = pieceName;
        const dealTitle = document.getElementById('deal-project-name');
        if (dealTitle) dealTitle.textContent = pieceName;

        const promptInput = document.getElementById('atelier-vision-input') as HTMLTextAreaElement;
        if (promptInput) {
          promptInput.value = `${pieceName} sob medida com cabos de aço naval`;
        }

        this.showToast(`Carregando ${pieceName} no Ateliê 3D...`);
        document.getElementById('atelier-section')?.scrollIntoView({ behavior: 'smooth' });

        if (this.atelierAIViewer) {
          await this.atelierAIViewer.generateCustom3DObject(pieceName);
        }
        if (this.heroAIViewer) {
          await this.heroAIViewer.generateCustom3DObject(pieceName);
        }
      });
    });

    // Reserve Atelier Slot in Deal Closing Card
    document.getElementById('btn-reserve-atelier-slot')?.addEventListener('click', () => {
      this.openLeadModalWithCustomPiece(this.currentModelName, this.currentEstimatedBracket);
    });

    // Download .GLB
    document.getElementById('btn-download-glb')?.addEventListener('click', async () => {
      if (this.atelierAIViewer) {
        this.showToast('Compilando malha binária .GLB para download...');
        try {
          await this.atelierAIViewer.exportCurrentModelToGLB(`${this.currentModelName.toLowerCase().replace(/\s+/g, '-')}.glb`);
          this.showToast('Download concluído! Arquivo 3D compatível com Blender e Rhino CAD.');
        } catch (err) {
          console.error('Export GLB error:', err);
          this.showToast('Erro ao exportar arquivo .GLB.');
        }
      }
    });

    // Innovative Projects Buttons
    document.querySelectorAll('.btn-load-project').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const pId = (e.currentTarget as HTMLElement).dataset.projectId;
        const project = INNOVATIVE_PROJECTS.find(p => p.id === pId);
        if (project) {
          this.currentModelName = project.title;
          const promptVal = `${project.title}: ${project.subtitle} em ${project.materials.join(', ')}`;
          const promptInput = document.getElementById('atelier-vision-input') as HTMLTextAreaElement;
          if (promptInput) {
            promptInput.value = promptVal;
          }
          const dealTitle = document.getElementById('deal-project-name');
          if (dealTitle) dealTitle.textContent = project.title;

          this.showToast(`Carregado: ${project.title}`);
          document.getElementById('atelier-section')?.scrollIntoView({ behavior: 'smooth' });

          if (this.atelierAIViewer) {
            await this.atelierAIViewer.generateCustom3DObject(promptVal);
          }
          if (this.heroAIViewer) {
            await this.heroAIViewer.generateCustom3DObject(promptVal);
          }
        }
      });
    });

    document.querySelectorAll('.btn-inquire-project').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = (e.currentTarget as HTMLElement).dataset.projectTitle || 'Obra Especial';
        this.openLeadModalWithCustomPiece(title, 'R$ 45.000 – R$ 65.000');
      });
    });
  }

  private openLeadModalWithCustomPiece(pieceName: string, priceBracket: string, wood?: string): void {
    const cfg: ProjectConfiguration = {
      category: 'tensegrity-dining-table',
      title: pieceName,
      dimensions: { length: 280, width: 110, height: 76, diameter: 6.0, domeHeight: 3.6 },
      woodSpeciesId: wood || 'Cumaru Amazônico Maciço FSC®',
      tensionSystemId: 'Aço Inox Naval 316 (6mm)',
      joineryId: 'Encaixes Ocultos com Cavilhas de Titânio',
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
      customNotes: `Interesse exclusivo na peça: ${pieceName} (${priceBracket})`
    };

    const est: EstimateResult = {
      lumberBoardFeet: 140,
      cableLengthMeters: 32,
      hubConnectorsCount: 12,
      artisanHours: 140,
      estimatedWeeks: 7,
      materialsCost: 18000,
      craftsmanshipCost: 12000,
      hardwareCost: 6500,
      addonsCost: 2000,
      subtotal: 38500,
      estimatedTax: 2500,
      totalEstimate: 38500,
      bom: [],
      loadCapacityKg: 480
    };

    this.leadModal.open(cfg, est);
  }

  private initAtelierGenerator(): void {
    const promptInput = document.getElementById('atelier-vision-input') as HTMLTextAreaElement;
    const sketchInput = document.getElementById('atelier-file-input') as HTMLInputElement;
    const sketchZone = document.getElementById('atelier-sketch-zone');
    const generateBtn = document.getElementById('btn-generate-3d');
    const spinner = document.getElementById('generate-spinner');
    const statusLabel = document.getElementById('atelier-status-label');
    const dealPrice = document.getElementById('deal-price-bracket');
    const dealTitle = document.getElementById('deal-project-name');

    // Archetype Tabs Switcher
    const archetypeTabs = document.querySelectorAll('.archetype-tab');
    archetypeTabs.forEach(tab => {
      tab.addEventListener('click', async (e) => {
        archetypeTabs.forEach(t => t.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');

        const name = target.dataset.name || 'Mobiliário em Tensegridade';
        const price = target.dataset.price || 'R$ 38.500 – R$ 48.000';
        this.currentModelName = name;
        this.currentEstimatedBracket = price;

        if (dealTitle) dealTitle.textContent = name;
        if (dealPrice) dealPrice.textContent = price;

        const defaultPrompts: Record<string, string> = {
          'dining-table': 'Mesa de jantar flutuante para 10 lugares em madeira Cumaru maciça com cabos de aço inoxidável naval 316 e esticadores ocultos.',
          'lounge-chair': 'Poltrona lounge Niemeyer flutuante em madeira Freijó curvada no vapor com tirantes tensores dourados em titânio e couro nobre caramelo.',
          'canopy': 'Aparador escultural Cerrado suspenso por cabos em madeira Jacarandá da Bahia de demolição com portas ripadas e base suspensa.',
          'dome': 'Cúpula geodésica biosfera 3V em madeira tratada de reflorestamento com conectores em alumínio naval e claraboias triangulares.'
        };

        const archType = target.dataset.archetype || 'dining-table';
        const promptToRun = defaultPrompts[archType] || name;
        if (promptInput) {
          promptInput.value = promptToRun;
        }

        // Live 3D procedural regeneration on tab switch
        if (this.atelierAIViewer) {
          await this.atelierAIViewer.generateCustom3DObject(promptToRun);
        }
        if (this.heroAIViewer) {
          await this.heroAIViewer.generateCustom3DObject(promptToRun);
        }

        this.showToast(`Peça atualizada no Ateliê 3D: ${name}`);
      });
    });

    // Prompt Chips
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = (e.currentTarget as HTMLElement).dataset.text || '';
        if (promptInput) {
          if (promptInput.value.trim().length > 0) {
            promptInput.value += `, ${text}`;
          } else {
            promptInput.value = text;
          }
          promptInput.focus();
        }
      });
    });

    // File Upload
    sketchZone?.addEventListener('click', () => sketchInput?.click());
    sketchInput?.addEventListener('change', () => {
      if (sketchInput.files && sketchInput.files[0]) {
        const file = sketchInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.attachedSketchDataUrl = e.target?.result as string;
          this.showToast(`Arquivo anexado: ${file.name}`);
          const dropMain = sketchZone?.querySelector('.dropzone-main');
          if (dropMain) dropMain.textContent = `✓ ${file.name} (Anexado)`;
        };
        reader.readAsDataURL(file);
      }
    });

    // Generate Button Action Flow
    generateBtn?.addEventListener('click', async () => {
      const promptText = promptInput?.value.trim() || 'Mesa de Jantar em Madeira Cumaru com Tensegridade';

      if (spinner) spinner.style.display = 'inline-block';
      if (statusLabel) statusLabel.textContent = 'Sintetizando geometria 3D e cálculo tensil...';
      generateBtn.setAttribute('disabled', 'true');

      try {
        let generatedGlbUrl: string | null = null;

        // Try backend neural generation endpoint
        try {
          const res = await fetch('/api/generate-3d', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText, image: this.attachedSketchDataUrl })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.glbUrl) {
              generatedGlbUrl = data.glbUrl;
            }
          }
        } catch (netErr) {
          console.warn('Backend fallback to procedural WebGL:', netErr);
        }

        if (generatedGlbUrl) {
          await this.updateBothViewers(generatedGlbUrl, this.currentModelName);
        } else if (this.atelierAIViewer) {
          await this.atelierAIViewer.generateCustom3DObject(promptText, this.attachedSketchDataUrl);
          await this.heroAIViewer?.generateCustom3DObject(promptText, this.attachedSketchDataUrl);
        }

        if (statusLabel) statusLabel.textContent = 'Renderização 3D Concluída';
        this.showToast('Modelo 3D gerado e atualizado no Ateliê!');
      } catch (err) {
        console.error('Generation error:', err);
        this.showToast('Erro ao sintetizar 3D.');
      } finally {
        if (spinner) spinner.style.display = 'none';
        generateBtn.removeAttribute('disabled');
      }
    });
  }

  private initOnPageCommissionForm(): void {
    const form = document.getElementById('onpage-commission-form') as HTMLFormElement;
    const successBox = document.getElementById('commission-success-state');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('comm-name') as HTMLInputElement)?.value.trim();
      const email = (document.getElementById('comm-email') as HTMLInputElement)?.value.trim();
      const phone = (document.getElementById('comm-phone') as HTMLInputElement)?.value.trim();
      const archetype = (document.getElementById('comm-archetype') as HTMLSelectElement)?.value;
      const budget = (document.getElementById('comm-budget') as HTMLSelectElement)?.value;
      const city = (document.getElementById('comm-city') as HTMLInputElement)?.value.trim();
      const notes = (document.getElementById('comm-notes') as HTMLTextAreaElement)?.value.trim();

      const newLead: LeadSubmission = {
        id: `BR-TT-${Date.now().toString().slice(-6)}`,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        clientType: 'private-homeowner',
        projectLocation: city || 'Brasil',
        budgetBracket: budget,
        timeline: '6 a 8 semanas',
        notes: `Peça de interesse: ${archetype}. Detalhes: ${notes || 'Nenhum'}`,
        configuration: {
          category: 'tensegrity-dining-table',
          title: archetype,
          dimensions: { length: 280, width: 110, height: 76, diameter: 6.0, domeHeight: 3.6 },
          woodSpeciesId: 'Cumaru Amazônico FSC®',
          tensionSystemId: 'Aço Inox Naval 316',
          joineryId: 'Encaixes Tradicionais & Titânio',
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
          customNotes: notes || ''
        },
        estimate: {
          lumberBoardFeet: 120,
          cableLengthMeters: 28,
          hubConnectorsCount: 10,
          artisanHours: 110,
          estimatedWeeks: 7,
          materialsCost: 18000,
          craftsmanshipCost: 12000,
          hardwareCost: 5500,
          addonsCost: 2000,
          subtotal: 37500,
          estimatedTax: 2500,
          totalEstimate: 37500,
          bom: [],
          loadCapacityKg: 450
        },
        submittedAt: new Date().toISOString(),
        status: 'new'
      };

      // Save to localStorage
      try {
        const stored = localStorage.getItem('tensor_timber_leads');
        const leads: LeadSubmission[] = stored ? JSON.parse(stored) : [];
        leads.unshift(newLead);
        localStorage.setItem('tensor_timber_leads', JSON.stringify(leads));
      } catch (err) {
        console.warn('Erro ao salvar lead:', err);
      }

      // Celebratory Confetti in Brazilian Flag Colors!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#009c3b', '#ffdf00', '#002776', '#ffffff']
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }

      // Show success state
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';
      this.showToast('Solicitação recebida com sucesso!');
    });
  }

  private showToast(message: string): void {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast?.classList.remove('visible');
    }, 3800);
  }
}

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  new AtelierApp();
});
